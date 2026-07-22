import type { RangeMonths } from "@/components/features/analytics/RangeFilter";
import {
  accountingAnalytics,
  laborAnalytics,
  marketingAnalytics,
  salesAnalytics,
} from "@/lib/api/fixtures/analytics";
import { CARS } from "@/lib/api/fixtures/cars";
import { CUSTOMERS } from "@/lib/api/fixtures/customers";
import { EVENTS } from "@/lib/api/fixtures/events";
import { LOCATIONS } from "@/lib/api/fixtures/locations";
import { NEWS } from "@/lib/api/fixtures/news";
import { STAFF } from "@/lib/api/fixtures/staff";
import type {
  AccountingAnalytics,
  LaborAnalytics,
  MarketingAnalytics,
  SalesAnalytics,
} from "@/types/analytics";
import type { Car } from "@/types/car";
import type { Customer, CustomerInput } from "@/types/customer";
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

function reject(message: string): Promise<never> {
  return new Promise((_, fail) => {
    setTimeout(() => fail(new Error(message)), LATENCY_MS);
  });
}

/**
 * Next sequential id for a `prefix-NNNN` id scheme. In-memory only — the
 * fixture layer has no persistence, so created and edited rows live until the
 * next full reload. Replacing this with HTTP changes this file alone.
 */
function nextId(rows: { id: string }[], prefix: string): string {
  const max = rows.reduce((highest, row) => {
    const parsed = Number.parseInt(row.id.replace(`${prefix}-`, ""), 10);
    return Number.isNaN(parsed) ? highest : Math.max(highest, parsed);
  }, 0);
  return `${prefix}-${max + 1}`;
}

export const api = {
  locations: {
    list: (): Promise<Location[]> => resolve(LOCATIONS),
    get: (id: string): Promise<Location | null> => byId(LOCATIONS, id),
  },
  customers: {
    list: (): Promise<Customer[]> => resolve(CUSTOMERS),
    get: (id: string): Promise<Customer | null> => byId(CUSTOMERS, id),
    create: (input: CustomerInput): Promise<Customer> => {
      const customer: Customer = { id: nextId(CUSTOMERS, "cus"), ...input };
      CUSTOMERS.unshift(customer);
      return resolve(customer);
    },
    update: (id: string, patch: CustomerInput): Promise<Customer> => {
      const index = CUSTOMERS.findIndex((row) => row.id === id);
      if (index === -1) return reject("הלקוח לא נמצא");
      const updated: Customer = { ...CUSTOMERS[index], ...patch, id };
      CUSTOMERS[index] = updated;
      return resolve(updated);
    },
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
  analytics: {
    sales: (months: RangeMonths): Promise<SalesAnalytics> => resolve(salesAnalytics(months)),
    marketing: (months: RangeMonths): Promise<MarketingAnalytics> =>
      resolve(marketingAnalytics(months)),
    labor: (months: RangeMonths): Promise<LaborAnalytics> => resolve(laborAnalytics(months)),
    accounting: (months: RangeMonths): Promise<AccountingAnalytics> =>
      resolve(accountingAnalytics(months)),
  },
};
