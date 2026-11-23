import { imageManifest } from "../content/images";
import type {
  ArtistProfile,
  BookingRecord,
  ClientProfile,
  ConversationThread,
  EventGig,
  GigApplication,
  MarketplaceNotification,
  Review,
  ServicePackage,
  UserAccount,
  UserSettings,
} from "../types/marketplace";

/**
 * DEMO MODE FIXTURES ONLY.
 * Every record here is illustrative, flagged `isSample: true`, and is shown with a "Demo" label.
 * None of these people, businesses, bookings, reviews or amounts are real.
 * Dates are generated relative to the moment the demo database is seeded so the demo never goes stale.
 */

/**
 * Demo data version. Includes a fingerprint of the bundled image URLs (content-hashed by Vite) so a
 * new deployment reseeds stale browser data instead of showing broken images.
 */
export const DEMO_DATA_VERSION = `4:${Object.values(imageManifest)
  .map((i) => i.src)
  .join("|")
  .split("")
  .reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) | 0, 7)}`;

export interface DemoDatabase {
  version: string;
  seededAt: string;
  users: UserAccount[];
  credentials: Record<string, { salt: string; hash: string }>;
  pendingCodes: { userId: string; purpose: "verify_email" | "reset_password"; code: string; expiresAt: string }[];
  settings: UserSettings[];
  artistProfiles: ArtistProfile[];
  clientProfiles: ClientProfile[];
  gigs: EventGig[];
  applications: GigApplication[];
  conversations: ConversationThread[];
  bookings: BookingRecord[];
  notifications: MarketplaceNotification[];
  savedArtists: { userId: string; artistProfileId: string }[];
  reviews: Review[];
  reports: import("../types/marketplace").SafetyReport[];
  supportTickets: import("../types/marketplace").SupportTicket[];
  auditEvents: import("../types/marketplace").AuditEvent[];
}

/** One-click demo sign-in accounts surfaced on the sign-in page. */
export const FEATURED_DEMO_ACCOUNTS = [
  { userId: "demo-client-zoe", label: "Zoe Fernandes", detail: "Client · Bandra Terrace Bistro, Mumbai" },
  { userId: "demo-artist-rhea", label: "Rhea Kapoor", detail: "Artist · Acoustic vocalist, Mumbai" },
  { userId: "demo-client-aarav", label: "Aarav Mehta", detail: "Client · Planning a family wedding, Jaipur" },
  { userId: "demo-artist-meera", label: "Meera Joshi", detail: "Artist · Event photographer, New Delhi" },
] as const;

const DAY = 24 * 60 * 60 * 1000;

function isoDate(base: Date, offsetDays: number): string {
  return new Date(base.getTime() + offsetDays * DAY).toISOString().slice(0, 10);
}
function isoTime(base: Date, offsetDays: number, hour = 10): string {
  const d = new Date(base.getTime() + offsetDays * DAY);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

function pkg(p: Omit<ServicePackage, "description" | "format"> & Partial<Pick<ServicePackage, "description" | "format">>): ServicePackage {
  return { description: "", format: "on_site", ...p };
}

function user(p: Pick<UserAccount, "id" | "email" | "displayName" | "city" | "roles" | "activeRole"> & Partial<UserAccount>, createdAt: string): UserAccount {
  return {
    phone: "",
    avatarUrl: "",
    emailVerified: true,
    onboarding: {
      artist: p.roles.includes("artist") ? "complete" : "not_started",
      client: p.roles.includes("client") ? "complete" : "not_started",
    },
    authProvider: "demo",
    isSample: true,
    createdAt,
    ...p,
  };
}

export function defaultSettings(userId: string): UserSettings {
  return {
    userId,
    notifications: { email: true, messages: true, proposals: true, bookings: true, marketing: false },
    profileVisibility: "public",
    showCityOnProfile: true,
    deactivationRequestedAt: null,
    blockedUserIds: [],
  };
}

export function createDemoSeed(now: Date = new Date()): DemoDatabase {
  const created = isoTime(now, -60);
  const d = (n: number) => isoDate(now, n);
  const t = (n: number, h?: number) => isoTime(now, n, h);

  const users: UserAccount[] = [
    user({ id: "demo-client-zoe", email: "zoe@demo.cultgig.local", displayName: "Zoe Fernandes", city: "Mumbai", phone: "+91 98200 00001", roles: ["client"], activeRole: "client" }, created),
    user({ id: "demo-client-aarav", email: "aarav@demo.cultgig.local", displayName: "Aarav Mehta", city: "Jaipur", roles: ["client"], activeRole: "client" }, created),
    user({ id: "demo-client-kala", email: "studio@demo.cultgig.local", displayName: "Kala Studio Collective", city: "Bengaluru", roles: ["client"], activeRole: "client" }, created),
    user({ id: "demo-artist-rhea", email: "rhea@demo.cultgig.local", displayName: "Rhea Kapoor", city: "Mumbai", roles: ["artist"], activeRole: "artist", avatarUrl: imageManifest.creatorRhea.src }, created),
    user({ id: "demo-artist-meera", email: "meera@demo.cultgig.local", displayName: "Meera Joshi", city: "New Delhi", roles: ["artist", "client"], activeRole: "artist", avatarUrl: imageManifest.creatorMeera.src }, created),
    user({ id: "demo-artist-zarina", email: "zarina@demo.cultgig.local", displayName: "Zarina Khan", city: "Jaipur", roles: ["artist"], activeRole: "artist" }, created),
    user({ id: "demo-artist-naina", email: "naina@demo.cultgig.local", displayName: "Naina Rao", city: "Bengaluru", roles: ["artist"], activeRole: "artist", avatarUrl: imageManifest.creatorNaina.src }, created),
    user({ id: "demo-artist-kabir", email: "kabir@demo.cultgig.local", displayName: "Kabir Malhotra", city: "Mumbai", roles: ["artist"], activeRole: "artist", avatarUrl: imageManifest.creatorKabir.src }, created),
    user({ id: "demo-artist-ananya", email: "ananya@demo.cultgig.local", displayName: "Ananya Das", city: "Kolkata", roles: ["artist"], activeRole: "artist" }, created),
    user({ id: "demo-artist-rohan", email: "rohan@demo.cultgig.local", displayName: "Rohan Sen", city: "Bengaluru", roles: ["artist"], activeRole: "artist", avatarUrl: imageManifest.creatorArjun.src }, created),
    user({ id: "demo-artist-tara", email: "tara@demo.cultgig.local", displayName: "Tara Movement Collective", city: "Pune", roles: ["artist"], activeRole: "artist" }, created),
  ];

  const base = { isSample: true, published: true, equipmentNotes: "", unavailableDates: [] as string[], createdAt: created, updatedAt: created, priceMaxInr: null as number | null };

  const artistProfiles: ArtistProfile[] = [
    {
      ...base,
      id: "artist-rhea",
      ownerUserId: "demo-artist-rhea",
      slug: "rhea-kapoor-acoustic",
      displayName: "Rhea Kapoor",
      tagline: "Indie and soul acoustic vocalist for intimate dinners, sundowners and receptions",
      primaryCategory: "singers-and-vocalists",
      secondaryCategories: ["music-and-bands"],
      city: "Mumbai",
      travelCities: ["Pune", "Alibaug", "Goa"],
      travelRadiusKm: 180,
      workingMode: "on_site",
      artistFormat: "solo",
      pricingMode: "starting_at",
      startingPriceInr: 18000,
      experienceYears: 6,
      languages: ["English", "Hindi"],
      bio: "Acoustic vocalist performing stripped-back indie, soul and contemporary Hindi rearrangements for terrace dinners, boutique hotels and intimate celebrations. I bring my own electro-acoustic guitar and can plug into most house sound systems.",
      equipmentNotes: "Electro-acoustic guitar, vocal mic. Needs a 2-channel PA or mixer from the venue.",
      unavailableDates: [d(9), d(10), d(24)],
      avatarUrl: imageManifest.creatorRhea.src,
      avatarAlt: imageManifest.creatorRhea.alt,
      coverUrl: imageManifest.categoryMusicians.src,
      coverAlt: imageManifest.categoryMusicians.alt,
      portfolio: [
        { id: "pf-rhea-1", type: "image", title: "Terrace acoustic session, Bandra", caption: "90-minute sunset set for 55 guests.", mediaUrl: imageManifest.categoryMusicians.src, featured: true, ownershipConfirmed: true },
        { id: "pf-rhea-2", type: "image", title: "Studio rehearsal", caption: "Guitar and vocal setup using a compact house PA.", mediaUrl: imageManifest.pageStory.src, featured: false, ownershipConfirmed: true },
        { id: "pf-rhea-3", type: "image", title: "Hotel lobby evening", caption: "Background acoustic set for a boutique hotel launch.", mediaUrl: imageManifest.heroPerformance.src, featured: false, ownershipConfirmed: true },
      ],
      packages: [
        pkg({ id: "pkg-rhea-1", title: "Intimate 90-minute solo acoustic set", description: "Two 45-minute sets of mellow English and Hindi acoustic music.", category: "singers-and-vocalists", pricingMode: "starting_at", duration: "90 mins (2 × 45 min sets)", inclusions: ["Acoustic guitar and vocal mic", "45-minute soundcheck", "Curated mellow repertoire"], exclusions: ["PA speakers (venue provides)", "Outstation travel and stay"], priceInr: 18000 }),
        pkg({ id: "pkg-rhea-2", title: "Acoustic duo with percussionist", description: "Vocals, guitar and cajon for receptions and larger rooms.", category: "music-and-bands", pricingMode: "starting_at", duration: "2 hours", inclusions: ["Vocalist, acoustic guitar and cajon", "One custom feature song"], exclusions: ["Sound engineer and monitors", "Extension beyond 11 PM"], priceInr: 32000 }),
      ],
    },
    {
      ...base,
      id: "artist-meera",
      ownerUserId: "demo-artist-meera",
      slug: "meera-joshi-photography",
      displayName: "Meera Joshi",
      tagline: "Documentary wedding and cultural event photographer for unposed moments",
      primaryCategory: "photography-and-videography",
      secondaryCategories: [],
      city: "New Delhi",
      travelCities: ["Jaipur", "Udaipur", "Gurugram"],
      travelRadiusKm: 350,
      workingMode: "on_site",
      artistFormat: "solo",
      pricingMode: "range",
      startingPriceInr: 28000,
      priceMaxInr: 65000,
      experienceYears: 7,
      languages: ["English", "Hindi", "Punjabi"],
      bio: "Documentary storyteller focused on natural light, candid family moments and editorial brand launches across Delhi NCR and Rajasthan.",
      avatarUrl: imageManifest.creatorMeera.src,
      avatarAlt: imageManifest.creatorMeera.alt,
      coverUrl: imageManifest.categoryPhotographers.src,
      coverAlt: imageManifest.categoryPhotographers.alt,
      portfolio: [
        { id: "pf-meera-1", type: "image", title: "Courtyard mehendi coverage", caption: "Natural daylight storytelling across five hours.", mediaUrl: imageManifest.categoryPhotographers.src, featured: true, ownershipConfirmed: true },
      ],
      packages: [
        pkg({ id: "pkg-meera-1", title: "Half-day documentary coverage", description: "Candid coverage of a ceremony or launch.", category: "photography-and-videography", pricingMode: "fixed_package", duration: "4 hours", inclusions: ["150+ colour-graded photos", "Private online gallery within 7 days"], exclusions: ["Printed albums", "Drone footage"], priceInr: 28000 }),
        pkg({ id: "pkg-meera-2", title: "Full wedding day", description: "Getting ready through to the reception.", category: "photography-and-videography", pricingMode: "fixed_package", duration: "10 hours", inclusions: ["Two photographers", "400+ edited photos", "Highlights reel"], exclusions: ["Travel outside Delhi NCR"], priceInr: 65000 }),
      ],
    },
    {
      ...base,
      id: "artist-zarina",
      ownerUserId: "demo-artist-zarina",
      slug: "zarina-henna-atelier",
      displayName: "Zarina Khan",
      tagline: "Traditional Rajasthani and minimal contemporary bridal mehendi with organic cones",
      primaryCategory: "mehendi-artists",
      secondaryCategories: [],
      city: "Jaipur",
      travelCities: ["Udaipur", "Jodhpur", "New Delhi"],
      travelRadiusKm: 400,
      workingMode: "on_site",
      artistFormat: "group",
      pricingMode: "starting_at",
      startingPriceInr: 12000,
      experienceYears: 9,
      languages: ["Hindi", "English", "Urdu"],
      bio: "Hand-rolled organic henna specialist offering custom bridal motifs and quick, clean guest mehendi teams for family celebrations.",
      avatarUrl: imageManifest.categoryMehendi.src,
      avatarAlt: imageManifest.categoryMehendi.alt,
      coverUrl: imageManifest.categoryMehendi.src,
      coverAlt: imageManifest.categoryMehendi.alt,
      portfolio: [
        { id: "pf-zarina-1", type: "image", title: "Bridal mehendi detail", caption: "Fine jali motifs in fresh organic henna.", mediaUrl: imageManifest.categoryMehendi.src, featured: true, ownershipConfirmed: true },
      ],
      packages: [
        pkg({ id: "pkg-zarina-1", title: "Bridal mehendi (hands and feet)", category: "mehendi-artists", pricingMode: "starting_at", duration: "4–5 hours", inclusions: ["Fresh organic henna cones", "Motif consultation beforehand"], exclusions: ["Guest mehendi (priced per guest)"], priceInr: 12000 }),
      ],
    },
    {
      ...base,
      id: "artist-naina",
      ownerUserId: "demo-artist-naina",
      slug: "naina-rao-draping-beauty",
      displayName: "Naina Rao",
      tagline: "Regional saree draping, hair styling and skin-first makeup",
      primaryCategory: "saree-draping-and-styling",
      secondaryCategories: ["makeup-and-beauty"],
      city: "Bengaluru",
      travelCities: ["Mysuru", "Chennai", "Hyderabad"],
      travelRadiusKm: 300,
      workingMode: "on_site",
      artistFormat: "solo",
      pricingMode: "fixed_package",
      startingPriceInr: 9500,
      experienceYears: 5,
      languages: ["English", "Kannada", "Tamil", "Hindi"],
      bio: "Specialising in Kanjeevaram, Banarasi and pre-pleated saree draping paired with skin-first makeup for ceremonies and shoots.",
      avatarUrl: imageManifest.creatorNaina.src,
      avatarAlt: imageManifest.creatorNaina.alt,
      coverUrl: imageManifest.categorySaree.src,
      coverAlt: imageManifest.categorySaree.alt,
      portfolio: [
        { id: "pf-naina-1", type: "image", title: "Kanjeevaram pleating and pallu styling", caption: "Box-folded pleats with secure pinning for all-day comfort.", mediaUrl: imageManifest.categorySaree.src, featured: true, ownershipConfirmed: true },
      ],
      packages: [
        pkg({ id: "pkg-naina-1", title: "Saree draping and pinning (per person)", category: "saree-draping-and-styling", pricingMode: "fixed_package", duration: "45 mins", inclusions: ["Steam touch-up", "Regional drape of your choice", "Concealed pinning"], exclusions: ["Makeup and hair (add-on)"], priceInr: 9500 }),
      ],
    },
    {
      ...base,
      id: "artist-kabir",
      ownerUserId: "demo-artist-kabir",
      slug: "kabir-malhotra-scenography",
      displayName: "Kabir Malhotra",
      tagline: "Floral installations, warm lighting and intimate event scenography",
      primaryCategory: "decorators-and-florists",
      secondaryCategories: [],
      city: "Mumbai",
      travelCities: ["Lonavala", "Pune", "Goa"],
      travelRadiusKm: 250,
      workingMode: "on_site",
      artistFormat: "group",
      pricingMode: "quote_required",
      startingPriceInr: null,
      experienceYears: 8,
      languages: ["English", "Hindi"],
      bio: "Transforming cafés, rooftops and private courtyards with seasonal Indian botanicals, warm filament lighting and custom fabric backdrops.",
      avatarUrl: imageManifest.creatorKabir.src,
      avatarAlt: imageManifest.creatorKabir.alt,
      coverUrl: imageManifest.categoryDecorators.src,
      coverAlt: imageManifest.categoryDecorators.alt,
      portfolio: [
        { id: "pf-kabir-1", type: "image", title: "Candlelit courtyard dinner", caption: "Marigolds, brass urns and dimmable festoons.", mediaUrl: imageManifest.categoryDecorators.src, featured: true, ownershipConfirmed: true },
      ],
      packages: [
        pkg({ id: "pkg-kabir-1", title: "Custom terrace and dining scenography", category: "decorators-and-florists", pricingMode: "quote_required", duration: "Full setup and teardown", inclusions: ["Moodboard and floor plan", "Floral sourcing and installation", "Same-night teardown"], exclusions: ["Furniture rental unless quoted"], priceInr: null }),
      ],
    },
    {
      ...base,
      id: "artist-ananya",
      ownerUserId: "demo-artist-ananya",
      slug: "ananya-das-mural-studio",
      displayName: "Ananya Das",
      tagline: "Commissioned wall murals and hand-painted interiors for cafés and studios",
      primaryCategory: "wall-art-and-murals",
      secondaryCategories: ["painters-and-illustrators"],
      city: "Kolkata",
      travelCities: ["Bengaluru", "Mumbai", "New Delhi"],
      travelRadiusKm: 500,
      workingMode: "both",
      artistFormat: "solo",
      pricingMode: "range",
      startingPriceInr: 22000,
      priceMaxInr: 85000,
      experienceYears: 6,
      languages: ["Bengali", "English", "Hindi"],
      bio: "Original commissioned murals and site-specific illustration for restaurants, coworking studios and homes — always with the owner's written permission.",
      avatarUrl: imageManifest.categoryMural.src,
      avatarAlt: imageManifest.categoryMural.alt,
      coverUrl: imageManifest.categoryMural.src,
      coverAlt: imageManifest.categoryMural.alt,
      portfolio: [
        { id: "pf-ananya-1", type: "image", title: "Botanical courtyard mural", caption: "Weather-sealed exterior acrylic on brick plaster.", mediaUrl: imageManifest.categoryMural.src, featured: true, ownershipConfirmed: true },
      ],
      packages: [
        pkg({ id: "pkg-ananya-1", title: "Interior feature wall (up to 100 sq ft)", category: "wall-art-and-murals", pricingMode: "range", format: "on_site", duration: "3–4 days", inclusions: ["Two concept sketches", "Artist-grade acrylics and matte sealer"], exclusions: ["Scaffolding above 10 ft", "Wall plaster repair"], priceInr: 22000 }),
      ],
    },
    {
      ...base,
      id: "artist-rohan",
      ownerUserId: "demo-artist-rohan",
      slug: "rohan-sen-emcee-host",
      displayName: "Rohan Sen",
      tagline: "Bilingual stage anchor, cultural host and panel moderator",
      primaryCategory: "emcees-and-event-hosts",
      secondaryCategories: [],
      city: "Bengaluru",
      travelCities: ["Hyderabad", "Chennai", "Mumbai"],
      travelRadiusKm: 400,
      workingMode: "both",
      artistFormat: "solo",
      pricingMode: "starting_at",
      startingPriceInr: 15000,
      experienceYears: 5,
      languages: ["English", "Hindi"],
      bio: "Warm, articulate anchor who keeps sangeets, brand launches and community panels moving — without loud, clichéd scripts.",
      avatarUrl: imageManifest.creatorArjun.src,
      avatarAlt: imageManifest.creatorArjun.alt,
      coverUrl: imageManifest.categoryEmcee.src,
      coverAlt: imageManifest.categoryEmcee.alt,
      portfolio: [
        { id: "pf-rohan-1", type: "image", title: "Evening cultural showcase", caption: "Run-of-show scripting and bilingual audience engagement.", mediaUrl: imageManifest.categoryEmcee.src, featured: true, ownershipConfirmed: true },
      ],
      packages: [
        pkg({ id: "pkg-rohan-1", title: "Evening ceremony or launch anchoring", category: "emcees-and-event-hosts", pricingMode: "starting_at", duration: "3 hours", inclusions: ["Cue sheet preparation", "One briefing call"], exclusions: ["Stage audio and cordless mics"], priceInr: 15000 }),
      ],
    },
    {
      ...base,
      id: "artist-tara",
      ownerUserId: "demo-artist-tara",
      slug: "tara-ensemble-dance",
      displayName: "Tara Movement Collective",
      tagline: "Contemporary and semi-classical choreography for showcases and sangeets",
      primaryCategory: "dance-and-choreography",
      secondaryCategories: [],
      city: "Pune",
      travelCities: ["Mumbai", "Nashik", "Goa"],
      travelRadiusKm: 220,
      workingMode: "both",
      artistFormat: "group",
      pricingMode: "range",
      startingPriceInr: 25000,
      priceMaxInr: 60000,
      experienceYears: 7,
      languages: ["Marathi", "Hindi", "English"],
      bio: "A four-member movement collective creating live fusion performances and stress-free family sangeet choreography.",
      avatarUrl: imageManifest.categoryDanceClassical.src,
      avatarAlt: imageManifest.categoryDanceClassical.alt,
      coverUrl: imageManifest.categoryDanceClassical.src,
      coverAlt: imageManifest.categoryDanceClassical.alt,
      portfolio: [
        { id: "pf-tara-1", type: "image", title: "Backstage before a fusion set", caption: "12-minute choreographed showcase with costume cues.", mediaUrl: imageManifest.categoryDanceClassical.src, featured: true, ownershipConfirmed: true },
      ],
      packages: [
        pkg({ id: "pkg-tara-1", title: "20-minute contemporary fusion set (4 dancers)", category: "dance-and-choreography", pricingMode: "fixed_package", duration: "20 mins on stage", inclusions: ["4 trained dancers", "Mixed audio track", "Coordinated costumes"], exclusions: ["Stage lighting and sound"], priceInr: 38000 }),
        pkg({ id: "pkg-tara-2", title: "Sangeet choreography (remote + 2 in-person sessions)", category: "dance-and-choreography", pricingMode: "fixed_package", format: "both", duration: "3 weeks", inclusions: ["Up to 4 family routines", "Video tutorials", "Two in-person rehearsals"], exclusions: ["Performance on the day"], priceInr: 25000 }),
      ],
    },
  ];

  const clientProfiles: ClientProfile[] = [
    { userId: "demo-client-zoe", accountType: "business", organisationName: "Bandra Terrace Bistro", organisationRole: "Owner", website: "", hiringInterests: ["singers-and-vocalists", "music-and-bands", "emcees-and-event-hosts"], typicalEventTypes: ["Dining evenings", "Launch nights"], typicalBudgetInr: 25000, updatedAt: created },
    { userId: "demo-client-aarav", accountType: "individual", organisationName: "", organisationRole: "", website: "", hiringInterests: ["mehendi-artists", "photography-and-videography"], typicalEventTypes: ["Family wedding"], typicalBudgetInr: null, updatedAt: created },
    { userId: "demo-client-kala", accountType: "business", organisationName: "Kala Studio Collective", organisationRole: "Studio manager", website: "", hiringInterests: ["wall-art-and-murals"], typicalEventTypes: ["Interior commissions"], typicalBudgetInr: 35000, updatedAt: created },
    { userId: "demo-artist-meera", accountType: "individual", organisationName: "", organisationRole: "", website: "", hiringInterests: ["makeup-and-beauty"], typicalEventTypes: ["Shoots"], typicalBudgetInr: null, updatedAt: created },
  ];

  const gigBase = { isSample: true, specialInstructions: "", references: "", experiencePreference: "", locationPreference: "", createdAt: t(-6), updatedAt: t(-6) };

  const gigs: EventGig[] = [
    {
      ...gigBase,
      id: "gig-terrace-acoustic",
      clientId: "demo-client-zoe",
      clientDisplayName: "Bandra Terrace Bistro",
      clientType: "business",
      title: "Saturday sunset acoustic set for a 60-seat terrace dinner",
      category: "singers-and-vocalists",
      eventType: "Restaurant dining evening",
      description: "We're looking for a warm acoustic act for our rooftop dinner service. Guests are mostly couples and small groups, so the music should stay conversational.",
      eventDate: d(12),
      startTime: "19:00",
      endTime: "21:00",
      city: "Mumbai",
      venueArea: "Bandra West (exact address shared after a match)",
      workingMode: "on_site",
      artistsNeeded: 1,
      durationSummary: "2 hours (two 45-minute sets with a break)",
      requirements: "English and Hindi acoustic repertoire. No backing tracks.",
      deliverables: "Two 45-minute live sets.",
      equipmentAndSpaceNotes: "In-house PA, 2-channel mixer and vocal mic stand provided. Soundcheck at 6:15 PM.",
      budgetMode: "range",
      budgetMinInr: 15000,
      budgetMaxInr: 25000,
      travelCovered: false,
      applicationDeadline: d(6),
      experiencePreference: "3+ years performing in hospitality venues",
      status: "open",
    },
    {
      ...gigBase,
      id: "gig-jaipur-mehendi",
      clientId: "demo-client-aarav",
      clientDisplayName: "Mehta family",
      clientType: "individual",
      title: "Courtyard mehendi artist and assistant for the bride and 12 guests",
      category: "mehendi-artists",
      eventType: "Wedding mehendi",
      description: "Daytime mehendi for my sister's wedding. Bridal design for hands and feet, plus simple designs for close family.",
      eventDate: d(19),
      startTime: "11:00",
      endTime: "16:30",
      city: "Jaipur",
      venueArea: "Civil Lines",
      workingMode: "on_site",
      artistsNeeded: 2,
      durationSummary: "5.5 hours",
      requirements: "Organic henna only. Bridal motif consultation a week before.",
      deliverables: "Bridal hands and feet, plus minimal designs for 12 guests.",
      equipmentAndSpaceNotes: "Shaded seating, water and lunch provided.",
      budgetMode: "open_to_quotes",
      budgetMinInr: null,
      budgetMaxInr: null,
      travelCovered: true,
      applicationDeadline: d(10),
      status: "open",
    },
    {
      ...gigBase,
      id: "gig-studio-mural",
      clientId: "demo-client-kala",
      clientDisplayName: "Kala Studio Collective",
      clientType: "business",
      title: "Botanical wall mural for a new Indiranagar studio reception",
      category: "wall-art-and-murals",
      eventType: "Interior commission",
      description: "Original mural for our reception wall. We'd like botanical forms in muted earth tones that photograph well.",
      eventDate: d(25),
      startTime: "10:00",
      endTime: "18:00",
      city: "Bengaluru",
      venueArea: "Indiranagar",
      workingMode: "on_site",
      artistsNeeded: 1,
      durationSummary: "3–4 days on site",
      requirements: "Concept sketch approval before painting.",
      deliverables: "Original 12 ft × 8 ft mural.",
      equipmentAndSpaceNotes: "Primed matte wall ready; written owner permission on file.",
      budgetMode: "fixed",
      budgetMinInr: 35000,
      budgetMaxInr: 35000,
      travelCovered: false,
      applicationDeadline: d(14),
      status: "open",
    },
    {
      ...gigBase,
      id: "gig-launch-host-draft",
      clientId: "demo-client-zoe",
      clientDisplayName: "Bandra Terrace Bistro",
      clientType: "business",
      title: "Host for our winter menu launch night",
      category: "emcees-and-event-hosts",
      eventType: "Launch night",
      description: "Draft — still confirming the date with our chef.",
      eventDate: d(40),
      startTime: "19:30",
      endTime: "22:00",
      city: "Mumbai",
      venueArea: "Bandra West",
      workingMode: "on_site",
      artistsNeeded: 1,
      durationSummary: "2.5 hours",
      requirements: "",
      deliverables: "",
      equipmentAndSpaceNotes: "",
      budgetMode: "open_to_quotes",
      budgetMinInr: null,
      budgetMaxInr: null,
      travelCovered: false,
      applicationDeadline: d(30),
      status: "draft",
    },
  ];

  const applications: GigApplication[] = [
    {
      id: "app-rhea-terrace",
      gigId: "gig-terrace-acoustic",
      artistProfileId: "artist-rhea",
      artistUserId: "demo-artist-rhea",
      message: "Your terrace timing and 60-seat layout suit my mellow acoustic repertoire. I can plug my guitar straight into your 2-channel mixer.",
      quotedAmountPaise: 2_500_000,
      scopeSummary: "Two 45-minute live acoustic sets (English and Hindi), including a 6:15 PM soundcheck.",
      portfolioItemIds: ["pf-rhea-1"],
      availabilityConfirmed: true,
      travelCostPaise: 0,
      equipmentNotes: "Uses venue PA.",
      validUntil: d(8),
      status: "in_negotiation",
      conversationId: "conv-zoe-rhea",
      createdAt: t(-4),
      updatedAt: t(-1),
    },
    {
      id: "app-tara-terrace",
      gigId: "gig-terrace-acoustic",
      artistProfileId: "artist-tara",
      artistUserId: "demo-artist-tara",
      message: "We usually perform dance sets, but our vocalist-guitarist duo also plays acoustic evenings.",
      quotedAmountPaise: 2_200_000,
      scopeSummary: "Acoustic duo, two 40-minute sets.",
      portfolioItemIds: [],
      availabilityConfirmed: true,
      travelCostPaise: 300_000,
      equipmentNotes: "Travel from Pune added separately.",
      validUntil: d(7),
      status: "submitted",
      conversationId: null,
      createdAt: t(-3),
      updatedAt: t(-3),
    },
  ];

  const proposalBase = {
    conversationId: "conv-zoe-rhea",
    currency: "INR" as const,
    eventDate: d(12),
    deliverables: "Two 45-minute live acoustic sets",
    travelNotes: "Local Mumbai travel included.",
    cancellationTerms: "Free reschedule up to 72 hours before the event.",
  };

  const conversations: ConversationThread[] = [
    {
      id: "conv-zoe-rhea",
      isSample: true,
      subject: "Saturday sunset acoustic set",
      clientUserId: "demo-client-zoe",
      clientName: "Zoe Fernandes",
      artistUserId: "demo-artist-rhea",
      artistProfileId: "artist-rhea",
      artistName: "Rhea Kapoor",
      artistSlug: "rhea-kapoor-acoustic",
      category: "singers-and-vocalists",
      city: "Mumbai",
      gigId: "gig-terrace-acoustic",
      applicationId: "app-rhea-terrace",
      inquiry: null,
      bookingId: null,
      createdAt: t(-4, 9),
      updatedAt: t(-1, 15),
      lastReadAt: { "demo-client-zoe": t(-2, 12), "demo-artist-rhea": t(-1, 15) },
      proposals: [
        { ...proposalBase, id: "prop-zr-1", version: 1, proposedByUserId: "demo-artist-rhea", proposedByRole: "artist", proposedByName: "Rhea Kapoor", amountPaise: 2_500_000, duration: "7:00–9:00 PM (two 45-min sets)", inclusions: ["Solo vocals and acoustic guitar", "6:15 PM soundcheck"], exclusions: ["PA and mixer (venue provides)"], validUntil: d(8), status: "superseded", respondsToProposalId: null, createdAt: t(-4, 9), respondedAt: t(-2, 11) },
        { ...proposalBase, id: "prop-zr-2", version: 2, proposedByUserId: "demo-client-zoe", proposedByRole: "client", proposedByName: "Zoe Fernandes", amountPaise: 2_200_000, duration: "7:00–9:00 PM (two 45-min sets)", inclusions: ["Solo vocals and acoustic guitar", "6:15 PM soundcheck"], exclusions: ["PA and mixer (venue provides)"], validUntil: d(8), status: "superseded", respondsToProposalId: "prop-zr-1", createdAt: t(-2, 11), respondedAt: t(-1, 15) },
        { ...proposalBase, id: "prop-zr-3", version: 3, proposedByUserId: "demo-artist-rhea", proposedByRole: "artist", proposedByName: "Rhea Kapoor", amountPaise: 2_350_000, duration: "6:45–9:00 PM (arrival set + two 45-min sets)", inclusions: ["15-minute arrival ambience", "Two 45-minute vocal and guitar sets", "6:00 PM soundcheck"], exclusions: ["PA and mixer (venue provides)"], validUntil: d(8), status: "pending", respondsToProposalId: "prop-zr-2", createdAt: t(-1, 15), respondedAt: null },
      ],
      messages: [
        { id: "m-zr-1", conversationId: "conv-zoe-rhea", senderUserId: "demo-artist-rhea", senderRole: "artist", senderName: "Rhea Kapoor", body: "Hi Zoe — thanks for shortlisting me. I've sent Proposal v1 based on your brief.", proposalId: "prop-zr-1", createdAt: t(-4, 9) },
        { id: "m-zr-2", conversationId: "conv-zoe-rhea", senderUserId: "demo-client-zoe", senderRole: "client", senderName: "Zoe Fernandes", body: "Loved your clips. Our budget is a little tighter — could you do ₹22,000? I've sent a counter-offer.", proposalId: "prop-zr-2", createdAt: t(-2, 11) },
        { id: "m-zr-3", conversationId: "conv-zoe-rhea", senderUserId: "demo-artist-rhea", senderRole: "artist", senderName: "Rhea Kapoor", body: "I can meet you at ₹23,500 and add a 15-minute arrival set while guests are seated. Proposal v3 is in.", proposalId: "prop-zr-3", createdAt: t(-1, 15) },
      ],
    },
    {
      id: "conv-zoe-rohan",
      isSample: true,
      subject: "Corporate dinner anchoring",
      clientUserId: "demo-client-zoe",
      clientName: "Zoe Fernandes",
      artistUserId: "demo-artist-rohan",
      artistProfileId: "artist-rohan",
      artistName: "Rohan Sen",
      artistSlug: "rohan-sen-emcee-host",
      category: "emcees-and-event-hosts",
      city: "Mumbai",
      gigId: null,
      applicationId: null,
      inquiry: { eventTitle: "Corporate dinner anchoring", eventType: "Corporate dinner", eventDate: d(5), eventTime: "19:30", city: "Mumbai", venue: "Bandra Terrace Bistro", duration: "3 hours", requirements: "Bilingual hosting for an 80-guest dinner with two short speeches.", estimatedBudgetInr: 18000 },
      bookingId: "booking-zoe-rohan",
      createdAt: t(-12),
      updatedAt: t(-9),
      lastReadAt: { "demo-client-zoe": t(-9), "demo-artist-rohan": t(-9) },
      proposals: [
        { conversationId: "conv-zoe-rohan", currency: "INR", id: "prop-zro-1", version: 1, proposedByUserId: "demo-artist-rohan", proposedByRole: "artist", proposedByName: "Rohan Sen", amountPaise: 1_800_000, eventDate: d(5), duration: "3 hours", deliverables: "Bilingual anchoring and cue sheet", inclusions: ["Cue sheet preparation", "One briefing call"], exclusions: ["Stage audio"], travelNotes: "Flights Bengaluru–Mumbai booked by client.", cancellationTerms: "50% refundable up to 7 days before.", validUntil: d(-8), status: "accepted", respondsToProposalId: null, createdAt: t(-11), respondedAt: t(-9) },
      ],
      messages: [
        { id: "m-zro-1", conversationId: "conv-zoe-rohan", senderUserId: "demo-client-zoe", senderRole: "client", senderName: "Zoe Fernandes", body: "Hi Rohan, we're hosting an 80-guest corporate dinner. Would you be available to anchor?", proposalId: null, createdAt: t(-12) },
        { id: "m-zro-2", conversationId: "conv-zoe-rohan", senderUserId: "demo-artist-rohan", senderRole: "artist", senderName: "Rohan Sen", body: "Happy to. Proposal v1 attached.", proposalId: "prop-zro-1", createdAt: t(-11) },
        { id: "m-zro-3", conversationId: "conv-zoe-rohan", senderUserId: null, senderRole: "system", senderName: "Cultgig", body: "Zoe Fernandes accepted Proposal v1 (₹18,000). A booking was created.", proposalId: "prop-zro-1", createdAt: t(-9) },
      ],
    },
    {
      id: "conv-aarav-meera",
      isSample: true,
      subject: "Engagement photography",
      clientUserId: "demo-client-aarav",
      clientName: "Aarav Mehta",
      artistUserId: "demo-artist-meera",
      artistProfileId: "artist-meera",
      artistName: "Meera Joshi",
      artistSlug: "meera-joshi-photography",
      category: "photography-and-videography",
      city: "Jaipur",
      gigId: null,
      applicationId: null,
      inquiry: { eventTitle: "Engagement photography", eventType: "Engagement", eventDate: d(-20), eventTime: "17:00", city: "Jaipur", venue: "Family home, Civil Lines", duration: "4 hours", requirements: "Candid coverage of the ring ceremony and family portraits.", estimatedBudgetInr: 30000 },
      bookingId: "booking-aarav-meera",
      createdAt: t(-45),
      updatedAt: t(-18),
      lastReadAt: { "demo-client-aarav": t(-18), "demo-artist-meera": t(-18) },
      proposals: [
        { conversationId: "conv-aarav-meera", currency: "INR", id: "prop-am-1", version: 1, proposedByUserId: "demo-artist-meera", proposedByRole: "artist", proposedByName: "Meera Joshi", amountPaise: 3_000_000, eventDate: d(-20), duration: "4 hours", deliverables: "150+ edited photos in a private gallery", inclusions: ["Colour grading", "Gallery within 7 days"], exclusions: ["Prints"], travelNotes: "Delhi–Jaipur travel included.", cancellationTerms: "Free reschedule up to 7 days before.", validUntil: d(-35), status: "accepted", respondsToProposalId: null, createdAt: t(-42), respondedAt: t(-40) },
      ],
      messages: [
        { id: "m-am-1", conversationId: "conv-aarav-meera", senderUserId: "demo-client-aarav", senderRole: "client", senderName: "Aarav Mehta", body: "Hi Meera, could you cover our engagement in Jaipur?", proposalId: null, createdAt: t(-45) },
        { id: "m-am-2", conversationId: "conv-aarav-meera", senderUserId: null, senderRole: "system", senderName: "Cultgig", body: "Aarav Mehta confirmed completion. The booking is complete.", proposalId: null, createdAt: t(-18) },
      ],
    },
  ];

  const bookingCommon = { isSample: true, platformFeePaise: 0, currency: "INR" as const, cancellationReason: null };

  const bookings: BookingRecord[] = [
    {
      ...bookingCommon,
      id: "booking-zoe-rohan",
      conversationId: "conv-zoe-rohan",
      gigId: null,
      title: "Corporate dinner anchoring",
      clientUserId: "demo-client-zoe",
      clientName: "Zoe Fernandes",
      artistUserId: "demo-artist-rohan",
      artistProfileId: "artist-rohan",
      artistName: "Rohan Sen",
      artistSlug: "rohan-sen-emcee-host",
      acceptedProposalId: "prop-zro-1",
      acceptedProposalVersion: 1,
      grossAmountPaise: 1_800_000,
      artistSharePaise: 1_800_000,
      eventDate: d(5),
      city: "Mumbai",
      duration: "3 hours",
      deliverables: "Bilingual anchoring and cue sheet",
      inclusions: ["Cue sheet preparation", "One briefing call"],
      exclusions: ["Stage audio"],
      cancellationTerms: "50% refundable up to 7 days before.",
      status: "confirmed",
      paymentStatus: "not_collected_demo",
      createdAt: t(-9),
      updatedAt: t(-8),
      timeline: [
        { id: "tl-zro-1", status: "offer_accepted", actorUserId: "demo-client-zoe", actorName: "Zoe Fernandes", note: "Accepted Proposal v1.", createdAt: t(-9) },
        { id: "tl-zro-2", status: "awaiting_payment", actorUserId: null, actorName: "Cultgig", note: "Booking created from Proposal v1.", createdAt: t(-9) },
        { id: "tl-zro-3", status: "confirmed", actorUserId: "demo-client-zoe", actorName: "Zoe Fernandes", note: "Confirmed in demo mode. No payment was collected.", createdAt: t(-8) },
      ],
    },
    {
      ...bookingCommon,
      id: "booking-aarav-meera",
      conversationId: "conv-aarav-meera",
      gigId: null,
      title: "Engagement photography",
      clientUserId: "demo-client-aarav",
      clientName: "Aarav Mehta",
      artistUserId: "demo-artist-meera",
      artistProfileId: "artist-meera",
      artistName: "Meera Joshi",
      artistSlug: "meera-joshi-photography",
      acceptedProposalId: "prop-am-1",
      acceptedProposalVersion: 1,
      grossAmountPaise: 3_000_000,
      artistSharePaise: 3_000_000,
      eventDate: d(-20),
      city: "Jaipur",
      duration: "4 hours",
      deliverables: "150+ edited photos in a private gallery",
      inclusions: ["Colour grading", "Gallery within 7 days"],
      exclusions: ["Prints"],
      cancellationTerms: "Free reschedule up to 7 days before.",
      status: "completed",
      paymentStatus: "not_collected_demo",
      createdAt: t(-40),
      updatedAt: t(-18),
      timeline: [
        { id: "tl-am-1", status: "offer_accepted", actorUserId: "demo-client-aarav", actorName: "Aarav Mehta", note: "Accepted Proposal v1.", createdAt: t(-40) },
        { id: "tl-am-2", status: "confirmed", actorUserId: "demo-client-aarav", actorName: "Aarav Mehta", note: "Confirmed in demo mode. No payment was collected.", createdAt: t(-39) },
        { id: "tl-am-3", status: "in_progress", actorUserId: "demo-artist-meera", actorName: "Meera Joshi", note: "Event day.", createdAt: t(-20) },
        { id: "tl-am-4", status: "completion_pending", actorUserId: "demo-artist-meera", actorName: "Meera Joshi", note: "Gallery delivered.", createdAt: t(-19) },
        { id: "tl-am-5", status: "completed", actorUserId: "demo-client-aarav", actorName: "Aarav Mehta", note: "Completion confirmed.", createdAt: t(-18) },
      ],
    },
  ];

  const reviews: Review[] = [
    {
      id: "review-aarav-meera",
      bookingId: "booking-aarav-meera",
      reviewerUserId: "demo-client-aarav",
      reviewerName: "Aarav M.",
      artistProfileId: "artist-meera",
      ratings: { overall: 5, professionalism: 5, communication: 4, quality: 5, punctuality: 5 },
      text: "Meera blended in completely — the candid family photos are the ones we keep going back to. Gallery arrived in six days.",
      status: "published",
      isSample: true,
      createdAt: t(-16),
    },
  ];

  const notifications: MarketplaceNotification[] = [
    { id: "n-1", userId: "demo-client-zoe", kind: "counter_offer", title: "Rhea Kapoor sent Proposal v3", detail: "₹23,500 for Saturday sunset acoustic set", path: "/messages/conv-zoe-rhea", read: false, createdAt: t(-1, 15) },
    { id: "n-2", userId: "demo-client-zoe", kind: "application", title: "New application from Tara Movement Collective", detail: "Saturday sunset acoustic set", path: "/client/gigs/gig-terrace-acoustic", read: false, createdAt: t(-3) },
    { id: "n-3", userId: "demo-artist-rhea", kind: "shortlist", title: "You were shortlisted", detail: "Bandra Terrace Bistro shortlisted your application.", path: "/artist/applications", read: true, createdAt: t(-4) },
    { id: "n-4", userId: "demo-artist-meera", kind: "review", title: "New review from Aarav M.", detail: "5.0 overall for Engagement photography", path: "/artists/meera-joshi-photography", read: false, createdAt: t(-16) },
  ];

  return {
    version: DEMO_DATA_VERSION,
    seededAt: now.toISOString(),
    users,
    credentials: {},
    pendingCodes: [],
    settings: users.map((u) => defaultSettings(u.id)),
    artistProfiles,
    clientProfiles,
    gigs,
    applications,
    conversations,
    bookings,
    notifications,
    savedArtists: [
      { userId: "demo-client-zoe", artistProfileId: "artist-rhea" },
      { userId: "demo-client-zoe", artistProfileId: "artist-kabir" },
    ],
    reviews,
    reports: [],
    supportTickets: [],
    auditEvents: [],
  };
}
