import type { RangeMonths } from "@/components/features/analytics/RangeFilter";
import type {
  AccountingAnalytics,
  LaborAnalytics,
  MarketingAnalytics,
  SalesAnalytics,
} from "@/types/analytics";

/**
 * Demonstration data for the analytics proof of concept.
 *
 * These are invented figures, not Champion Motors results. The reports label
 * themselves "נתוני הדגמה" in the filter row so the numbers are never mistaken
 * for reporting. Replace this module when the real sources are connected — the
 * chart components depend on the shapes in @/types/analytics, not on this file.
 *
 * Monetary series are in thousands of shekels (אלפי ₪).
 */

/** Twelve months ending July 2026, oldest first. */
const MONTHS = [
  "אוג׳",
  "ספט׳",
  "אוק׳",
  "נוב׳",
  "דצמ׳",
  "ינו׳",
  "פבר׳",
  "מרץ",
  "אפר׳",
  "מאי",
  "יוני",
  "יולי",
];

const DELIVERIES = [412, 388, 445, 501, 468, 392, 421, 487, 534, 498, 512, 476];
const LEADS = [1240, 1180, 1350, 1520, 1410, 1190, 1280, 1470, 1610, 1530, 1580, 1490];
const CONVERSIONS = [186, 171, 203, 241, 219, 174, 195, 228, 262, 245, 254, 238];
const REVENUE_SALES = [
  68200, 61400, 72800, 84500, 79100, 64300, 70200, 81900, 91400, 85600, 88300, 82700,
];
const REVENUE_SERVICE = [
  21400, 20800, 22600, 24100, 23500, 21900, 22300, 24800, 26200, 25400, 25900, 24600,
];

/** Marque mix, as a share of deliveries in the selected range. */
const MARQUE_MIX: [string, number][] = [
  ["Volkswagen", 0.34],
  ["Škoda", 0.27],
  ["Audi", 0.16],
  ["SEAT", 0.09],
  ["CUPRA", 0.08],
  ["VW Commercial", 0.06],
];

/** Lead origin mix, as a share of leads in the selected range. */
const SOURCE_MIX: [string, number][] = [
  ["אתר החברה", 0.38],
  ["קמפיינים ממומנים", 0.24],
  ["הפניות לקוחות", 0.16],
  ["אולמות תצוגה", 0.13],
  ["פניות טלפוניות", 0.09],
];

function lastN<T>(rows: T[], months: RangeMonths): T[] {
  return rows.slice(-months);
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function splitByMix(total: number, mix: [string, number][]) {
  return mix.map(([name, share]) => ({ name, value: Math.round(total * share) }));
}

export function salesAnalytics(months: RangeMonths): SalesAnalytics {
  const labels = lastN(MONTHS, months);
  const deliveries = lastN(DELIVERIES, months);
  const total = sum(deliveries);

  return {
    deliveries: total,
    openOrders: Math.round(total * 0.31),
    avgStockDays: months === 3 ? 38 : months === 6 ? 41 : 44,
    orderValueThousands: Math.round(total * 212),
    deliveriesByMonth: labels.map((month, index) => ({ month, value: deliveries[index] })),
    deliveriesByMarque: splitByMix(total, MARQUE_MIX),
  };
}

export function marketingAnalytics(months: RangeMonths): MarketingAnalytics {
  const labels = lastN(MONTHS, months);
  const leads = lastN(LEADS, months);
  const conversions = lastN(CONVERSIONS, months);
  const totalLeads = sum(leads);
  const totalConversions = sum(conversions);

  return {
    leads: totalLeads,
    conversionRate: Math.round((totalConversions / totalLeads) * 1000) / 10,
    costPerLeadIls: months === 3 ? 168 : months === 6 ? 174 : 181,
    activeCampaigns: months === 3 ? 7 : months === 6 ? 11 : 14,
    leadsBySource: splitByMix(totalLeads, SOURCE_MIX),
    leadsVsConversions: labels.map((month, index) => ({
      month,
      primary: leads[index],
      secondary: conversions[index],
    })),
  };
}

export function laborAnalytics(months: RangeMonths): LaborAnalytics {
  const deliveries = lastN(DELIVERIES, months);

  return {
    activeStaff: 169,
    workedHours: Math.round(sum(deliveries) * 61),
    technicianUtilization: months === 3 ? 81 : months === 6 ? 79 : 77,
    openPositions: 12,
    utilizationByLocation: [
      { name: "ראשון לציון", value: 87 },
      { name: "חיפה", value: 82 },
      { name: "באר שבע", value: 76 },
      { name: "תל אביב", value: 71 },
      { name: "ירושלים", value: 68 },
    ],
    headcountByDepartment: [
      { name: "שירות", plan: 132, actual: 121 },
      { name: "מכירות", plan: 74, actual: 68 },
      { name: "כספים", plan: 22, actual: 22 },
      { name: "שיווק", plan: 18, actual: 17 },
      { name: "הנהלה", plan: 12, actual: 11 },
    ],
  };
}

export function accountingAnalytics(months: RangeMonths): AccountingAnalytics {
  const labels = lastN(MONTHS, months);
  const sales = lastN(REVENUE_SALES, months);
  const service = lastN(REVENUE_SERVICE, months);
  const revenue = sum(sales) + sum(service);

  return {
    revenueThousands: revenue,
    receivablesThousands: 72700,
    avgCollectionDays: months === 3 ? 47 : months === 6 ? 49 : 52,
    netCashThousands: Math.round(revenue * 0.086),
    revenueByMonth: labels.map((month, index) => ({
      month,
      primary: sales[index],
      secondary: service[index],
    })),
    receivablesAging: [
      { name: "0–30 ימים", value: 42800 },
      { name: "31–60 ימים", value: 18600 },
      { name: "61–90 ימים", value: 7400 },
      { name: "מעל 90 ימים", value: 3900 },
    ],
  };
}
