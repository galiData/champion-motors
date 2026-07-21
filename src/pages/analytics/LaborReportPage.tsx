import { useState } from "react";
import { ChartCard } from "@/components/features/analytics/ChartCard";
import { ReportLayout } from "@/components/features/analytics/ReportLayout";
import {
  RANGE_COMPARISON_LABELS,
  type RangeMonths,
} from "@/components/features/analytics/RangeFilter";
import type { StatTileProps } from "@/components/features/analytics/StatTile";
import { NominalBarChart } from "@/components/features/analytics/charts/NominalBarChart";
import { PairedBarChart } from "@/components/features/analytics/charts/PairedBarChart";
import { useLaborAnalytics } from "@/hooks/useLaborAnalytics";
import { formatNumber } from "@/utils/formatCurrency";
import { formatPercent } from "@/utils/formatPercent";

export function LaborReportPage() {
  const [range, setRange] = useState<RangeMonths>(6);
  const state = useLaborAnalytics(range);
  const data = state.data;

  const stats: StatTileProps[] = data
    ? [
        { label: "עובדים פעילים", value: formatNumber(data.activeStaff) },
        {
          label: "שעות עבודה",
          value: formatNumber(data.workedHours),
          note: RANGE_COMPARISON_LABELS[range],
        },
        {
          label: "ניצולת טכנאים",
          value: formatPercent(data.technicianUtilization),
          delta: { label: "+2.0%", direction: "up" },
        },
        { label: "משרות פתוחות", value: formatNumber(data.openPositions) },
      ]
    : [];

  return (
    <ReportLayout
      title="דוח כוח אדם"
      description="תקינה, שעות עבודה וניצולת במרכזי השירות."
      range={range}
      onRangeChange={setRange}
      state={state}
      stats={stats}
    >
      {data ? (
        <>
          <ChartCard
            title="ניצולת לפי מרכז שירות"
            description="אחוז השעות שנוצלו מתוך השעות הזמינות."
            isRefreshing={state.isLoading}
            table={{
              columns: ["מרכז שירות", "ניצולת (%)"],
              rows: data.utilizationByLocation.map((row) => [row.name, row.value]),
            }}
          >
            <NominalBarChart
              data={data.utilizationByLocation}
              seriesLabel="ניצולת"
              format={formatPercent}
              ariaLabel="תרשים ניצולת לפי מרכז שירות"
            />
          </ChartCard>

          <ChartCard
            title="תקן מול איוש"
            description="פערי איוש לפי מחלקה."
            isRefreshing={state.isLoading}
            table={{
              columns: ["מחלקה", "תקן", "איוש"],
              rows: data.headcountByDepartment.map((row) => [row.name, row.plan, row.actual]),
            }}
          >
            <PairedBarChart
              data={data.headcountByDepartment.map((row) => ({ ...row }))}
              categoryKey="name"
              primaryKey="plan"
              secondaryKey="actual"
              primaryLabel="תקן"
              secondaryLabel="איוש"
              format={formatNumber}
              ariaLabel="תרשים תקן מול איוש לפי מחלקה"
            />
          </ChartCard>
        </>
      ) : null}
    </ReportLayout>
  );
}
