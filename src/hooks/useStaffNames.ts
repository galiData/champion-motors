import { useMemo } from "react";
import { useStaff } from "@/hooks/useStaff";

/** Maps staff id → display name, for tables that reference an employee. */
export function useStaffNames(): Map<string, string> {
  const { data } = useStaff();
  return useMemo(() => new Map((data ?? []).map((member) => [member.id, member.name])), [data]);
}
