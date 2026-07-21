import { useCallback } from "react";
import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { Customer } from "@/types/customer";

export function useCustomer(id: string | undefined): AsyncState<Customer | null> {
  return useAsyncData(useCallback(() => (id ? api.customers.get(id) : Promise.resolve(null)), [id]));
}
