"use client";

import { useState } from "react";
import { CompanyForm } from "@/components/company-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateCompanyPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Company</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-24" />
            </div>
          ) : (
            <CompanyForm onLoadingChange={setIsLoading} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
