// Single auth implementation switch. TEST/DEVELOPMENT ONLY until real auth exists.
import type { AuthProvider } from "./types";
import { mockAuthProvider } from "./mockAuthProvider";
export const authProvider: AuthProvider = mockAuthProvider;
export type { AuthUser, UserRole } from "./types";
