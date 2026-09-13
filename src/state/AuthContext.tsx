import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { authProvider, type AuthUser, type UserRole } from "../lib/auth";
type AuthContextValue = { user: AuthUser | null; loading: boolean; loginAs: (role: UserRole) => Promise<void>; logout: () => Promise<void>; switchRole: (role: UserRole) => Promise<void>; };
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProviderRoot({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { authProvider.getCurrentUser().then(setUser).finally(() => setLoading(false)); }, []);
  const loginAs = useCallback(async (role: UserRole) => setUser(await authProvider.loginAs(role)), []);
  const logout = useCallback(async () => { await authProvider.logout(); setUser(null); }, []);
  const switchRole = useCallback(async (role: UserRole) => setUser(await authProvider.switchRole(role)), []);
  return <AuthContext.Provider value={{ user, loading, loginAs, logout, switchRole }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth() must be used inside <AuthProviderRoot>"); return context; }
