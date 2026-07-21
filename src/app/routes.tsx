import { Route, Routes } from "react-router-dom";
import { ALL_NAV_ITEMS } from "@/app/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/lib/auth/RequireAuth";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

/** The route tree, generated from the navigation registry. */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        {ALL_NAV_ITEMS.flatMap((item) => {
          const routes = [
            <Route key={item.path} path={item.path} element={<item.Component />} />,
          ];
          if (item.detail) {
            routes.push(
              <Route
                key={item.detail.path}
                path={item.detail.path}
                element={<item.detail.Component />}
              />,
            );
          }
          return routes;
        })}

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
