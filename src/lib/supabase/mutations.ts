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