import { CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EVENT_KIND_LABELS, type CalendarEvent } from "@/types/event";
import { formatDate, formatTime } from "@/utils/formatDate";

export function EventList({ events }: { events: CalendarEvent[] }) {
  return (
    <ul className="flex flex-col divide-y divide-cm-line">
      {events.map((event) => (
        <li key={event.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="neutral">{EVENT_KIND_LABELS[event.kind]}</Badge>
            <span className="inline-flex items-center gap-1.5 text-sm text-cm-slate">
              <CalendarDays className="size-4 text-cm-gray" aria-hidden="true" />
              <time dateTime={event.startsAt}>
                {formatDate(event.startsAt)} · {formatTime(event.startsAt)}–
                {formatTime(event.endsAt)}
              </time>
            </span>
          </div>
          <p className="text-base font-semibold text-cm-ink">{event.title}</p>
          <p className="inline-flex items-center gap-1.5 text-sm text-cm-slate">
            <MapPin className="size-4 text-cm-gray" aria-hidden="true" />
            {event.locationName}
          </p>
        </li>
      ))}
    </ul>
  );
}
