// TEST/DEVELOPMENT ONLY — this control is hard-gated from production builds.
import { useAuth } from "../../state/AuthContext";
export function DevRoleSwitcher() {
  const { user, loginAs, logout } = useAuth();
  if (!import.meta.env.DEV) return null;
  return <aside className="dev-role-switcher" aria-label="Test authentication controls"><strong>TEST / DEVELOPMENT ONLY</strong><span>{user ? `${user.role} — ${user.displayName}` : "Logged out"}</span><div><button onClick={() => loginAs("artist")}>Artist</button><button onClick={() => loginAs("business")}>Business</button><button onClick={logout}>Log out</button></div></aside>;
}
