import { useState } from "react";
import { Pencil } from "lucide-react";
import { useParams } from "react-router-dom";
import { CustomerForm } from "@/components/features/directory/CustomerForm";
import { DetailLayout } from "@/components/features/directory/DetailLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/hooks/useCustomer";
import { useCustomerMutations } from "@/hooks/useCustomerMutations";
import { useLocationNames } from "@/hooks/useLocationNames";
import { useLocations } from "@/hooks/useLocations";
import { CUSTOMER_STATUS_LABELS } from "@/types/customer";
import { formatNumber } from "@/utils/formatCurrency";
import { formatLongDate } from "@/utils/formatDate";

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const state = useCustomer(id);
  const locationNames = useLocationNames();
  const { data: locations } = useLocations();
  const { update, isSaving, error } = useCustomerMutations();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <DetailLayout
      state={state}
      backTo="/customers"
      backLabel="חזרה לרשימת הלקוחות"
      title={(customer) => customer.name}
      subtitle={(customer) => (
        <Badge tone="info">{CUSTOMER_STATUS_LABELS[customer.status]}</Badge>
      )}
      notFoundTitle="הלקוח לא נמצא"
      notFoundDescription="ייתכן שהרשומה הוסרה מהמערכת או שהקישור שגוי."
      headerActions={() =>
        isEditing ? null : (
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil aria-hidden="true" />
            עריכת פרטים
          </Button>
        )
      }
      body={
        isEditing
          ? (customer) => (
              <CustomerForm
                initialValue={customer}
                locations={locations ?? []}
                isSaving={isSaving}
                submitLabel="שמירת שינויים"
                saveError={error?.message}
                onCancel={() => setIsEditing(false)}
                onSubmit={async (input) => {
                  await update(customer.id, input);
                  setIsEditing(false);
                  state.refetch();
                }}
              />
            )
          : undefined
      }
      fields={(customer) => [
        { label: "טלפון", value: <span className="ltr-nums">{customer.phone}</span> },
        { label: "דוא״ל", value: <span dir="ltr">{customer.email}</span> },
        { label: "עיר", value: customer.city },
        { label: "סטטוס", value: CUSTOMER_STATUS_LABELS[customer.status] },
        {
          label: "כלי רכב",
          value: <span className="ltr-nums">{formatNumber(customer.vehicleCount)}</span>,
        },
        { label: "סניף בית", value: locationNames.get(customer.homeLocationId) ?? "—" },
        { label: "לקוח מאז", value: formatLongDate(customer.customerSince) },
        { label: "קשר אחרון", value: formatLongDate(customer.lastContactAt) },
      ]}
    />
  );
}
