export type EventKind = "training" | "launch" | "meeting" | "social";

export const EVENT_KIND_LABELS: Record<EventKind, string> = {
  training: "הדרכה",
  launch: "השקה",
  meeting: "מפגש",
  social: "אירוע חברה",
};

export interface CalendarEvent {
  id: string;
  title: string;
  kind: EventKind;
  startsAt: string;
  endsAt: string;
  locationName: string;
}
