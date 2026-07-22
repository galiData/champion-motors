import { describe, expect, it } from "vitest";
import { leaveDurationDays } from "@/utils/leaveDuration";

describe("leaveDurationDays", () => {
  it("counts a single day as 1, not 0", () => {
    expect(leaveDurationDays("2026-07-20", "2026-07-20")).toBe(1);
  });

  it("counts inclusively across a multi-day range", () => {
    expect(leaveDurationDays("2026-07-20", "2026-07-22")).toBe(3);
  });

  it("counts correctly across a month boundary", () => {
    expect(leaveDurationDays("2026-07-30", "2026-08-02")).toBe(4);
  });

  it("never returns a negative count for an inverted range", () => {
    expect(leaveDurationDays("2026-07-22", "2026-07-20")).toBe(0);
  });
});
