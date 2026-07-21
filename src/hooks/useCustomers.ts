import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { Customer } from "@/types/customer";

export function useCustomers(): AsyncState<Customer[]> {
  return useAsyncData(() => api.customers.list(), []);
}
