import { Badge } from "@/components/ui/badge";
import { NEWS_CATEGORY_LABELS, type NewsItem } from "@/types/news";
import { formatLongDate } from "@/utils/formatDate";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="rounded-lg border border-cm-mist bg-white p-6">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Badge tone="info">{NEWS_CATEGORY_LABELS[item.category]}</Badge>
        <time dateTime={item.publishedAt} className="text-sm text-cm-gray">
          {formatLongDate(item.publishedAt)}
        </time>
      </div>
      <h3 className="text-xl font-bold text-cm-deep-blue">{item.title}</h3>
      <p className="mt-2 text-base text-cm-graphite">{item.summary}</p>
      <p className="mt-4 text-sm text-cm-gray">{item.author}</p>
    </article>
  );
}
