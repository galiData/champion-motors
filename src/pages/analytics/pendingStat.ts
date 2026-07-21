import type { StatTileProps } from "@/components/features/analytics/StatTile";

/**
 * A KPI tile with no data behind it yet.
 *
 * The skeleton deliberately shows an em dash rather than an invented figure —
 * a placeholder number in a report reads as a real metric, and the brand rules
 * require every claim to be substantiated.
 */
export function PENDING_STAT(label: string): StatTileProps {
  return { label, value: "—", note: "ממתין לחיבור מקור הנתונים" };
}
