import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { StaffMember } from "@/types/staff";

export function useStaff(): AsyncState<StaffMember[]> {
  return useAsyncData(() => api.staff.list(), []);
}
