import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { Customer } from "@/types/customer";

export function useCustomer(id: string | undefined): AsyncState<Customer | null> {
  return useAsyncData(() => (id ? api.customers.get(id) : Promise.resolve(null)), [id]);
}
