// TEST/DEVELOPMENT ONLY auth contract. Future real authentication implements this.
export type UserRole = "artist" | "business";
export interface AuthUser { id: string; role: UserRole; displayName: string; }
export interface AuthProvider {
  getCurrentUser(): Promise<AuthUser | null>;
  loginAs(role: UserRole): Promise<AuthUser>;
  logout(): Promise<void>;
  switchRole(role: UserRole): Promise<AuthUser>;
}
