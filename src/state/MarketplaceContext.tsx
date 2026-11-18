import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  sampleApplications,
  sampleArtists,
  sampleBookings,
  sampleConversations,
  sampleGigs,
} from "../data/sampleMarketplace";
import type {
  BookingLifecycleStatus,
  BookingRecord,
  CategorySlug,
  ConversationThread,
  EventGig,
  GigApplication,
  MarketplaceNotification,
  PortfolioItem,
  ProposalVersion,
  SampleArtist,
  SupportTicket,
} from "../types/marketplace";

interface ArtistWorkspaceProfile {
  displayName: string;
  tagline: string;
  primaryCategory: CategorySlug;
  city: string;
  travelRadiusKm: number;
  startingPriceInr: number | null;
  bio: string;
  availabilitySlots: string[];
  portfolio: PortfolioItem[];
}

interface MarketplaceState {
  savedArtistIds: string[];
  gigs: EventGig[];
  applications: GigApplication[];
  conversations: ConversationThread[];
  bookings: BookingRecord[];
  notifications: MarketplaceNotification[];
  supportTickets: SupportTicket[];
  artistProfile: ArtistWorkspaceProfile;
}

const STORAGE_KEY = "cultgig.marketplace.prototype.v1";

const initialArtistProfile: ArtistWorkspaceProfile = {
  displayName: "Your Artist Profile (Draft)",
  tagline: "Independent creative performer — update your craft summary and city",
  primaryCategory: "singers-and-vocalists",
  city: "Mumbai",
  travelRadiusKm: 120,
  startingPriceInr: 15000,
  bio: "Tell event hosts and venues about your training, performance format, equipment needs, and the kind of rooms where your work shines.",
  availabilitySlots: ["2026-12-06", "2026-12-13", "2026-12-20"],
  portfolio: [],
};

const initialState: MarketplaceState = {
  savedArtistIds: ["sample-artist-rhea"],
  gigs: sampleGigs,
  applications: sampleApplications,
  conversations: sampleConversations,
  bookings: sampleBookings,
  notifications: [
    {
      id: "notif-1",
      title: "Sample proposal v2 in negotiation thread",
      detail: "Rhea Kapoor (Sample) sent Proposal v2 for Saturday sunset acoustic set.",
      path: "/messages/sample-thread-1",
      read: false,
      createdAt: "2026-11-16T14:05:00.000Z",
    },
  ],
  supportTickets: [],
  artistProfile: initialArtistProfile,
};

function loadState(): MarketplaceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<MarketplaceState>;
    return {
      ...initialState,
      ...parsed,
      artistProfile: {
        ...initialArtistProfile,
        ...(parsed.artistProfile ?? {}),
      },
    };
  } catch {
    return initialState;
  }
}

interface MarketplaceContextValue {
  artists: SampleArtist[];
  savedArtistIds: string[];
  gigs: EventGig[];
  applications: GigApplication[];
  conversations: ConversationThread[];
  bookings: BookingRecord[];
  notifications: MarketplaceNotification[];
  supportTickets: SupportTicket[];
  artistProfile: ArtistWorkspaceProfile;
  toggleSaveArtist: (artistId: string) => void;
  createOrUpdateGig: (gig: Omit<EventGig, "id" | "createdAt"> & { id?: string }) => EventGig;
  updateGigStatus: (gigId: string, status: EventGig["status"]) => void;
  deleteGig: (gigId: string) => void;
  submitApplication: (
    app: Omit<GigApplication, "id" | "status" | "createdAt">
  ) => GigApplication;
  startInquiryConversation: (params: {
    artist: SampleArtist;
    clientId: string;
    clientName: string;
    gigId?: string;
    gigTitle: string;
    initialMessage: string;
  }) => ConversationThread;
  sendMessage: (
    conversationId: string,
    senderRole: "client" | "artist",
    senderName: string,
    body: string
  ) => void;
  sendCounterProposal: (
    conversationId: string,
    proposal: Omit<ProposalVersion, "id" | "version" | "status" | "createdAt">
  ) => void;
  acceptProposalVersion: (conversationId: string, proposalId: string) => BookingRecord | null;
  updateBookingStatus: (bookingId: string, nextStatus: BookingLifecycleStatus) => void;
  updateArtistProfile: (patch: Partial<ArtistWorkspaceProfile>) => void;
  addPortfolioItem: (item: Omit<PortfolioItem, "id">) => void;
  removePortfolioItem: (itemId: string) => void;
  toggleAvailabilityDate: (isoDate: string) => void;
  markNotificationRead: (id: string) => void;
  createSupportTicket: (
    ticket: Omit<SupportTicket, "id" | "status" | "createdAt">
  ) => SupportTicket;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MarketplaceState>(() => loadState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage failures
    }
  }, [state]);

  const toggleSaveArtist = useCallback((artistId: string) => {
    setState((prev) => {
      const exists = prev.savedArtistIds.includes(artistId);
      return {
        ...prev,
        savedArtistIds: exists
          ? prev.savedArtistIds.filter((id) => id !== artistId)
          : [...prev.savedArtistIds, artistId],
      };
    });
  }, []);

  const createOrUpdateGig = useCallback(
    (input: Omit<EventGig, "id" | "createdAt"> & { id?: string }): EventGig => {
      const now = new Date().toISOString();
      const created: EventGig = {
        ...input,
        id: input.id || `gig-${Date.now()}`,
        createdAt: now,
        isSample: false,
      };
      setState((prev) => {
        const exists = prev.gigs.some((g) => g.id === created.id);
        return {
          ...prev,
          gigs: exists
            ? prev.gigs.map((g) => (g.id === created.id ? created : g))
            : [created, ...prev.gigs],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: created.status === "draft" ? "Gig draft saved" : "Gig brief published (prototype)",
              detail: created.title,
              path: `/client/gigs/${created.id}`,
              read: false,
              createdAt: now,
            },
            ...prev.notifications,
          ],
        };
      });
      return created;
    },
    []
  );

  const updateGigStatus = useCallback((gigId: string, status: EventGig["status"]) => {
    setState((prev) => ({
      ...prev,
      gigs: prev.gigs.map((g) => (g.id === gigId ? { ...g, status } : g)),
    }));
  }, []);

  const deleteGig = useCallback((gigId: string) => {
    setState((prev) => ({
      ...prev,
      gigs: prev.gigs.filter((g) => g.id !== gigId),
    }));
  }, []);

  const submitApplication = useCallback(
    (input: Omit<GigApplication, "id" | "status" | "createdAt">): GigApplication => {
      const now = new Date().toISOString();
      const newApp: GigApplication = {
        ...input,
        id: `app-${Date.now()}`,
        status: "submitted",
        createdAt: now,
      };
      setState((prev) => ({
        ...prev,
        applications: [newApp, ...prev.applications],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: "Application submitted (prototype)",
            detail: `Quote of ₹${input.quotedAmountInr.toLocaleString("en-IN")} sent for review.`,
            path: "/artist/applications",
            read: false,
            createdAt: now,
          },
          ...prev.notifications,
        ],
      }));
      return newApp;
    },
    []
  );

  const startInquiryConversation = useCallback(
    (params: {
      artist: SampleArtist;
      clientId: string;
      clientName: string;
      gigId?: string;
      gigTitle: string;
      initialMessage: string;
    }): ConversationThread => {
      const now = new Date().toISOString();
      const thread: ConversationThread = {
        id: `thread-${Date.now()}`,
        gigId: params.gigId,
        gigTitle: params.gigTitle,
        clientId: params.clientId,
        clientName: params.clientName,
        artistId: params.artist.id,
        artistName: params.artist.displayName,
        artistSlug: params.artist.slug,
        category: params.artist.primaryCategory,
        city: params.artist.city,
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderRole: "client",
            senderName: params.clientName,
            body: params.initialMessage,
            createdAt: now,
          },
        ],
        proposals: [],
      };
      setState((prev) => ({
        ...prev,
        conversations: [thread, ...prev.conversations],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: "Inquiry thread started",
            detail: `Conversation with ${params.artist.displayName}`,
            path: `/messages/${thread.id}`,
            read: false,
            createdAt: now,
          },
          ...prev.notifications,
        ],
      }));
      return thread;
    },
    []
  );

  const sendMessage = useCallback(
    (
      conversationId: string,
      senderRole: "client" | "artist",
      senderName: string,
      body: string
    ) => {
      const now = new Date().toISOString();
      setState((prev) => ({
        ...prev,
        conversations: prev.conversations.map((thread) =>
          thread.id !== conversationId
            ? thread
            : {
                ...thread,
                messages: [
                  ...thread.messages,
                  {
                    id: `msg-${Date.now()}`,
                    senderRole,
                    senderName,
                    body,
                    createdAt: now,
                  },
                ],
              }
        ),
      }));
    },
    []
  );

  const sendCounterProposal = useCallback(
    (
      conversationId: string,
      proposalInput: Omit<ProposalVersion, "id" | "version" | "status" | "createdAt">
    ) => {
      const now = new Date().toISOString();
      setState((prev) => ({
        ...prev,
        conversations: prev.conversations.map((thread) => {
          if (thread.id !== conversationId) return thread;
          const nextVersion = thread.proposals.length + 1;
          const superseded = thread.proposals.map((p) =>
            p.status === "pending" ? { ...p, status: "superseded" as const } : p
          );
          const createdProposal: ProposalVersion = {
            ...proposalInput,
            id: `prop-${Date.now()}`,
            version: nextVersion,
            status: "pending",
            createdAt: now,
          };
          return {
            ...thread,
            proposals: [...superseded, createdProposal],
            messages: [
              ...thread.messages,
              {
                id: `msg-${Date.now()}`,
                senderRole: "system",
                senderName: "Cultgig Offer Log",
                body: `Proposal v${nextVersion} submitted by ${proposalInput.proposedByName} for ₹${Math.round(
                  proposalInput.amountPaise / 100
                ).toLocaleString("en-IN")}.`,
                createdAt: now,
              },
            ],
          };
        }),
      }));
    },
    []
  );

  const acceptProposalVersion = useCallback(
    (conversationId: string, proposalId: string): BookingRecord | null => {
      let createdOrUpdatedBooking: BookingRecord | null = null;
      const now = new Date().toISOString();

      setState((prev) => {
        const thread = prev.conversations.find((c) => c.id === conversationId);
        const target = thread?.proposals.find((p) => p.id === proposalId);
        if (!thread || !target) return prev;

        const bookingId = thread.bookingId || `booking-${Date.now()}`;
        const nextBooking: BookingRecord = {
          id: bookingId,
          isSample: thread.isSample,
          conversationId: thread.id,
          gigId: thread.gigId,
          gigTitle: thread.gigTitle,
          clientId: thread.clientId,
          clientName: thread.clientName,
          artistId: thread.artistId,
          artistName: thread.artistName,
          artistSlug: thread.artistSlug,
          acceptedProposalVersion: target.version,
          grossAmountPaise: target.amountPaise,
          platformFeePaise: 0,
          artistSharePaise: target.amountPaise,
          currency: "INR",
          eventDate: target.eventDate,
          city: thread.city,
          serviceSummary: `${target.duration} — ${target.inclusions.join(", ")}`,
          status: "awaiting_payment",
          updatedAt: now,
        };
        createdOrUpdatedBooking = nextBooking;

        const existingBooking = prev.bookings.some((b) => b.id === bookingId);

        return {
          ...prev,
          conversations: prev.conversations.map((c) =>
            c.id !== conversationId
              ? c
              : {
                  ...c,
                  bookingId,
                  proposals: c.proposals.map((p) =>
                    p.id === proposalId
                      ? { ...p, status: "accepted" }
                      : p.status === "pending"
                      ? { ...p, status: "superseded" }
                      : p
                  ),
                  messages: [
                    ...c.messages,
                    {
                      id: `msg-${Date.now()}`,
                      senderRole: "system",
                      senderName: "Cultgig Offer Log",
                      body: `Proposal v${target.version} mutually accepted. Booking moved to awaiting_payment.`,
                      createdAt: now,
                    },
                  ],
                }
          ),
          bookings: existingBooking
            ? prev.bookings.map((b) => (b.id === bookingId ? nextBooking : b))
            : [nextBooking, ...prev.bookings],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: `Proposal v${target.version} accepted`,
              detail: `Booking ${bookingId} is now awaiting approved payment setup.`,
              path: `/checkout/${bookingId}`,
              read: false,
              createdAt: now,
            },
            ...prev.notifications,
          ],
        };
      });

      return createdOrUpdatedBooking;
    },
    []
  );

  const updateBookingStatus = useCallback(
    (bookingId: string, nextStatus: BookingLifecycleStatus) => {
      const now = new Date().toISOString();
      setState((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: nextStatus, updatedAt: now } : b
        ),
      }));
    },
    []
  );

  const updateArtistProfile = useCallback((patch: Partial<ArtistWorkspaceProfile>) => {
    setState((prev) => ({
      ...prev,
      artistProfile: { ...prev.artistProfile, ...patch },
    }));
  }, []);

  const addPortfolioItem = useCallback((item: Omit<PortfolioItem, "id">) => {
    setState((prev) => ({
      ...prev,
      artistProfile: {
        ...prev.artistProfile,
        portfolio: [...prev.artistProfile.portfolio, { ...item, id: `pf-${Date.now()}` }],
      },
    }));
  }, []);

  const removePortfolioItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      artistProfile: {
        ...prev.artistProfile,
        portfolio: prev.artistProfile.portfolio.filter((p) => p.id !== itemId),
      },
    }));
  }, []);

  const toggleAvailabilityDate = useCallback((isoDate: string) => {
    setState((prev) => {
      const exists = prev.artistProfile.availabilitySlots.includes(isoDate);
      return {
        ...prev,
        artistProfile: {
          ...prev.artistProfile,
          availabilitySlots: exists
            ? prev.artistProfile.availabilitySlots.filter((d) => d !== isoDate)
            : [...prev.artistProfile.availabilitySlots, isoDate].sort(),
        },
      };
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const createSupportTicket = useCallback(
    (input: Omit<SupportTicket, "id" | "status" | "createdAt">): SupportTicket => {
      const ticket: SupportTicket = {
        ...input,
        id: `CG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        status: "recorded_locally",
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        supportTickets: [ticket, ...prev.supportTickets],
      }));
      return ticket;
    },
    []
  );

  return (
    <MarketplaceContext.Provider
      value={{
        artists: sampleArtists,
        savedArtistIds: state.savedArtistIds,
        gigs: state.gigs,
        applications: state.applications,
        conversations: state.conversations,
        bookings: state.bookings,
        notifications: state.notifications,
        supportTickets: state.supportTickets,
        artistProfile: state.artistProfile,
        toggleSaveArtist,
        createOrUpdateGig,
        updateGigStatus,
        deleteGig,
        submitApplication,
        startInquiryConversation,
        sendMessage,
        sendCounterProposal,
        acceptProposalVersion,
        updateBookingStatus,
        updateArtistProfile,
        addPortfolioItem,
        removePortfolioItem,
        toggleAvailabilityDate,
        markNotificationRead,
        createSupportTicket,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace() must be used inside <MarketplaceProvider>");
  return ctx;
}
