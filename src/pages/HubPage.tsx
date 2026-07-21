import { CalendarDays } from "lucide-react";
import { EventList } from "@/components/features/hub/EventList";
import { NewsCard } from "@/components/features/hub/NewsCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEvents } from "@/hooks/useEvents";
import { useNews } from "@/hooks/useNews";

export function HubPage() {
  const { user } = useCurrentUser();
  const news = useNews();
  const events = useEvents();

  return (
    <div>
      <PageHeader
        title={user ? `שלום, ${user.name}` : "מרכז"}
        description="עדכונים מהחברה והאירועים הקרובים."
      />

      <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <section aria-labelledby="news-heading">
          <h2 id="news-heading" className="mb-4 text-xl font-semibold text-cm-deep-blue">
            חדשות
          </h2>

          {news.isLoading ? (
            <div className="flex flex-col gap-4" aria-busy="true" aria-label="טוען חדשות">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-40 w-full" />
              ))}
            </div>
          ) : null}

          {news.error ? <ErrorState onRetry={news.refetch} /> : null}

          {!news.isLoading && !news.error && (news.data?.length ?? 0) === 0 ? (
            <div className="rounded-lg border border-cm-mist bg-white">
              <EmptyState
                title="אין עדכונים חדשים"
                description="כשיפורסמו עדכונים מהחברה הם יופיעו כאן."
              />
            </div>
          ) : null}

          {!news.isLoading && !news.error && news.data ? (
            <div className="flex flex-col gap-4">
              {news.data.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : null}
        </section>

        <section aria-labelledby="events-heading">
          <h2 id="events-heading" className="mb-4 text-xl font-semibold text-cm-deep-blue">
            אירועים קרובים
          </h2>

          <div className="rounded-lg border border-cm-mist bg-white p-6">
            {events.isLoading ? (
              <div className="flex flex-col gap-4" aria-busy="true" aria-label="טוען אירועים">
                {Array.from({ length: 4 }, (_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            ) : null}

            {events.error ? <ErrorState onRetry={events.refetch} /> : null}

            {!events.isLoading && !events.error && (events.data?.length ?? 0) === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="אין אירועים קרובים"
                description="כשיתוזמנו אירועים חדשים הם יופיעו כאן."
              />
            ) : null}

            {!events.isLoading && !events.error && events.data?.length ? (
              <EventList events={events.data} />
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
