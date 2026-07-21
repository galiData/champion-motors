import type { RangeMonths } from "@/components/features/analytics/RangeFilter";
import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { SalesAnalytics } from "@/types/analytics";

export function useSalesAnalytics(months: RangeMonths): AsyncState<SalesAnalytics> {
  return useAsyncData(() => api.analytics.sales(months), [months]);
}
