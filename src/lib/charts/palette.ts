/**
 * Chart palette — VALIDATED. Do not edit these values by eye.
 *
 * Every hex here was checked with the dataviz validator against a white chart
 * surface. If you change one, re-run the validator and paste the new result:
 *
 *   node scripts/validate_palette.js "#1760F0,#539FFF" --mode light --surface "#FFFFFF"
 *     → all checks PASS. Worst adjacent pair ΔE 15.2 (deutan) / 17.2 (normal).
 *     → WARN: Sky #539FFF sits at 2.7:1 on white, below the 3:1 mark floor.
 *
 *   node scripts/validate_palette.js "#8DB2F8,#5389F4,#1760F0,#0F45AB" --ordinal …
 *     → all checks PASS. Monotone lightness, single hue, light end 2.13:1.
 *
 * The Sky WARN is not dismissable: any chart using slot 2 must also carry the
 * value another way. Every chart card here ships a table view, which is that
 * relief channel.
 *
 * Why only two categorical slots: Champion's brand palette is deliberately
 * narrow. Deep Blue #00335C was tested and FAILS as a data fill — OKLCH L 0.316
 * is outside the 0.43–0.77 band and chroma 0.088 is below the 0.10 floor, so it
 * reads as gray. It stays a text and heading color, per design.md. There is no
 * brand-legal third categorical hue, so charts here are designed to need at most
 * two series; anything wider becomes a nominal bar (one hue) or an ordinal ramp.
 */

/** Categorical identity. Assigned in fixed order, never cycled. */
export const CATEGORICAL = ["#1760F0", "#539FFF"] as const;

/** Ordered buckets (aging, tiers, bands) — one hue, light → dark. */
export const ORDINAL_RAMP = ["#8DB2F8", "#5389F4", "#1760F0", "#0F45AB"] as const;

/** Context series in an emphasis chart, and unfilled meter track. */
export const DEEMPHASIS = "#CED5DF";

/** Chart chrome. Gridlines are hairline and solid — never dashed. */
export const CHART_SURFACE = "#FFFFFF";
export const GRID_LINE = "#CED5DF";
export const AXIS_TEXT = "#5F5F5F";

/** Fixed mark specs, shared by every chart so they read as one system. */
export const MARK = {
  /** Bars never fill their band — the leftover is air. */
  maxBarSize: 24,
  /** 4px rounded data-end, square at the baseline. */
  barRadiusColumn: [4, 4, 0, 0] as [number, number, number, number],
  /** RTL horizontal bars grow leftward, so the rounded end is on the left. */
  barRadiusRowRtl: [4, 0, 0, 4] as [number, number, number, number],
  lineWidth: 2,
  /** Marker diameter >= 8px. */
  dotRadius: 4,
  /** Area fills are a wash, never a saturated block. */
  areaFillOpacity: 0.1,
  /** White doing the separating, between stacked segments and adjacent bars. */
  surfaceGap: 2,
  gridWidth: 1,
} as const;
