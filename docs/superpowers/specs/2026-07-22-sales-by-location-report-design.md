# Sales by Location Report — Design

## Purpose

The internal analytics section already has a sales report (`/analytics/sales`) broken
down by month and by marque. This adds a second, distinct sales report broken down by
**location** — which showroom/branch is delivering, and how much order value each is
carrying — so ops/leadership can compare branch performance.

## Scope

New page only. Does not modify the existing `SalesReportPage`. Follows the established
analytics-report pattern used by the four existing reports (sales, marketing, labor,
accounting) rather than introducing a new one.

## Data model

New type in `src/types/analytics.ts`:

```ts
export interface SalesByLocationAnalytics {
  deliveries: number;
  openOrders: number;
  avgStockDays: number;
  orderValueThousands: number;
  deliveriesByLocation: NamedValue[];
  orderValueByLocation: NamedValue[];
}
```

Reuses the existing `NamedValue` shape already used by `deliveriesByMarque` and
`utilizationByLocation`.

## Fixture data

New `salesByLocationAnalytics(months: RangeMonths)` function in
`src/lib/api/fixtures/analytics.ts`, colocated with the other four `*Analytics`
functions and carrying the same "demonstration data" disclaimer already documented at
the top of that file.

- Reuses the existing `DELIVERIES` series and `lastN` / `sum` / `splitByMix` helpers.
- Splits the deliveries total across the four **sales-capable** locations — `kind`
  `showroom` or `both` in `src/lib/api/fixtures/locations.ts`: אולם תצוגה תל אביב,
  מרכז שירות ראשון לציון, אולם תצוגה ירושלים, מרכז שירות באר שבע. מרכז שירות חיפה
  (`kind: "service"`) is excluded — it doesn't sell vehicles.
- Order value gets its own location mix (not a scaled copy of the deliveries mix), so
  the two charts show independent information.
- `openOrders` and `avgStockDays` are nationwide aggregates, computed the same way as
  in `salesAnalytics`.

## API + hook

- `api.analytics.salesByLocation(months)` added to `src/lib/api/client.ts`, alongside
  the existing `analytics.sales` / `marketing` / `labor` / `accounting` methods, using
  the same `resolve()` fake-latency wrapper.
- `src/hooks/useSalesByLocationAnalytics.ts`, structurally identical to
  `useSalesAnalytics.ts`.

## Page

`src/pages/analytics/SalesByLocationReportPage.tsx`, built on the same primitives as
the other four reports: `ReportLayout`, `ChartCard`, `StatTile`, `RangeFilter`,
`NominalBarChart`.

- Title: "מכירות לפי סניף". Description: short line noting this is the location cut of
  the sales data.
- KPI row: same 4 stat tiles as the existing sales report — מסירות, הזמנות פתוחות,
  ימי מלאי ממוצעים, שווי הזמנות (מ׳ ₪).
- Chart 1 — "מסירות לפי סניף": `NominalBarChart` over `deliveriesByLocation`, with the
  underlying table (`columns: ["סניף", "מסירות"]`) passed to `ChartCard` as with the
  existing marque chart.
- Chart 2 — "שווי הזמנות לפי סניף": `NominalBarChart` over `orderValueByLocation`, with
  its own table.

## Routing

New entry in `src/app/navigation.ts`:

- Lazy-loaded the same way as the other four analytics pages (keeps Recharts out of
  the initial bundle).
- `path: "/analytics/sales-by-location"`, `label: "מכירות לפי סניף"`, placed
  immediately after the existing `"/analytics/sales"` entry in the `analytics` section.
- Icon: `MapPin` from `lucide-react` — distinct from `TrendingUp` (used by the existing
  sales report) and `Building2` (used by the directory's Locations page), so the
  sidebar doesn't repeat an icon within the same view.

## States

No custom handling — `ReportLayout` already provides the first-load skeleton, the
dimmed-opacity refresh state, and `ErrorState` with retry. This page inherits all of it
for free, same as the other four reports.

## Testing

No new test file. `ChartCard` and `NominalBarChart` already have their own tests
covering rendering and table fallback; none of the five existing report pages
(`SalesReportPage`, `MarketingReportPage`, `LaborReportPage`, `AccountingReportPage`)
have page-level tests, and this page is pure composition of already-tested pieces with
no new business logic — consistent with `testing.md`'s guidance to skip "simple
presentational components with no logic." The `Sidebar.test.tsx` navigation test
derives its expectations from `NAV_SECTIONS` directly, so it covers the new nav entry
automatically without changes.

## Out of scope

- Does not touch the existing `SalesReportPage` or its hook/type.
- Does not add a drill-down link between the two sales reports.
- Does not surface sales stats on the per-location detail page
  (`LocationDetailPage.tsx`) — that was considered and explicitly deferred in favor of
  a standalone analytics page.
