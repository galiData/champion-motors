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
