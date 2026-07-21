import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatTile, type StatTileProps } from "@/components/features/analytics/StatTile";
import {
  RangeFilter,
  type RangeMonths,
} from "@/components/features/analytics/RangeFilter";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { AsyncState } from "@/hooks/useAsyncData";
import { cn } from "@/utils/cn";

export interface ReportLayoutProps<T> {
  title: string;
  description: string;
  range: RangeMonths;
  onRangeChange: (range: RangeMonths) => void;
  state: AsyncState<T>;
  /** Built from the loaded data; empty while the first load is in flight. */
  stats: StatTileProps[];
  children: ReactNode;
}

/**
 * Shared shell for the analytics reports: header, one filter row scoping
 * everything below it, a KPI row, and the chart grid.
 *
 * On a range change the previous render is held at reduced opacity rather than
 * being replaced by a skeleton — no layout jump, no flash.
 */
export function ReportLayout<T>({
  title,
  description,
  range,
  onRangeChange,
  state,
  stats,
  children,
}: ReportLayoutProps<T>) {
  const { data, isLoading, error, refetch } = state;
  const isFirstLoad = isLoading && !data;
  const isRefreshing = isLoading && Boolean(data);

  return (
    <div>
      <PageHeader title={title} description={description} />

      <RangeFilter value={range} onChange={onRangeChange} />

      {error ? <ErrorState onRetry={refetch} /> : null}

      {!error && isFirstLoad ? (
        <div aria-busy="true" aria-label="טוען נתונים">
          <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      ) : null}

      {!error && data ? (
        <div className={cn("transition-opacity", isRefreshing && "opacity-50")}>
          <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatTile key={stat.label} {...stat} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">{children}</div>
        </div>
      ) : null}
    </div>
  );
}
