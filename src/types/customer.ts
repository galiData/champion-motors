export type CustomerStatus = "active" | "lead" | "dormant";

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  active: "פעיל",
  lead: "ליד",
  dormant: "לא פעיל",
};

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
