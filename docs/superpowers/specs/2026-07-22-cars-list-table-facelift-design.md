# Cars List Page — Table Facelift — Design

**Date:** 2026-07-22
**Status:** Approved
**Scope:** `src/pages/directory/CarsPage.tsx` (row rendering) and the shared
`src/components/ui/table.tsx` primitives.

## Problem

The Cars list page (`/cars`) renders a functional but flat table through the
shared `DirectoryListLayout` shell. There is no hover feedback, the model/marque
share one undifferentiated line, the price (the figure a sales rep scans for)
carries no emphasis, and the license plate reads as loose text. The page works
but does not feel like the premium, considered surface the rest of the product
(e.g. the recently reworked `CarDetailPage`) has moved toward.

This is a **visual + light-interaction polish** of the existing table — not a
redesign, not a card grid, and not the filtering feature (tracked separately in
`2026-07-22-cars-list-filtering-design.md`).

## Constraints

- **Champion palette only.** All color comes from the design-system tokens.
- **No marque colors or logos.** The brand rules sanction authentic OEM colors
  in listings but forbid inventing them, and no real per-marque values are
  documented in the codebase or the brand skill. Marque identity in the table
  therefore stays as the Latin wordmark. Colored marque tags are a clean
  follow-up *if* the marque CI manuals are later obtained.
- **RTL-native.** Logical properties only (`ms-*`/`me-*`/`ps-*`/`pe-*`/
  `start-*`/`end-*`/`text-start`/`text-end`). Latin model names, license plates,
  prices and years stay LTR inline.
- **No behavioral change beyond whole-row navigation.** No data, no routing
  structure, no filtering.

## Goals

- Make the table scannable and premium within the existing layout.
- Give the price and license plate the visual weight their role warrants.
- Whole-row click-to-detail, without regressing keyboard/RTL accessibility.
- Improve the shared table primitives so all four directory pages benefit
  consistently, without forking a Cars-specific table.

## Non-goals

- Marque/status filter chips (separate approved spec).
- Sort-by-column.
- Any change to Customers, Locations, or Staff row rendering (they inherit only
  the neutral shared-table refinements).
- Zebra striping (rejected — reads busy; the design language treats whitespace
  and restraint as the premium signal, and hover does the scanning job).
- Signal Red on the price column (rationed to one role tied to a real fact; a
  full column of list prices is not that).

## Architecture

Two layers, matching the approved blast-radius decision ("Cars-only, plus shared
table styling").

### Layer 1 — Shared table primitives (`src/components/ui/table.tsx`)

Neutral, brand-token-only refinements. Every directory page (Cars, Customers,
Locations, Staff) inherits them; none breaks.

- `TableRow`: add `transition-colors hover:bg-cm-surface`. Motion within the
  200–300ms UI-transition band. No hover currently exists.
- `TableHeader` (or `TableHead`): subtle `bg-cm-surface` fill so the column
  labels read as a distinct band. Keep existing `cm-deep-blue` semibold text and
  the `cm-line` bottom rule. (Apply the fill at the level that renders a clean
  band across all columns — implementation decides `thead` vs `th`; the visual
  result is the contract.)
- No zebra striping.

Note: `CarsPage` adds `cursor-pointer` and an `onClick` to its *own* rows (Layer
2). The shared `TableRow` stays non-interactive by default so the other three
pages are visually improved but behaviorally unchanged.

### Layer 2 — Cars row rendering (`src/pages/directory/CarsPage.tsx`)

The Cars page supplies `renderRow`; all Cars-specific polish lives there. No
change to `DirectoryListLayout`.

- **Model cell** (three-tier hierarchy, all `dir="ltr"`):
  - Marque as a small eyebrow label — `text-sm text-cm-slate`
    (`MARQUE_LABELS[car.marque]`).
  - Model name as the bold `cm-ink` primary, remaining the `cm-blue`
    `hover:underline` link to `/cars/:id` (this is the keyboard-accessible
    anchor — see accessibility below).
  - Trim beneath in `text-sm text-cm-gray`.
- **License plate:** a bordered plate-style chip — `border border-cm-mist`,
  small radius, `ltr-nums`, `text-cm-graphite`. Reads as a real identifier and
  aligns the column.
- **Status:** keep the `Badge` with its existing `STATUS_TONE` mapping; add a
  small leading dot (a `rounded-full` span) inside/beside the badge for
  at-a-glance scanning. The Hebrew label is always present — meaning is never
  carried by color alone. Dot color stays within the palette per tone.
- **Location:** a `MapPin` icon (lucide, `size-4 text-cm-gray`, `aria-hidden`)
  before the branch name — consistent with `CarDetailPage`, which already uses
  `MapPin`. Falls back to `—` when unknown (unchanged).
- **Price:** the key figure — bold, slightly larger than body, `text-cm-ink`,
  `ltr-nums`, via the existing `formatCurrency`. Not red.

### Whole-row navigation + accessibility

- The `TableRow` for a car gets `onClick={() => navigate(\`/cars/${car.id}\`)}`
  (`useNavigate` from `react-router-dom`) and `cursor-pointer`.
- The model-name `<a>` (`react-router` `Link`) stays in the row as the
  **keyboard-accessible** path: it remains focusable, keeps the visible
  `cm-blue` focus ring, and preserves logical RTL tab order. Mouse users can
  click anywhere on the row; keyboard/screen-reader users get a real link.
- The row `onClick` is a mouse convenience layered on top of a genuine anchor —
  not a replacement for it — so no `role`/`tabIndex` hacks on the `<tr>` are
  introduced.
- Touch target: full-width row comfortably exceeds the 44×44px floor.

## Testing plan

Per this repo's testing rules, presentational components with no logic are not
unit-tested, and this change introduces no new business logic, formatter, or
pricing/availability rule (it reuses the existing `formatCurrency`,
`MARQUE_LABELS`, `CAR_STATUS_LABELS`, `STATUS_TONE`, and `useLocationNames`).

- **No new unit tests required.** The one behavioral addition — whole-row
  navigation — is a thin `useNavigate` call; if a light RTL-render/interaction
  test proves warranted at implementation time it may be added, but the testing
  rules' "critical UI states" bar does not mandate it.
- **Verification gate before "done":**
  - `npm run test:run` stays green (no regressions in the existing suite).
  - TypeScript typecheck and lint stay green — no `any`, no disabled rules, no
    `@ts-ignore`.
  - Manual RTL check: layout uses logical properties only; hover, plate chip,
    status dot, and row click render correctly under `dir="rtl"`.

## Out of scope / future work

- Marque/status filter chips (`2026-07-22-cars-list-filtering-design.md`).
- Colored marque tags/logos, pending real OEM CI manuals.
- Sort-by-column on the Cars list.
- Extending row-click or any Cars-specific polish to the other directory pages.
