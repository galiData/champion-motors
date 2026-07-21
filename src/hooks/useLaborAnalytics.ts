import type { RangeMonths } from "@/components/features/analytics/RangeFilter";
import { useCallback } from "react";
import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { LaborAnalytics } from "@/types/analytics";

export function useLaborAnalytics(months: RangeMonths): AsyncState<LaborAnalytics> {
  return useAsyncData(useCallback(() => api.analytics.labor(months), [months]));
}
