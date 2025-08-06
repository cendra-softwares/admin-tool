import { createClient } from "@/lib/supabase/client";
import { Project } from "@/lib/types";

const supabase = createClient();

export async function updateProject(project: Project) {
  const { data, error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", project.id);

  return { data, error };
}

export async function createProject(project: Omit<Project, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("projects")
    .insert([project])
    .select();

  return { data, error };
}

export async function uploadProjectImage(projectId: string, file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${projectId}-${Math.random()}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from("project_images")
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from("project_images")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

export async function updateProjectImageUrls(projectId: string, imageUrls: string[]) {
  const { data, error } = await supabase
    .from("projects")
    .update({ image_urls: imageUrls })
    .eq("id", projectId);

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteProjectImage(imageUrl: string) {
  const fileName = imageUrl.split("/").pop();
  if (!fileName) {
    throw new Error("Invalid image URL");
  }

  const { error } = await supabase.storage
    .from("project_images")
    .remove([fileName]);

  if (error) {
    throw error;
  }
}

export async function createNewAttendanceToken() {
  const token = Math.random().toString(36).substring(2, 12);
  const { data, error } = await supabase
    .from("attendance_tokens")
    .insert([{ token }])
    .select()
    .single();

  if (error) {
    console.error("Error creating new attendance token:", error);
    throw error;
  }

  return data;
}

export async function markAttendance(
  employeeId: string,
  scannedToken: string,
  type: "check-in" | "check-out"
) {
  const { data, error } = await supabase.from("attendance").insert([
    {
      employee_id: employeeId,
      scanned_token: scannedToken,
      type,
    },
  ]);

  if (error) {
    console.error("Error marking attendance:", error);
    throw error;
  }

  return data;
}

export async function markTokenAsUsed(tokenId: string, userId: string) {
  const { data, error } = await supabase
    .from("attendance_tokens")
    .update({ used_by_id: userId })
    .eq("id", tokenId);

  if (error) {
    console.error("Error marking token as used:", error);
    throw error;
  }

  return data;
}