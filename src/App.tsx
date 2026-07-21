import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/app/routes";
import { AuthProvider } from "@/lib/auth/AuthProvider";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
