"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Project } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import { ProjectEditDialog } from "./project-edit-dialog";
import {
  IconCalendar,
  IconPhone,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconPlayerStop,
  IconProgress,
  IconUpload,
  IconTrash,
} from "@tabler/icons-react";
import { uploadProjectImage, updateProjectImageUrls, deleteProjectImage } from "@/lib/supabase/mutations";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectOverviewResponsiveProps {
  project: Project;
  children: React.ReactNode;
  refreshData: () => void;
}

const statusMap: Record<
  Project["status"],
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
    label: string;
  }
> = {
  active: {
    variant: "default",
    icon: <IconProgress className="h-4 w-4" />,
    label: "Active",
  },
  completed: {
    variant: "secondary",
    icon: <IconCircleCheck className="h-4 w-4" />,
    label: "Completed",
  },
  cancelled: {
    variant: "destructive",
    icon: <IconCircleX className="h-4 w-4" />,
    label: "Cancelled",
  },
  draft: {
    variant: "outline",
    icon: <IconClock className="h-4 w-4" />,
    label: "Draft",
  },
  on_hold: {
    variant: "outline",
    icon: <IconPlayerStop className="h-4 w-4" />,
    label: "On Hold",
  },
};

export function ProjectOverviewResponsive({
  project,
  children,
  refreshData,
}: ProjectOverviewResponsiveProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const [uploading, setUploading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setCurrentProject(project);
  }, [project]);

  const {
    variant: statusVariant,
    icon: statusIcon,
    label: statusLabel,
  } = statusMap[currentProject.status];

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploading(true);
      try {
        const newImageUrl = await uploadProjectImage(currentProject.id, file);
        const updatedImageUrls = [...(currentProject.image_urls || []), newImageUrl];
        await updateProjectImageUrls(currentProject.id, updatedImageUrls);
        setCurrentProject(prevProject => ({
            ...prevProject,
            image_urls: updatedImageUrls
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      await deleteProjectImage(imageUrl);
      const updatedImageUrls = (currentProject.image_urls || []).filter(url => url !== imageUrl);
      await updateProjectImageUrls(currentProject.id, updatedImageUrls);
      setCurrentProject(prevProject => ({
        ...prevProject,
        image_urls: updatedImageUrls
      }));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      refreshData();
    }
  };

  const OverviewContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Description</Label>
              <p className="text-sm text-muted-foreground">
                {currentProject.description || "No description provided."}
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Status</Label>
              <Badge variant={statusVariant} className="flex w-fit items-center gap-x-2">
                {statusIcon}
                <span>{statusLabel}</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Key Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <IconCalendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-semibold">Created On</Label>
                <p className="text-sm">
                  {currentProject.created_at
                    ? new Date(currentProject.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconPhone className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-sm font-semibold">Contact</Label>
                <p className="text-sm">{currentProject.contact_number || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(currentProject.image_urls || []).map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <Image
                    src={url}
                    alt={`Project image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md cursor-pointer"
                    onClick={() => openLightbox(index)}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteImage(url)}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {(currentProject.image_urls?.length || 0) < 3 && (
              <div className="mt-4">
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <IconUpload className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DrawerTrigger asChild>{children}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{currentProject.name}</DrawerTitle>
              <DrawerDescription>
                A comprehensive overview of the project's status and images.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 12rem)" }}>
              <OverviewContent />
            </div>
            <DrawerFooter className="pt-2">
              <ProjectEditDialog project={currentProject} refreshData={() => {
                setIsDialogOpen(false);
                refreshData();
              }}>
                <Button>Edit Project</Button>
              </ProjectEditDialog>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={(currentProject.image_urls || []).map((url) => ({ src: url }))}
          index={lightboxIndex}
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange} modal={!lightboxOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">{currentProject.name}</DialogTitle>
            <DialogDescription>
              A comprehensive overview of the project's status and images.
            </DialogDescription>
          </DialogHeader>
          <OverviewContent />
          <DialogFooter>
            <ProjectEditDialog project={currentProject} refreshData={() => {
              setIsDialogOpen(false);
              refreshData();
            }}>
              <Button>Edit Project</Button>
            </ProjectEditDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={(currentProject.image_urls || []).map((url) => ({ src: url }))}
        index={lightboxIndex}
      />
    </>
  );
}