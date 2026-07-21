import type { RangeMonths } from "@/components/features/analytics/RangeFilter";
import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { MarketingAnalytics } from "@/types/analytics";

export function useMarketingAnalytics(months: RangeMonths): AsyncState<MarketingAnalytics> {
  return useAsyncData(() => api.analytics.marketing(months), [months]);
}
