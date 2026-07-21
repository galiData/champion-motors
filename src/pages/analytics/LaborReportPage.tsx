import { ChartPlaceholder } from "@/components/features/analytics/ChartPlaceholder";
import { ReportLayout } from "@/components/features/analytics/ReportLayout";
import { PENDING_STAT } from "@/pages/analytics/pendingStat";

export function LaborReportPage() {
  return (
    <ReportLayout
      title="דוח כוח אדם"
      description="תקינה, שעות עבודה וניצולת במרכזי השירות."
      stats={[
        PENDING_STAT("עובדים פעילים"),
        PENDING_STAT("שעות עבודה"),
        PENDING_STAT("ניצולת טכנאים"),
        PENDING_STAT("משרות פתוחות"),
      ]}
    >
      <ChartPlaceholder
        title="ניצולת לפי מרכז שירות"
        description="שעות שנוצלו מול שעות זמינות, בפילוח לפי סניף."
      />
      <ChartPlaceholder
        title="תקן מול איוש"
        description="פערי איוש לפי מחלקה ותפקיד."
      />
    </ReportLayout>
  );
}
