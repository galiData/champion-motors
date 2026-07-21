import { cn } from "@/utils/cn";

export interface StatTileProps {
  label: string;
  value: string;
  /** Short qualifier, e.g. a comparison period. Never a manufactured urgency claim. */
  note?: string;
  /** Numeric values render LTR inside the Hebrew layout. */
  numeric?: boolean;
  className?: string;
}

export function StatTile({ label, value, note, numeric = true, className }: StatTileProps) {
  return (
    <div className={cn("rounded-lg border border-cm-mist bg-white p-6", className)}>
      <p className="text-sm font-semibold text-cm-gray">{label}</p>
      <p className="mt-2 text-4xl font-bold leading-none text-cm-ink">
        <span className={numeric ? "ltr-nums" : undefined}>{value}</span>
      </p>
      {note ? <p className="mt-2 text-sm text-cm-slate">{note}</p> : null}
    </div>
  );
}
