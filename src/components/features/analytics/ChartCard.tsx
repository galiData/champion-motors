import { useId, useState, type ReactNode } from "react";
import { BarChart3, TableIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/utils/cn";

export interface ChartTableData {
  columns: string[];
  rows: (string | number)[][];
}

export interface ChartCardProps {
  title: string;
  description: string;
  /** The rendered chart. */
  children: ReactNode;
  /**
   * The chart's table-view twin. Required, not optional: it is how every value
   * stays reachable without hovering, and it is the relief channel for the
   * sub-3:1 Sky series.
   */
  table: ChartTableData;
  /** Dim the frame during a refetch instead of flashing a skeleton. */
  isRefreshing?: boolean;
}

export function ChartCard({
  title,
  description,
  children,
  table,
  isRefreshing = false,
}: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);
  const regionId = useId();

  return (
    <section className="flex flex-col rounded-lg border border-cm-mist bg-white p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-cm-deep-blue">{title}</h3>
          <p className="mt-1 text-sm text-cm-slate">{description}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowTable((shown) => !shown)}
          aria-pressed={showTable}
          aria-controls={regionId}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-cm-mist px-3 py-2 text-sm font-semibold text-cm-deep-blue transition-colors hover:border-cm-blue hover:text-cm-blue"
        >
          {showTable ? (
            <BarChart3 className="size-4" aria-hidden="true" />
          ) : (
            <TableIcon className="size-4" aria-hidden="true" />
          )}
          {showTable ? "תרשים" : "טבלה"}
        </button>
      </div>

      <div
        id={regionId}
        className={cn("transition-opacity", isRefreshing && "opacity-50")}
      >
        {showTable ? (
          <Table>
            <TableHeader>
              <TableRow>
                {table.columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.map((row) => (
                <TableRow key={String(row[0])}>
                  {row.map((cell, index) => (
                    <TableCell
                      key={`${String(row[0])}-${index}`}
                      className={index === 0 ? "text-cm-ink" : "text-cm-graphite"}
                    >
                      {typeof cell === "number" ? (
                        <span className="ltr-nums tabular-nums">
                          {cell.toLocaleString("he-IL")}
                        </span>
                      ) : (
                        cell
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
