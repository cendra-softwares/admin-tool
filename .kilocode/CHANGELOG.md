# Changelog

## Aug 06, 2025, 08:52 AM
### feat(skeleton): add skeleton loading to dashboard and projects pages
**Reasoning:**
Converted `/dashboard` and `/projects` pages to client components, integrating `useState` and `useEffect` for client-side data fetching. This decision was made to improve the perceived performance and user experience by displaying skeleton loaders while data is being fetched, providing immediate visual feedback. Additionally, `SiteHeader` was updated to accept a `title` prop for dynamic page titles, enhancing reusability and flexibility.

## Aug 05, 2025, 02:08 AM
### feat(nav): enable sidebar navigation
**Reasoning:**
Refactored the `SidebarMenuButton` to function as a proper navigation link by using the `asChild` prop with an `<a>` tag. This enables routing from the main sidebar menu, specifically allowing the "Projects" link to correctly navigate to `/projects`. The `@radix-ui/react-alert-dialog` dependency was added for future use, anticipating the need for alert dialog functionalities.