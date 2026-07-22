import type { RangeMonths } from "@/components/features/analytics/RangeFilter";
import { useCallback } from "react";
import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { SalesByLocationAnalytics } from "@/types/analytics";

export function useSalesByLocationAnalytics(
  months: RangeMonths,
): AsyncState<SalesByLocationAnalytics> {
  return useAsyncData(useCallback(() => api.analytics.salesByLocation(months), [months]));
}
