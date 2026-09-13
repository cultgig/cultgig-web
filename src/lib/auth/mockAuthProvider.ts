// TEST/DEVELOPMENT ONLY — no real authentication, verification, or network calls.
// Replace this implementation via ./index.ts when real auth is introduced.
import type { AuthProvider, AuthUser, UserRole } from "./types";
const STORAGE_KEY = "cultgig.mockAuth.__DEV_ONLY__";
const users: Record<UserRole, AuthUser> = {
  artist: { id: "mock-artist-1", role: "artist", displayName: "Rhea (Test Artist)" },
  business: { id: "mock-business-1", role: "business", displayName: "Cafe Zoe (Test Business)" },
};
function storedRole(): UserRole | null { const value = sessionStorage.getItem(STORAGE_KEY); return value === "artist" || value === "business" ? value : null; }
function saveRole(role: UserRole | null) { if (role) sessionStorage.setItem(STORAGE_KEY, role); else sessionStorage.removeItem(STORAGE_KEY); }
export const mockAuthProvider: AuthProvider = {
  async getCurrentUser() { const role = storedRole(); return role ? users[role] : null; },
  async loginAs(role) { saveRole(role); return users[role]; },
  async logout() { saveRole(null); },
  async switchRole(role) { saveRole(role); return users[role]; },
};
