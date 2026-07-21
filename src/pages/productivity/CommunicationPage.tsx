import { Bell, Mail, MessagesSquare, Megaphone } from "lucide-react";
import { LauncherGrid } from "@/components/features/productivity/LauncherGrid";
import { PageHeader } from "@/components/layout/PageHeader";

export function CommunicationPage() {
  return (
    <div>
      <PageHeader
        title="תקשורת"
        description="הכלים שבהם הצוותים מתכתבים, מעדכנים ומפרסמים הודעות פנים־ארגוניות."
      />

      <LauncherGrid
        tiles={[
          {
            label: "דואר אלקטרוני",
            description: "תיבת הדואר הארגונית.",
            icon: Mail,
            to: "/productivity/communication",
          },
          {
            label: "צ'אט צוותים",
            description: "שיחות צוות לפי סניף ומחלקה.",
            icon: MessagesSquare,
            to: "/productivity/communication",
          },
          {
            label: "הודעות הנהלה",
            description: "הודעות רשמיות לכלל העובדים.",
            icon: Megaphone,
            to: "/productivity/communication",
          },
          {
            label: "התראות מערכת",
            description: "עדכונים אוטומטיים ממערכות התפעול.",
            icon: Bell,
            to: "/productivity/communication",
          },
        ]}
      />
    </div>
  );
}
