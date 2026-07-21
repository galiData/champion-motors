export interface LegendItem {
  label: string;
  color: string;
  /** Legends mirror the mark: a rect for bars and areas, a line for lines. */
  shape: "rect" | "line";
}

/**
 * Always present for two or more series — identity is never color-alone.
 * A single-series chart gets no legend; its title already names what is plotted.
 *
 * Label text wears a text token, never the series color.
 */
export function ChartLegend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-sm text-cm-graphite">
          {item.shape === "rect" ? (
            <span
              aria-hidden="true"
              className="size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
          ) : (
            <span
              aria-hidden="true"
              className="h-0.5 w-4 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          )}
          {item.label}
        </li>
      ))}
    </ul>
  );
}
