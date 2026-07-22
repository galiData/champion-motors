const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Inclusive day count between two ISO dates, e.g. Mon–Wed is 3 days. */
export function leaveDurationDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
  return Math.max(days, 0);
}
