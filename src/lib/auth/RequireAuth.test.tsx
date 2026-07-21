import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthProvider, MOCK_USER } from "@/lib/auth/AuthProvider";
import { RequireAuth } from "@/lib/auth/RequireAuth";
import type { User } from "@/types/user";

function renderProtected(initialUser: User | null) {
  return render(
    <AuthProvider initialUser={initialUser}>
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/login" element={<p>מסך כניסה</p>} />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <p>תוכן מוגן</p>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("RequireAuth", () => {
  it("redirects to the login page when signed out", () => {
    renderProtected(null);

    expect(screen.getByText("מסך כניסה")).toBeInTheDocument();
    expect(screen.queryByText("תוכן מוגן")).not.toBeInTheDocument();
  });

  it("renders its children when signed in", () => {
    renderProtected(MOCK_USER);

    expect(screen.getByText("תוכן מוגן")).toBeInTheDocument();
    expect(screen.queryByText("מסך כניסה")).not.toBeInTheDocument();
  });
});
