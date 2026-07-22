import { useCallback, useState } from "react";
import { api } from "@/lib/api/client";
import type { Customer, CustomerInput } from "@/types/customer";

export interface CustomerMutations {
  create: (input: CustomerInput) => Promise<Customer>;
  update: (id: string, patch: CustomerInput) => Promise<Customer>;
  isSaving: boolean;
  error: Error | null;
}

/**
 * Write access to a customer record. Tracks a single in-flight save so a form
 * can disable its submit button and surface a failure, without owning the data
 * itself — the caller refetches its list or detail state on success.
 */
export function useCustomerMutations(): CustomerMutations {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(<T,>(operation: Promise<T>): Promise<T> => {
    setIsSaving(true);
    setError(null);
    return operation
      .catch((cause: unknown) => {
        const wrapped = cause instanceof Error ? cause : new Error(String(cause));
        setError(wrapped);
        throw wrapped;
      })
      .finally(() => setIsSaving(false));
  }, []);

  const create = useCallback(
    (input: CustomerInput) => run(api.customers.create(input)),
    [run],
  );

  const update = useCallback(
    (id: string, patch: CustomerInput) => run(api.customers.update(id, patch)),
    [run],
  );

  return { create, update, isSaving, error };
}
