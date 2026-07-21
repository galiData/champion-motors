import { Link } from "react-router-dom";
import { DirectoryListLayout } from "@/components/features/directory/DirectoryListLayout";
import { TableCell, TableRow } from "@/components/ui/table";
import { useLocationNames } from "@/hooks/useLocationNames";
import { useStaff } from "@/hooks/useStaff";
import { DEPARTMENT_LABELS, type StaffMember } from "@/types/staff";
import { formatDate } from "@/utils/formatDate";

const COLUMNS = ["שם", "תפקיד", "מחלקה", "סניף", "טלפון", "תחילת עבודה"];

function matches(member: StaffMember, query: string): boolean {
  return (
    member.name.includes(query) ||
    member.role.includes(query) ||
    member.email.toLowerCase().includes(query.toLowerCase())
  );
}

export function StaffPage() {
  const state = useStaff();
  const locationNames = useLocationNames();

  return (
    <DirectoryListLayout
      title="עובדים"
      description="עובדי צ'מפיון מוטורס לפי תפקיד, מחלקה וסניף."
      state={state}
      columns={COLUMNS}
      matches={matches}
      searchPlaceholder="חיפוש לפי שם, תפקיד או דוא״ל"
      emptyTitle="אין עובדים להצגה"
      emptyDescription="ברגע שיתווספו עובדים למערכת הם יופיעו כאן."
      renderRow={(member) => (
        <TableRow key={member.id}>
          <TableCell>
            <Link to={`/staff/${member.id}`} className="font-semibold text-cm-blue hover:underline">
              {member.name}
            </Link>
          </TableCell>
          <TableCell className="text-cm-graphite">{member.role}</TableCell>
          <TableCell className="text-cm-graphite">
            {DEPARTMENT_LABELS[member.department]}
          </TableCell>
          <TableCell className="text-cm-graphite">
            {locationNames.get(member.locationId) ?? "—"}
          </TableCell>
          <TableCell>
            <span className="ltr-nums text-cm-graphite">{member.phone}</span>
          </TableCell>
          <TableCell className="text-cm-graphite">{formatDate(member.startedAt)}</TableCell>
        </TableRow>
      )}
    />
  );
}
