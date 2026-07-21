import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/utils/cn";

export interface StatDelta {
  /** Signed, already formatted — e.g. "+8.4%". */
  label: string;
  direction: "up" | "down";
}

export interface StatTileProps {
  label: string;
  value: string;
  /** Short qualifier, e.g. the comparison period. Never manufactured urgency. */
  note?: string;
  delta?: StatDelta;
  /** Numeric values render LTR inside the Hebrew layout. */
  numeric?: boolean;
  className?: string;
}

/**
 * A headline number. The value uses proportional figures — `tabular-nums` would
 * give every digit the width of a zero and read loose at this size.
 *
 * The delta is not colour-coded: Signal Red is rationed to one role per layout,
 * and a red arrow in every tile would spend it. Direction is carried by the
 * arrow and the sign, which also keeps it out of colour-alone territory.
 */
export function StatTile({ label, value, note, delta, numeric = true, className }: StatTileProps) {
  const DeltaIcon = delta?.direction === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <div className={cn("rounded-lg border border-cm-mist bg-white p-6", className)}>
      <p className="text-sm font-semibold text-cm-gray">{label}</p>
      <p className="mt-2 text-4xl font-bold leading-none text-cm-ink">
        <span className={numeric ? "ltr-nums" : undefined}>{value}</span>
      </p>
      {delta ? (
        <p className="mt-3 flex items-center gap-1 text-sm text-cm-graphite">
          <DeltaIcon className="size-4 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
          <span className="ltr-nums font-semibold">{delta.label}</span>
        </p>
      ) : null}
      {note ? <p className="mt-2 text-sm text-cm-slate">{note}</p> : null}
    </div>
  );
}
