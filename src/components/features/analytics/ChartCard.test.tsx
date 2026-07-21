import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ChartCard } from "@/components/features/analytics/ChartCard";

function renderCard() {
  return render(
    <ChartCard
      title="מסירות לפי חודש"
      description="מגמת המסירות בטווח הנבחר."
      table={{
        columns: ["חודש", "מסירות"],
        rows: [
          ["מאי", 498],
          ["יוני", 512],
        ],
      }}
    >
      <div data-testid="chart">תרשים</div>
    </ChartCard>,
  );
}

describe("ChartCard", () => {
  it("shows the chart and not the table by default", () => {
    renderCard();

    expect(screen.getByTestId("chart")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  /*
   * The table view is not a nicety — it is the relief channel required by the
   * sub-3:1 contrast of the Sky series, and the non-hover route to every value.
   * If this test goes red, the charts stop being accessible.
   */
  it("swaps to a table view carrying every value", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: "טבלה" }));

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("498")).toBeInTheDocument();
    expect(screen.getByText("512")).toBeInTheDocument();
    expect(screen.queryByTestId("chart")).not.toBeInTheDocument();
  });

  it("reports its toggle state to assistive technology", async () => {
    const user = userEvent.setup();
    renderCard();

    const toggle = screen.getByRole("button", { name: "טבלה" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);

    expect(screen.getByRole("button", { name: "תרשים" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
