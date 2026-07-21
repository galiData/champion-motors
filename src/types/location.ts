import type { Marque } from "@/types/marque";

export type LocationKind = "showroom" | "service" | "both";

export const LOCATION_KIND_LABELS: Record<LocationKind, string> = {
  showroom: "אולם תצוגה",
  service: "מרכז שירות",
  both: "אולם תצוגה ומרכז שירות",
};

export interface Location {
  id: string;
  name: string;
  kind: LocationKind;
  city: string;
  address: string;
  phone: string;
  marques: Marque[];
  staffCount: number;
  openedAt: string;
}
