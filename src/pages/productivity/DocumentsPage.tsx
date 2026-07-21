import { BookText, FileSignature, FileText, Presentation } from "lucide-react";
import { LauncherGrid } from "@/components/features/productivity/LauncherGrid";
import { PageHeader } from "@/components/layout/PageHeader";

export function DocumentsPage() {
  return (
    <div>
      <PageHeader
        title="מסמכים"
        description="נהלים, טפסים וחומרי מיתוג — מרוכזים במקום אחד."
      />

      <LauncherGrid
        tiles={[
          {
            label: "נהלים",
            description: "נהלי עבודה, בטיחות ושירות.",
            icon: BookText,
            to: "/productivity/documents",
          },
          {
            label: "טפסים",
            description: "טפסים לשימוש הצוותים בסניפים.",
            icon: FileText,
            to: "/productivity/documents",
          },
          {
            label: "חוזים והסכמים",
            description: "תבניות חוזי מכירה, ליסינג ושירות.",
            icon: FileSignature,
            to: "/productivity/documents",
          },
          {
            label: "חומרי מיתוג",
            description: "מצגות, לוגואים והנחיות מותג.",
            icon: Presentation,
            to: "/productivity/documents",
          },
        ]}
      />
    </div>
  );
}
