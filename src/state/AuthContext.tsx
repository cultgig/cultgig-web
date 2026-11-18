import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { account, isAppwriteConfigured } from "../lib/appwrite";
import { sendOtp, verifyOtp } from "../lib/appwriteAuth";

export type ActiveWorkspaceMode = "client" | "artist";

export interface MarketplaceUser {
  id: string;
  email: string;
  displayName: string;
  city: string;
  emailVerified: boolean;
  canActAsClient: boolean;
  canActAsArtist: boolean;
  activeMode: ActiveWorkspaceMode;
  authMode: "appwrite" | "prototype_local";
}

interface AuthContextValue {
  user: MarketplaceUser | null;
  loading: boolean;
  isAppwriteConfigured: boolean;
  signInPrototype: (params: {
    email: string;
    displayName: string;
    city?: string;
    activeMode: ActiveWorkspaceMode;
    emailVerified?: boolean;
  }) => void;
  sendEmailVerificationOtp: (email: string) => Promise<{ userId: string; local: boolean }>;
  completeEmailOtpSignIn: (params: {
    userId: string;
    secret: string;
    local: boolean;
    email: string;
    displayName: string;
    activeMode: ActiveWorkspaceMode;
  }) => Promise<void>;
  switchWorkspaceMode: (mode: ActiveWorkspaceMode) => void;
  enableCapability: (capability: ActiveWorkspaceMode) => void;
  updateUserProfile: (patch: Partial<Pick<MarketplaceUser, "displayName" | "city">>) => void;
  logout: () => Promise<void>;
}

const STORAGE_KEY = "cultgig.auth.session.v1";

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): MarketplaceUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MarketplaceUser;
  } catch {
    return null;
  }
}

function writeStoredUser(user: MarketplaceUser | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota errors in restricted sandboxes
  }
}

export function AuthProviderRoot({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MarketplaceUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function hydrate() {
      if (isAppwriteConfigured) {
        try {
          const appwriteUser = await account.get();
          const stored = readStoredUser();
          if (active) {
            const hydrated: MarketplaceUser = {
              id: appwriteUser.$id,
              email: appwriteUser.email,
              displayName: appwriteUser.name || stored?.displayName || appwriteUser.email.split("@")[0],
              city: stored?.city || "Mumbai",
              emailVerified: Boolean(appwriteUser.emailVerification),
              canActAsClient: stored?.canActAsClient ?? true,
              canActAsArtist: stored?.canActAsArtist ?? true,
              activeMode: stored?.activeMode ?? "client",
              authMode: "appwrite",
            };
            setUser(hydrated);
            writeStoredUser(hydrated);
          }
          return;
        } catch {
          // Fall back to stored local prototype session if no Appwrite session is active
        }
      }
      if (active) {
        setUser(readStoredUser());
      }
    }
    hydrate().finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const signInPrototype = useCallback(
    (params: {
      email: string;
      displayName: string;
      city?: string;
      activeMode: ActiveWorkspaceMode;
      emailVerified?: boolean;
    }) => {
      const next: MarketplaceUser = {
        id: `proto-${params.email.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        email: params.email.trim(),
        displayName: params.displayName.trim() || params.email.split("@")[0],
        city: params.city?.trim() || "Mumbai",
        emailVerified: Boolean(params.emailVerified),
        canActAsClient: true,
        canActAsArtist: true,
        activeMode: params.activeMode,
        authMode: "prototype_local",
      };
      setUser(next);
      writeStoredUser(next);
    },
    []
  );

  const sendEmailVerificationOtp = useCallback(async (email: string) => {
    return sendOtp(email);
  }, []);

  const completeEmailOtpSignIn = useCallback(
    async (params: {
      userId: string;
      secret: string;
      local: boolean;
      email: string;
      displayName: string;
      activeMode: ActiveWorkspaceMode;
    }) => {
      await verifyOtp(params.userId, params.secret, params.local);
      const next: MarketplaceUser = {
        id: params.userId,
        email: params.email.trim(),
        displayName: params.displayName.trim() || params.email.split("@")[0],
        city: "Mumbai",
        emailVerified: true,
        canActAsClient: true,
        canActAsArtist: true,
        activeMode: params.activeMode,
        authMode: params.local ? "prototype_local" : "appwrite",
      };
      setUser(next);
      writeStoredUser(next);
    },
    []
  );

  const switchWorkspaceMode = useCallback((mode: ActiveWorkspaceMode) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: MarketplaceUser = {
        ...prev,
        activeMode: mode,
        canActAsClient: prev.canActAsClient || mode === "client",
        canActAsArtist: prev.canActAsArtist || mode === "artist",
      };
      writeStoredUser(updated);
      return updated;
    });
  }, []);

  const enableCapability = useCallback((capability: ActiveWorkspaceMode) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: MarketplaceUser = {
        ...prev,
        canActAsClient: prev.canActAsClient || capability === "client",
        canActAsArtist: prev.canActAsArtist || capability === "artist",
        activeMode: capability,
      };
      writeStoredUser(updated);
      return updated;
    });
  }, []);

  const updateUserProfile = useCallback(
    (patch: Partial<Pick<MarketplaceUser, "displayName" | "city">>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...patch };
        writeStoredUser(updated);
        return updated;
      });
    },
    []
  );

  const logout = useCallback(async () => {
    if (isAppwriteConfigured) {
      try {
        await account.deleteSession("current");
      } catch {
        // Ignore if session was local prototype
      }
    }
    setUser(null);
    writeStoredUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAppwriteConfigured,
        signInPrototype,
        sendEmailVerificationOtp,
        completeEmailOtpSignIn,
        switchWorkspaceMode,
        enableCapability,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() must be used inside <AuthProviderRoot>");
  return ctx;
}
