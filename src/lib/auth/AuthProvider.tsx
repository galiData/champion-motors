import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import type { User } from "@/types/user";

/**
 * The signed-in employee used throughout the skeleton. Real authentication
 * replaces `signIn` with a network call; nothing else in the app changes.
 */
export const MOCK_USER: User = {
  id: "emp-3002",
  name: "אורי מזרחי",
  role: "יועץ מכירות בכיר",
  department: "sales",
  email: "uri.m@championmotors.co.il",
  homeLocationId: "loc-tlv",
  initials: "אמ",
};

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
  /** Starting state. Tests use this to render a signed-out tree. */
  initialUser?: User | null;
}

export function AuthProvider({
  children,
  initialUser = MOCK_USER,
}: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<User | null>(initialUser);

  const signIn = useCallback(() => setUser(MOCK_USER), []);
  const signOut = useCallback(() => setUser(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, signIn, signOut }),
    [user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
