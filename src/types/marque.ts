/** The six Volkswagen Group marques Champion Motors imports into Israel. */
export const MARQUES = [
  "volkswagen",
  "vw-commercial",
  "audi",
  "seat",
  "cupra",
  "skoda",
] as const;

export type Marque = (typeof MARQUES)[number];

/**
 * Display names stay in Latin script — marque names are brand assets and are
 * never transliterated into Hebrew in the interface.
 */
export const MARQUE_LABELS: Record<Marque, string> = {
  volkswagen: "Volkswagen",
  "vw-commercial": "VW Commercial",
  audi: "Audi",
  seat: "SEAT",
  cupra: "CUPRA",
  skoda: "Škoda",
};
