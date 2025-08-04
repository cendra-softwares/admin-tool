import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/types";

const statusColors = {
  draft: "bg-gray-500",
  active: "bg-blue-500",
  completed: "bg-green-500",
  on_hold: "bg-yellow-500",
  cancelled: "bg-red-500",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Badge className={statusColors[project.status]}>{project.status}</Badge>
            <span className="text-sm text-gray-500">
              {new Date(project.created_at!).toLocaleDateString()}
            </span>
          </div>
          {project.contact_number && (
            <div className="text-sm text-gray-500">
              Contact: {project.contact_number}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <a href={`/projects/${project.id}`}>View Project</a>
        </Button>
      </CardFooter>
    </Card>
  );
}