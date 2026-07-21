import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { StaffMember } from "@/types/staff";

export function useStaffMember(id: string | undefined): AsyncState<StaffMember | null> {
  return useAsyncData(() => (id ? api.staff.get(id) : Promise.resolve(null)), [id]);
}
