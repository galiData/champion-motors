import { useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomerForm } from "@/components/features/directory/CustomerForm";
import { DirectoryListLayout } from "@/components/features/directory/DirectoryListLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useCustomerMutations } from "@/hooks/useCustomerMutations";
import { useCustomers } from "@/hooks/useCustomers";
import { useLocationNames } from "@/hooks/useLocationNames";
import { useLocations } from "@/hooks/useLocations";
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
  const { data: locations } = useLocations();
  const { create, isSaving, error } = useCustomerMutations();
  const [isAdding, setIsAdding] = useState(false);

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
      headerActions={
        isAdding ? null : (
          <Button onClick={() => setIsAdding(true)}>
            <Plus aria-hidden="true" />
            לקוח חדש
          </Button>
        )
      }
      banner={
        isAdding ? (
          <section
            aria-label="הוספת לקוח חדש"
            className="rounded-lg border border-cm-mist bg-white p-8"
          >
            <h2 className="mb-6 text-xl font-semibold text-cm-deep-blue">הוספת לקוח חדש</h2>
            <CustomerForm
              locations={locations ?? []}
              isSaving={isSaving}
              submitLabel="הוספת לקוח"
              saveError={error?.message}
              onCancel={() => setIsAdding(false)}
              onSubmit={async (input) => {
                await create(input);
                setIsAdding(false);
                state.refetch();
              }}
            />
          </section>
        ) : null
      }
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
