import { useCallback } from "react";
import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { LeaveRequest } from "@/types/leave";

export function useLeaveRequests(): AsyncState<LeaveRequest[]> {
  return useAsyncData(useCallback(() => api.leaveRequests.list(), []));
}
