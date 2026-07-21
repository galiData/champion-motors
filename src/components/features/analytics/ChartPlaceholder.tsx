import { BarChart3 } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ChartPlaceholderProps {
  title: string;
  /** What this chart will show once it is wired to real data. */
  description: string;
  className?: string;
}

/**
 * Reserves the space and states the intent of a chart that is not built yet.
 * No chart library is chosen until the real metrics are known — see the spec.
 */
export function ChartPlaceholder({ title, description, className }: ChartPlaceholderProps) {
  return (
    <section className={cn("rounded-lg border border-cm-mist bg-white p-6", className)}>
      <h2 className="text-xl font-semibold text-cm-deep-blue">{title}</h2>
      <p className="mt-1 text-sm text-cm-slate">{description}</p>
      <div className="mt-6 flex h-64 flex-col items-center justify-center gap-2 rounded border border-dashed border-cm-mist bg-cm-paper">
        <BarChart3 className="size-8 text-cm-mist" aria-hidden="true" />
        <p className="text-sm text-cm-gray">התרשים יתווסף כאן</p>
      </div>
    </section>
  );
}
