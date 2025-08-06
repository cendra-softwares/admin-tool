# Skeleton Loading and Fast Page Rendering Guide

This guide explains how to implement skeleton loading to improve the perceived performance of web pages, making them feel faster and more responsive. The core idea is to render a simplified placeholder of the page instantly, and then populate it with real data as it becomes available.

## Guidelines

### 1. Convert to a Client Component
Add the `"use client";` directive at the top of your page component file. This is necessary to use React Hooks like `useState` and `useEffect`.

### 2. Introduce State for Data and Loading
Use `React.useState` to manage the data and the loading status.

```tsx
import React from "react";

export default function MyPage() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  // ...
}
```

### 3. Fetch Data on the Client
Use `React.useEffect` to fetch the data when the component mounts. Once the data is fetched, update the state and set `loading` to `false`.

```tsx
React.useEffect(() => {
  const fetchData = async () => {
    const result = await yourDataFetchingFunction();
    setData(result);
    setLoading(false);
  };

  fetchData();
}, []); // Empty dependency array ensures this runs only once
```

### 4. Create Skeleton Components
For each component that will display fetched data, create a corresponding skeleton version. These skeletons should use a library like `shadcn/ui`'s `Skeleton` component to create the placeholder shapes.

*Example: `project-card-skeleton.tsx`*
```tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        {/* ... more skeleton elements */}
      </CardContent>
    </Card>
  );
}
```

### 5. Conditionally Render Skeletons or Content
In your page component, use the `loading` state to conditionally render either the skeleton components or the actual components with the fetched data.

```tsx
<div className="grid">
  {loading
    ? Array.from({ length: 3 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))
    : data.map((item) => (
        <ProjectCard key={item.id} project={item} />
      ))}
</div>
```

By following these guidelines, you can significantly improve the user experience of your application by making pages load faster and providing immediate visual feedback.
