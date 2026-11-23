/**
 * Cultgig domain model.
 *
 * Money: every amount that participates in a transaction (proposals, bookings,
 * payments) is stored as integer paise (`*Paise`). Display-only listing prices
 * (`startingPriceInr`, budgets) are whole rupees and are never charged directly.
 * IDs are opaque strings. Timestamps are ISO-8601 strings. Dates are YYYY-MM-DD.
 */

export type CategorySlug =
  | "music-and-bands"
  | "singers-and-vocalists"
  | "djs-and-instrumentalists"
  | "dance-and-choreography"
  | "photography-and-videography"
  | "mehendi-artists"
  | "makeup-and-beauty"
  | "saree-draping-and-styling"
  | "painters-and-illustrators"
  | "wall-art-and-murals"
  | "models-and-fashion-talent"
  | "tattoo-artists"
  | "decorators-and-florists"
  | "emcees-and-event-hosts"
  | "other-creative-professionals";

export type PricingMode = "starting_at" | "range" | "fixed_package" | "quote_required";
export type WorkingMode = "on_site" | "remote" | "both";
export type ArtistFormat = "solo" | "group";
export type MarketplaceRole = "artist" | "client";

/* ------------------------------------------------------------------ */
/* Accounts                                                            */
/* ------------------------------------------------------------------ */

export type OnboardingState = "not_started" | "draft" | "complete";
export type ClientAccountType = "individual" | "business" | "planner";

export interface UserAccount {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  city: string;
  avatarUrl: string;
  emailVerified: boolean;
  /** Roles this account has enabled. One account can hold both. */
  roles: MarketplaceRole[];
  activeRole: MarketplaceRole;
  onboarding: Record<MarketplaceRole, OnboardingState>;
  authProvider: "demo" | "appwrite";
  /** Demo records are illustrative fixtures and never real users. */
  isSample: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  email: boolean;
  messages: boolean;
  proposals: boolean;
  bookings: boolean;
  marketing: boolean;
}

export interface UserSettings {
  userId: string;
  notifications: NotificationPreferences;
  profileVisibility: "public" | "hidden";
  showCityOnProfile: boolean;
  deactivationRequestedAt: string | null;
  blockedUserIds: string[];
}

/* ------------------------------------------------------------------ */
/* Artist side                                                         */
/* ------------------------------------------------------------------ */

export interface ServicePackage {
  id: string;
  title: string;
  description: string;
  category: CategorySlug;
  format: WorkingMode;
  pricingMode: PricingMode;
  duration: string;
  inclusions: string[];
  exclusions: string[];
  /** Whole rupees for display; null when quotation-based. */
  priceInr: number | null;
}

export type PortfolioMediaType = "image" | "audio" | "video";

export interface PortfolioItem {
  id: string;
  type: PortfolioMediaType;
  title: string;
  caption: string;
  mediaUrl: string;
  featured: boolean;
  ownershipConfirmed: boolean;
}

export interface ArtistProfile {
  id: string;
  /** Account that owns and may edit this profile. */
  ownerUserId: string;
  slug: string;
  isSample: boolean;
  published: boolean;
  displayName: string;
  tagline: string;
  primaryCategory: CategorySlug;
  secondaryCategories: CategorySlug[];
  city: string;
  travelCities: string[];
  travelRadiusKm: number;
  workingMode: WorkingMode;
  artistFormat: ArtistFormat;
  pricingMode: PricingMode;
  startingPriceInr: number | null;
  priceMaxInr: number | null;
  experienceYears: number;
  languages: string[];
  bio: string;
  equipmentNotes: string;
  /** Dates (YYYY-MM-DD) the artist has marked unavailable. Everything else is open. */
  unavailableDates: string[];
  avatarUrl: string;
  avatarAlt: string;
  coverUrl: string;
  coverAlt: string;
  portfolio: PortfolioItem[];
  packages: ServicePackage[];
  createdAt: string;
  updatedAt: string;
}

/** Back-compat alias used by older public pages. */
export type SampleArtist = ArtistProfile;

export interface ClientProfile {
  userId: string;
  accountType: ClientAccountType;
  organisationName: string;
  organisationRole: string;
  website: string;
  hiringInterests: CategorySlug[];
  typicalEventTypes: string[];
  typicalBudgetInr: number | null;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Gigs and applications                                               */
/* ------------------------------------------------------------------ */

export type GigBudgetMode = "fixed" | "range" | "open_to_quotes";
export type GigStatus = "draft" | "open" | "paused" | "filled" | "closed";

export interface EventGig {
  id: string;
  isSample: boolean;
  clientId: string;
  clientDisplayName: string;
  clientType: ClientAccountType;
  title: string;
  category: CategorySlug;
  eventType: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  city: string;
  venueArea: string;
  workingMode: "on_site" | "remote";
  artistsNeeded: number;
  durationSummary: string;
  requirements: string;
  deliverables: string;
  specialInstructions: string;
  references: string;
  equipmentAndSpaceNotes: string;
  budgetMode: GigBudgetMode;
  budgetMinInr: number | null;
  budgetMaxInr: number | null;
  travelCovered: boolean;
  applicationDeadline: string;
  experiencePreference: string;
  locationPreference: string;
  status: GigStatus;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | "submitted"
  | "shortlisted"
  | "in_negotiation"
  | "accepted"
  | "declined"
  | "withdrawn";

export interface GigApplication {
  id: string;
  gigId: string;
  artistProfileId: string;
  artistUserId: string;
  message: string;
  quotedAmountPaise: number;
  scopeSummary: string;
  portfolioItemIds: string[];
  availabilityConfirmed: boolean;
  travelCostPaise: number;
  equipmentNotes: string;
  validUntil: string;
  status: ApplicationStatus;
  conversationId: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Conversations and proposals                                         */
/* ------------------------------------------------------------------ */

export interface InquiryDetails {
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  city: string;
  venue: string;
  duration: string;
  requirements: string;
  estimatedBudgetInr: number | null;
}

export type ProposalStatus = "pending" | "accepted" | "rejected" | "withdrawn" | "superseded" | "expired";

export interface ProposalVersion {
  id: string;
  conversationId: string;
  version: number;
  proposedByUserId: string;
  proposedByRole: MarketplaceRole;
  proposedByName: string;
  amountPaise: number;
  currency: "INR";
  eventDate: string;
  duration: string;
  deliverables: string;
  inclusions: string[];
  exclusions: string[];
  travelNotes: string;
  cancellationTerms: string;
  validUntil: string;
  status: ProposalStatus;
  /** Proposal this version answered (counter-offers). */
  respondsToProposalId: string | null;
  createdAt: string;
  respondedAt: string | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderUserId: string | null; // null for system messages
  senderRole: MarketplaceRole | "system";
  senderName: string;
  body: string;
  proposalId: string | null;
  createdAt: string;
}

export interface ConversationThread {
  id: string;
  isSample: boolean;
  subject: string;
  clientUserId: string;
  clientName: string;
  artistUserId: string;
  artistProfileId: string;
  artistName: string;
  artistSlug: string;
  category: CategorySlug;
  city: string;
  gigId: string | null;
  applicationId: string | null;
  inquiry: InquiryDetails | null;
  bookingId: string | null;
  messages: ChatMessage[];
  proposals: ProposalVersion[];
  /** Last time each participant opened the thread (userId → ISO). */
  lastReadAt: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Bookings and payments                                               */
/* ------------------------------------------------------------------ */

export type BookingLifecycleStatus =
  | "inquiry"
  | "proposal_received"
  | "negotiating"
  | "offer_accepted"
  | "awaiting_payment"
  | "confirmed"
  | "in_progress"
  | "completion_pending"
  | "completed"
  | "cancelled"
  | "disputed";

export type PaymentStatus =
  /** No payment provider is configured — checkout is unavailable. */
  | "provider_unavailable"
  /** Demo mode only: booking confirmed without collecting any money. */
  | "not_collected_demo"
  | "pending"
  | "paid"
  | "failed"
  | "refund_pending"
  | "refunded";

export interface BookingTimelineEvent {
  id: string;
  status: BookingLifecycleStatus;
  actorUserId: string | null;
  actorName: string;
  note: string;
  createdAt: string;
}

export interface BookingRecord {
  id: string;
  isSample: boolean;
  conversationId: string;
  gigId: string | null;
  title: string;
  clientUserId: string;
  clientName: string;
  artistUserId: string;
  artistProfileId: string;
  artistName: string;
  artistSlug: string;
  acceptedProposalId: string;
  acceptedProposalVersion: number;
  grossAmountPaise: number;
  platformFeePaise: number;
  artistSharePaise: number;
  currency: "INR";
  eventDate: string;
  city: string;
  duration: string;
  deliverables: string;
  inclusions: string[];
  exclusions: string[];
  cancellationTerms: string;
  status: BookingLifecycleStatus;
  paymentStatus: PaymentStatus;
  cancellationReason: string | null;
  timeline: BookingTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Supporting records                                                  */
/* ------------------------------------------------------------------ */

export type NotificationKind =
  | "message"
  | "application"
  | "shortlist"
  | "proposal"
  | "counter_offer"
  | "offer_accepted"
  | "offer_rejected"
  | "booking"
  | "payment"
  | "reminder"
  | "review"
  | "system";

export interface MarketplaceNotification {
  id: string;
  userId: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  path: string;
  read: boolean;
  createdAt: string;
}

export interface ReviewRatings {
  overall: number;
  professionalism: number;
  communication: number;
  quality: number;
  punctuality: number;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerUserId: string;
  reviewerName: string;
  artistProfileId: string;
  ratings: ReviewRatings;
  text: string;
  status: "published" | "reported" | "removed";
  isSample: boolean;
  createdAt: string;
}

export type ReportTargetType = "user" | "artist_profile" | "gig" | "review" | "booking";

export interface SafetyReport {
  id: string;
  reporterUserId: string | null;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  details: string;
  status: "open" | "reviewing" | "closed";
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string | null;
  issueType: "booking_issue" | "cancellation_refund" | "artist_safety" | "account_help" | "partnership" | "dispute";
  bookingReference: string;
  name: string;
  email: string;
  message: string;
  status: "recorded_demo" | "submitted";
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  detail: string;
  createdAt: string;
}
