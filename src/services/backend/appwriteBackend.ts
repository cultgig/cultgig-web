/**
 * PRODUCTION BACKEND (Appwrite).
 *
 * Authentication uses the real Appwrite Account API (email/password, email verification, password
 * recovery, Google OAuth). Marketplace data is NOT read or written from the browser directly:
 * privileged state changes (proposal acceptance, booking transitions, payments, application status)
 * must run in Appwrite Functions that enforce ownership and status rules server-side
 * (see docs/APPWRITE_SETUP.md). Until those Functions are deployed, every marketplace method fails
 * safely with a clear "not provisioned" error — it never falls back to demo data.
 */
import { Account, Client, ID, OAuthProvider, type Models } from "appwrite";
import { appConfig } from "../../config/env";
import { DomainError } from "../../domain/errors";
import type { UserAccount } from "../../types/marketplace";
import type { AuthApi, Backend, MarketplaceApi, MarketplaceSnapshot } from "./types";

function toAccount(user: Models.User<Models.Preferences>): UserAccount {
  const prefs = user.prefs as Partial<Pick<UserAccount, "roles" | "activeRole" | "onboarding" | "city" | "phone" | "avatarUrl">>;
  const roles = prefs.roles?.length ? prefs.roles : ["client" as const];
  return {
    id: user.$id,
    email: user.email,
    displayName: user.name || user.email.split("@")[0],
    phone: prefs.phone ?? user.phone ?? "",
    city: prefs.city ?? "",
    avatarUrl: prefs.avatarUrl ?? "",
    emailVerified: user.emailVerification,
    roles,
    activeRole: prefs.activeRole && roles.includes(prefs.activeRole) ? prefs.activeRole : roles[0],
    onboarding: prefs.onboarding ?? { artist: "not_started", client: "not_started" },
    authProvider: "appwrite",
    isSample: false,
    createdAt: user.$createdAt,
  };
}

function mapAppwriteError(error: unknown): never {
  const code = typeof error === "object" && error && "code" in error ? Number((error as { code: unknown }).code) : 0;
  if (code === 401) throw new DomainError("unauthenticated", "Email or password is incorrect, or your session has expired.");
  if (code === 409) throw new DomainError("duplicate", "An account with this email already exists. Sign in instead.");
  if (code === 429) throw new DomainError("conflict", "Too many attempts. Wait a minute and try again.");
  if (code === 400) throw new DomainError("invalid_input", "Some details weren't accepted. Check them and try again.");
  throw new DomainError("conflict", "We couldn't reach Cultgig right now. Check your connection and try again.");
}

const notProvisioned = () =>
  new DomainError(
    "not_configured",
    "The Cultgig marketplace backend isn't connected yet. Your account works, but marketplace features need the Appwrite collections and Functions described in docs/APPWRITE_SETUP.md.",
  );

export function createAppwriteBackend(): Backend {
  const { endpoint, projectId } = appConfig.appwrite;
  if (!endpoint || !projectId) {
    throw new DomainError("not_configured", "Appwrite isn't configured. Set VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID.");
  }
  const client = new Client().setEndpoint(endpoint).setProject(projectId);
  const account = new Account(client);
  const origin = typeof window !== "undefined" ? window.location.origin : appConfig.siteUrl;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  const auth: AuthApi = {
    provider: "appwrite",
    async getSessionUser() {
      try {
        return toAccount(await account.get());
      } catch {
        return null; // No session or expired session.
      }
    },
    async signUp({ email, password, displayName, role }) {
      try {
        await account.create({ userId: ID.unique(), email: email.trim(), password, name: displayName.trim() });
        await account.createEmailPasswordSession({ email: email.trim(), password });
        await account.updatePrefs({ prefs: { roles: [role], activeRole: role, onboarding: { artist: "not_started", client: "not_started" } } });
        await account.createVerification({ url: `${origin}/verify-email` });
        emit();
        return { user: toAccount(await account.get()) };
      } catch (error) {
        mapAppwriteError(error);
      }
    },
    async signIn(email, password) {
      try {
        await account.createEmailPasswordSession({ email: email.trim(), password });
        emit();
        return toAccount(await account.get());
      } catch (error) {
        mapAppwriteError(error);
      }
    },
    async signInWithGoogle() {
      if (!appConfig.googleOAuthEnabled) {
        throw new DomainError("not_configured", "Google sign-in isn't enabled yet.");
      }
      account.createOAuth2Session({ provider: OAuthProvider.Google, success: `${origin}/auth/callback`, failure: `${origin}/sign-in?error=oauth` });
    },
    async completeOAuth() {
      try {
        const user = toAccount(await account.get());
        emit();
        return user;
      } catch {
        throw new DomainError("unauthenticated", "Google sign-in didn't complete. Please try again.");
      }
    },
    async signOut() {
      try {
        await account.deleteSession({ sessionId: "current" });
      } catch {
        /* Session already gone. */
      }
      emit();
    },
    async requestEmailVerification() {
      try {
        await account.createVerification({ url: `${origin}/verify-email` });
        return {};
      } catch (error) {
        mapAppwriteError(error);
      }
    },
    async confirmEmailVerification({ userId, secret }) {
      if (!userId || !secret) throw new DomainError("invalid_input", "This verification link is incomplete. Request a new one.");
      try {
        await account.updateVerification({ userId, secret });
        return toAccount(await account.get());
      } catch (error) {
        mapAppwriteError(error);
      }
    },
    async requestPasswordReset(email) {
      try {
        await account.createRecovery({ email: email.trim(), url: `${origin}/reset-password` });
      } catch {
        /* Same response whether or not the account exists. */
      }
      return {};
    },
    async resetPassword({ userId, secret, password }) {
      if (!userId || !secret) throw new DomainError("invalid_input", "This reset link is incomplete. Request a new one.");
      try {
        await account.updateRecovery({ userId, secret, password });
      } catch (error) {
        mapAppwriteError(error);
      }
    },
  };

  const reject = async (): Promise<never> => {
    throw notProvisioned();
  };

  const market: MarketplaceApi = {
    provider: "appwrite",
    async snapshot(): Promise<MarketplaceSnapshot> {
      const viewer = await auth.getSessionUser();
      // Public data and viewer-scoped data load from Appwrite Functions once provisioned.
      return {
        viewer,
        settings: null,
        artists: [],
        myArtistProfile: null,
        myClientProfile: null,
        gigs: [],
        applications: [],
        conversations: [],
        bookings: [],
        notifications: [],
        savedArtistIds: [],
        reviews: [],
        supportTickets: [],
      };
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async updateAccount(patch) {
      try {
        if (patch.displayName) await account.updateName({ name: patch.displayName.trim() });
        const current = await account.getPrefs();
        await account.updatePrefs({ prefs: { ...current, ...(patch.city !== undefined ? { city: patch.city } : {}), ...(patch.phone !== undefined ? { phone: patch.phone } : {}) } });
        emit();
      } catch (error) {
        mapAppwriteError(error);
      }
    },
    async setActiveRole(role) {
      try {
        const current = await account.getPrefs();
        const roles = Array.from(new Set([...(Array.isArray(current.roles) ? current.roles : []), role]));
        await account.updatePrefs({ prefs: { ...current, roles, activeRole: role } });
        emit();
      } catch (error) {
        mapAppwriteError(error);
      }
    },
    updateSettings: reject,
    requestDeactivation: reject,
    saveArtistOnboarding: reject,
    saveClientOnboarding: reject,
    updateArtistProfile: reject,
    upsertServicePackage: reject,
    deleteServicePackage: reject,
    addPortfolioItem: reject,
    updatePortfolioItem: reject,
    removePortfolioItem: reject,
    reorderPortfolio: reject,
    setUnavailableDates: reject,
    toggleSavedArtist: reject,
    saveGig: reject,
    setGigStatus: reject,
    applyToGig: reject,
    withdrawApplication: reject,
    setApplicationStatus: reject,
    openApplicationConversation: reject,
    startInquiry: reject,
    sendMessage: reject,
    markConversationRead: async () => undefined,
    sendProposal: reject,
    respondToProposal: reject,
    withdrawProposal: reject,
    transitionBooking: reject,
    async confirmBookingWithoutPayment() {
      throw new DomainError("forbidden", "Bookings are confirmed only after a verified payment.");
    },
    async createPaymentOrder() {
      throw new DomainError("not_configured", "Online payment isn't available yet.");
    },
    markNotificationRead: reject,
    markAllNotificationsRead: reject,
    submitReview: reject,
    report: reject,
    blockUser: reject,
    createSupportTicket: reject,
  };

  return { auth, market };
}
