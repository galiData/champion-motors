import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { Location } from "@/types/location";

export function useLocations(): AsyncState<Location[]> {
  return useAsyncData(() => api.locations.list(), []);
}
