import type { CalendarEvent } from "@/types/event";

export const EVENTS: CalendarEvent[] = [
  {
    id: "evt-5001",
    title: "הדרכת צוותי מכירות — הטיגואן החדש",
    kind: "training",
    startsAt: "2026-07-23T09:00:00+03:00",
    endsAt: "2026-07-23T13:00:00+03:00",
    locationName: "מרכז שירות ראשון לציון",
  },
  {
    id: "evt-5002",
    title: "השקת Audi Q6 e-tron ללקוחות מוזמנים",
    kind: "launch",
    startsAt: "2026-07-28T18:30:00+03:00",
    endsAt: "2026-07-28T21:30:00+03:00",
    locationName: "אולם תצוגה תל אביב",
  },
  {
    id: "evt-5003",
    title: "מפגש מנהלי סניפים רבעוני",
    kind: "meeting",
    startsAt: "2026-08-04T10:00:00+03:00",
    endsAt: "2026-08-04T15:00:00+03:00",
    locationName: "מרכז שירות ראשון לציון",
  },
  {
    id: "evt-5004",
    title: "יום גיבוש עובדים",
    kind: "social",
    startsAt: "2026-08-14T08:00:00+03:00",
    endsAt: "2026-08-14T17:00:00+03:00",
    locationName: "פארק אשכול",
  },
];
