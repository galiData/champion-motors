import { CartesianGrid, XAxis, YAxis } from "recharts";
import { AXIS_TEXT, GRID_LINE, MARK } from "@/lib/charts/palette";

/**
 * Shared axis and grid chrome, so every chart reads as one system.
 *
 * RTL: the category axis is reversed and the value axis sits on the right, so
 * the plot reads right-to-left like the rest of the interface. Tick text uses a
 * text token — never a series color.
 */
export const AXIS_TICK = { fill: AXIS_TEXT, fontSize: 13 } as const;

/** Shared style for direct labels riding the marks. Text wears a text token. */
export const LABEL_STYLE = { fill: AXIS_TEXT, fontSize: 13, direction: "ltr" } as const;

/**
 * Adapts a numeric formatter to the shape `LabelList` expects — it hands the
 * formatter a renderable value, which may be a string or undefined.
 */
export function labelFormatter(format?: (value: number) => string) {
  return (value: unknown): string => {
    if (value == null) return "";
    return format ? format(Number(value)) : String(value);
  };
}

interface BarLabelProps {
  /** Recharts reports geometry as either a number or a numeric string. */
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  /** Recharts widens this to any renderable value, including `false`. */
  value?: unknown;
}

function toNumber(value: unknown): number | null {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Places a value label just past the growing end of a horizontal bar.
 *
 * `LabelList position="left"` cannot be used here: with a reversed value axis it
 * resolves against the baseline edge, so every label lands on the same x and the
 * whole column stacks on top of the category names. This computes the position
 * from the bar's own geometry instead — bars grow leftward, so the data end is
 * the rect's left edge.
 */
export function barEndLabel(format?: (value: number) => string) {
  return function BarEndLabel({ x, y, width, height, value }: BarLabelProps) {
    const left = toNumber(x);
    const top = toNumber(y);
    const barHeight = toNumber(height);
    if (left == null || top == null || barHeight == null) return null;

    /*
     * On a reversed value axis Recharts reports `x` at the baseline edge and a
     * negative `width`, so the growing end is whichever side is smaller. Taking
     * the minimum works for both directions.
     */
    const dataEnd = Math.min(left, left + (toNumber(width) ?? 0));
    const numeric = toNumber(value);
    const text = format && numeric != null ? format(numeric) : String(value ?? "");

    return (
      <text
        x={dataEnd - 8}
        y={top + barHeight / 2}
        textAnchor="end"
        dominantBaseline="central"
        fill={AXIS_TEXT}
        fontSize={13}
        direction="ltr"
      >
        {text}
      </text>
    );
  };
}

/** Hairline, solid, one step off the surface. Never dashed. */
export function Grid({ horizontal = true, vertical = false }) {
  return (
    <CartesianGrid
      stroke={GRID_LINE}
      strokeWidth={MARK.gridWidth}
      horizontal={horizontal}
      vertical={vertical}
    />
  );
}

/** Category axis along the bottom, reading right-to-left. */
export function CategoryAxisX({ dataKey }: { dataKey: string }) {
  return (
    <XAxis
      dataKey={dataKey}
      reversed
      tick={AXIS_TICK}
      tickLine={false}
      axisLine={{ stroke: GRID_LINE }}
      interval="preserveStartEnd"
    />
  );
}

/** Value axis on the right, ticks rounded to clean numbers. */
export function ValueAxisY({ tickFormatter }: { tickFormatter?: (value: number) => string }) {
  return (
    <YAxis
      orientation="right"
      tick={AXIS_TICK}
      tickLine={false}
      axisLine={false}
      width={64}
      tickFormatter={tickFormatter}
    />
  );
}
