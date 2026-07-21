# Champion Motors Internal Portal — Skeleton Design

**Date:** 2026-07-21
**Status:** Approved
**Scope:** Application skeleton only. Page content is added later.

## Purpose

An internal operations portal for Champion Motors Israel employees. It gives staff one
place to see company news and events, browse the operational directory (locations,
customers, cars, staff), open analytics reports, and reach productivity tools.

This spec covers the **skeleton**: navigation, routing, layout, types, mock data, auth
shell, and empty/loading/error states. It does not cover real business logic, real data
sources, or finished report content.

## Brand layer

**Champion corporate.** This is the importer's own internal tool, so Champion's identity
governs — navy shell, Champion Blue reserved for actions. No marque (Audi / VW / Škoda /
SEAT / CUPRA) branding appears in the application chrome. When model listings gain real
content later, OEM logos there render in full authentic color per `.claude/rules/design.md`.

## Language and direction

Hebrew-first, RTL. `dir="rtl" lang="he"` on `<html>`. All UI strings in Hebrew; all code
identifiers in English. Latin model names and numerals stay LTR inline.

Font stack `'ploni', 'Assistant', 'Heebo', system-ui, sans-serif`. Ploni is the brand
face and is used automatically where licensed; Assistant loads from Google Fonts as the
shipping fallback.

## Stack

| Concern | Choice | Note |
|---|---|---|
| Build | Vite + React + TypeScript (strict) | |
| Routing | React Router | Route tree generated from the nav registry |
| Styling | Tailwind CSS v4 + shadcn/ui | v4 is CSS-first — tokens live in `@theme`, not `tailwind.config.js` |
| Icons | lucide-react | Consistent stroke weight; directional icons mirrored in RTL |
| Testing | Vitest + React Testing Library | |

Deliberately **not** included yet (YAGNI until there is real content):
- No chart library — analytics pages use placeholder blocks
- No data-fetching library — a fake async client plus one hook per entity is enough
- No state management library — router state and local state cover the skeleton

## Architecture

### The navigation registry

`src/app/navigation.ts` is the single source of truth for the sidebar and the route tree.
Each entry declares its path, Hebrew label, icon, and optional detail route. The sidebar
renders from it; `src/app/routes.tsx` generates routes from it.

Adding a page later is one registry entry plus one page component. The sidebar and the
router cannot drift apart, because neither is hand-maintained.

### Sections

Four groups, in sidebar order:

1. **מרכז (Hub)** — landing page: news feed and upcoming events
2. **ספרייה (Directory)** — סניפים · לקוחות · רכבים · עובדים
3. **אנליטיקה (Analytics)** — מכירות · שיווק · כוח אדם · הנהלת חשבונות
4. **פרודוקטיביות (Productivity)** — תקשורת · מסמכים

### Layout

Right sidebar as the single global navigation, containing all four groups. A top bar
carries the current page title, search, and the user menu. Content fills the remaining
width — no extra centered max-width wrapper on data screens.

### Directory

Each of the four entities gets a list route and a detail route (`/customers`,
`/customers/:id`). Lists share a presentational `DirectoryListLayout` (header, search,
result count, table slot, empty state); each page supplies its own columns. Detail pages
share a `DetailLayout` (breadcrumb, title, field grid).

### Analytics

Each report shares a `ReportLayout`: page header, a row of KPI stat tiles, and placeholder
blocks where charts will go. No chart library is chosen yet — that decision waits until
the real metrics are known.

### Productivity

A launcher tile grid. Tiles route to internal placeholder pages today and support an
optional external `href` so they can point at outside tools later without restructuring.

### Data

`src/lib/api/client.ts` is a fake async client over typed fixtures in
`src/lib/api/fixtures/`, with a small artificial delay so loading states are real. One
hook per entity (`useCustomers`, `useCars`, …) exposes `{ data, isLoading, error }`.

Replacing the fake client with real HTTP later touches `client.ts` only — the hooks and
pages keep their contracts.

### Auth

`AuthProvider` holds a hardcoded mock employee (name, role, home branch). `RequireAuth`
wraps the protected layout and redirects to `/login` when signed out. The login page sets
the mock user. Real authentication drops in behind the same interface without touching
route structure.

## File structure

```
src/
  app/
    navigation.ts          registry — sections, Hebrew labels, paths, icons
    routes.tsx             route tree generated from the registry
  components/
    layout/                AppShell · Sidebar · SidebarSection · SidebarItem · Topbar · PageHeader
    ui/                    shadcn primitives
    features/
      hub/                 NewsCard · EventList
      directory/           DirectoryListLayout · DetailLayout
      analytics/           ReportLayout · StatTile · ChartPlaceholder
      productivity/        LauncherGrid · LauncherTile
  pages/                   one thin component per route
  hooks/                   one per entity, plus useCurrentUser
  lib/
    api/client.ts          fake async client
    api/fixtures/          Hebrew mock rows
    auth/                  AuthProvider · RequireAuth
  types/                   Customer · Car · Location · StaffMember · NewsItem · CalendarEvent · User
  utils/                   cn · formatCurrency · formatDate
```

## States

Every list and report page renders three real states in Hebrew: loading (skeleton rows),
empty (explanatory text, not a bare "0"), and error (message plus retry). These are part
of the skeleton, not a later addition — they are where the layout gets exercised.

## Testing

Per `.claude/rules/testing.md`, the skeleton has little logic worth testing. Cover:

- The navigation registry renders every section and item in the sidebar
- `RequireAuth` redirects to `/login` when signed out and renders children when signed in
- `formatCurrency` — shekel sign, thousands separator, whole shekels, em dash for null
- A directory list page renders its Hebrew empty state when the entity list is empty

Not covered: presentational layout components, fixture files, type-only modules.

## Out of scope

Real authentication · real data sources · chart implementation · report content · CRUD
write paths · role-based permissions · i18n framework (Hebrew is hardcoded; the app is
not multilingual) · mobile-specific layouts beyond responsive stacking.

## Consequence for existing rules

`.claude/rules/design.md` documents Tailwind tokens as a v3 `tailwind.config.js` block.
Tailwind v4 is CSS-first, so that block is updated to `@theme` syntax in
`src/styles/theme.css` and `design.md` is corrected to match. Token names and hex values
are unchanged.
