import { useMemo } from "react";
import { useLocations } from "@/hooks/useLocations";

/** Maps location id → display name, for tables that reference a branch. */
export function useLocationNames(): Map<string, string> {
  const { data } = useLocations();
  return useMemo(
    () => new Map((data ?? []).map((location) => [location.id, location.name])),
    [data],
  );
}
