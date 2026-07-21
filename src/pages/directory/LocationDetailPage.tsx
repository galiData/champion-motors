import { useParams } from "react-router-dom";
import { DetailLayout } from "@/components/features/directory/DetailLayout";
import { useLocation } from "@/hooks/useLocation";
import { LOCATION_KIND_LABELS } from "@/types/location";
import { MARQUE_LABELS } from "@/types/marque";
import { formatNumber } from "@/utils/formatCurrency";
import { formatLongDate } from "@/utils/formatDate";

export function LocationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const state = useLocation(id);

  return (
    <DetailLayout
      state={state}
      backTo="/locations"
      backLabel="חזרה לרשימת הסניפים"
      title={(location) => location.name}
      subtitle={(location) => `${LOCATION_KIND_LABELS[location.kind]} · ${location.city}`}
      notFoundTitle="הסניף לא נמצא"
      notFoundDescription="ייתכן שהסניף הוסר מהמערכת או שהקישור שגוי."
      fields={(location) => [
        { label: "כתובת", value: location.address },
        { label: "עיר", value: location.city },
        { label: "טלפון", value: <span className="ltr-nums">{location.phone}</span> },
        { label: "סוג סניף", value: LOCATION_KIND_LABELS[location.kind] },
        {
          label: "מותגים",
          value: (
            <span dir="ltr">
              {location.marques.map((marque) => MARQUE_LABELS[marque]).join(" · ")}
            </span>
          ),
        },
        {
          label: "מספר עובדים",
          value: <span className="ltr-nums">{formatNumber(location.staffCount)}</span>,
        },
        { label: "תאריך פתיחה", value: formatLongDate(location.openedAt) },
      ]}
    />
  );
}
