"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconDots,
  IconEye, // Added IconEye
  IconPlayerStop,
  IconProgress,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ProjectDetailsDialog } from "@/components/project-details-dialog"; // Added ProjectDetailsDialog

export const columns = (refreshData: () => void): ColumnDef<Project>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Project Name",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Project["status"];
      const variantMap: Record<
        Project["status"],
        {
          variant: "default" | "secondary" | "destructive" | "outline";
          icon: React.ReactNode;
          color: string;
        }
      > = {
        active: {
          variant: "default",
          icon: <IconProgress className="h-4 w-4" />,
          color: "text-white bg-blue-500",
        },
        completed: {
          variant: "secondary",
          icon: <IconCircleCheck className="h-4 w-4" />,
          color: "text-white bg-green-500",
        },
        cancelled: {
          variant: "destructive",
          icon: <IconCircleX className="h-4 w-4" />,
          color: "text-white bg-red-500",
        },
        draft: {
          variant: "outline",
          icon: <IconClock className="h-4 w-4" />,
          color: "text-white bg-gray-500",
        },
        on_hold: {
          variant: "outline",
          icon: <IconPlayerStop className="h-4 w-4" />,
          color: "text-white bg-yellow-500",
        },
      };
      const { variant, icon, color } = variantMap[status];

      return (
        <Badge
          variant={variant}
          className={`flex w-fit items-center gap-x-2 ${color}`}
        >
          {icon}
          <span>{status}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "contact_number",
    header: "Contact Number",
    cell: ({ row }) => {
      return <div>{row.getValue("contact_number") || "N/A"}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return <div>{row.getValue("description") || "N/A"}</div>;
    },
  },
  {
    id: "viewDetails",
    header: "Details",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <ProjectDetailsDialog project={project} refreshData={refreshData}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">View project details</span>
            <IconEye className="h-4 w-4" />
          </Button>
        </ProjectDetailsDialog>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(project.id)}
            >
              Copy project ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
