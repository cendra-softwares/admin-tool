# Memory

This file serves as a cumulative memory of key decisions, architectural choices, and significant learnings throughout the project's development. It aims to provide context and rationale for the current state of the codebase, aiding future development and maintenance.

## Key Decisions & Learnings

### Aug 06, 2025: Skeleton Loading Implementation
- **Decision:** Implemented client-side skeleton loading for `/dashboard` and `/projects` pages.
- **Reasoning:** To enhance perceived performance and user experience by providing immediate visual feedback during data fetching. This approach avoids blank screens and improves responsiveness.
- **Impact:** Required conversion of server components to client components (`"use client";`), integration of `useState` and `useEffect` for data fetching, and conditional rendering of skeleton components. Dynamic page titles were enabled via `SiteHeader` `title` prop.

### Aug 05, 2025: Sidebar Navigation Refactor
- **Decision:** Refactored `SidebarMenuButton` to act as a proper navigation link.
- **Reasoning:** To enable seamless routing from the main sidebar menu, specifically for the "Projects" link to navigate to `/projects`.
- **Impact:** Utilized the `asChild` prop with an `<a>` tag for navigation. Added `@radix-ui/react-alert-dialog` as a dependency in anticipation of future alert dialog features, demonstrating forward-thinking dependency management.