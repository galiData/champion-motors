import { CARS } from "@/lib/api/fixtures/cars";
import { CUSTOMERS } from "@/lib/api/fixtures/customers";
import { EVENTS } from "@/lib/api/fixtures/events";
import { LOCATIONS } from "@/lib/api/fixtures/locations";
import { NEWS } from "@/lib/api/fixtures/news";
import { STAFF } from "@/lib/api/fixtures/staff";
import type { Car } from "@/types/car";
import type { Customer } from "@/types/customer";
import type { CalendarEvent } from "@/types/event";
import type { Location } from "@/types/location";
import type { NewsItem } from "@/types/news";
import type { StaffMember } from "@/types/staff";

/**
 * Fake data layer for the skeleton.
 *
 * Every method is async and artificially delayed so that loading states in the
 * UI are real rather than theoretical. Replacing this with HTTP means rewriting
 * this file only — hooks and pages depend on the method signatures, not on the
 * fixtures.
 */
const LATENCY_MS = 350;

function resolve<T>(value: T): Promise<T> {
  return new Promise((done) => {
    setTimeout(() => done(value), LATENCY_MS);
  });
}

function byId<T extends { id: string }>(rows: T[], id: string): Promise<T | null> {
  return resolve(rows.find((row) => row.id === id) ?? null);
}

export const api = {
  locations: {
    list: (): Promise<Location[]> => resolve(LOCATIONS),
    get: (id: string): Promise<Location | null> => byId(LOCATIONS, id),
  },
  customers: {
    list: (): Promise<Customer[]> => resolve(CUSTOMERS),
    get: (id: string): Promise<Customer | null> => byId(CUSTOMERS, id),
  },
  cars: {
    list: (): Promise<Car[]> => resolve(CARS),
    get: (id: string): Promise<Car | null> => byId(CARS, id),
  },
  staff: {
    list: (): Promise<StaffMember[]> => resolve(STAFF),
    get: (id: string): Promise<StaffMember | null> => byId(STAFF, id),
  },
  news: {
    list: (): Promise<NewsItem[]> => resolve(NEWS),
  },
  events: {
    list: (): Promise<CalendarEvent[]> => resolve(EVENTS),
  },
};
