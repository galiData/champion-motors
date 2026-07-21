import {
  Building2,
  Calculator,
  CarFront,
  FolderOpen,
  Home,
  IdCard,
  Megaphone,
  MessagesSquare,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

import { HubPage } from "@/pages/HubPage";
import { AccountingReportPage } from "@/pages/analytics/AccountingReportPage";
import { LaborReportPage } from "@/pages/analytics/LaborReportPage";
import { MarketingReportPage } from "@/pages/analytics/MarketingReportPage";
import { SalesReportPage } from "@/pages/analytics/SalesReportPage";
import { CarDetailPage } from "@/pages/directory/CarDetailPage";
import { CarsPage } from "@/pages/directory/CarsPage";
import { CustomerDetailPage } from "@/pages/directory/CustomerDetailPage";
import { CustomersPage } from "@/pages/directory/CustomersPage";
import { LocationDetailPage } from "@/pages/directory/LocationDetailPage";
import { LocationsPage } from "@/pages/directory/LocationsPage";
import { StaffMemberDetailPage } from "@/pages/directory/StaffMemberDetailPage";
import { StaffPage } from "@/pages/directory/StaffPage";
import { CommunicationPage } from "@/pages/productivity/CommunicationPage";
import { DocumentsPage } from "@/pages/productivity/DocumentsPage";

/**
 * The single source of truth for the sidebar and the route tree.
 *
 * Adding a page means adding one entry here plus its component — the sidebar
 * and the router both read from this list, so they cannot drift apart.
 */
export interface NavItem {
  path: string;
  /** Hebrew label shown in the sidebar and the top bar. */
  label: string;
  icon: LucideIcon;
  Component: ComponentType;
  /** Optional `:id` route rendered under the same section. */
  detail?: {
    path: string;
    Component: ComponentType;
  };
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

export const HUB_ITEM: NavItem = {
  path: "/",
  label: "מרכז",
  icon: Home,
  Component: HubPage,
};

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "directory",
    label: "ספרייה",
    items: [
      {
        path: "/locations",
        label: "סניפים",
        icon: Building2,
        Component: LocationsPage,
        detail: { path: "/locations/:id", Component: LocationDetailPage },
      },
      {
        path: "/customers",
        label: "לקוחות",
        icon: UserRound,
        Component: CustomersPage,
        detail: { path: "/customers/:id", Component: CustomerDetailPage },
      },
      {
        path: "/cars",
        label: "רכבים",
        icon: CarFront,
        Component: CarsPage,
        detail: { path: "/cars/:id", Component: CarDetailPage },
      },
      {
        path: "/staff",
        label: "עובדים",
        icon: Users,
        Component: StaffPage,
        detail: { path: "/staff/:id", Component: StaffMemberDetailPage },
      },
    ],
  },
  {
    id: "analytics",
    label: "אנליטיקה",
    items: [
      { path: "/analytics/sales", label: "מכירות", icon: TrendingUp, Component: SalesReportPage },
      {
        path: "/analytics/marketing",
        label: "שיווק",
        icon: Megaphone,
        Component: MarketingReportPage,
      },
      { path: "/analytics/labor", label: "כוח אדם", icon: IdCard, Component: LaborReportPage },
      {
        path: "/analytics/accounting",
        label: "הנהלת חשבונות",
        icon: Calculator,
        Component: AccountingReportPage,
      },
    ],
  },
  {
    id: "productivity",
    label: "פרודוקטיביות",
    items: [
      {
        path: "/productivity/communication",
        label: "תקשורת",
        icon: MessagesSquare,
        Component: CommunicationPage,
      },
      {
        path: "/productivity/documents",
        label: "מסמכים",
        icon: FolderOpen,
        Component: DocumentsPage,
      },
    ],
  },
];

/** Every routable item, hub first. */
export const ALL_NAV_ITEMS: NavItem[] = [
  HUB_ITEM,
  ...NAV_SECTIONS.flatMap((section) => section.items),
];

/**
 * The label for a pathname, used by the top bar. Detail routes inherit their
 * list page's label — the page itself renders the specific entity name.
 */
export function labelForPath(pathname: string): string {
  const exact = ALL_NAV_ITEMS.find((item) => item.path === pathname);
  if (exact) return exact.label;

  const withDetail = ALL_NAV_ITEMS.find(
    (item) => item.detail !== undefined && pathname.startsWith(`${item.path}/`),
  );
  return withDetail?.label ?? "";
}
