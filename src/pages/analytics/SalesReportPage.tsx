import { useState } from "react";
import { ChartCard } from "@/components/features/analytics/ChartCard";
import { ReportLayout } from "@/components/features/analytics/ReportLayout";
import {
  RANGE_COMPARISON_LABELS,
  type RangeMonths,
} from "@/components/features/analytics/RangeFilter";
import type { StatTileProps } from "@/components/features/analytics/StatTile";
import { NominalBarChart } from "@/components/features/analytics/charts/NominalBarChart";
import { TrendAreaChart } from "@/components/features/analytics/charts/TrendAreaChart";
import { useSalesAnalytics } from "@/hooks/useSalesAnalytics";
import { formatNumber } from "@/utils/formatCurrency";

export function SalesReportPage() {
  const [range, setRange] = useState<RangeMonths>(6);
  const state = useSalesAnalytics(range);
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
      title="דוח מכירות"
      description="מסירות, הזמנות ומלאי לפי סניף ומותג."
      range={range}
      onRangeChange={setRange}
      state={state}
      stats={stats}
    >
      {data ? (
        <>
          <ChartCard
            title="מסירות לפי חודש"
            description="מגמת המסירות בטווח הנבחר."
            isRefreshing={state.isLoading}
            table={{
              columns: ["חודש", "מסירות"],
              rows: data.deliveriesByMonth.map((point) => [point.month, point.value]),
            }}
          >
            <TrendAreaChart
              data={data.deliveriesByMonth}
              seriesLabel="מסירות"
              format={formatNumber}
              ariaLabel="תרשים מסירות לפי חודש"
            />
          </ChartCard>

          <ChartCard
            title="מסירות לפי מותג"
            description="פילוח המסירות בין מותגי הקבוצה."
            isRefreshing={state.isLoading}
            table={{
              columns: ["מותג", "מסירות"],
              rows: data.deliveriesByMarque.map((row) => [row.name, row.value]),
            }}
          >
            <NominalBarChart
              data={data.deliveriesByMarque}
              seriesLabel="מסירות"
              format={formatNumber}
              ariaLabel="תרשים מסירות לפי מותג"
            />
          </ChartCard>
        </>
      ) : null}
    </ReportLayout>
  );
}
