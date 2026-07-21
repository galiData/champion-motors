import type { Marque } from "@/types/marque";

export type CarStatus = "in-stock" | "reserved" | "delivered" | "in-service";

export const CAR_STATUS_LABELS: Record<CarStatus, string> = {
  "in-stock": "במלאי",
  reserved: "משוריין",
  delivered: "נמסר",
  "in-service": "בטיפול",
};

export interface Car {
  id: string;
  marque: Marque;
  /** Latin model name — stays LTR in the interface. */
  model: string;
  trim: string;
  year: number;
  licensePlate: string;
  vin: string;
  status: CarStatus;
  locationId: string;
  listPriceIls: number;
  mileageKm: number;
}
