import { useCallback } from "react";
import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { Car } from "@/types/car";

export function useCar(id: string | undefined): AsyncState<Car | null> {
  return useAsyncData(useCallback(() => (id ? api.cars.get(id) : Promise.resolve(null)), [id]));
}
