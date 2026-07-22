export type CustomerStatus = "active" | "lead" | "dormant";

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  active: "פעיל",
  lead: "ליד",
  dormant: "לא פעיל",
};

/** Ordered for status dropdowns — matches the label map above. */
export const CUSTOMER_STATUSES: CustomerStatus[] = ["active", "lead", "dormant"];

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  status: CustomerStatus;
  vehicleCount: number;
  homeLocationId: string;
  customerSince: string;
  lastContactAt: string | null;
}

/** The editable shape of a customer — everything except the server-owned id. */
export type CustomerInput = Omit<Customer, "id">;
