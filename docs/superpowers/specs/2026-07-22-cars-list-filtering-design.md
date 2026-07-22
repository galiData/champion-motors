# Cars List Filtering — Design

**Date:** 2026-07-22
**Status:** Approved
**Scope:** `src/pages/directory/CarsPage.tsx` and the shared
`src/components/features/directory/DirectoryListLayout.tsx` shell.

## Problem

The Cars list page (`/cars`) only supports free-text search across marque,
model, trim, license plate and VIN. A sales rep who wants "all Audi currently
in stock" has to scan the whole table manually. There is no way to narrow by
marque or status, and no way to share or bookmark a narrowed view.

## Goals

- Multi-select filter chips for **marque** (6 values) and **status** (4
  values), combined with each other (AND) and with the existing free-text
  search (AND).
- Filter state is synced to the URL (`?marque=audi,skoda&status=in-stock`) so
  it survives refresh/back-navigation and is shareable via link.
- The filtering mechanism added to `DirectoryListLayout` is generic — it must
  not bake in car-specific concepts, so Customers/Locations/Staff can adopt
  filters later without changes to the shell.

## Non-goals

- No changes to Customers, Locations, or Staff pages beyond what falls out of
  making `DirectoryListLayout`'s new props optional.
- No new dependency (no external state-management or query-string library) —
  `useSearchParams` from `react-router-dom` (already a dependency) is
  sufficient.
- No sort-by-column feature (raised in earlier discussion, deferred to a
  separate design).
- No changes to the Cars detail page or the "add new car" feature — those are
  tracked separately.

## Architecture

### `DirectoryListLayout` — new optional props

```ts
export interface DirectoryListLayoutProps<T> {
  // ...existing props unchanged...
  /** Extra filter UI rendered in the toolbar, next to the search input. */
  filters?: ReactNode;
  /** Additional predicate ANDed with the free-text `matches` result. */
  filterFn?: (item: T) => boolean;
  /** Controlled search text. Omit to keep today's internal-state behavior. */
  query?: string;
  /** Required if `query` is passed; called on every keystroke. */
  onQueryChange?: (query: string) => void;
}
```

`query`/`onQueryChange` follow the standard controlled/uncontrolled hybrid:

```ts
const [localQuery, setLocalQuery] = useState("");
const query = queryProp ?? localQuery;
const setQuery = onQueryChange ?? setLocalQuery;
```

Pages that don't pass `query`/`onQueryChange` (Customers, Locations, Staff)
get byte-identical behavior to today — internal `useState`, nothing persisted
anywhere. Only `CarsPage` passes them, wiring `setQuery` to write the `q` URL
param.

Inside the `visible` `useMemo`, apply `filterFn` (if provided) in addition to
the existing `matches` check:

```ts
const visible = useMemo(() => {
  const rows = data ?? [];
  const trimmed = query.trim();
  return rows
    .filter((row) => (trimmed ? matches(row, trimmed) : true))
    .filter((row) => (filterFn ? filterFn(row) : true));
}, [data, query, matches, filterFn]);
```

The toolbar renders `filters` (if provided) below the existing search
row, inside the same bordered container. The "X מתוך Y רשומות" count
continues to reflect the post-filter, post-search `visible.length` against
the raw `data.length` — unchanged behavior, now also reflects chip filtering.

Every other consumer of `DirectoryListLayout` (Customers, Locations, Staff)
omits all four new props and is unaffected.

### URL state — owned by `CarsPage`

`CarsPage` reads/writes three `useSearchParams` keys:

| Param | Format | Example |
|---|---|---|
| `q` | free text (already exists conceptually as component state; now promoted to a URL param) | `?q=q6` |
| `marque` | comma-separated `Marque` values | `?marque=audi,skoda` |
| `status` | comma-separated `CarStatus` values | `?status=in-stock` |

An empty/absent param means "no filter on that dimension" (equivalent to the
"הכל" chip being active). Unknown values in the URL (e.g. a hand-edited
`?marque=bogus`) are silently ignored by the parser — they simply won't match
any chip and contribute nothing to the filter set.

`CarsPage` derives `selectedMarques: Set<Marque>` and
`selectedStatuses: Set<CarStatus>` from the parsed params, and builds:

```ts
function carMatchesFilters(car: Car): boolean {
  const marqueOk = selectedMarques.size === 0 || selectedMarques.has(car.marque);
  const statusOk = selectedStatuses.size === 0 || selectedStatuses.has(car.status);
  return marqueOk && statusOk;
}
```

passed to `DirectoryListLayout` as `filterFn={carMatchesFilters}`.

This parse/build logic (URL params ↔ `Set<Marque>`/`Set<CarStatus>`, and the
AND/OR combination rule) is extracted into a small pure utility —
`src/utils/carFilters.ts` — so it's unit-testable independent of routing or
rendering.

### New UI primitive — `FilterChip`

`src/components/ui/filter-chip.tsx` — a toggle button, one per file per
existing conventions:

```ts
export interface FilterChipProps {
  label: string;
  tone?: "positive" | "info" | "neutral" | "muted"; // mirrors Badge tones
  isActive: boolean;
  onToggle: () => void;
}
```

Renders a `<button type="button" aria-pressed={isActive}>`. Inactive state:
`border-cm-mist text-cm-graphite` background white/paper. Active state:
`bg-cm-blue text-white border-cm-blue` (mirrors the primary-button action
color, since selecting a chip is the one "clickable" affordance in the
toolbar — consistent with the design system's "Champion Blue = action" rule).
When `tone` is passed and the chip is inactive, the chip's text/border uses
that tone's color (so the "במלאי" status chip reads green-ish even before
selection, matching its `Badge` elsewhere) — active state always overrides to
`cm-blue` per the single-action-color rule.

Radius/height matches `Button`'s small size; focus ring `2px cm-blue` at 2px
offset per the accessibility floor.

### `CarsPage` integration

Two chip rows added above/alongside the existing search box, inside the
`filters` slot:

```
מקטע:   [ הכל ]  [ Volkswagen ]  [ VW Commercial ]  [ Audi ]  [ SEAT ]  [ CUPRA ]  [ Škoda ]
סטטוס:  [ הכל ]  [ במלאי ]  [ משוריין ]  [ נמסר ]  [ בטיפול ]
```

- "הכל" is a synthetic chip, active when the corresponding `Set` is empty;
  clicking it clears that dimension's selection (not a real filter value).
- Each real chip toggles membership in its `Set` and updates the URL param.
- Chip row uses `flex flex-wrap gap-2`, RTL-neutral (chips have no inherent
  direction — the row starts from the reading-start side automatically via
  `flex` + `dir="rtl"` inherited from the document root).
- Labels use existing `MARQUE_LABELS` / `CAR_STATUS_LABELS` — no new label
  strings to introduce or translate.

### Empty state

When filters and/or search produce zero rows, `DirectoryListLayout`'s
existing empty-state branch already distinguishes "no search query" vs
"search query present". This design does not change that copy — a
filtered-to-zero result with no search text will currently show the generic
`emptyTitle`/`emptyDescription` (e.g. "אין רכבים להצגה"), which is slightly
inaccurate when the true cause is an active filter combination. Accepted as a
minor, non-blocking gap for this iteration; revisit only if it proves
confusing in practice.

## Testing plan

Per this repo's testing rules (business-logic utilities get tests):

- `src/utils/carFilters.test.ts` — covers: empty selection matches everything,
  single marque/status match, multi-value OR-within-dimension /
  AND-across-dimension combination, URL param parse round-trip (including
  malformed/unknown values being ignored).
- No new test for `FilterChip` beyond what's already conventional for
  interactive components with ARIA state (`aria-pressed` toggles on click) —
  a light RTL-render test is reasonable but not required by the testing
  rules' "critical UI states" bar; left to implementation-time judgment.
- No test changes needed for `DirectoryListLayout` itself — the new props are
  optional pass-through logic already covered by the `carFilters` tests
  exercising `filterFn`'s actual predicate.

## Open items deferred to future design work

- Sort-by-column on the Cars list.
- The "add new car" button/flow (separate design, not started).
- Applying `filters`/`filterFn` to any other directory page.
