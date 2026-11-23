/**
 * Runtime configuration and readiness checks.
 *
 * Only public, non-secret values may be read here: anything prefixed VITE_ is bundled into the
 * browser. Server secrets (Appwrite API keys, SMTP passwords, payment keys, webhook secrets) belong
 * in Appwrite Function / server environment variables and must never be added as VITE_ variables.
 */

export type AppMode = "demo" | "production";

function readEnv(name: string): string {
  const value = (import.meta.env as Record<string, string | boolean | undefined>)[name];
  return typeof value === "string" ? value.trim() : "";
}

function resolveMode(): AppMode {
  const explicit = readEnv("VITE_APP_MODE").toLowerCase();
  if (explicit === "demo" || explicit === "production") return explicit;
  // Unset: local development defaults to demo; production builds must opt in explicitly.
  return import.meta.env.DEV ? "demo" : "production";
}

export const appConfig = {
  mode: resolveMode(),
  siteUrl: readEnv("VITE_SITE_URL") || "https://www.cultgig.com",
  appwrite: {
    endpoint: readEnv("VITE_APPWRITE_ENDPOINT"),
    projectId: readEnv("VITE_APPWRITE_PROJECT_ID"),
    databaseId: readEnv("VITE_APPWRITE_DATABASE_ID"),
    storageBucketId: readEnv("VITE_APPWRITE_STORAGE_BUCKET_ID"),
    collections: {
      users: readEnv("VITE_APPWRITE_USERS_COLLECTION_ID"),
      artistProfiles: readEnv("VITE_APPWRITE_ARTIST_PROFILES_COLLECTION_ID"),
      clientProfiles: readEnv("VITE_APPWRITE_CLIENT_PROFILES_COLLECTION_ID"),
      gigs: readEnv("VITE_APPWRITE_GIGS_COLLECTION_ID"),
      applications: readEnv("VITE_APPWRITE_APPLICATIONS_COLLECTION_ID"),
      conversations: readEnv("VITE_APPWRITE_CONVERSATIONS_COLLECTION_ID"),
      messages: readEnv("VITE_APPWRITE_MESSAGES_COLLECTION_ID"),
      proposals: readEnv("VITE_APPWRITE_PROPOSALS_COLLECTION_ID"),
      bookings: readEnv("VITE_APPWRITE_BOOKINGS_COLLECTION_ID"),
    },
  },
  googleOAuthEnabled: readEnv("VITE_GOOGLE_OAUTH_ENABLED") === "true",
  paymentsEnabled: readEnv("VITE_PAYMENTS_ENABLED") === "true",
} as const;

export const isDemoMode = appConfig.mode === "demo";

export interface ReadinessItem {
  id: string;
  label: string;
  status: "ready" | "missing" | "demo" | "blocked";
  detail: string;
}

/** Developer checklist shown at /system/readiness. Never marks provider features active without config. */
export function configurationReadiness(): ReadinessItem[] {
  const aw = appConfig.appwrite;
  const appwriteCore = Boolean(aw.endpoint && aw.projectId);
  const collectionIds = Object.values(aw.collections);
  const collectionsReady = collectionIds.every(Boolean) && Boolean(aw.databaseId);
  return [
    {
      id: "mode",
      label: "Application mode",
      status: isDemoMode ? "demo" : "ready",
      detail: isDemoMode
        ? "VITE_APP_MODE=demo — sample data and demo accounts stored in this browser. Not production."
        : "VITE_APP_MODE=production — requires a configured Appwrite backend.",
    },
    {
      id: "appwrite-core",
      label: "Appwrite endpoint and project",
      status: appwriteCore ? "ready" : isDemoMode ? "demo" : "missing",
      detail: appwriteCore ? `Endpoint ${aw.endpoint}` : "Set VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID.",
    },
    {
      id: "appwrite-collections",
      label: "Appwrite database and marketplace collections",
      status: collectionsReady ? "ready" : isDemoMode ? "demo" : "missing",
      detail: collectionsReady
        ? "All collection IDs present. Permissions and Functions must still be verified (docs/APPWRITE_SETUP.md)."
        : "Set VITE_APPWRITE_DATABASE_ID and every VITE_APPWRITE_*_COLLECTION_ID.",
    },
    {
      id: "storage",
      label: "Portfolio storage bucket",
      status: aw.storageBucketId ? "ready" : isDemoMode ? "demo" : "missing",
      detail: aw.storageBucketId ? "Bucket configured." : "Set VITE_APPWRITE_STORAGE_BUCKET_ID. Demo mode keeps uploads in this browser only.",
    },
    {
      id: "google",
      label: "Google sign-in",
      status: appConfig.googleOAuthEnabled && appwriteCore ? "ready" : "missing",
      detail: "Enable the Google provider in the Appwrite console, then set VITE_GOOGLE_OAUTH_ENABLED=true.",
    },
    {
      id: "smtp",
      label: "Transactional email (SMTP)",
      status: "missing",
      detail: "Configure SMTP in Appwrite (Settings → SMTP). Delivery must be tested before it is marked active.",
    },
    {
      id: "payments",
      label: "Marketplace payments",
      status: "blocked",
      detail: "No provider approved. Requires Razorpay Route or Cashfree Easy Split approval plus server-side order, webhook and transfer Functions.",
    },
  ];
}
