# Sales by Location Report Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new analytics page, "מכירות לפי סניף" (Sales by Location), reachable from the sidebar at `/analytics/sales-by-location`, showing the same four sales KPI tiles as the existing sales report plus two bar charts breaking deliveries and order value down by branch instead of by month/marque.

**Architecture:** Follows the existing analytics-report pattern exactly (type → fixture function → API method → hook → page → nav entry), the same pipeline already used by the sales/marketing/labor/accounting reports. No new architectural concepts.

**Tech Stack:** React 19 + TypeScript (strict), Vite, Recharts (via existing `NominalBarChart`), `react-router-dom`, Vitest/RTL (not used in this plan — see Global Constraints).

## Global Constraints

- Strict TypeScript: explicit param/return types, no `any`, no `@ts-ignore` (per `.claude/rules/code-style.md`).
- Named exports only, one component per file, functional components only.
- Absolute imports via `@/`; import order React → third-party → internal → types.
- All user-facing strings in Hebrew; Latin/numeric content stays LTR (already handled by the shared components this plan reuses — no new formatting code needed).
- Logical Tailwind properties only if any new className is added (none are needed here — this plan only composes existing styled components).
- Per the approved design spec (`docs/superpowers/specs/2026-07-22-sales-by-location-report-design.md`) and `.claude/rules/testing.md`'s guidance to skip "simple presentational components with no logic": **no new test files**. This mirrors the existing sales/marketing/labor/accounting report pages, none of which have page-level tests. Every task instead verifies via `npm run typecheck`; the final task also runs the full existing suite and a manual browser check.
- Commit after every task with an imperative-present-tense, single-concern message (per root `CLAUDE.md`).

---

### Task 1: Add the `SalesByLocationAnalytics` type

**Files:**
- Modify: `src/types/analytics.ts:24-31` (directly after the existing `SalesAnalytics` interface)

**Interfaces:**
- Produces: `SalesByLocationAnalytics` — consumed by Task 2 (fixture), Task 3 (API client), Task 4 (hook), Task 5 (page).

- [ ] **Step 1: Add the interface**

Insert immediately after the closing brace of `SalesAnalytics` (currently ending at line 31 with `}`), before the blank line preceding `MarketingAnalytics`:

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

The file already declares `NamedValue` above `SalesAnalytics`, so no new import is needed.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/analytics.ts
git commit -m "Add SalesByLocationAnalytics type"
```

---

### Task 2: Add the `salesByLocationAnalytics` fixture function

**Files:**
- Modify: `src/lib/api/fixtures/analytics.ts`

**Interfaces:**
- Consumes: `SalesByLocationAnalytics` (Task 1), `RangeMonths` (already imported in this file), existing helpers `lastN`, `sum`, `splitByMix`, and the existing `DELIVERIES` constant — all already defined in this file.
- Produces: `salesByLocationAnalytics(months: RangeMonths): SalesByLocationAnalytics` — consumed by Task 3.

- [ ] **Step 1: Extend the type import**

Change the import at the top of the file from:

```ts
import type {
  AccountingAnalytics,
  LaborAnalytics,
  MarketingAnalytics,
  SalesAnalytics,
} from "@/types/analytics";
```

to:

```ts
import type {
  AccountingAnalytics,
  LaborAnalytics,
  MarketingAnalytics,
  SalesAnalytics,
  SalesByLocationAnalytics,
} from "@/types/analytics";
```

- [ ] **Step 2: Add the location mixes**

Insert directly after the existing `MARQUE_MIX` constant (after its closing `];` at line 54), before `SOURCE_MIX`:

```ts
/**
 * Deliveries mix across the sales-capable locations (kind `showroom` or
 * `both` in src/lib/api/fixtures/locations.ts). מרכז שירות חיפה is
 * service-only and is excluded — it doesn't sell vehicles.
 */
const LOCATION_DELIVERY_MIX: [string, number][] = [
  ["אולם תצוגה תל אביב", 0.33],
  ["מרכז שירות ראשון לציון", 0.29],
  ["מרכז שירות באר שבע", 0.21],
  ["אולם תצוגה ירושלים", 0.17],
];

/** Order-value mix across the same locations — deliberately not a scaled copy of the deliveries mix. */
const LOCATION_ORDER_VALUE_MIX: [string, number][] = [
  ["מרכז שירות ראשון לציון", 0.31],
  ["אולם תצוגה תל אביב", 0.3],
  ["אולם תצוגה ירושלים", 0.21],
  ["מרכז שירות באר שבע", 0.18],
];
```

- [ ] **Step 3: Add the fixture function**

Insert directly after the existing `salesAnalytics` function (after its closing `}` around line 90), before `marketingAnalytics`:

```ts
export function salesByLocationAnalytics(months: RangeMonths): SalesByLocationAnalytics {
  const deliveries = lastN(DELIVERIES, months);
  const total = sum(deliveries);
  const orderValue = Math.round(total * 212);

  return {
    deliveries: total,
    openOrders: Math.round(total * 0.31),
    avgStockDays: months === 3 ? 38 : months === 6 ? 41 : 44,
    orderValueThousands: orderValue,
    deliveriesByLocation: splitByMix(total, LOCATION_DELIVERY_MIX),
    orderValueByLocation: splitByMix(orderValue, LOCATION_ORDER_VALUE_MIX),
  };
}
```

Note this deliberately reproduces the same nationwide `openOrders` / `avgStockDays` / `orderValueThousands` formulas as `salesAnalytics` — the KPI tiles on the new page show the same nationwide numbers as the existing sales report, just paired with a location cut instead of a marque cut.

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: exits 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/api/fixtures/analytics.ts
git commit -m "Add salesByLocationAnalytics fixture data"
```

---

### Task 3: Wire the fixture into the fake API client

**Files:**
- Modify: `src/lib/api/client.ts`

**Interfaces:**
- Consumes: `salesByLocationAnalytics` (Task 2), `SalesByLocationAnalytics` type (Task 1).
- Produces: `api.analytics.salesByLocation(months: RangeMonths): Promise<SalesByLocationAnalytics>` — consumed by Task 4.

- [ ] **Step 1: Extend the fixture import**

Change:

```ts
import {
  accountingAnalytics,
  laborAnalytics,
  marketingAnalytics,
  salesAnalytics,
} from "@/lib/api/fixtures/analytics";
```

to:

```ts
import {
  accountingAnalytics,
  laborAnalytics,
  marketingAnalytics,
  salesAnalytics,
  salesByLocationAnalytics,
} from "@/lib/api/fixtures/analytics";
```

- [ ] **Step 2: Extend the type import**

Change:

```ts
import type {
  AccountingAnalytics,
  LaborAnalytics,
  MarketingAnalytics,
  SalesAnalytics,
} from "@/types/analytics";
```

to:

```ts
import type {
  AccountingAnalytics,
  LaborAnalytics,
  MarketingAnalytics,
  SalesAnalytics,
  SalesByLocationAnalytics,
} from "@/types/analytics";
```

- [ ] **Step 3: Add the API method**

Inside the `analytics` object (currently lines 70-77), add a new entry directly after `sales`:

```ts
  analytics: {
    sales: (months: RangeMonths): Promise<SalesAnalytics> => resolve(salesAnalytics(months)),
    salesByLocation: (months: RangeMonths): Promise<SalesByLocationAnalytics> =>
      resolve(salesByLocationAnalytics(months)),
    marketing: (months: RangeMonths): Promise<MarketingAnalytics> =>
      resolve(marketingAnalytics(months)),
    labor: (months: RangeMonths): Promise<LaborAnalytics> => resolve(laborAnalytics(months)),
    accounting: (months: RangeMonths): Promise<AccountingAnalytics> =>
      resolve(accountingAnalytics(months)),
  },
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: exits 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/api/client.ts
git commit -m "Add salesByLocation method to the fake analytics API client"
```

---

### Task 4: Add the `useSalesByLocationAnalytics` hook

**Files:**
- Create: `src/hooks/useSalesByLocationAnalytics.ts`

**Interfaces:**
- Consumes: `api.analytics.salesByLocation` (Task 3), `useAsyncData` (existing, `src/hooks/useAsyncData.ts`), `RangeMonths` (existing), `SalesByLocationAnalytics` (Task 1).
- Produces: `useSalesByLocationAnalytics(months: RangeMonths): AsyncState<SalesByLocationAnalytics>` — consumed by Task 5.

- [ ] **Step 1: Create the hook file**

```ts
import type { RangeMonths } from "@/components/features/analytics/RangeFilter";
import { useCallback } from "react";
import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { SalesByLocationAnalytics } from "@/types/analytics";

export function useSalesByLocationAnalytics(
  months: RangeMonths,
): AsyncState<SalesByLocationAnalytics> {
  return useAsyncData(useCallback(() => api.analytics.salesByLocation(months), [months]));
}
```

This is structurally identical to `src/hooks/useSalesAnalytics.ts` — same shape, different API method and type.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useSalesByLocationAnalytics.ts
git commit -m "Add useSalesByLocationAnalytics hook"
```

---

### Task 5: Add the `SalesByLocationReportPage` page

**Files:**
- Create: `src/pages/analytics/SalesByLocationReportPage.tsx`

**Interfaces:**
- Consumes: `useSalesByLocationAnalytics` (Task 4); existing `ChartCard`, `ReportLayout`, `RANGE_COMPARISON_LABELS`, `RangeMonths`, `StatTileProps`, `NominalBarChart`, `formatNumber` (all already exist — same imports `SalesReportPage.tsx` uses).
- Produces: exported `SalesByLocationReportPage` component — consumed by Task 6.

- [ ] **Step 1: Create the page file**

```tsx
import { useState } from "react";
import { ChartCard } from "@/components/features/analytics/ChartCard";
import { ReportLayout } from "@/components/features/analytics/ReportLayout";
import {
  RANGE_COMPARISON_LABELS,
  type RangeMonths,
} from "@/components/features/analytics/RangeFilter";
import type { StatTileProps } from "@/components/features/analytics/StatTile";
import { NominalBarChart } from "@/components/features/analytics/charts/NominalBarChart";
import { useSalesByLocationAnalytics } from "@/hooks/useSalesByLocationAnalytics";
import { formatNumber } from "@/utils/formatCurrency";

export function SalesByLocationReportPage() {
  const [range, setRange] = useState<RangeMonths>(6);
  const state = useSalesByLocationAnalytics(range);
  const data = state.data;

  const stats: StatTileProps[] = data
    ? [
        {
          label: "מסירות",
          value: formatNumber(data.deliveries),
          delta: { label: "+6.2%", direction: "up" },
          note: RANGE_COMPARISON_LABELS[range],
        },
        { label: "הזמנות פתוחות", value: formatNumber(data.openOrders) },
        {
          label: "ימי מלאי ממוצעים",
          value: formatNumber(data.avgStockDays),
          delta: { label: "-3 ימים", direction: "down" },
        },
        {
          label: "שווי הזמנות (מ׳ ₪)",
          value: formatNumber(Math.round(data.orderValueThousands / 1000)),
        },
      ]
    : [];

  return (
    <ReportLayout
      title="מכירות לפי סניף"
      description="מסירות ושווי הזמנות לפי סניף מכירה."
      range={range}
      onRangeChange={setRange}
      state={state}
      stats={stats}
    >
      {data ? (
        <>
          <ChartCard
            title="מסירות לפי סניף"
            description="פילוח המסירות בין סניפי המכירה בטווח הנבחר."
            isRefreshing={state.isLoading}
            table={{
              columns: ["סניף", "מסירות"],
              rows: data.deliveriesByLocation.map((row) => [row.name, row.value]),
            }}
          >
            <NominalBarChart
              data={data.deliveriesByLocation}
              seriesLabel="מסירות"
              format={formatNumber}
              ariaLabel="תרשים מסירות לפי סניף"
            />
          </ChartCard>

          <ChartCard
            title="שווי הזמנות לפי סניף"
            description="פילוח שווי ההזמנות בין סניפי המכירה בטווח הנבחר."
            isRefreshing={state.isLoading}
            table={{
              columns: ["סניף", "שווי הזמנות (אלפי ₪)"],
              rows: data.orderValueByLocation.map((row) => [row.name, row.value]),
            }}
          >
            <NominalBarChart
              data={data.orderValueByLocation}
              seriesLabel="שווי הזמנות"
              format={formatNumber}
              ariaLabel="תרשים שווי הזמנות לפי סניף"
            />
          </ChartCard>
        </>
      ) : null}
    </ReportLayout>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/analytics/SalesByLocationReportPage.tsx
git commit -m "Add SalesByLocationReportPage"
```

---

### Task 6: Wire the page into navigation and routing

**Files:**
- Modify: `src/app/navigation.ts`

**Interfaces:**
- Consumes: `SalesByLocationReportPage` (Task 5, via lazy import).
- Produces: new routable nav item at `/analytics/sales-by-location` — this is the final integration task; the feature is reachable end-to-end after this task.

- [ ] **Step 1: Add the `MapPin` icon import**

Change:

```ts
import {
  Building2,
  Calculator,
  CarFront,
  FolderOpen,
  Home,
  IdCard,
  Megaphone,
  MessagesSquare,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
```

to (keeping alphabetical order):

```ts
import {
  Building2,
  Calculator,
  CarFront,
  FolderOpen,
  Home,
  IdCard,
  MapPin,
  Megaphone,
  MessagesSquare,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
```

- [ ] **Step 2: Add the lazy import**

Directly after the existing `SalesReportPage` lazy import (after its closing `);` at line 26), insert:

```ts
const SalesByLocationReportPage = lazy(() =>
  import("@/pages/analytics/SalesByLocationReportPage").then((m) => ({
    default: m.SalesByLocationReportPage,
  })),
);
```

- [ ] **Step 3: Add the nav item**

In `NAV_SECTIONS`, inside the `analytics` section's `items` array, change:

```ts
      { path: "/analytics/sales", label: "מכירות", icon: TrendingUp, Component: SalesReportPage },
      {
        path: "/analytics/marketing",
```

to:

```ts
      { path: "/analytics/sales", label: "מכירות", icon: TrendingUp, Component: SalesReportPage },
      {
        path: "/analytics/sales-by-location",
        label: "מכירות לפי סניף",
        icon: MapPin,
        Component: SalesByLocationReportPage,
      },
      {
        path: "/analytics/marketing",
```

- [ ] **Step 4: Typecheck and lint**

Run: `npm run typecheck`
Expected: exits 0, no errors.

Run: `npm run lint`
Expected: exits 0, no errors (confirms the new `MapPin` import ordering and no unused imports).

- [ ] **Step 5: Run the existing test suite**

Run: `npm run test:run`
Expected: all existing tests pass, including `src/components/layout/Sidebar.test.tsx`, which derives its expected links from `NAV_SECTIONS` and will automatically cover the new item.

- [ ] **Step 6: Manual verification in the browser**

Run: `npm run dev`

Open the app, log in if required, and confirm:
- The sidebar's "אנליטיקה" section now shows "מכירות לפי סניף" directly under "מכירות", with a distinct pin icon.
- Clicking it navigates to `/analytics/sales-by-location` and renders four KPI tiles and two bar charts ("מסירות לפי סניף", "שווי הזמנות לפי סניף"), each with a working "טבלה" toggle.
- Changing the טווח זמן (3/6/12 months) filter updates all four tiles and both charts together.
- Layout reads correctly RTL (bars grow from the right, branch names on the right axis).

Stop the dev server once confirmed.

- [ ] **Step 7: Commit**

```bash
git add src/app/navigation.ts
git commit -m "Add Sales by Location report to the analytics navigation"
```

---

## Self-Review Notes

- **Spec coverage:** all six spec sections (data model, fixture data, API+hook, page, routing, states/testing) map to Tasks 1–6 respectively; "states" needed no dedicated task since `ReportLayout` provides loading/error/refresh handling for free, as noted in Task 6's manual-verification step.
- **Placeholders:** none — every step has literal file content, exact commands, and expected output.
- **Type consistency:** `SalesByLocationAnalytics` (Task 1) → `salesByLocationAnalytics` return type (Task 2) → `api.analytics.salesByLocation` return type (Task 3) → `useSalesByLocationAnalytics` return type (Task 4) → `state.data` shape consumed in the page (Task 5) all match field-for-field (`deliveries`, `openOrders`, `avgStockDays`, `orderValueThousands`, `deliveriesByLocation`, `orderValueByLocation`).
