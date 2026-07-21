import { ChartPlaceholder } from "@/components/features/analytics/ChartPlaceholder";
import { ReportLayout } from "@/components/features/analytics/ReportLayout";
import { PENDING_STAT } from "@/pages/analytics/pendingStat";

export function MarketingReportPage() {
  return (
    <ReportLayout
      title="דוח שיווק"
      description="לידים, קמפיינים ומקורות הגעה של לקוחות."
      stats={[
        PENDING_STAT("לידים חדשים"),
        PENDING_STAT("שיעור המרה"),
        PENDING_STAT("עלות לליד"),
        PENDING_STAT("קמפיינים פעילים"),
      ]}
    >
      <ChartPlaceholder
        title="לידים לפי מקור"
        description="פילוח מקורות ההגעה — אתר, קמפיינים ממומנים, הפניות וסניפים."
      />
      <ChartPlaceholder
        title="ביצועי קמפיינים"
        description="השוואת קמפיינים פעילים לאורך התקופה הנבחרת."
      />
    </ReportLayout>
  );
}
