import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { Car } from "@/types/car";

export function useCars(): AsyncState<Car[]> {
  return useAsyncData(() => api.cars.list(), []);
}
