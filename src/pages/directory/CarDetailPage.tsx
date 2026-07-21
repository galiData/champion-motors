import { useParams } from "react-router-dom";
import { DetailLayout } from "@/components/features/directory/DetailLayout";
import { Badge } from "@/components/ui/badge";
import { useCar } from "@/hooks/useCar";
import { useLocationNames } from "@/hooks/useLocationNames";
import { CAR_STATUS_LABELS } from "@/types/car";
import { MARQUE_LABELS } from "@/types/marque";
import { formatCurrency, formatNumber } from "@/utils/formatCurrency";

export function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const state = useCar(id);
  const locationNames = useLocationNames();

  return (
    <DetailLayout
      state={state}
      backTo="/cars"
      backLabel="חזרה לרשימת הרכבים"
      title={(car) => `${MARQUE_LABELS[car.marque]} ${car.model}`}
      subtitle={(car) => (
        <span className="flex flex-wrap items-center gap-3">
          <span dir="ltr">{car.trim}</span>
          <Badge tone="info">{CAR_STATUS_LABELS[car.status]}</Badge>
        </span>
      )}
      notFoundTitle="הרכב לא נמצא"
      notFoundDescription="ייתכן שהרכב הוסר מהמלאי או שהקישור שגוי."
      fields={(car) => [
        { label: "יצרן", value: <span dir="ltr">{MARQUE_LABELS[car.marque]}</span> },
        { label: "דגם", value: <span dir="ltr">{car.model}</span> },
        { label: "רמת גימור", value: <span dir="ltr">{car.trim}</span> },
        { label: "שנת ייצור", value: <span className="ltr-nums">{car.year}</span> },
        { label: "מספר רישוי", value: <span className="ltr-nums">{car.licensePlate}</span> },
        { label: "מספר שלדה", value: <span className="ltr-nums">{car.vin}</span> },
        { label: "סטטוס", value: CAR_STATUS_LABELS[car.status] },
        { label: "סניף", value: locationNames.get(car.locationId) ?? "—" },
        {
          label: "קילומטראז'",
          value: <span className="ltr-nums">{formatNumber(car.mileageKm)} ק״מ</span>,
        },
        {
          label: "מחיר מחירון",
          value: <span className="ltr-nums font-semibold">{formatCurrency(car.listPriceIls)}</span>,
        },
      ]}
    />
  );
}
