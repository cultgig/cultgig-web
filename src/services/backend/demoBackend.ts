/**
 * DEMO BACKEND — browser-local, single-device simulation of the Cultgig server.
 *
 * It is NOT production authentication or storage. It exists so the full marketplace can be tested
 * before Appwrite, OAuth, SMTP and payments are configured. It deliberately behaves like a trusted
 * server: every mutation re-reads the persisted database, checks the signed-in user, enforces the
 * domain rules in src/domain, and returns only data the viewer may see.
 *
 * What it never does: send email, collect or simulate a successful payment, or claim to be secure.
 */
import { DEMO_DATA_VERSION, createDemoSeed, defaultSettings, type DemoDatabase } from "../../data/demoSeed";
import { assertTransition, BOOKING_STATUS_LABELS, bookingRoleFor, type BookingActor } from "../../domain/bookings";
import { DomainError } from "../../domain/errors";
import { assertApplicationTransition, assertCanApply, assertGigTransition, validateGigForPublish } from "../../domain/gigs";
import { formatPaise, isValidPaise } from "../../domain/money";
import {
  createProposal,
  participantRole,
  respondToProposal as respondRule,
  withdrawProposal as withdrawRule,
  type ProposalActor,
} from "../../domain/proposals";
import type {
  ArtistProfile,
  BookingRecord,
  ChatMessage,
  ConversationThread,
  MarketplaceNotification,
  MarketplaceRole,
  NotificationKind,
  UserAccount,
} from "../../types/marketplace";
import type { KeyValueStore } from "../storage";
import type { AuthApi, Backend, MarketplaceApi, MarketplaceSnapshot } from "./types";

export const DEMO_DB_KEY = "cultgig.demo.db";
export const DEMO_SESSION_KEY = "cultgig.demo.session";

export interface DemoBackendOptions {
  store: KeyValueStore;
  clock?: () => Date;
  idFactory?: (prefix: string) => string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function defaultId(prefix: string): string {
  const rand = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 12) : Math.random().toString(36).slice(2, 14);
  return `${prefix}-${rand}`;
}

async function sha256(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function slugify(text: string): string {
  return text.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "artist";
}

function clean(text: string, max = 4000): string {
  return text.replace(/\u0000/g, "").trim().slice(0, max);
}

export function createDemoBackend({ store, clock = () => new Date(), idFactory = defaultId }: DemoBackendOptions): Backend {
  const listeners = new Set<() => void>();
  const now = () => clock().toISOString();
  const today = () => clock().toISOString().slice(0, 10);
  const id = idFactory;

  function emit() {
    listeners.forEach((l) => l());
  }

  function load(): DemoDatabase {
    const existing = store.read<DemoDatabase>(DEMO_DB_KEY);
    if (existing && existing.version === DEMO_DATA_VERSION) return existing;
    const seeded = createDemoSeed(clock());
    store.write(DEMO_DB_KEY, seeded);
    return seeded;
  }

  function save(db: DemoDatabase) {
    store.write(DEMO_DB_KEY, db);
  }

  function sessionUserId(): string | null {
    return store.read<{ userId: string }>(DEMO_SESSION_KEY)?.userId ?? null;
  }

  function setSession(userId: string | null) {
    if (userId) store.write(DEMO_SESSION_KEY, { userId });
    else store.remove(DEMO_SESSION_KEY);
  }

  function viewerFrom(db: DemoDatabase): UserAccount | null {
    const uid = sessionUserId();
    return uid ? db.users.find((u) => u.id === uid) ?? null : null;
  }

  /** Run a mutation as the signed-in user against the latest persisted database. */
  function mutate<T>(fn: (db: DemoDatabase, viewer: UserAccount) => T): T {
    const db = load();
    const viewer = viewerFrom(db);
    if (!viewer) throw new DomainError("unauthenticated", "Please sign in to continue.");
    const result = fn(db, viewer);
    save(db);
    emit();
    return result;
  }

  function notify(db: DemoDatabase, userId: string, kind: NotificationKind, title: string, detail: string, path: string) {
    const n: MarketplaceNotification = { id: id("ntf"), userId, kind, title, detail, path, read: false, createdAt: now() };
    db.notifications.unshift(n);
  }

  function audit(db: DemoDatabase, actorUserId: string | null, action: string, entityType: string, entityId: string, detail = "") {
    db.auditEvents.unshift({ id: id("audit"), actorUserId, action, entityType, entityId, detail, createdAt: now() });
    if (db.auditEvents.length > 500) db.auditEvents.length = 500;
  }

  function ensureRole(viewer: UserAccount, role: MarketplaceRole) {
    if (!viewer.roles.includes(role)) viewer.roles = [...viewer.roles, role];
  }

  function ownArtistProfile(db: DemoDatabase, viewer: UserAccount): ArtistProfile {
    const profile = db.artistProfiles.find((p) => p.ownerUserId === viewer.id);
    if (!profile) throw new DomainError("not_found", "Create your artist profile first.");
    return profile;
  }

  function findConversation(db: DemoDatabase, conversationId: string, viewer: UserAccount): ConversationThread {
    const thread = db.conversations.find((c) => c.id === conversationId);
    // Same error for missing and forbidden so IDs can't be probed.
    if (!thread || !participantRole(thread, viewer.id)) throw new DomainError("not_found", "Conversation not found.");
    return thread;
  }

  function findBooking(db: DemoDatabase, bookingId: string, viewer: UserAccount): BookingRecord {
    const booking = db.bookings.find((b) => b.id === bookingId);
    if (!booking || !bookingRoleFor(booking, viewer.id)) throw new DomainError("not_found", "Booking not found.");
    return booking;
  }

  function actorFor(thread: ConversationThread, viewer: UserAccount): ProposalActor {
    const role = participantRole(thread, viewer.id);
    if (!role) throw new DomainError("forbidden", "You are not a participant in this conversation.");
    return { userId: viewer.id, role, name: viewer.displayName };
  }

  function systemMessage(thread: ConversationThread, body: string, proposalId: string | null = null): ChatMessage {
    const msg: ChatMessage = { id: id("msg"), conversationId: thread.id, senderUserId: null, senderRole: "system", senderName: "Cultgig", body, proposalId, createdAt: now() };
    thread.messages.push(msg);
    thread.updatedAt = msg.createdAt;
    return msg;
  }

  function otherParticipant(thread: ConversationThread, viewerId: string): string {
    return thread.clientUserId === viewerId ? thread.artistUserId : thread.clientUserId;
  }

  function isBlocked(db: DemoDatabase, byUserId: string, targetUserId: string): boolean {
    return db.settings.find((s) => s.userId === byUserId)?.blockedUserIds.includes(targetUserId) ?? false;
  }

  /* ---------------------------------------------------------------- */
  /* Snapshot (server-side visibility rules)                          */
  /* ---------------------------------------------------------------- */

  function buildSnapshot(db: DemoDatabase): MarketplaceSnapshot {
    const viewer = viewerFrom(db);
    const hiddenOwners = new Set(
      db.settings.filter((s) => s.profileVisibility === "hidden" || s.deactivationRequestedAt).map((s) => s.userId),
    );
    const publicArtists = db.artistProfiles.filter((a) => a.published && !hiddenOwners.has(a.ownerUserId));
    const myArtistProfile = viewer ? db.artistProfiles.find((a) => a.ownerUserId === viewer.id) ?? null : null;
    const artists = myArtistProfile && !publicArtists.includes(myArtistProfile) ? [...publicArtists, myArtistProfile] : publicArtists;
    const publishedReviews = db.reviews.filter((r) => r.status === "published");

    if (!viewer) {
      return {
        viewer: null,
        settings: null,
        artists,
        myArtistProfile: null,
        myClientProfile: null,
        gigs: db.gigs.filter((g) => g.status === "open"),
        applications: [],
        conversations: [],
        bookings: [],
        notifications: [],
        savedArtistIds: [],
        reviews: publishedReviews,
        supportTickets: [],
      };
    }

    const myGigIds = new Set(db.gigs.filter((g) => g.clientId === viewer.id).map((g) => g.id));
    return {
      viewer,
      settings: db.settings.find((s) => s.userId === viewer.id) ?? defaultSettings(viewer.id),
      artists,
      myArtistProfile,
      myClientProfile: db.clientProfiles.find((c) => c.userId === viewer.id) ?? null,
      gigs: db.gigs.filter((g) => g.status === "open" || g.clientId === viewer.id),
      applications: db.applications.filter((a) => a.artistUserId === viewer.id || myGigIds.has(a.gigId)),
      conversations: db.conversations
        .filter((c) => c.clientUserId === viewer.id || c.artistUserId === viewer.id)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      bookings: db.bookings
        .filter((b) => b.clientUserId === viewer.id || b.artistUserId === viewer.id)
        .sort((a, b) => a.eventDate.localeCompare(b.eventDate)),
      notifications: db.notifications.filter((n) => n.userId === viewer.id).slice(0, 100),
      savedArtistIds: db.savedArtists.filter((s) => s.userId === viewer.id).map((s) => s.artistProfileId),
      reviews: publishedReviews,
      supportTickets: db.supportTickets.filter((t) => t.userId === viewer.id),
    };
  }

  /* ---------------------------------------------------------------- */
  /* Auth                                                             */
  /* ---------------------------------------------------------------- */

  function issueCode(db: DemoDatabase, userId: string, purpose: "verify_email" | "reset_password"): string {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    db.pendingCodes = db.pendingCodes.filter((c) => !(c.userId === userId && c.purpose === purpose));
    db.pendingCodes.push({ userId, purpose, code, expiresAt: new Date(clock().getTime() + 15 * 60 * 1000).toISOString() });
    return code;
  }

  function consumeCode(db: DemoDatabase, userId: string, purpose: "verify_email" | "reset_password", code: string) {
    const entry = db.pendingCodes.find((c) => c.userId === userId && c.purpose === purpose);
    if (!entry || entry.code !== code.trim()) throw new DomainError("invalid_input", "That code isn't right. Check it and try again.");
    if (entry.expiresAt < now()) throw new DomainError("expired", "That code has expired. Request a new one.");
    db.pendingCodes = db.pendingCodes.filter((c) => c !== entry);
  }

  const auth: AuthApi = {
    provider: "demo",
    async getSessionUser() {
      return viewerFrom(load());
    },
    async signUp({ email, password, displayName, role }) {
      const normalized = email.trim().toLowerCase();
      if (!EMAIL_RE.test(normalized)) throw new DomainError("invalid_input", "Enter a valid email address.");
      if (password.length < 8) throw new DomainError("invalid_input", "Use at least 8 characters for your password.");
      if (!displayName.trim()) throw new DomainError("invalid_input", "Enter your name.");
      const db = load();
      if (db.users.some((u) => u.email.toLowerCase() === normalized)) {
        throw new DomainError("duplicate", "An account with this email already exists. Sign in instead.");
      }
      const salt = id("salt");
      const user: UserAccount = {
        id: id("user"),
        email: normalized,
        displayName: clean(displayName, 80),
        phone: "",
        city: "",
        avatarUrl: "",
        emailVerified: false,
        roles: [role],
        activeRole: role,
        onboarding: { artist: "not_started", client: "not_started" },
        authProvider: "demo",
        isSample: false,
        createdAt: now(),
      };
      db.users.push(user);
      db.credentials[user.id] = { salt, hash: await sha256(`${salt}:${password}`) };
      db.settings.push(defaultSettings(user.id));
      const code = issueCode(db, user.id, "verify_email");
      audit(db, user.id, "account.created", "user", user.id);
      save(db);
      setSession(user.id);
      emit();
      return { user, demoVerificationCode: code };
    },
    async signIn(email, password) {
      const db = load();
      const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      const cred = user ? db.credentials[user.id] : undefined;
      const generic = new DomainError("unauthenticated", "Email or password is incorrect.");
      if (!user) throw generic;
      if (!cred) {
        throw new DomainError("unauthenticated", "This is a demo account. Use the one-click demo sign-in below.");
      }
      if ((await sha256(`${cred.salt}:${password}`)) !== cred.hash) throw generic;
      setSession(user.id);
      emit();
      return user;
    },
    async signInWithGoogle() {
      throw new DomainError("not_configured", "Google sign-in isn't available in demo mode. It activates once Google OAuth is configured in Appwrite.");
    },
    async completeOAuth() {
      throw new DomainError("not_configured", "Google sign-in isn't available in demo mode.");
    },
    async signOut() {
      setSession(null);
      emit();
    },
    async requestEmailVerification() {
      return mutate((db, viewer) => ({ demoCode: issueCode(db, viewer.id, "verify_email") }));
    },
    async confirmEmailVerification({ code }) {
      return mutate((db, viewer) => {
        consumeCode(db, viewer.id, "verify_email", code ?? "");
        viewer.emailVerified = true;
        audit(db, viewer.id, "account.email_verified", "user", viewer.id);
        return { ...viewer };
      });
    },
    async requestPasswordReset(email) {
      const db = load();
      const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      // Same response whether or not the account exists (no account enumeration).
      if (!user || !db.credentials[user.id]) return {};
      const code = issueCode(db, user.id, "reset_password");
      save(db);
      return { demoCode: code };
    },
    async resetPassword({ email, code, password }) {
      if (password.length < 8) throw new DomainError("invalid_input", "Use at least 8 characters for your password.");
      const db = load();
      const user = db.users.find((u) => u.email.toLowerCase() === (email ?? "").trim().toLowerCase());
      if (!user) throw new DomainError("invalid_input", "That code isn't right. Check it and try again.");
      consumeCode(db, user.id, "reset_password", code ?? "");
      const salt = id("salt");
      db.credentials[user.id] = { salt, hash: await sha256(`${salt}:${password}`) };
      audit(db, user.id, "account.password_reset", "user", user.id);
      save(db);
    },
    async signInAsDemoUser(userId) {
      const db = load();
      const user = db.users.find((u) => u.id === userId && u.isSample);
      if (!user) throw new DomainError("not_found", "That demo account doesn't exist. Reset the demo data and try again.");
      setSession(user.id);
      emit();
      return user;
    },
  };

  /* ---------------------------------------------------------------- */
  /* Marketplace                                                      */
  /* ---------------------------------------------------------------- */

  const market: MarketplaceApi = {
    provider: "demo",

    async snapshot() {
      return buildSnapshot(load());
    },

    subscribe(listener) {
      listeners.add(listener);
      const offExternal = store.subscribeExternal(DEMO_DB_KEY, listener);
      return () => {
        listeners.delete(listener);
        offExternal();
      };
    },

    async resetDemoData() {
      const keepSession = sessionUserId();
      const seeded = createDemoSeed(clock());
      save(seeded);
      if (keepSession && !seeded.users.some((u) => u.id === keepSession)) setSession(null);
      emit();
    },

    /* Account ------------------------------------------------------ */

    async updateAccount(patch) {
      mutate((db, viewer) => {
        if (patch.displayName !== undefined) {
          if (!patch.displayName.trim()) throw new DomainError("invalid_input", "Your name can't be empty.");
          viewer.displayName = clean(patch.displayName, 80);
        }
        if (patch.phone !== undefined) viewer.phone = clean(patch.phone, 20);
        if (patch.city !== undefined) viewer.city = clean(patch.city, 60);
        if (patch.avatarUrl !== undefined) viewer.avatarUrl = patch.avatarUrl;
        audit(db, viewer.id, "account.updated", "user", viewer.id);
      });
    },

    async setActiveRole(role) {
      mutate((_db, viewer) => {
        ensureRole(viewer, role);
        viewer.activeRole = role;
      });
    },

    async updateSettings(patch) {
      mutate((db, viewer) => {
        const idx = db.settings.findIndex((s) => s.userId === viewer.id);
        const current = idx >= 0 ? db.settings[idx] : defaultSettings(viewer.id);
        const next = { ...current, ...patch, notifications: { ...current.notifications, ...(patch.notifications ?? {}) }, userId: viewer.id };
        if (idx >= 0) db.settings[idx] = next;
        else db.settings.push(next);
      });
    },

    async requestDeactivation() {
      mutate((db, viewer) => {
        const s = db.settings.find((x) => x.userId === viewer.id);
        if (s) s.deactivationRequestedAt = now();
        audit(db, viewer.id, "account.deactivation_requested", "user", viewer.id);
      });
    },

    /* Onboarding --------------------------------------------------- */

    async saveArtistOnboarding(input, complete) {
      mutate((db, viewer) => {
        const { personal, identity, services, portfolio, availability } = input;
        if (complete) {
          if (!identity.displayName.trim()) throw new DomainError("invalid_input", "Add your artist or team name.");
          if (identity.bio.trim().length < 40) throw new DomainError("invalid_input", "Write a bio of at least 40 characters.");
          if (!personal.city.trim()) throw new DomainError("invalid_input", "Add your city.");
          if (services.length === 0) throw new DomainError("invalid_input", "Add at least one service.");
        }
        viewer.displayName = clean(personal.displayName || viewer.displayName, 80);
        viewer.phone = clean(personal.phone, 20);
        viewer.city = clean(personal.city, 60);
        if (personal.avatarUrl) viewer.avatarUrl = personal.avatarUrl;
        ensureRole(viewer, "artist");
        viewer.activeRole = "artist";
        viewer.onboarding = { ...viewer.onboarding, artist: complete ? "complete" : "draft" };

        const priced = services.map((s) => s.priceInr).filter((p): p is number => typeof p === "number" && p > 0);
        const existing = db.artistProfiles.find((p) => p.ownerUserId === viewer.id);
        const fields = {
          displayName: clean(identity.displayName || viewer.displayName, 80),
          tagline: clean(identity.tagline, 140),
          primaryCategory: identity.primaryCategory,
          secondaryCategories: identity.secondaryCategories.filter((c) => c !== identity.primaryCategory).slice(0, 4),
          artistFormat: identity.artistFormat,
          experienceYears: Math.max(0, Math.min(60, Math.round(identity.experienceYears))),
          languages: identity.languages.map((l) => clean(l, 30)).filter(Boolean),
          bio: clean(identity.bio, 2000),
          city: viewer.city,
          packages: services,
          portfolio,
          pricingMode: priced.length ? services[0].pricingMode : ("quote_required" as const),
          startingPriceInr: priced.length ? Math.min(...priced) : null,
          priceMaxInr: priced.length > 1 ? Math.max(...priced) : null,
          unavailableDates: [...new Set(availability.unavailableDates)].sort(),
          travelRadiusKm: Math.max(0, Math.round(availability.travelRadiusKm)),
          travelCities: availability.travelCities.map((c) => clean(c, 40)).filter(Boolean),
          workingMode: availability.workingMode,
          equipmentNotes: clean(availability.equipmentNotes, 600),
          avatarUrl: viewer.avatarUrl,
          avatarAlt: `${identity.displayName || viewer.displayName}, profile photo`,
          coverUrl: portfolio.find((p) => p.type === "image")?.mediaUrl ?? viewer.avatarUrl,
          coverAlt: portfolio.find((p) => p.type === "image")?.title ?? "",
          published: complete,
          updatedAt: now(),
        };
        if (existing) {
          Object.assign(existing, fields);
        } else {
          const profileId = id("artist");
          db.artistProfiles.push({
            ...fields,
            id: profileId,
            ownerUserId: viewer.id,
            slug: `${slugify(fields.displayName)}-${profileId.slice(-4)}`,
            isSample: false,
            createdAt: now(),
          });
        }
        audit(db, viewer.id, complete ? "artist.onboarding_completed" : "artist.onboarding_draft_saved", "artistProfile", viewer.id);
      });
    },

    async saveClientOnboarding(input, complete) {
      mutate((db, viewer) => {
        if (complete && !input.personal.city.trim()) throw new DomainError("invalid_input", "Add your city.");
        if (complete && input.profile.accountType !== "individual" && !input.profile.organisationName.trim()) {
          throw new DomainError("invalid_input", "Add your organisation's name.");
        }
        viewer.displayName = clean(input.personal.displayName || viewer.displayName, 80);
        viewer.phone = clean(input.personal.phone, 20);
        viewer.city = clean(input.personal.city, 60);
        ensureRole(viewer, "client");
        viewer.activeRole = "client";
        viewer.onboarding = { ...viewer.onboarding, client: complete ? "complete" : "draft" };
        const profile = {
          ...input.profile,
          organisationName: clean(input.profile.organisationName, 120),
          organisationRole: clean(input.profile.organisationRole, 80),
          website: clean(input.profile.website, 200),
          userId: viewer.id,
          updatedAt: now(),
        };
        const idx = db.clientProfiles.findIndex((c) => c.userId === viewer.id);
        if (idx >= 0) db.clientProfiles[idx] = profile;
        else db.clientProfiles.push(profile);
      });
    },

    /* Artist profile ----------------------------------------------- */

    async updateArtistProfile(patch) {
      mutate((db, viewer) => {
        const profile = ownArtistProfile(db, viewer);
        if (patch.displayName !== undefined && !patch.displayName.trim()) throw new DomainError("invalid_input", "Your artist name can't be empty.");
        Object.assign(profile, patch, { updatedAt: now() });
      });
    },

    async upsertServicePackage(pkg) {
      mutate((db, viewer) => {
        const profile = ownArtistProfile(db, viewer);
        if (!pkg.title.trim()) throw new DomainError("invalid_input", "Give the service a name.");
        if (pkg.pricingMode !== "quote_required" && !(pkg.priceInr && pkg.priceInr > 0)) {
          throw new DomainError("invalid_input", "Add a price, or choose quotation-based pricing.");
        }
        const next = { ...pkg, priceInr: pkg.pricingMode === "quote_required" ? null : pkg.priceInr };
        const idx = profile.packages.findIndex((p) => p.id === pkg.id);
        if (idx >= 0) profile.packages[idx] = next;
        else profile.packages.push({ ...next, id: pkg.id || id("pkg") });
        const priced = profile.packages.map((p) => p.priceInr).filter((p): p is number => typeof p === "number");
        profile.startingPriceInr = priced.length ? Math.min(...priced) : null;
        profile.priceMaxInr = priced.length > 1 ? Math.max(...priced) : null;
        profile.updatedAt = now();
      });
    },

    async deleteServicePackage(packageId) {
      mutate((db, viewer) => {
        const profile = ownArtistProfile(db, viewer);
        profile.packages = profile.packages.filter((p) => p.id !== packageId);
        profile.updatedAt = now();
      });
    },

    async addPortfolioItem(item) {
      mutate((db, viewer) => {
        const profile = ownArtistProfile(db, viewer);
        if (!item.ownershipConfirmed) throw new DomainError("invalid_input", "Confirm you own or have permission to share this work.");
        if (profile.portfolio.length >= 30) throw new DomainError("invalid_input", "You can show up to 30 portfolio items.");
        profile.portfolio.push({ ...item, title: clean(item.title, 120), caption: clean(item.caption, 600), id: id("pf") });
        profile.updatedAt = now();
      });
    },

    async updatePortfolioItem(itemId, patch) {
      mutate((db, viewer) => {
        const profile = ownArtistProfile(db, viewer);
        const item = profile.portfolio.find((p) => p.id === itemId);
        if (!item) throw new DomainError("not_found", "Portfolio item not found.");
        Object.assign(item, patch);
        profile.updatedAt = now();
      });
    },

    async removePortfolioItem(itemId) {
      mutate((db, viewer) => {
        const profile = ownArtistProfile(db, viewer);
        profile.portfolio = profile.portfolio.filter((p) => p.id !== itemId);
        profile.updatedAt = now();
      });
    },

    async reorderPortfolio(itemIds) {
      mutate((db, viewer) => {
        const profile = ownArtistProfile(db, viewer);
        const byId = new Map(profile.portfolio.map((p) => [p.id, p]));
        const ordered = itemIds.map((i) => byId.get(i)).filter((p): p is NonNullable<typeof p> => Boolean(p));
        if (ordered.length !== profile.portfolio.length) throw new DomainError("conflict", "Your portfolio changed. Refresh and try again.");
        profile.portfolio = ordered;
        profile.updatedAt = now();
      });
    },

    async setUnavailableDates(dates) {
      mutate((db, viewer) => {
        const profile = ownArtistProfile(db, viewer);
        profile.unavailableDates = [...new Set(dates)].filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
        profile.updatedAt = now();
      });
    },

    /* Client ------------------------------------------------------- */

    async toggleSavedArtist(artistProfileId) {
      return mutate((db, viewer) => {
        if (!db.artistProfiles.some((a) => a.id === artistProfileId)) throw new DomainError("not_found", "Artist not found.");
        const existing = db.savedArtists.findIndex((s) => s.userId === viewer.id && s.artistProfileId === artistProfileId);
        if (existing >= 0) {
          db.savedArtists.splice(existing, 1);
          return false;
        }
        db.savedArtists.push({ userId: viewer.id, artistProfileId });
        return true;
      });
    },

    /* Gigs --------------------------------------------------------- */

    async saveGig(input, { gigId, publish }) {
      return mutate((db, viewer) => {
        ensureRole(viewer, "client");
        if (publish) {
          const problems = validateGigForPublish(input, today());
          if (problems.length) throw new DomainError("invalid_input", problems[0]);
        }
        const client = db.clientProfiles.find((c) => c.userId === viewer.id);
        const sanitized = {
          ...input,
          title: clean(input.title, 140),
          description: clean(input.description, 4000),
          requirements: clean(input.requirements, 2000),
          deliverables: clean(input.deliverables, 2000),
          specialInstructions: clean(input.specialInstructions, 2000),
          references: clean(input.references, 1000),
          equipmentAndSpaceNotes: clean(input.equipmentAndSpaceNotes, 1000),
          artistsNeeded: Math.max(1, Math.min(50, Math.round(input.artistsNeeded))),
        };
        if (gigId) {
          const gig = db.gigs.find((g) => g.id === gigId);
          if (!gig || gig.clientId !== viewer.id) throw new DomainError("not_found", "Gig not found.");
          const status = publish && gig.status === "draft" ? "open" : gig.status;
          Object.assign(gig, sanitized, { status, updatedAt: now() });
          audit(db, viewer.id, "gig.updated", "gig", gig.id);
          return { ...gig };
        }
        const gig = {
          ...sanitized,
          status: publish ? ("open" as const) : ("draft" as const),
          id: id("gig"),
          isSample: false,
          clientId: viewer.id,
          clientDisplayName: client?.organisationName || viewer.displayName,
          clientType: client?.accountType ?? "individual",
          createdAt: now(),
          updatedAt: now(),
        };
        db.gigs.unshift(gig);
        audit(db, viewer.id, publish ? "gig.published" : "gig.draft_created", "gig", gig.id);
        return { ...gig };
      });
    },

    async setGigStatus(gigId, status) {
      mutate((db, viewer) => {
        const gig = db.gigs.find((g) => g.id === gigId);
        if (!gig || gig.clientId !== viewer.id) throw new DomainError("not_found", "Gig not found.");
        assertGigTransition(gig.status, status);
        if (status === "open") {
          const problems = validateGigForPublish(gig, today());
          if (problems.length) throw new DomainError("invalid_input", problems[0]);
        }
        gig.status = status;
        gig.updatedAt = now();
        audit(db, viewer.id, `gig.${status}`, "gig", gig.id);
      });
    },

    /* Applications ------------------------------------------------- */

    async applyToGig(input) {
      return mutate((db, viewer) => {
        const profile = ownArtistProfile(db, viewer);
        if (!profile.published) throw new DomainError("invalid_transition", "Finish your artist profile before applying to gigs.");
        const gig = db.gigs.find((g) => g.id === input.gigId);
        if (!gig) throw new DomainError("not_found", "Gig not found.");
        assertCanApply({ gig, artistProfileId: profile.id, artistUserId: viewer.id, existing: db.applications, today: today() });
        if (!isValidPaise(input.quotedAmountPaise)) throw new DomainError("invalid_input", "Enter your quote.");
        if (input.message.trim().length < 20) throw new DomainError("invalid_input", "Write a message of at least 20 characters.");
        if (!input.availabilityConfirmed) throw new DomainError("invalid_input", "Confirm you're available on the event date.");
        if (input.validUntil < today()) throw new DomainError("invalid_input", "The quote validity date can't be in the past.");
        const portfolioIds = new Set(profile.portfolio.map((p) => p.id));
        const app = {
          ...input,
          message: clean(input.message, 3000),
          scopeSummary: clean(input.scopeSummary, 2000),
          equipmentNotes: clean(input.equipmentNotes, 1000),
          portfolioItemIds: input.portfolioItemIds.filter((p) => portfolioIds.has(p)),
          travelCostPaise: Math.max(0, Math.round(input.travelCostPaise)),
          id: id("app"),
          artistProfileId: profile.id,
          artistUserId: viewer.id,
          status: "submitted" as const,
          conversationId: null,
          createdAt: now(),
          updatedAt: now(),
        };
        db.applications.unshift(app);
        notify(db, gig.clientId, "application", `New application from ${profile.displayName}`, `${gig.title} · quote ${formatPaise(app.quotedAmountPaise)}`, `/client/gigs/${gig.id}`);
        audit(db, viewer.id, "application.submitted", "application", app.id);
        return { ...app };
      });
    },

    async withdrawApplication(applicationId) {
      mutate((db, viewer) => {
        const app = db.applications.find((a) => a.id === applicationId);
        if (!app || app.artistUserId !== viewer.id) throw new DomainError("not_found", "Application not found.");
        assertApplicationTransition(app.status, "withdrawn", "artist");
        app.status = "withdrawn";
        app.updatedAt = now();
        const gig = db.gigs.find((g) => g.id === app.gigId);
        if (gig) notify(db, gig.clientId, "application", "An applicant withdrew", gig.title, `/client/gigs/${gig.id}`);
      });
    },

    async setApplicationStatus(applicationId, status) {
      mutate((db, viewer) => {
        const app = db.applications.find((a) => a.id === applicationId);
        const gig = app ? db.gigs.find((g) => g.id === app.gigId) : undefined;
        if (!app || !gig || gig.clientId !== viewer.id) throw new DomainError("not_found", "Application not found.");
        assertApplicationTransition(app.status, status, "client");
        app.status = status;
        app.updatedAt = now();
        notify(
          db,
          app.artistUserId,
          status === "shortlisted" ? "shortlist" : "application",
          status === "shortlisted" ? "You were shortlisted" : "Application not selected",
          gig.title,
          "/artist/applications",
        );
        audit(db, viewer.id, `application.${status}`, "application", app.id);
      });
    },

    async openApplicationConversation(applicationId) {
      return mutate((db, viewer) => {
        const app = db.applications.find((a) => a.id === applicationId);
        const gig = app ? db.gigs.find((g) => g.id === app.gigId) : undefined;
        if (!app || !gig) throw new DomainError("not_found", "Application not found.");
        const isClient = gig.clientId === viewer.id;
        const isArtist = app.artistUserId === viewer.id;
        if (!isClient && !isArtist) throw new DomainError("not_found", "Application not found.");
        if (app.conversationId) return app.conversationId;
        if (!isClient) throw new DomainError("forbidden", "The client starts the conversation once they've reviewed your application.");
        if (["declined", "withdrawn"].includes(app.status)) throw new DomainError("invalid_transition", "This application is closed.");
        const profile = db.artistProfiles.find((p) => p.id === app.artistProfileId);
        const artistUser = db.users.find((u) => u.id === app.artistUserId);
        if (!profile || !artistUser) throw new DomainError("not_found", "Artist not found.");
        const ts = now();
        const thread: ConversationThread = {
          id: id("conv"),
          isSample: false,
          subject: gig.title,
          clientUserId: viewer.id,
          clientName: viewer.displayName,
          artistUserId: artistUser.id,
          artistProfileId: profile.id,
          artistName: profile.displayName,
          artistSlug: profile.slug,
          category: gig.category,
          city: gig.city,
          gigId: gig.id,
          applicationId: app.id,
          inquiry: null,
          bookingId: null,
          messages: [],
          proposals: [],
          lastReadAt: { [viewer.id]: ts },
          createdAt: ts,
          updatedAt: ts,
        };
        // The artist's application message and quote open the thread; the quote becomes Proposal v1.
        thread.messages.push({ id: id("msg"), conversationId: thread.id, senderUserId: artistUser.id, senderRole: "artist", senderName: profile.displayName, body: app.message, proposalId: null, createdAt: app.createdAt });
        const { created, proposals } = createProposal({
          thread,
          actor: { userId: artistUser.id, role: "artist", name: profile.displayName },
          draft: {
            amountPaise: app.quotedAmountPaise + app.travelCostPaise,
            eventDate: gig.eventDate,
            duration: gig.durationSummary || "As per gig brief",
            deliverables: app.scopeSummary || gig.deliverables,
            inclusions: app.scopeSummary ? [app.scopeSummary] : [],
            exclusions: [],
            travelNotes: app.travelCostPaise ? `Includes travel ${formatPaise(app.travelCostPaise)}. ${app.equipmentNotes}` : app.equipmentNotes,
            cancellationTerms: "To be agreed in this conversation.",
            validUntil: app.validUntil >= today() ? app.validUntil : today(),
          },
          id: id("prop"),
          now: ts,
          today: today(),
        });
        thread.proposals = proposals;
        systemMessage(thread, `${viewer.displayName} opened a conversation. The application quote is recorded as Proposal v1 (${formatPaise(created.amountPaise)}).`, created.id);
        db.conversations.unshift(thread);
        app.conversationId = thread.id;
        assertApplicationTransition(app.status, "in_negotiation", "system");
        app.status = "in_negotiation";
        app.updatedAt = ts;
        notify(db, artistUser.id, "message", `${viewer.displayName} wants to discuss your application`, gig.title, `/messages/${thread.id}`);
        return thread.id;
      });
    },

    /* Conversations & proposals ----------------------------------- */

    async startInquiry({ artistProfileId, inquiry, message }) {
      return mutate((db, viewer) => {
        const profile = db.artistProfiles.find((p) => p.id === artistProfileId && p.published);
        if (!profile) throw new DomainError("not_found", "Artist not found.");
        if (profile.ownerUserId === viewer.id) throw new DomainError("forbidden", "You can't send an inquiry to your own profile.");
        if (isBlocked(db, profile.ownerUserId, viewer.id)) throw new DomainError("forbidden", "This artist isn't accepting messages from you.");
        if (!inquiry.eventTitle.trim()) throw new DomainError("invalid_input", "Add a short title for your event.");
        if (!inquiry.eventDate) throw new DomainError("invalid_input", "Add the event date.");
        if (inquiry.eventDate < today()) throw new DomainError("invalid_input", "The event date can't be in the past.");
        if (message.trim().length < 10) throw new DomainError("invalid_input", "Write a short message to the artist.");
        ensureRole(viewer, "client");
        const ts = now();
        const thread: ConversationThread = {
          id: id("conv"),
          isSample: false,
          subject: clean(inquiry.eventTitle, 120),
          clientUserId: viewer.id,
          clientName: viewer.displayName,
          artistUserId: profile.ownerUserId,
          artistProfileId: profile.id,
          artistName: profile.displayName,
          artistSlug: profile.slug,
          category: profile.primaryCategory,
          city: inquiry.city || profile.city,
          gigId: null,
          applicationId: null,
          inquiry: { ...inquiry, requirements: clean(inquiry.requirements, 2000) },
          bookingId: null,
          messages: [{ id: id("msg"), conversationId: "", senderUserId: viewer.id, senderRole: "client", senderName: viewer.displayName, body: clean(message), proposalId: null, createdAt: ts }],
          proposals: [],
          lastReadAt: { [viewer.id]: ts },
          createdAt: ts,
          updatedAt: ts,
        };
        thread.messages[0].conversationId = thread.id;
        db.conversations.unshift(thread);
        notify(db, profile.ownerUserId, "message", `New inquiry from ${viewer.displayName}`, thread.subject, `/messages/${thread.id}`);
        audit(db, viewer.id, "conversation.inquiry_started", "conversation", thread.id);
        return thread.id;
      });
    },

    async sendMessage(conversationId, body) {
      mutate((db, viewer) => {
        const thread = findConversation(db, conversationId, viewer);
        const text = clean(body, 4000);
        if (!text) throw new DomainError("invalid_input", "Write a message first.");
        const other = otherParticipant(thread, viewer.id);
        if (isBlocked(db, other, viewer.id)) throw new DomainError("forbidden", "You can't send messages in this conversation.");
        const role = participantRole(thread, viewer.id)!;
        const ts = now();
        thread.messages.push({ id: id("msg"), conversationId, senderUserId: viewer.id, senderRole: role, senderName: viewer.displayName, body: text, proposalId: null, createdAt: ts });
        thread.updatedAt = ts;
        thread.lastReadAt = { ...thread.lastReadAt, [viewer.id]: ts };
        // Collapse repeated unread message notifications for the same thread.
        const existing = db.notifications.find((n) => n.userId === other && n.path === `/messages/${conversationId}` && n.kind === "message" && !n.read);
        if (existing) {
          existing.detail = text.slice(0, 120);
          existing.createdAt = ts;
        } else {
          notify(db, other, "message", `New message from ${viewer.displayName}`, text.slice(0, 120), `/messages/${conversationId}`);
        }
      });
    },

    async markConversationRead(conversationId) {
      const db = load();
      const viewer = viewerFrom(db);
      if (!viewer) return;
      const thread = db.conversations.find((c) => c.id === conversationId);
      if (!thread || !participantRole(thread, viewer.id)) return;
      thread.lastReadAt = { ...thread.lastReadAt, [viewer.id]: now() };
      db.notifications.forEach((n) => {
        if (n.userId === viewer.id && n.path === `/messages/${conversationId}`) n.read = true;
      });
      save(db);
      emit();
    },

    async sendProposal(conversationId, draft) {
      mutate((db, viewer) => {
        const thread = findConversation(db, conversationId, viewer);
        const actor = actorFor(thread, viewer);
        const { proposals, created, superseded } = createProposal({ thread, actor, draft, id: id("prop"), now: now(), today: today() });
        thread.proposals = proposals;
        const kind = superseded ? "counter-offer" : "offer";
        systemMessage(thread, `${viewer.displayName} sent Proposal v${created.version} (${formatPaise(created.amountPaise)})${superseded ? ` as a counter-offer to v${superseded.version}` : ""}.`, created.id);
        if (thread.applicationId) {
          const app = db.applications.find((a) => a.id === thread.applicationId);
          if (app && (app.status === "submitted" || app.status === "shortlisted")) app.status = "in_negotiation";
        }
        notify(
          db,
          otherParticipant(thread, viewer.id),
          superseded ? "counter_offer" : "proposal",
          `${viewer.displayName} sent a ${kind}: Proposal v${created.version}`,
          `${formatPaise(created.amountPaise)} · ${thread.subject}`,
          `/messages/${thread.id}`,
        );
        audit(db, viewer.id, "proposal.created", "proposal", created.id, `v${created.version} ${created.amountPaise}`);
      });
    },

    async respondToProposal(conversationId, proposalId, expectedVersion, response) {
      return mutate((db, viewer) => {
        const thread = findConversation(db, conversationId, viewer);
        const actor = actorFor(thread, viewer);
        const ts = now();
        // respondRule enforces: exact current version, not own offer, not expired, not already accepted.
        const { proposals, target } = respondRule({ thread, actor, proposalId, expectedVersion, response, now: ts, today: today() });
        thread.proposals = proposals;
        const other = otherParticipant(thread, viewer.id);

        if (response === "reject") {
          systemMessage(thread, `${viewer.displayName} declined Proposal v${target.version}. Either side can send a new offer.`, target.id);
          notify(db, other, "offer_rejected", `Proposal v${target.version} was declined`, thread.subject, `/messages/${thread.id}`);
          audit(db, viewer.id, "proposal.rejected", "proposal", target.id);
          return null;
        }

        // Atomic acceptance: proposal → accepted, booking created, application/gig updated, in one write.
        if (thread.bookingId || db.bookings.some((b) => b.conversationId === thread.id)) {
          throw new DomainError("already_accepted", "A booking already exists for this conversation.");
        }
        const booking: BookingRecord = {
          id: id("booking"),
          isSample: false,
          conversationId: thread.id,
          gigId: thread.gigId,
          title: thread.subject,
          clientUserId: thread.clientUserId,
          clientName: thread.clientName,
          artistUserId: thread.artistUserId,
          artistProfileId: thread.artistProfileId,
          artistName: thread.artistName,
          artistSlug: thread.artistSlug,
          acceptedProposalId: target.id,
          acceptedProposalVersion: target.version,
          grossAmountPaise: target.amountPaise,
          // Platform fee policy is not finalised; the backend computes it, never the browser.
          platformFeePaise: 0,
          artistSharePaise: target.amountPaise,
          currency: "INR",
          eventDate: target.eventDate,
          city: thread.city,
          duration: target.duration,
          deliverables: target.deliverables,
          inclusions: target.inclusions,
          exclusions: target.exclusions,
          cancellationTerms: target.cancellationTerms,
          status: "awaiting_payment",
          paymentStatus: "provider_unavailable",
          cancellationReason: null,
          timeline: [
            { id: id("tl"), status: "offer_accepted", actorUserId: viewer.id, actorName: viewer.displayName, note: `Accepted Proposal v${target.version} (${formatPaise(target.amountPaise)}).`, createdAt: ts },
            { id: id("tl"), status: "awaiting_payment", actorUserId: null, actorName: "Cultgig", note: "Booking created. Online payment isn't available yet.", createdAt: ts },
          ],
          createdAt: ts,
          updatedAt: ts,
        };
        db.bookings.push(booking);
        thread.bookingId = booking.id;
        systemMessage(thread, `${viewer.displayName} accepted Proposal v${target.version} (${formatPaise(target.amountPaise)}). A booking was created.`, target.id);

        if (thread.applicationId) {
          const app = db.applications.find((a) => a.id === thread.applicationId);
          if (app && app.status !== "accepted") {
            app.status = "accepted";
            app.updatedAt = ts;
          }
          const gig = thread.gigId ? db.gigs.find((g) => g.id === thread.gigId) : undefined;
          if (gig && gig.status === "open") {
            const accepted = db.applications.filter((a) => a.gigId === gig.id && a.status === "accepted").length;
            if (accepted >= gig.artistsNeeded) gig.status = "filled";
          }
        }
        notify(db, other, "offer_accepted", `Proposal v${target.version} accepted`, `${thread.subject} · ${formatPaise(target.amountPaise)}`, `/bookings/${booking.id}`);
        audit(db, viewer.id, "proposal.accepted", "proposal", target.id, `booking ${booking.id}`);
        return booking.id;
      });
    },

    async withdrawProposal(conversationId, proposalId) {
      mutate((db, viewer) => {
        const thread = findConversation(db, conversationId, viewer);
        const actor = actorFor(thread, viewer);
        const { proposals, target } = withdrawRule({ thread, actor, proposalId, now: now() });
        thread.proposals = proposals;
        systemMessage(thread, `${viewer.displayName} withdrew Proposal v${target.version}.`, target.id);
        notify(db, otherParticipant(thread, viewer.id), "proposal", `Proposal v${target.version} withdrawn`, thread.subject, `/messages/${thread.id}`);
      });
    },

    /* Bookings ----------------------------------------------------- */

    async transitionBooking(bookingId, to, reason) {
      mutate((db, viewer) => {
        const booking = findBooking(db, bookingId, viewer);
        const role = bookingRoleFor(booking, viewer.id)!;
        assertTransition(booking, to, role, reason);
        const ts = now();
        booking.status = to;
        booking.updatedAt = ts;
        if (to === "cancelled") booking.cancellationReason = clean(reason ?? "", 600);
        booking.timeline.push({ id: id("tl"), status: to, actorUserId: viewer.id, actorName: viewer.displayName, note: clean(reason ?? "", 600), createdAt: ts });
        const thread = db.conversations.find((c) => c.id === booking.conversationId);
        if (thread) systemMessage(thread, `${viewer.displayName} moved the booking to "${BOOKING_STATUS_LABELS[to]}".${reason ? ` Reason: ${clean(reason, 300)}` : ""}`);
        const other = role === "client" ? booking.artistUserId : booking.clientUserId;
        notify(db, other, "booking", `Booking ${BOOKING_STATUS_LABELS[to].toLowerCase()}`, booking.title, `/bookings/${booking.id}`);
        if (to === "completed") notify(db, booking.clientUserId, "review", "How did it go?", `Leave a review for ${booking.artistName}`, `/bookings/${booking.id}`);
        if (to === "disputed") {
          db.supportTickets.unshift({ id: id("ticket"), userId: viewer.id, issueType: "dispute", bookingReference: booking.id, name: viewer.displayName, email: viewer.email, message: clean(reason ?? "", 2000), status: "recorded_demo", createdAt: ts });
        }
        audit(db, viewer.id, `booking.${to}`, "booking", booking.id, reason ?? "");
      });
    },

    async confirmBookingWithoutPayment(bookingId) {
      mutate((db, viewer) => {
        const booking = findBooking(db, bookingId, viewer);
        if (booking.clientUserId !== viewer.id) throw new DomainError("forbidden", "Only the client can confirm this booking.");
        const actor: BookingActor = "demo";
        assertTransition(booking, "confirmed", actor);
        const ts = now();
        booking.status = "confirmed";
        booking.paymentStatus = "not_collected_demo";
        booking.updatedAt = ts;
        booking.timeline.push({ id: id("tl"), status: "confirmed", actorUserId: viewer.id, actorName: viewer.displayName, note: "Confirmed in demo mode. No payment was collected.", createdAt: ts });
        const thread = db.conversations.find((c) => c.id === booking.conversationId);
        if (thread) systemMessage(thread, `${viewer.displayName} confirmed the booking in demo mode. No payment was collected.`);
        notify(db, booking.artistUserId, "booking", "Booking confirmed (demo, unpaid)", booking.title, `/bookings/${booking.id}`);
        audit(db, viewer.id, "booking.confirmed_demo", "booking", booking.id);
      });
    },

    async createPaymentOrder() {
      throw new DomainError(
        "not_configured",
        "Online payment isn't available yet. Cultgig will enable checkout after a marketplace payment provider approves the account.",
      );
    },

    /* Notifications ------------------------------------------------ */

    async markNotificationRead(notificationId) {
      mutate((db, viewer) => {
        const n = db.notifications.find((x) => x.id === notificationId && x.userId === viewer.id);
        if (n) n.read = true;
      });
    },

    async markAllNotificationsRead() {
      mutate((db, viewer) => {
        db.notifications.forEach((n) => {
          if (n.userId === viewer.id) n.read = true;
        });
      });
    },

    /* Trust & safety ---------------------------------------------- */

    async submitReview(bookingId, ratings, text) {
      mutate((db, viewer) => {
        const booking = findBooking(db, bookingId, viewer);
        if (booking.clientUserId !== viewer.id) throw new DomainError("forbidden", "Only the client on this booking can review the artist.");
        if (booking.status !== "completed") throw new DomainError("invalid_transition", "You can review once the booking is completed.");
        if (db.reviews.some((r) => r.bookingId === bookingId && r.reviewerUserId === viewer.id)) {
          throw new DomainError("duplicate", "You've already reviewed this booking.");
        }
        const values = Object.values(ratings);
        if (!values.every((v) => Number.isInteger(v) && v >= 1 && v <= 5)) throw new DomainError("invalid_input", "Rate every category from 1 to 5.");
        if (text.trim().length < 20) throw new DomainError("invalid_input", "Write at least 20 characters about your experience.");
        const parts = viewer.displayName.trim().split(/\s+/);
        db.reviews.unshift({
          id: id("review"),
          bookingId,
          reviewerUserId: viewer.id,
          reviewerName: parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0],
          artistProfileId: booking.artistProfileId,
          ratings,
          text: clean(text, 2000),
          status: "published",
          isSample: false,
          createdAt: now(),
        });
        notify(db, booking.artistUserId, "review", `New review from ${viewer.displayName}`, `${ratings.overall}/5 for ${booking.title}`, `/artists/${booking.artistSlug}`);
      });
    },

    async report({ targetType, targetId, reason, details }) {
      mutate((db, viewer) => {
        if (!reason.trim()) throw new DomainError("invalid_input", "Choose a reason for the report.");
        db.reports.unshift({ id: id("report"), reporterUserId: viewer.id, targetType, targetId, reason: clean(reason, 120), details: clean(details, 2000), status: "open", createdAt: now() });
        if (targetType === "review") {
          const review = db.reviews.find((r) => r.id === targetId);
          if (review && review.status === "published") review.status = "reported";
        }
        audit(db, viewer.id, "report.created", targetType, targetId, reason);
      });
    },

    async blockUser(userId) {
      mutate((db, viewer) => {
        if (userId === viewer.id) throw new DomainError("invalid_input", "You can't block yourself.");
        const s = db.settings.find((x) => x.userId === viewer.id);
        if (s && !s.blockedUserIds.includes(userId)) s.blockedUserIds.push(userId);
        audit(db, viewer.id, "user.blocked", "user", userId);
      });
    },

    async createSupportTicket(ticket) {
      const db = load();
      const viewer = viewerFrom(db);
      if (!EMAIL_RE.test(ticket.email.trim())) throw new DomainError("invalid_input", "Enter a valid email so support can reply.");
      if (ticket.message.trim().length < 10) throw new DomainError("invalid_input", "Describe the issue in a little more detail.");
      const created = {
        ...ticket,
        name: clean(ticket.name, 80),
        message: clean(ticket.message, 4000),
        id: `CG-${id("t").slice(-6).toUpperCase()}`,
        userId: viewer?.id ?? null,
        status: "recorded_demo" as const,
        createdAt: now(),
      };
      db.supportTickets.unshift(created);
      save(db);
      emit();
      return created;
    },
  };

  return { auth, market };
}
