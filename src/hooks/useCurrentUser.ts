import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "@/lib/auth/AuthProvider";

/** Access the signed-in employee. Throws outside an `AuthProvider`. */
export function useCurrentUser(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCurrentUser must be used inside an AuthProvider");
  }
  return context;
}
