import type { ProposalDraft, ProposalResponse } from "../../domain/proposals";
import type { GigDraftInput } from "../../domain/gigs";
import type {
  ApplicationStatus,
  ArtistProfile,
  BookingLifecycleStatus,
  BookingRecord,
  ClientProfile,
  ConversationThread,
  EventGig,
  GigApplication,
  GigStatus,
  InquiryDetails,
  MarketplaceNotification,
  MarketplaceRole,
  PortfolioItem,
  ReportTargetType,
  Review,
  ReviewRatings,
  ServicePackage,
  SupportTicket,
  UserAccount,
  UserSettings,
} from "../../types/marketplace";

/**
 * Everything the signed-in viewer is allowed to see, computed by the backend.
 * The backend enforces visibility: a viewer only ever receives their own conversations, bookings,
 * applications and notifications, plus public marketplace data. The UI never filters for security.
 */
export interface MarketplaceSnapshot {
  viewer: UserAccount | null;
  settings: UserSettings | null;
  /** Published public artist profiles (plus the viewer's own profile even if unpublished). */
  artists: ArtistProfile[];
  myArtistProfile: ArtistProfile | null;
  myClientProfile: ClientProfile | null;
  /** Open public gigs, plus every gig the viewer owns regardless of status. */
  gigs: EventGig[];
  /** Applications the viewer submitted, plus applications to gigs the viewer owns. */
  applications: GigApplication[];
  conversations: ConversationThread[];
  bookings: BookingRecord[];
  notifications: MarketplaceNotification[];
  savedArtistIds: string[];
  reviews: Review[];
  supportTickets: SupportTicket[];
}

export interface SignUpInput {
  email: string;
  password: string;
  displayName: string;
  role: MarketplaceRole;
}

export interface AuthResult {
  user: UserAccount;
  /** Demo mode only: the verification code is displayed on screen instead of being emailed. */
  demoVerificationCode?: string;
}

export interface AuthApi {
  readonly provider: "demo" | "appwrite";
  getSessionUser(): Promise<UserAccount | null>;
  signUp(input: SignUpInput): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<UserAccount>;
  signInWithGoogle(): Promise<void>;
  completeOAuth(): Promise<UserAccount>;
  signOut(): Promise<void>;
  requestEmailVerification(): Promise<{ demoCode?: string }>;
  confirmEmailVerification(params: { code?: string; userId?: string; secret?: string }): Promise<UserAccount>;
  requestPasswordReset(email: string): Promise<{ demoCode?: string }>;
  resetPassword(params: { email?: string; code?: string; userId?: string; secret?: string; password: string }): Promise<void>;
  /** Demo mode only. */
  signInAsDemoUser?(userId: string): Promise<UserAccount>;
}

export interface ArtistOnboardingInput {
  personal: { displayName: string; phone: string; city: string; avatarUrl: string };
  identity: Pick<ArtistProfile, "displayName" | "primaryCategory" | "secondaryCategories" | "artistFormat" | "experienceYears" | "languages" | "bio" | "tagline">;
  services: ServicePackage[];
  portfolio: PortfolioItem[];
  availability: Pick<ArtistProfile, "unavailableDates" | "travelRadiusKm" | "travelCities" | "workingMode" | "equipmentNotes">;
}

export interface ClientOnboardingInput {
  personal: { displayName: string; phone: string; city: string };
  profile: Omit<ClientProfile, "userId" | "updatedAt">;
}

export interface ApplicationInput {
  gigId: string;
  message: string;
  quotedAmountPaise: number;
  scopeSummary: string;
  portfolioItemIds: string[];
  availabilityConfirmed: boolean;
  travelCostPaise: number;
  equipmentNotes: string;
  validUntil: string;
}

export interface MarketplaceApi {
  readonly provider: "demo" | "appwrite";
  snapshot(): Promise<MarketplaceSnapshot>;

  // Account & roles
  updateAccount(patch: Partial<Pick<UserAccount, "displayName" | "phone" | "city" | "avatarUrl">>): Promise<void>;
  setActiveRole(role: MarketplaceRole): Promise<void>;
  updateSettings(patch: Partial<Omit<UserSettings, "userId">>): Promise<void>;
  requestDeactivation(): Promise<void>;

  // Onboarding
  saveArtistOnboarding(input: ArtistOnboardingInput, complete: boolean): Promise<void>;
  saveClientOnboarding(input: ClientOnboardingInput, complete: boolean): Promise<void>;

  // Artist profile
  updateArtistProfile(patch: Partial<Omit<ArtistProfile, "id" | "ownerUserId" | "slug" | "isSample" | "createdAt" | "updatedAt">>): Promise<void>;
  upsertServicePackage(pkg: ServicePackage): Promise<void>;
  deleteServicePackage(packageId: string): Promise<void>;
  addPortfolioItem(item: Omit<PortfolioItem, "id">): Promise<void>;
  updatePortfolioItem(itemId: string, patch: Partial<Omit<PortfolioItem, "id">>): Promise<void>;
  removePortfolioItem(itemId: string): Promise<void>;
  reorderPortfolio(itemIds: string[]): Promise<void>;
  setUnavailableDates(dates: string[]): Promise<void>;

  // Client
  toggleSavedArtist(artistProfileId: string): Promise<boolean>;

  // Gigs
  saveGig(input: GigDraftInput, options: { gigId?: string; publish: boolean }): Promise<EventGig>;
  setGigStatus(gigId: string, status: GigStatus): Promise<void>;

  // Applications
  applyToGig(input: ApplicationInput): Promise<GigApplication>;
  withdrawApplication(applicationId: string): Promise<void>;
  setApplicationStatus(applicationId: string, status: Extract<ApplicationStatus, "shortlisted" | "declined">): Promise<void>;
  openApplicationConversation(applicationId: string): Promise<string>;

  // Conversations & proposals
  startInquiry(params: { artistProfileId: string; inquiry: InquiryDetails; message: string }): Promise<string>;
  sendMessage(conversationId: string, body: string): Promise<void>;
  markConversationRead(conversationId: string): Promise<void>;
  sendProposal(conversationId: string, draft: ProposalDraft): Promise<void>;
  respondToProposal(conversationId: string, proposalId: string, expectedVersion: number, response: ProposalResponse): Promise<string | null>;
  withdrawProposal(conversationId: string, proposalId: string): Promise<void>;

  // Bookings & payments
  transitionBooking(bookingId: string, to: BookingLifecycleStatus, reason?: string): Promise<void>;
  /** Demo mode only: confirm without collecting money. Production confirmation comes from a verified payment webhook. */
  confirmBookingWithoutPayment(bookingId: string): Promise<void>;
  createPaymentOrder(bookingId: string): Promise<{ orderId: string; amountPaise: number }>;

  // Notifications
  markNotificationRead(notificationId: string): Promise<void>;
  markAllNotificationsRead(): Promise<void>;

  // Trust & safety
  submitReview(bookingId: string, ratings: ReviewRatings, text: string): Promise<void>;
  report(params: { targetType: ReportTargetType; targetId: string; reason: string; details: string }): Promise<void>;
  blockUser(userId: string): Promise<void>;
  createSupportTicket(ticket: Omit<SupportTicket, "id" | "status" | "createdAt" | "userId">): Promise<SupportTicket>;

  /** Demo mode only. */
  resetDemoData?(): Promise<void>;
  /** Subscribe to data changes (other tabs, realtime). Returns unsubscribe. */
  subscribe(listener: () => void): () => void;
}

export interface Backend {
  auth: AuthApi;
  market: MarketplaceApi;
}
