export type Department = "sales" | "service" | "marketing" | "finance" | "management";

export const DEPARTMENT_LABELS: Record<Department, string> = {
  sales: "מכירות",
  service: "שירות",
  marketing: "שיווק",
  finance: "כספים",
  management: "הנהלה",
};

export interface StaffMember {
  id: string;
  name: string;
  /** Job title, in Hebrew. */
  role: string;
  department: Department;
  email: string;
  phone: string;
  locationId: string;
  startedAt: string;
}
