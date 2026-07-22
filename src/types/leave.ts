export type LeaveType = "vacation" | "sick" | "personal" | "unpaid";

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  vacation: "חופשה שנתית",
  sick: "מחלה",
  personal: "אישי",
  unpaid: "ללא תשלום",
};

export type LeaveStatus = "pending" | "approved" | "rejected";

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  pending: "ממתין לאישור",
  approved: "אושר",
  rejected: "נדחה",
};

export interface LeaveRequest {
  id: string;
  staffId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  submittedAt: string;
  note?: string;
}
