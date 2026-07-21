import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { AsyncState } from "@/hooks/useAsyncData";

export interface DetailField {
  label: string;
  value: ReactNode;
}

export interface DetailLayoutProps<T> {
  state: AsyncState<T | null>;
  backTo: string;
  backLabel: string;
  title: (item: T) => string;
  subtitle?: (item: T) => ReactNode;
  fields: (item: T) => DetailField[];
  notFoundTitle: string;
  notFoundDescription: string;
  children?: (item: T) => ReactNode;
}

/**
 * Shared shell for entity detail pages. The chevron mirrors in RTL because it is
 * directional — it points back toward the reading-start side.
 */
export function DetailLayout<T>({
  state,
  backTo,
  backLabel,
  title,
  subtitle,
  fields,
  notFoundTitle,
  notFoundDescription,
  children,
}: DetailLayoutProps<T>) {
  const { data, isLoading, error, refetch } = state;

  return (
    <div>
      <Link
        to={backTo}
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-cm-blue hover:underline"
      >
        <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        {backLabel}
      </Link>

      {isLoading ? (
        <div className="flex flex-col gap-4" aria-busy="true" aria-label="טוען נתונים">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : null}

      {error ? <ErrorState onRetry={refetch} /> : null}

      {!isLoading && !error && !data ? (
        <EmptyState title={notFoundTitle} description={notFoundDescription} />
      ) : null}

      {!isLoading && !error && data ? (
        <>
          <header className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-cm-deep-blue">{title(data)}</h1>
            {subtitle ? <div className="text-base text-cm-slate">{subtitle(data)}</div> : null}
          </header>

          <dl className="grid gap-x-8 gap-y-6 rounded-lg border border-cm-mist bg-white p-8 sm:grid-cols-2 lg:grid-cols-3">
            {fields(data).map((field) => (
              <div key={field.label} className="flex flex-col gap-1">
                <dt className="text-sm font-semibold text-cm-gray">{field.label}</dt>
                <dd className="text-base text-cm-ink">{field.value}</dd>
              </div>
            ))}
          </dl>

          {children ? <div className="mt-8">{children(data)}</div> : null}
        </>
      ) : null}
    </div>
  );
}
