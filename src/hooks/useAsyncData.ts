import { useCallback, useEffect, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface Settled<T> {
  /** The loader whose result this is — identity, not value. */
  load: unknown;
  attempt: number;
  data: T | null;
  error: Error | null;
}

/**
 * Run an async loader and expose loading/error/data state.
 *
 * `load` must be referentially stable — wrap it in `useCallback` with whatever
 * it closes over. Its identity *is* the cache key: when it changes, a new
 * request starts. That is what lets the effect declare honest dependencies
 * instead of suppressing the exhaustive-deps rule.
 *
 * `isLoading` is derived rather than stored. Setting it synchronously inside the
 * effect would cascade an extra render on every load, which is what
 * `react-hooks/set-state-in-effect` flags.
 *
 * Previous data survives while a new request is in flight, so callers can hold
 * the last render at reduced opacity instead of flashing a skeleton.
 */
export function useAsyncData<T>(load: () => Promise<T>): AsyncState<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T>>({
    load: null,
    attempt: -1,
    data: null,
    error: null,
  });

  const isLoading = settled.load !== load || settled.attempt !== attempt;

  const refetch = useCallback(() => setAttempt((count) => count + 1), []);

  useEffect(() => {
    let active = true;

    load()
      .then((data) => {
        if (active) setSettled({ load, attempt, data, error: null });
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setSettled({
          load,
          attempt,
          data: null,
          error: cause instanceof Error ? cause : new Error(String(cause)),
        });
      });

    return () => {
      active = false;
    };
  }, [load, attempt]);

  return {
    data: settled.data,
    isLoading,
    // A stale error must not outlive the retry that is already in flight.
    error: isLoading ? null : settled.error,
    refetch,
  };
}
