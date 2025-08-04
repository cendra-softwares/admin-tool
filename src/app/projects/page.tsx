import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getProjects } from "@/lib/supabase/queries";
import { ProjectCard } from "@/components/project-card";
import { Project } from "@/lib/types";
import { CreateProjectDialog } from "@/components/create-project-dialog";

export default async function ProjectsPage() {
  const projects: Project[] = await getProjects();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Projects</h1>
                  <CreateProjectDialog />
                </div>
              </div>
              <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
