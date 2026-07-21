import { useCallback } from "react";
import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { NewsItem } from "@/types/news";

export function useNews(): AsyncState<NewsItem[]> {
  return useAsyncData(useCallback(() => api.news.list(), []));
}
