import { useParams } from "react-router-dom";
import { DetailLayout } from "@/components/features/directory/DetailLayout";
import { Badge } from "@/components/ui/badge";
import { useCustomer } from "@/hooks/useCustomer";
import { useLocationNames } from "@/hooks/useLocationNames";
import { CUSTOMER_STATUS_LABELS } from "@/types/customer";
import { formatNumber } from "@/utils/formatCurrency";
import { formatLongDate } from "@/utils/formatDate";

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const state = useCustomer(id);
  const locationNames = useLocationNames();

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
