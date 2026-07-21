import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/features/analytics/ChartTooltip";
import {
  AXIS_TICK,
  LABEL_STYLE,
  labelFormatter,
} from "@/components/features/analytics/charts/chartAxes";
import { CATEGORICAL, GRID_LINE, MARK } from "@/lib/charts/palette";
import type { NamedValue } from "@/types/analytics";

export interface NominalBarChartProps {
  data: NamedValue[];
  seriesLabel: string;
  format?: (value: number) => string;
  ariaLabel: string;
  /** Widen when category names are long. */
  categoryWidth?: number;
}

/**
 * Magnitude across categories that have no natural order — marques, lead
 * sources, branches.
 *
 * Every bar wears slot 1. Colouring each bar darker-where-bigger would spend the
 * identity channel re-encoding what bar length already shows, and would fail the
 * categorical checks by design.
 */
export function NominalBarChart({
  data,
  seriesLabel,
  format,
  ariaLabel,
  categoryWidth = 132,
}: NominalBarChartProps) {
  const height = Math.max(220, data.length * 48 + 48);

  return (
    <div role="img" aria-label={ariaLabel} style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 8, bottom: 8, left: 56 }}
        >
          {/* Value axis reversed so bars grow leftward from the right baseline. */}
          <XAxis type="number" reversed hide />
          <YAxis
            type="category"
            dataKey="name"
            orientation="right"
            width={categoryWidth}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: GRID_LINE }}
          />
          <Tooltip content={<ChartTooltip format={format} />} cursor={{ fill: "#F5F5F5" }} />
          <Bar
            dataKey="value"
            name={seriesLabel}
            fill={CATEGORICAL[0]}
            maxBarSize={MARK.maxBarSize}
            radius={MARK.barRadiusRowRtl}
            isAnimationActive={false}
          >
            {/* Direct labels at the tip — also the relief channel for values. */}
            <LabelList
              dataKey="value"
              position="left"
              offset={8}
              formatter={labelFormatter(format)}
              style={LABEL_STYLE}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
