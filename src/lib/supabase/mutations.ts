"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Project } from "@/lib/types";

export async function createProject(project: Omit<Project, "id" | "created_at">) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("projects").insert(project).select();

  if (error) {
    console.error("Error creating project:", error);
    return { error };
  }

  return { data };
}