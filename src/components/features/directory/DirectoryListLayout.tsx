import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { formatNumber } from "@/utils/formatCurrency";
import type { AsyncState } from "@/hooks/useAsyncData";

export interface DirectoryListLayoutProps<T> {
  title: string;
  description: string;
  state: AsyncState<T[]>;
  columns: string[];
  /** Render one table row. Keys are the caller's responsibility. */
  renderRow: (item: T) => ReactNode;
  /** Decide whether an item matches the free-text search. */
  matches: (item: T, query: string) => boolean;
  searchPlaceholder: string;
  emptyTitle: string;
  emptyDescription: string;
}

/**
 * Shared shell for the four directory list pages: header, search, result count,
 * table, and the three data states. Each page supplies only its columns and row
 * rendering.
 */
export function DirectoryListLayout<T>({
  title,
  description,
  state,
  columns,
  renderRow,
  matches,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
}: DirectoryListLayoutProps<T>) {
  const [query, setQuery] = useState("");
  const { data, isLoading, error, refetch } = state;

  const visible = useMemo(() => {
    const rows = data ?? [];
    const trimmed = query.trim();
    if (!trimmed) return rows;
    return rows.filter((row) => matches(row, trimmed));
  }, [data, query, matches]);

  return (
    <div>
      <PageHeader title={title} description={description} />

      <div className="rounded-lg border border-cm-mist bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cm-mist p-4">
          <div className="relative w-full max-w-sm">
            <Search
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-cm-gray"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="ps-10"
            />
          </div>
          {!isLoading && !error ? (
            <p className="text-sm text-cm-slate">
              {formatNumber(visible.length)} מתוך {formatNumber(data?.length ?? 0)} רשומות
            </p>
          ) : null}
        </div>

        {isLoading ? <TableSkeleton columns={columns.length} /> : null}

        {error ? <ErrorState onRetry={refetch} /> : null}

        {!isLoading && !error && visible.length === 0 ? (
          <EmptyState
            title={query.trim() ? "לא נמצאו תוצאות לחיפוש" : emptyTitle}
            description={
              query.trim()
                ? "אפשר לנסות מונח חיפוש אחר, או לנקות את שדה החיפוש כדי לראות את כל הרשומות."
                : emptyDescription
            }
          />
        ) : null}

        {!isLoading && !error && visible.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>{visible.map(renderRow)}</TableBody>
          </Table>
        ) : null}
      </div>
    </div>
  );
}
