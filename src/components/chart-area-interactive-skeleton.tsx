import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartAreaInteractiveSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-60" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}