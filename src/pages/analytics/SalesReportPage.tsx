import { ChartPlaceholder } from "@/components/features/analytics/ChartPlaceholder";
import { ReportLayout } from "@/components/features/analytics/ReportLayout";
import { PENDING_STAT } from "@/pages/analytics/pendingStat";

export function SalesReportPage() {
  return (
    <ReportLayout
      title="דוח מכירות"
      description="מסירות, הזמנות ומלאי לפי סניף ומותג."
      stats={[
        PENDING_STAT("מסירות החודש"),
        PENDING_STAT("הזמנות פתוחות"),
        PENDING_STAT("ימי מלאי ממוצעים"),
        PENDING_STAT("שווי הזמנות"),
      ]}
    >
      <ChartPlaceholder
        title="מסירות לפי חודש"
        description="מגמת המסירות לאורך השנה, בפילוח לפי מותג."
      />
      <ChartPlaceholder
        title="מכירות לפי סניף"
        description="השוואה בין הסניפים לתקופה הנבחרת."
      />
    </ReportLayout>
  );
}
