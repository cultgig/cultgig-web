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

export interface ServicePackage {
  id: string;
  title: string;
  duration: string;
  inclusions: string[];
  exclusions: string[];
  priceInr: number | null; // null if quote_required
}

export interface PortfolioItem {
  id: string;
  type: "image" | "audio" | "video";
  title: string;
  caption: string;
  mediaUrl: string;
  ownershipConfirmed: boolean;
}

export interface SampleArtist {
  id: string;
  slug: string;
  isSample: true;
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
  priceMaxInr?: number | null;
  experienceYears: number;
  languages: string[];
  bio: string;
  verificationLabel: string;
  availabilitySummary: string;
  avatarUrl: string;
  avatarAlt: string;
  coverUrl: string;
  coverAlt: string;
  portfolio: PortfolioItem[];
  packages: ServicePackage[];
  hasAudioSample: boolean;
  hasVideoSample: boolean;
}

export type GigBudgetMode = "fixed" | "range" | "open_to_quotes";
export type GigStatus = "draft" | "open" | "paused" | "filled" | "closed";

export interface EventGig {
  id: string;
  isSample?: boolean;
  clientId: string;
  clientDisplayName: string;
  clientType: "individual" | "business" | "planner";
  title: string;
  category: CategorySlug;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  city: string;
  venueArea: string;
  workingMode: "on_site" | "remote";
  artistsNeeded: number;
  durationSummary: string;
  deliverables: string;
  equipmentAndSpaceNotes: string;
  budgetMode: GigBudgetMode;
  budgetMinInr: number | null;
  budgetMaxInr: number | null;
  travelCovered: boolean;
  applicationDeadline: string;
  contactVisibility: "after_proposal" | "platform_messages_only";
  status: GigStatus;
  createdAt: string;
}

export type ApplicationStatus = "submitted" | "shortlisted" | "declined" | "withdrawn";

export interface GigApplication {
  id: string;
  gigId: string;
  artistId: string;
  artistName: string;
  artistSlug: string;
  artistCategory: CategorySlug;
  message: string;
  portfolioLink: string;
  quotedAmountInr: number;
  scopeSummary: string;
  availabilityConfirmed: boolean;
  travelAndEquipmentNotes: string;
  validUntil: string;
  cancellationNote: string;
  status: ApplicationStatus;
  createdAt: string;
}

export type ProposalStatus = "pending" | "accepted" | "rejected" | "withdrawn" | "superseded";

export interface ProposalVersion {
  id: string;
  version: number;
  proposedBy: "client" | "artist";
  proposedByName: string;
  amountPaise: number;
  currency: "INR";
  eventDate: string;
  duration: string;
  inclusions: string[];
  exclusions: string[];
  travelNotes: string;
  cancellationTerms: string;
  validUntil: string;
  status: ProposalStatus;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderRole: "client" | "artist" | "system";
  senderName: string;
  body: string;
  createdAt: string;
}

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

export interface ConversationThread {
  id: string;
  isSample?: boolean;
  gigId?: string;
  gigTitle: string;
  clientId: string;
  clientName: string;
  artistId: string;
  artistName: string;
  artistSlug: string;
  category: CategorySlug;
  city: string;
  messages: ChatMessage[];
  proposals: ProposalVersion[];
  bookingId?: string;
}

export interface BookingRecord {
  id: string;
  isSample?: boolean;
  conversationId: string;
  gigId?: string;
  gigTitle: string;
  clientId: string;
  clientName: string;
  artistId: string;
  artistName: string;
  artistSlug: string;
  acceptedProposalVersion: number;
  grossAmountPaise: number;
  platformFeePaise: number;
  artistSharePaise: number;
  currency: "INR";
  eventDate: string;
  city: string;
  serviceSummary: string;
  status: BookingLifecycleStatus;
  updatedAt: string;
}

export interface MarketplaceNotification {
  id: string;
  title: string;
  detail: string;
  path: string;
  read: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  issueType: "booking_issue" | "cancellation_refund" | "artist_safety" | "account_help" | "partnership";
  bookingReference?: string;
  name: string;
  email: string;
  message: string;
  status: "recorded_locally" | "submitted";
  createdAt: string;
}
