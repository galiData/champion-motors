import { Link } from "react-router-dom";
import { DirectoryListLayout } from "@/components/features/directory/DirectoryListLayout";
import { TableCell, TableRow } from "@/components/ui/table";
import { useLocations } from "@/hooks/useLocations";
import { LOCATION_KIND_LABELS, type Location } from "@/types/location";
import { MARQUE_LABELS } from "@/types/marque";
import { formatNumber } from "@/utils/formatCurrency";

const COLUMNS = ["שם הסניף", "סוג", "עיר", "טלפון", "מותגים", "עובדים"];

function matches(location: Location, query: string): boolean {
  return (
    location.name.includes(query) ||
    location.city.includes(query) ||
    location.address.includes(query)
  );
}

export function LocationsPage() {
  const state = useLocations();

  return (
    <DirectoryListLayout
      title="סניפים"
      description="אולמות התצוגה ומרכזי השירות של צ'מפיון מוטורס ברחבי הארץ."
      state={state}
      columns={COLUMNS}
      matches={matches}
      searchPlaceholder="חיפוש לפי שם סניף, עיר או כתובת"
      emptyTitle="אין סניפים להצגה"
      emptyDescription="ברגע שיתווספו סניפים למערכת הם יופיעו כאן."
      renderRow={(location) => (
        <TableRow key={location.id}>
          <TableCell>
            <Link
              to={`/locations/${location.id}`}
              className="font-semibold text-cm-blue hover:underline"
            >
              {location.name}
            </Link>
          </TableCell>
          <TableCell className="text-cm-graphite">
            {LOCATION_KIND_LABELS[location.kind]}
          </TableCell>
          <TableCell className="text-cm-graphite">{location.city}</TableCell>
          <TableCell>
            <span className="ltr-nums text-cm-graphite">{location.phone}</span>
          </TableCell>
          <TableCell className="text-cm-graphite">
            <span dir="ltr">
              {location.marques.map((marque) => MARQUE_LABELS[marque]).join(" · ")}
            </span>
          </TableCell>
          <TableCell>
            <span className="ltr-nums text-cm-graphite">{formatNumber(location.staffCount)}</span>
          </TableCell>
        </TableRow>
      )}
    />
  );
}
