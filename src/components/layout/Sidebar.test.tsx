import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { HUB_ITEM, NAV_SECTIONS } from "@/app/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

function renderSidebar() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Sidebar isOpen onNavigate={vi.fn()} />
    </MemoryRouter>,
  );
}

describe("Sidebar", () => {
  it("renders every section heading from the navigation registry", () => {
    renderSidebar();

    for (const section of NAV_SECTIONS) {
      expect(screen.getByRole("heading", { name: section.label })).toBeInTheDocument();
    }
  });

  it("renders a link for every navigation item, including the hub", () => {
    renderSidebar();

    const expected = [HUB_ITEM, ...NAV_SECTIONS.flatMap((section) => section.items)];

    for (const item of expected) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", item.path);
    }
  });

  it("marks the current route as the active page", () => {
    renderSidebar();

    expect(screen.getByRole("link", { name: HUB_ITEM.label })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
