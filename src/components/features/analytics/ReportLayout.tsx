import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatTile, type StatTileProps } from "@/components/features/analytics/StatTile";

export interface ReportLayoutProps {
  title: string;
  description: string;
  stats: StatTileProps[];
  children: ReactNode;
}

/** Shared shell for the four analytics reports: header, KPI row, chart area. */
export function ReportLayout({ title, description, stats, children }: ReportLayoutProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />

      <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">{children}</div>
    </div>
  );
}
