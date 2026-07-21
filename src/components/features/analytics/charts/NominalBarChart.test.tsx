import { cloneElement, type ReactElement } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NominalBarChart } from "@/components/features/analytics/charts/NominalBarChart";
import { formatNumber } from "@/utils/formatCurrency";

// Recharts measures its container; jsdom reports zero, so force a real size.
vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactElement }) =>
      cloneElement(children, { width: 560, height: 320 } as never),
  };
});

const LEADS = [
  { name: "אתר החברה", value: 6403 },
  { name: "קמפיינים ממומנים", value: 4044 },
  { name: "הפניות לקוחות", value: 2696 },
  { name: "אולמות תצוגה", value: 2191 },
  { name: "פניות טלפוניות", value: 1517 },
];

function renderChart() {
  const { container } = render(
    <NominalBarChart
      data={LEADS}
      seriesLabel="לידים"
      format={formatNumber}
      ariaLabel="תרשים לידים לפי מקור"
      categoryWidth={152}
    />,
  );

  const valueLabels = [...container.querySelectorAll("text")].filter((node) =>
    /^[\d,]+$/.test(node.textContent ?? ""),
  );

  return { container, valueLabels };
}

describe("NominalBarChart value labels", () => {
  it("renders one label per bar", () => {
    const { valueLabels } = renderChart();
    expect(valueLabels).toHaveLength(LEADS.length);
  });

  /*
   * The regression this guards: `LabelList position="left"` resolves against the
   * baseline on a reversed axis, so every label collapsed onto a single x and
   * stacked on top of the category names. Distinct x values per bar is the
   * signal that labels track their own bar's growing end.
   */
  it("places each label at its own bar's end, not a shared position", () => {
    const { valueLabels } = renderChart();

    const positions = valueLabels.map((node) => Number(node.getAttribute("x")));
    expect(new Set(positions).size).toBe(LEADS.length);

    // Bars grow leftward, so a longer bar puts its label further left.
    const descendingByValue = [...positions];
    expect(descendingByValue).toEqual([...positions].sort((a, b) => a - b));
  });

  it("keeps every label inside the chart rather than clipping at the edge", () => {
    const { valueLabels } = renderChart();

    for (const node of valueLabels) {
      const x = Number(node.getAttribute("x"));
      const text = node.textContent ?? "";
      expect(node.getAttribute("text-anchor")).toBe("end");

      // Anchored at the end, the text runs leftward from x. Approximate its
      // width generously and require it to clear the left edge.
      const approximateWidth = text.length * 9;
      expect(x - approximateWidth).toBeGreaterThan(0);
    }
  });
});
