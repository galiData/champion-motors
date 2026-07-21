import { useParams } from "react-router-dom";
import { DetailLayout } from "@/components/features/directory/DetailLayout";
import { useLocationNames } from "@/hooks/useLocationNames";
import { useStaffMember } from "@/hooks/useStaffMember";
import { DEPARTMENT_LABELS } from "@/types/staff";
import { formatLongDate } from "@/utils/formatDate";

export function StaffMemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const state = useStaffMember(id);
  const locationNames = useLocationNames();

  return (
    <DetailLayout
      state={state}
      backTo="/staff"
      backLabel="חזרה לרשימת העובדים"
      title={(member) => member.name}
      subtitle={(member) => `${member.role} · ${DEPARTMENT_LABELS[member.department]}`}
      notFoundTitle="העובד לא נמצא"
      notFoundDescription="ייתכן שהרשומה הוסרה מהמערכת או שהקישור שגוי."
      fields={(member) => [
        { label: "תפקיד", value: member.role },
        { label: "מחלקה", value: DEPARTMENT_LABELS[member.department] },
        { label: "סניף", value: locationNames.get(member.locationId) ?? "—" },
        { label: "דוא״ל", value: <span dir="ltr">{member.email}</span> },
        { label: "טלפון", value: <span className="ltr-nums">{member.phone}</span> },
        { label: "תחילת עבודה", value: formatLongDate(member.startedAt) },
      ]}
    />
  );
}
