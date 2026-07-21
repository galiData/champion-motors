import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/features/analytics/ChartTooltip";
import {
  AXIS_TICK,
  LABEL_STYLE,
  labelFormatter,
} from "@/components/features/analytics/charts/chartAxes";
import { GRID_LINE, MARK, ORDINAL_RAMP } from "@/lib/charts/palette";
import type { NamedValue } from "@/types/analytics";

export interface OrdinalBarChartProps {
  data: NamedValue[];
  seriesLabel: string;
  format?: (value: number) => string;
  ariaLabel: string;
}

/**
 * Ordered buckets — ageing bands, tiers, cohorts. Swapping the category order
 * would change the meaning, so the colour carries that order: one hue, light to
 * dark, on the validated ordinal ramp.
 *
 * The ramp caps at four steps. More buckets than that need a re-validated ramp,
 * not an interpolated fifth colour.
 */
export function OrdinalBarChart({ data, seriesLabel, format, ariaLabel }: OrdinalBarChartProps) {
  const height = Math.max(220, data.length * 48 + 48);

  return (
    <div role="img" aria-label={ariaLabel} style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 8, bottom: 8, left: 72 }}>
          <XAxis type="number" reversed hide />
          <YAxis
            type="category"
            dataKey="name"
            orientation="right"
            width={112}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: GRID_LINE }}
          />
          <Tooltip content={<ChartTooltip format={format} />} cursor={{ fill: "#F5F5F5" }} />
          <Bar
            dataKey="value"
            name={seriesLabel}
            maxBarSize={MARK.maxBarSize}
            radius={MARK.barRadiusRowRtl}
            isAnimationActive={false}
          >
            {data.map((bucket, index) => (
              <Cell
                key={bucket.name}
                fill={ORDINAL_RAMP[Math.min(index, ORDINAL_RAMP.length - 1)]}
              />
            ))}
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
