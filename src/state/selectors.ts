import { isActiveBooking } from "../domain/bookings";
import type {
  ArtistProfile,
  ConversationThread,
  EventGig,
  MarketplaceRole,
  Review,
  ReviewRatings,
  UserAccount,
} from "../types/marketplace";

/** Pure derivations over snapshot data. Keep components free of business calculations. */

export function unreadCount(thread: ConversationThread, viewerId: string): number {
  const lastRead = thread.lastReadAt[viewerId] ?? "";
  return thread.messages.filter((m) => m.senderUserId !== viewerId && m.createdAt > lastRead).length;
}

export function totalUnreadMessages(threads: ConversationThread[], viewerId: string): number {
  return threads.reduce((sum, t) => sum + unreadCount(t, viewerId), 0);
}

export function artistRating(reviews: Review[], artistProfileId: string): { average: number; count: number } | null {
  const mine = reviews.filter((r) => r.artistProfileId === artistProfileId && r.status === "published");
  if (!mine.length) return null;
  const average = mine.reduce((s, r) => s + r.ratings.overall, 0) / mine.length;
  return { average: Math.round(average * 10) / 10, count: mine.length };
}

export function averageRatings(reviews: Review[]): ReviewRatings | null {
  if (!reviews.length) return null;
  const keys: (keyof ReviewRatings)[] = ["overall", "professionalism", "communication", "quality", "punctuality"];
  return Object.fromEntries(keys.map((k) => [k, Math.round((reviews.reduce((s, r) => s + r.ratings[k], 0) / reviews.length) * 10) / 10])) as unknown as ReviewRatings;
}

export function isAvailableOn(artist: ArtistProfile, date: string): boolean {
  return !artist.unavailableDates.includes(date);
}

/** Which workspace a user should land in after signing in. */
export function workspaceHome(user: UserAccount): string {
  const role = user.activeRole;
  if (user.onboarding[role] !== "complete") return `/onboarding/${role}`;
  return role === "artist" ? "/artist/dashboard" : "/client/dashboard";
}

export function needsOnboarding(user: UserAccount, role: MarketplaceRole): boolean {
  return user.onboarding[role] !== "complete";
}

export function activeBookingCount(bookings: { status: Parameters<typeof isActiveBooking>[0] }[]): number {
  return bookings.filter((b) => isActiveBooking(b.status)).length;
}

export function profileCompletion(artist: ArtistProfile | null): { percent: number; missing: string[] } {
  if (!artist) return { percent: 0, missing: ["Create your artist profile"] };
  const checks: [boolean, string][] = [
    [Boolean(artist.avatarUrl), "Add a profile photo"],
    [artist.bio.trim().length >= 80, "Write a bio of at least 80 characters"],
    [Boolean(artist.tagline.trim()), "Add a one-line tagline"],
    [artist.packages.length > 0, "Add at least one service"],
    [artist.portfolio.length >= 3, "Show at least 3 portfolio items"],
    [artist.languages.length > 0, "Add the languages you work in"],
    [artist.travelCities.length > 0 || artist.workingMode === "remote", "Add cities you travel to"],
    [artist.portfolio.some((p) => p.type !== "image"), "Add an audio or video sample"],
  ];
  const done = checks.filter(([ok]) => ok).length;
  return { percent: Math.round((done / checks.length) * 100), missing: checks.filter(([ok]) => !ok).map(([, label]) => label) };
}

export function gigMatchesArtist(gig: EventGig, artist: ArtistProfile | null): boolean {
  if (!artist) return false;
  return gig.category === artist.primaryCategory || artist.secondaryCategories.includes(gig.category);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
