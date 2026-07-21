const EM_DASH = "—";

/** A percentage figure, e.g. 14.9% — one decimal at most. */
export function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return EM_DASH;
  const rounded = Math.round(value * 10) / 10;
  return `${rounded.toLocaleString("he-IL")}%`;
}
