/** Monetary series are expressed in thousands of shekels (אלפי ₪). */
export interface MonthlyValue {
  month: string;
  value: number;
}

export interface MonthlyPair {
  month: string;
  primary: number;
  secondary: number;
}

export interface NamedValue {
  name: string;
  value: number;
}

export interface PlanVsActual {
  name: string;
  plan: number;
  actual: number;
}

export interface SalesAnalytics {
  deliveries: number;
  openOrders: number;
  avgStockDays: number;
  orderValueThousands: number;
  deliveriesByMonth: MonthlyValue[];
  deliveriesByMarque: NamedValue[];
}

export interface SalesByLocationAnalytics {
  deliveries: number;
  openOrders: number;
  avgStockDays: number;
  orderValueThousands: number;
  deliveriesByLocation: NamedValue[];
  orderValueByLocation: NamedValue[];
}

export interface MarketingAnalytics {
  leads: number;
  conversionRate: number;
  costPerLeadIls: number;
  activeCampaigns: number;
  leadsBySource: NamedValue[];
  leadsVsConversions: MonthlyPair[];
}

export interface LaborAnalytics {
  activeStaff: number;
  workedHours: number;
  technicianUtilization: number;
  openPositions: number;
  utilizationByLocation: NamedValue[];
  headcountByDepartment: PlanVsActual[];
}

export interface AccountingAnalytics {
  revenueThousands: number;
  receivablesThousands: number;
  avgCollectionDays: number;
  netCashThousands: number;
  revenueByMonth: MonthlyPair[];
  receivablesAging: NamedValue[];
}
