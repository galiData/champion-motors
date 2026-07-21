import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartLegend } from "@/components/features/analytics/ChartLegend";
import { ChartTooltip } from "@/components/features/analytics/ChartTooltip";
import {
  CategoryAxisX,
  Grid,
  ValueAxisY,
} from "@/components/features/analytics/charts/chartAxes";
import { CATEGORICAL, GRID_LINE, MARK } from "@/lib/charts/palette";
import type { MonthlyPair } from "@/types/analytics";

export interface DualLineChartProps {
  data: MonthlyPair[];
  primaryLabel: string;
  secondaryLabel: string;
  format?: (value: number) => string;
  ariaLabel: string;
}

/**
 * Two series over time. The legend is always present — identity never rests on
 * colour alone — and the tooltip lists both series at the hovered month.
 *
 * Slot 2 (Sky) sits below 3:1 on white; the card's table view is the required
 * relief channel.
 */
export function DualLineChart({
  data,
  primaryLabel,
  secondaryLabel,
  format,
  ariaLabel,
}: DualLineChartProps) {
  return (
    <div>
      <ChartLegend
        items={[
          { label: primaryLabel, color: CATEGORICAL[0], shape: "line" },
          { label: secondaryLabel, color: CATEGORICAL[1], shape: "line" },
        ]}
      />
      <div role="img" aria-label={ariaLabel} className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Grid />
            <CategoryAxisX dataKey="month" />
            <ValueAxisY tickFormatter={format} />
            <Tooltip
              content={<ChartTooltip format={format} />}
              cursor={{ stroke: GRID_LINE, strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="primary"
              name={primaryLabel}
              stroke={CATEGORICAL[0]}
              strokeWidth={MARK.lineWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
              dot={false}
              activeDot={{
                r: MARK.dotRadius,
                fill: CATEGORICAL[0],
                stroke: "#FFFFFF",
                strokeWidth: MARK.surfaceGap,
              }}
            />
            <Line
              type="monotone"
              dataKey="secondary"
              name={secondaryLabel}
              stroke={CATEGORICAL[1]}
              strokeWidth={MARK.lineWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
              dot={false}
              activeDot={{
                r: MARK.dotRadius,
                fill: CATEGORICAL[1],
                stroke: "#FFFFFF",
                strokeWidth: MARK.surfaceGap,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
