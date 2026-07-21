import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartLegend } from "@/components/features/analytics/ChartLegend";
import { ChartTooltip } from "@/components/features/analytics/ChartTooltip";
import {
  CategoryAxisX,
  Grid,
  ValueAxisY,
} from "@/components/features/analytics/charts/chartAxes";
import { CATEGORICAL, CHART_SURFACE, MARK } from "@/lib/charts/palette";

export interface PairedBarChartProps {
  data: Record<string, string | number>[];
  categoryKey: string;
  primaryKey: string;
  secondaryKey: string;
  primaryLabel: string;
  secondaryLabel: string;
  /** Stack the two series (part-to-whole) or set them side by side. */
  stacked?: boolean;
  format?: (value: number) => string;
  ariaLabel: string;
}

/**
 * Two series as columns — stacked for part-to-whole, grouped for a comparison.
 *
 * No per-segment labels: a number on every segment is chaos and goes unread.
 * The legend, the tooltip and the table view carry the values instead.
 *
 * The 2px surface-coloured stroke is the surface gap, not a border — it is what
 * separates touching stacked segments so neighbours read as distinct without
 * adding contrasting ink.
 */
export function PairedBarChart({
  data,
  categoryKey,
  primaryKey,
  secondaryKey,
  primaryLabel,
  secondaryLabel,
  stacked = false,
  format,
  ariaLabel,
}: PairedBarChartProps) {
  const stackId = stacked ? "series" : undefined;

  return (
    <div>
      <ChartLegend
        items={[
          { label: primaryLabel, color: CATEGORICAL[0], shape: "rect" },
          { label: secondaryLabel, color: CATEGORICAL[1], shape: "rect" },
        ]}
      />
      <div role="img" aria-label={ariaLabel} className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Grid />
            <CategoryAxisX dataKey={categoryKey} />
            <ValueAxisY tickFormatter={format} />
            <Tooltip content={<ChartTooltip format={format} />} cursor={{ fill: "#F5F5F5" }} />
            <Bar
              dataKey={primaryKey}
              name={primaryLabel}
              stackId={stackId}
              fill={CATEGORICAL[0]}
              maxBarSize={MARK.maxBarSize}
              radius={stacked ? undefined : MARK.barRadiusColumn}
              stroke={stacked ? CHART_SURFACE : undefined}
              strokeWidth={stacked ? MARK.surfaceGap : 0}
              isAnimationActive={false}
            />
            <Bar
              dataKey={secondaryKey}
              name={secondaryLabel}
              stackId={stackId}
              fill={CATEGORICAL[1]}
              maxBarSize={MARK.maxBarSize}
              radius={MARK.barRadiusColumn}
              stroke={stacked ? CHART_SURFACE : undefined}
              strokeWidth={stacked ? MARK.surfaceGap : 0}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
