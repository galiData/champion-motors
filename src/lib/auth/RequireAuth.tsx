import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { ReactNode } from "react";

/** Gate for the protected application shell. Redirects to the login page. */
export function RequireAuth({ children }: { children: ReactNode }): React.ReactElement {
  const { isAuthenticated } = useCurrentUser();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
