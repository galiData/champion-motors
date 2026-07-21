import { describe, expect, it } from "vitest";
import { formatCurrency, formatNumber } from "@/utils/formatCurrency";

describe("formatCurrency", () => {
  it("formats an amount with a shekel sign and thousands separator", () => {
    expect(formatCurrency(1162)).toBe("1,162 ₪");
  });

  it("rounds to whole shekels — no agorot in a quote", () => {
    expect(formatCurrency(1162.4)).toBe("1,162 ₪");
    expect(formatCurrency(1162.6)).toBe("1,163 ₪");
  });

  it("returns an em dash for a missing amount rather than 0 ₪", () => {
    expect(formatCurrency(null)).toBe("—");
    expect(formatCurrency(undefined)).toBe("—");
  });

  it("returns an em dash for a non-finite amount", () => {
    expect(formatCurrency(Number.NaN)).toBe("—");
    expect(formatCurrency(Number.POSITIVE_INFINITY)).toBe("—");
  });
});

describe("formatNumber", () => {
  it("separates thousands without a currency sign", () => {
    expect(formatNumber(18740)).toBe("18,740");
  });

  it("returns an em dash for a missing value", () => {
    expect(formatNumber(null)).toBe("—");
  });
});
