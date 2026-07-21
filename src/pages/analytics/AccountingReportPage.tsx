import { useState } from "react";
import { ChartCard } from "@/components/features/analytics/ChartCard";
import { ReportLayout } from "@/components/features/analytics/ReportLayout";
import {
  RANGE_COMPARISON_LABELS,
  type RangeMonths,
} from "@/components/features/analytics/RangeFilter";
import type { StatTileProps } from "@/components/features/analytics/StatTile";
import { OrdinalBarChart } from "@/components/features/analytics/charts/OrdinalBarChart";
import { PairedBarChart } from "@/components/features/analytics/charts/PairedBarChart";
import { useAccountingAnalytics } from "@/hooks/useAccountingAnalytics";
import { formatNumber } from "@/utils/formatCurrency";

export function AccountingReportPage() {
  const [range, setRange] = useState<RangeMonths>(6);
  const state = useAccountingAnalytics(range);
  const data = state.data;

  const stats: StatTileProps[] = data
    ? [
        {
          label: "הכנסות (מ׳ ₪)",
          value: formatNumber(Math.round(data.revenueThousands / 1000)),
          delta: { label: "+5.8%", direction: "up" },
          note: RANGE_COMPARISON_LABELS[range],
        },
        {
          label: "חייבים פתוחים (מ׳ ₪)",
          value: formatNumber(Math.round(data.receivablesThousands / 1000)),
        },
        {
          label: "ימי גבייה ממוצעים",
          value: formatNumber(data.avgCollectionDays),
          delta: { label: "-2 ימים", direction: "down" },
        },
        {
          label: "תזרים נטו (מ׳ ₪)",
          value: formatNumber(Math.round(data.netCashThousands / 1000)),
        },
      ]
    : [];

  return (
    <ReportLayout
      title="דוח הנהלת חשבונות"
      description="הכנסות, חייבים ותזרים לפי סניף ותקופה."
      range={range}
      onRangeChange={setRange}
      state={state}
      stats={stats}
    >
      {data ? (
        <>
          <ChartCard
            title="הכנסות לפי חודש"
            description="מכירות מול שירות, באלפי ₪."
            isRefreshing={state.isLoading}
            table={{
              columns: ["חודש", "מכירות (אלפי ₪)", "שירות (אלפי ₪)"],
              rows: data.revenueByMonth.map((point) => [
                point.month,
                point.primary,
                point.secondary,
              ]),
            }}
          >
            <PairedBarChart
              data={data.revenueByMonth.map((point) => ({ ...point }))}
              categoryKey="month"
              primaryKey="primary"
              secondaryKey="secondary"
              primaryLabel="מכירות"
              secondaryLabel="שירות"
              stacked
              format={formatNumber}
              ariaLabel="תרשים הכנסות לפי חודש, מכירות מול שירות"
            />
          </ChartCard>

          <ChartCard
            title="גיול חייבים"
            description="יתרות פתוחות לפי טווח ימים, באלפי ₪."
            isRefreshing={state.isLoading}
            table={{
              columns: ["טווח", "יתרה (אלפי ₪)"],
              rows: data.receivablesAging.map((row) => [row.name, row.value]),
            }}
          >
            <OrdinalBarChart
              data={data.receivablesAging}
              seriesLabel="יתרה"
              format={formatNumber}
              ariaLabel="תרשים גיול חייבים לפי טווח ימים"
            />
          </ChartCard>
        </>
      ) : null}
    </ReportLayout>
  );
}
