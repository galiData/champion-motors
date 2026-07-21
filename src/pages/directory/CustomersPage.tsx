import { Link } from "react-router-dom";
import { DirectoryListLayout } from "@/components/features/directory/DirectoryListLayout";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useCustomers } from "@/hooks/useCustomers";
import { useLocationNames } from "@/hooks/useLocationNames";
import { CUSTOMER_STATUS_LABELS, type Customer, type CustomerStatus } from "@/types/customer";
import { formatNumber } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

const COLUMNS = ["שם הלקוח", "טלפון", "עיר", "סטטוס", "כלי רכב", "סניף בית", "קשר אחרון"];

const STATUS_TONE: Record<CustomerStatus, "positive" | "info" | "muted"> = {
  active: "positive",
  lead: "info",
  dormant: "muted",
};

function matches(customer: Customer, query: string): boolean {
  return (
    customer.name.includes(query) ||
    customer.city.includes(query) ||
    customer.phone.includes(query) ||
    customer.email.toLowerCase().includes(query.toLowerCase())
  );
}

export function CustomersPage() {
  const state = useCustomers();
  const locationNames = useLocationNames();

  return (
    <DirectoryListLayout
      title="לקוחות"
      description="לקוחות פרטיים וצי, לפי סניף הבית ומצב הקשר הנוכחי."
      state={state}
      columns={COLUMNS}
      matches={matches}
      searchPlaceholder="חיפוש לפי שם, עיר, טלפון או דוא״ל"
      emptyTitle="אין לקוחות להצגה"
      emptyDescription="ברגע שיתווספו לקוחות למערכת הם יופיעו כאן."
      renderRow={(customer) => (
        <TableRow key={customer.id}>
          <TableCell>
            <Link
              to={`/customers/${customer.id}`}
              className="font-semibold text-cm-blue hover:underline"
            >
              {customer.name}
            </Link>
          </TableCell>
          <TableCell>
            <span className="ltr-nums text-cm-graphite">{customer.phone}</span>
          </TableCell>
          <TableCell className="text-cm-graphite">{customer.city}</TableCell>
          <TableCell>
            <Badge tone={STATUS_TONE[customer.status]}>
              {CUSTOMER_STATUS_LABELS[customer.status]}
            </Badge>
          </TableCell>
          <TableCell>
            <span className="ltr-nums text-cm-graphite">
              {formatNumber(customer.vehicleCount)}
            </span>
          </TableCell>
          <TableCell className="text-cm-graphite">
            {locationNames.get(customer.homeLocationId) ?? "—"}
          </TableCell>
          <TableCell className="text-cm-graphite">{formatDate(customer.lastContactAt)}</TableCell>
        </TableRow>
      )}
    />
  );
}
