import { cn } from "@/utils/cn";

export const RANGE_OPTIONS = [3, 6, 12] as const;
export type RangeMonths = (typeof RANGE_OPTIONS)[number];

export const RANGE_LABELS: Record<RangeMonths, string> = {
  3: "3 חודשים",
  6: "6 חודשים",
  12: "12 חודשים",
};

/** Names the period a stat-tile delta is measured against. */
export const RANGE_COMPARISON_LABELS: Record<RangeMonths, string> = {
  3: "לעומת 3 החודשים הקודמים",
  6: "לעומת 6 החודשים הקודמים",
  12: "לעומת 12 החודשים הקודמים",
};

export interface RangeFilterProps {
  value: RangeMonths;
  onChange: (value: RangeMonths) => void;
}

/**
 * One filter row, above everything it scopes. Every stat and chart on the page
 * re-renders against the same slice, so the numbers always agree.
 *
 * Presets as rows rather than a calendar — nobody fights a date grid for
 * "last 6 months".
 */
export function RangeFilter({ value, onChange }: RangeFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-cm-graphite">טווח זמן</span>
      <div
        role="group"
        aria-label="טווח זמן"
        className="inline-flex overflow-hidden rounded-md border border-cm-mist"
      >
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={cn(
              "px-4 py-2 text-sm font-semibold transition-colors",
              "border-cm-mist not-first:border-s",
              value === option
                ? "bg-cm-blue text-white"
                : "bg-white text-cm-graphite hover:bg-cm-surface",
            )}
          >
            {RANGE_LABELS[option]}
          </button>
        ))}
      </div>

      <span className="rounded bg-cm-surface px-2.5 py-1 text-sm font-semibold text-cm-graphite">
        נתוני הדגמה
      </span>
    </div>
  );
}
