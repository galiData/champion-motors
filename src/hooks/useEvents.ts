import { api } from "@/lib/api/client";
import { useAsyncData, type AsyncState } from "@/hooks/useAsyncData";
import type { CalendarEvent } from "@/types/event";

export function useEvents(): AsyncState<CalendarEvent[]> {
  return useAsyncData(() => api.events.list(), []);
}
