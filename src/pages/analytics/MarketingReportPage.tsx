import { useState } from "react";
import { ChartCard } from "@/components/features/analytics/ChartCard";
import { ReportLayout } from "@/components/features/analytics/ReportLayout";
import {
  RANGE_COMPARISON_LABELS,
  type RangeMonths,
} from "@/components/features/analytics/RangeFilter";
import type { StatTileProps } from "@/components/features/analytics/StatTile";
import { DualLineChart } from "@/components/features/analytics/charts/DualLineChart";
import { NominalBarChart } from "@/components/features/analytics/charts/NominalBarChart";
import { useMarketingAnalytics } from "@/hooks/useMarketingAnalytics";
import { formatCurrency, formatNumber } from "@/utils/formatCurrency";
import { formatPercent } from "@/utils/formatPercent";

export function MarketingReportPage() {
  const [range, setRange] = useState<RangeMonths>(6);
  const state = useMarketingAnalytics(range);
  const data = state.data;

  const stats: StatTileProps[] = data
    ? [
        {
          label: "לידים חדשים",
          value: formatNumber(data.leads),
          delta: { label: "+4.1%", direction: "up" },
          note: RANGE_COMPARISON_LABELS[range],
        },
        { label: "שיעור המרה", value: formatPercent(data.conversionRate) },
        { label: "עלות לליד", value: formatCurrency(data.costPerLeadIls) },
        { label: "קמפיינים פעילים", value: formatNumber(data.activeCampaigns) },
      ]
    : [];

  return (
    <ReportLayout
      title="דוח שיווק"
      description="לידים, קמפיינים ומקורות הגעה של לקוחות."
      range={range}
      onRangeChange={setRange}
      state={state}
      stats={stats}
    >
      {data ? (
        <>
          <ChartCard
            title="לידים לפי מקור"
            description="מאיפה הגיעו הפניות בטווח הנבחר."
            isRefreshing={state.isLoading}
            table={{
              columns: ["מקור", "לידים"],
              rows: data.leadsBySource.map((row) => [row.name, row.value]),
            }}
          >
            <NominalBarChart
              data={data.leadsBySource}
              seriesLabel="לידים"
              format={formatNumber}
              ariaLabel="תרשים לידים לפי מקור"
              categoryWidth={152}
            />
          </ChartCard>

          <ChartCard
            title="לידים מול המרות"
            description="נפח הפניות מול עסקאות שנסגרו, לפי חודש."
            isRefreshing={state.isLoading}
            table={{
              columns: ["חודש", "לידים", "המרות"],
              rows: data.leadsVsConversions.map((point) => [
                point.month,
                point.primary,
                point.secondary,
              ]),
            }}
          >
            <DualLineChart
              data={data.leadsVsConversions}
              primaryLabel="לידים"
              secondaryLabel="המרות"
              format={formatNumber}
              ariaLabel="תרשים לידים מול המרות לפי חודש"
            />
          </ChartCard>
        </>
      ) : null}
    </ReportLayout>
  );
}
