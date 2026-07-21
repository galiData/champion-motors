import type { RangeMonths } from "@/components/features/analytics/RangeFilter";
import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { LaborAnalytics } from "@/types/analytics";

export function useLaborAnalytics(months: RangeMonths): AsyncState<LaborAnalytics> {
  return useAsyncData(() => api.analytics.labor(months), [months]);
}
