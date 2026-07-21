import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "@/components/features/analytics/ChartTooltip";
import {
  CategoryAxisX,
  Grid,
  ValueAxisY,
} from "@/components/features/analytics/charts/chartAxes";
import { CATEGORICAL, GRID_LINE, MARK } from "@/lib/charts/palette";
import type { MonthlyValue } from "@/types/analytics";

export interface TrendAreaChartProps {
  data: MonthlyValue[];
  seriesLabel: string;
  format?: (value: number) => string;
  ariaLabel: string;
}

/**
 * Trend over time, one series. A single series needs no legend — the card title
 * already names what is plotted. The crosshair snaps to the nearest month so
 * the reader aims at a date rather than at a 2px line.
 */
export function TrendAreaChart({ data, seriesLabel, format, ariaLabel }: TrendAreaChartProps) {
  return (
    <div role="img" aria-label={ariaLabel} className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Grid />
          <CategoryAxisX dataKey="month" />
          <ValueAxisY tickFormatter={format} />
          <Tooltip
            content={<ChartTooltip format={format} />}
            cursor={{ stroke: GRID_LINE, strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            name={seriesLabel}
            stroke={CATEGORICAL[0]}
            strokeWidth={MARK.lineWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            fill={CATEGORICAL[0]}
            fillOpacity={MARK.areaFillOpacity}
            dot={false}
            activeDot={{
              r: MARK.dotRadius,
              fill: CATEGORICAL[0],
              stroke: "#FFFFFF",
              strokeWidth: MARK.surfaceGap,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
