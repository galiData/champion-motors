import type { RangeMonths } from "@/components/features/analytics/RangeFilter";
import { useCallback } from "react";
import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { AccountingAnalytics } from "@/types/analytics";

export function useAccountingAnalytics(months: RangeMonths): AsyncState<AccountingAnalytics> {
  return useAsyncData(useCallback(() => api.analytics.accounting(months), [months]));
}
