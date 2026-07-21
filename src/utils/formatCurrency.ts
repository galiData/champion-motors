const EM_DASH = "—";

/**
 * Format a shekel amount for display. Leasing and pricing figures are always
 * shown in whole shekels — agorot in a quote read as false precision.
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return EM_DASH;
  return `${Math.round(value).toLocaleString("he-IL")} ₪`;
}

/** A monthly payment figure. Same formatting as {@link formatCurrency}. */
export function formatMonthlyPayment(value: number | null | undefined): string {
  return formatCurrency(value);
}

/** A plain integer with Hebrew thousands separators, for counts and mileage. */
export function formatNumber(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return EM_DASH;
  return Math.round(value).toLocaleString("he-IL");
}
