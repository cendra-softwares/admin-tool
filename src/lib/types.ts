export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: "draft" | "active" | "completed" | "on_hold" | "cancelled";
  created_at: string | null;
  company_id: string | null;
  contact_number: string | null;
  user_id: string | null;
  image_urls: string[] | null;
};
