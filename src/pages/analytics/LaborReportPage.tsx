import { useState } from "react";
import { Link } from "react-router-dom";
import { ChartCard } from "@/components/features/analytics/ChartCard";
import { ReportLayout } from "@/components/features/analytics/ReportLayout";
import {
  RANGE_COMPARISON_LABELS,
  type RangeMonths,
} from "@/components/features/analytics/RangeFilter";
import type { StatTileProps } from "@/components/features/analytics/StatTile";
import { NominalBarChart } from "@/components/features/analytics/charts/NominalBarChart";
import { PairedBarChart } from "@/components/features/analytics/charts/PairedBarChart";
import { DirectoryListLayout } from "@/components/features/directory/DirectoryListLayout";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useLaborAnalytics } from "@/hooks/useLaborAnalytics";
import { useLeaveRequests } from "@/hooks/useLeaveRequests";
import { useStaffNames } from "@/hooks/useStaffNames";
import { LEAVE_STATUS_LABELS, LEAVE_TYPE_LABELS, type LeaveRequest } from "@/types/leave";
import { formatDate } from "@/utils/formatDate";
import { formatNumber } from "@/utils/formatCurrency";
import { leaveDurationDays } from "@/utils/leaveDuration";
import { formatPercent } from "@/utils/formatPercent";

const LEAVE_COLUMNS = ["עובד", "סוג חופשה", "מתאריך", "עד תאריך", "ימים", "סטטוס", "הוגש בתאריך"];

const LEAVE_STATUS_TONE: Record<LeaveRequest["status"], NonNullable<BadgeProps["tone"]>> = {
  pending: "info",
  approved: "positive",
  rejected: "alert",
};

function matchesLeaveRequest(
  request: LeaveRequest,
  staffNames: Map<string, string>,
  query: string,
): boolean {
  const employeeName = staffNames.get(request.staffId) ?? "";
  const lowerQuery = query.toLowerCase();
  return (
    employeeName.includes(query) ||
    LEAVE_TYPE_LABELS[request.type].includes(query) ||
    LEAVE_STATUS_LABELS[request.status].toLowerCase().includes(lowerQuery)
  );
}

export function LaborReportPage() {
  const [range, setRange] = useState<RangeMonths>(6);
  const state = useLaborAnalytics(range);
  const data = state.data;
  const leaveState = useLeaveRequests();
  const staffNames = useStaffNames();

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

          <DirectoryListLayout
            variant="section"
            className="xl:col-span-2"
            title="בקשות חופשה"
            description="בקשות חופשה, מחלה והיעדרות של עובדי צ'מפיון מוטורס וסטטוס האישור שלהן."
            state={leaveState}
            columns={LEAVE_COLUMNS}
            matches={(request, query) => matchesLeaveRequest(request, staffNames, query)}
            searchPlaceholder="חיפוש לפי עובד, סוג חופשה או סטטוס"
            emptyTitle="אין בקשות חופשה להצגה"
            emptyDescription="ברגע שיוגשו בקשות חופשה הן יופיעו כאן."
            renderRow={(request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Link
                    to={`/staff/${request.staffId}`}
                    className="font-semibold text-cm-blue hover:underline"
                  >
                    {staffNames.get(request.staffId) ?? "—"}
                  </Link>
                </TableCell>
                <TableCell className="text-cm-graphite">
                  {LEAVE_TYPE_LABELS[request.type]}
                </TableCell>
                <TableCell className="text-cm-graphite">{formatDate(request.startDate)}</TableCell>
                <TableCell className="text-cm-graphite">{formatDate(request.endDate)}</TableCell>
                <TableCell className="ltr-nums text-cm-graphite">
                  {leaveDurationDays(request.startDate, request.endDate)}
                </TableCell>
                <TableCell>
                  <Badge tone={LEAVE_STATUS_TONE[request.status]}>
                    {LEAVE_STATUS_LABELS[request.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-cm-graphite">
                  {formatDate(request.submittedAt)}
                </TableCell>
              </TableRow>
            )}
          />
        </>
      ) : null}
    </ReportLayout>
  );
}
