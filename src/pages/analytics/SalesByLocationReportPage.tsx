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
