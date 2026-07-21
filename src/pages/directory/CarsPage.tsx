import { Link } from "react-router-dom";
import { DirectoryListLayout } from "@/components/features/directory/DirectoryListLayout";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useCars } from "@/hooks/useCars";
import { useLocationNames } from "@/hooks/useLocationNames";
import { CAR_STATUS_LABELS, type Car, type CarStatus } from "@/types/car";
import { MARQUE_LABELS } from "@/types/marque";
import { formatCurrency } from "@/utils/formatCurrency";

const COLUMNS = ["דגם", "שנה", "מספר רישוי", "סטטוס", "סניף", "מחיר מחירון"];

const STATUS_TONE: Record<CarStatus, "positive" | "info" | "neutral" | "muted"> = {
  "in-stock": "positive",
  reserved: "info",
  delivered: "neutral",
  "in-service": "muted",
};

function matches(car: Car, query: string): boolean {
  const haystack = `${MARQUE_LABELS[car.marque]} ${car.model} ${car.trim} ${car.licensePlate} ${car.vin}`;
  return haystack.toLowerCase().includes(query.toLowerCase());
}

export function CarsPage() {
  const state = useCars();
  const locationNames = useLocationNames();

  return (
    <DirectoryListLayout
      title="רכבים"
      description="מלאי הרכבים בסניפים, לפי דגם, סטטוס ומיקום."
      state={state}
      columns={COLUMNS}
      matches={matches}
      searchPlaceholder="חיפוש לפי דגם, מספר רישוי או מספר שלדה"
      emptyTitle="אין רכבים להצגה"
      emptyDescription="ברגע שיתווספו רכבים למלאי הם יופיעו כאן."
      renderRow={(car) => (
        <TableRow key={car.id}>
          <TableCell>
            <Link to={`/cars/${car.id}`} className="font-semibold text-cm-blue hover:underline">
              <span dir="ltr">
                {MARQUE_LABELS[car.marque]} {car.model}
              </span>
            </Link>
            <span className="block text-sm text-cm-gray" dir="ltr">
              {car.trim}
            </span>
          </TableCell>
          <TableCell>
            <span className="ltr-nums text-cm-graphite">{car.year}</span>
          </TableCell>
          <TableCell>
            <span className="ltr-nums text-cm-graphite">{car.licensePlate}</span>
          </TableCell>
          <TableCell>
            <Badge tone={STATUS_TONE[car.status]}>{CAR_STATUS_LABELS[car.status]}</Badge>
          </TableCell>
          <TableCell className="text-cm-graphite">
            {locationNames.get(car.locationId) ?? "—"}
          </TableCell>
          <TableCell>
            <span className="ltr-nums font-semibold text-cm-ink">
              {formatCurrency(car.listPriceIls)}
            </span>
          </TableCell>
        </TableRow>
      )}
    />
  );
}
