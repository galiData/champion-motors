import type { TooltipContentProps } from "recharts";

export interface ChartTooltipProps extends Partial<TooltipContentProps<number, string>> {
  /** Formats each value for display (currency, percent, plain count). */
  format?: (value: number) => string;
}

/**
 * One tooltip listing every series at the hovered position — the pointer never
 * has to land on a specific line to get a value.
 *
 * Values lead and labels follow: the number is the strong element, the series
 * name is secondary. Series are keyed with a short stroke rather than a filled
 * box, which would be data-weight ink doing a label's job.
 */
export function ChartTooltip({ active, payload, label, format }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const formatValue = format ?? ((value: number) => value.toLocaleString("he-IL"));

  return (
    <div className="rounded-lg border border-cm-mist bg-white px-4 py-3 shadow-sm">
      {label ? <p className="mb-2 text-sm text-cm-slate">{String(label)}</p> : null}
      <ul className="flex flex-col gap-1.5">
        {payload.map((entry) => (
          <li key={String(entry.dataKey)} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-0.5 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="ltr-nums text-base font-semibold text-cm-ink">
              {formatValue(Number(entry.value))}
            </span>
            <span className="text-sm text-cm-slate">{entry.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
