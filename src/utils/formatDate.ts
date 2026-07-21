const EM_DASH = "—";

function toDate(value: string | Date | null | undefined): Date | null {
  if (value == null) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Short numeric date, e.g. 21.7.2026 */
export function formatDate(value: string | Date | null | undefined): string {
  const date = toDate(value);
  if (!date) return EM_DASH;
  return date.toLocaleDateString("he-IL", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

/** Long date with month name, e.g. 21 ביולי 2026 */
export function formatLongDate(value: string | Date | null | undefined): string {
  const date = toDate(value);
  if (!date) return EM_DASH;
  return date.toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Time of day, e.g. 14:30 */
export function formatTime(value: string | Date | null | undefined): string {
  const date = toDate(value);
  if (!date) return EM_DASH;
  return date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

/** Date and time together, for event listings. */
export function formatDateTime(value: string | Date | null | undefined): string {
  const date = toDate(value);
  if (!date) return EM_DASH;
  return `${formatDate(date)} · ${formatTime(date)}`;
}
