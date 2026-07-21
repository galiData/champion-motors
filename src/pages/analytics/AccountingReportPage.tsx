import { ChartPlaceholder } from "@/components/features/analytics/ChartPlaceholder";
import { ReportLayout } from "@/components/features/analytics/ReportLayout";
import { PENDING_STAT } from "@/pages/analytics/pendingStat";

export function AccountingReportPage() {
  return (
    <ReportLayout
      title="דוח הנהלת חשבונות"
      description="הכנסות, חייבים ותזרים לפי סניף ותקופה."
      stats={[
        PENDING_STAT("הכנסות"),
        PENDING_STAT("חייבים פתוחים"),
        PENDING_STAT("ימי גבייה ממוצעים"),
        PENDING_STAT("תזרים נטו"),
      ]}
    >
      <ChartPlaceholder
        title="הכנסות לפי חודש"
        description="מגמת ההכנסות לאורך שנת הכספים, בפילוח מכירות מול שירות."
      />
      <ChartPlaceholder
        title="גיול חייבים"
        description="יתרות פתוחות לפי טווחי ימים."
      />
    </ReportLayout>
  );
}
