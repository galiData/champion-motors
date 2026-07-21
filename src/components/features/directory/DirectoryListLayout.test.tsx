import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DirectoryListLayout } from "@/components/features/directory/DirectoryListLayout";
import { TableCell, TableRow } from "@/components/ui/table";
import type { AsyncState } from "@/hooks/useAsyncData";

interface Row {
  id: string;
  name: string;
}

function state(overrides: Partial<AsyncState<Row[]>>): AsyncState<Row[]> {
  return { data: [], isLoading: false, error: null, refetch: vi.fn(), ...overrides };
}

function renderLayout(listState: AsyncState<Row[]>) {
  return render(
    <DirectoryListLayout
      title="לקוחות"
      description="תיאור"
      state={listState}
      columns={["שם"]}
      matches={(row, query) => row.name.includes(query)}
      searchPlaceholder="חיפוש"
      emptyTitle="אין לקוחות להצגה"
      emptyDescription="ברגע שיתווספו לקוחות למערכת הם יופיעו כאן."
      renderRow={(row) => (
        <TableRow key={row.id}>
          <TableCell>{row.name}</TableCell>
        </TableRow>
      )}
    />,
  );
}

describe("DirectoryListLayout", () => {
  it("shows the Hebrew empty state when the list is empty", () => {
    renderLayout(state({ data: [] }));

    expect(screen.getByText("אין לקוחות להצגה")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("shows the error state with a retry action when loading failed", () => {
    renderLayout(state({ data: null, error: new Error("boom") }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "נסו שוב" })).toBeInTheDocument();
  });

  it("renders rows and a result count when data is present", () => {
    renderLayout(state({ data: [{ id: "1", name: "מיכל אברהמי" }] }));

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("מיכל אברהמי")).toBeInTheDocument();
    expect(screen.getByText("1 מתוך 1 רשומות")).toBeInTheDocument();
  });

  it("does not render the table while loading", () => {
    renderLayout(state({ data: null, isLoading: true }));

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByLabelText("טוען נתונים")).toBeInTheDocument();
  });
});
