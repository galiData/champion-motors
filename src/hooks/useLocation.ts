import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { Location } from "@/types/location";

export function useLocation(id: string | undefined): AsyncState<Location | null> {
  return useAsyncData(() => (id ? api.locations.get(id) : Promise.resolve(null)), [id]);
}
