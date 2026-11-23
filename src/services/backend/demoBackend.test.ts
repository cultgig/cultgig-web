import { beforeEach, describe, expect, it } from "vitest";
import { createMemoryStore } from "../storage";
import { createDemoBackend } from "./demoBackend";
import type { Backend } from "./types";
import type { GigDraftInput } from "../../domain/gigs";
import type { ProposalDraft } from "../../domain/proposals";

const NOW = new Date("2026-11-23T10:00:00.000Z");
const day = (n: number) => new Date(NOW.getTime() + n * 86_400_000).toISOString().slice(0, 10);

let counter = 0;
function makeBackend(): Backend {
  counter = 0;
  return createDemoBackend({ store: createMemoryStore(), clock: () => NOW, idFactory: (p) => `${p}-${++counter}` });
}

const draft = (amountRupees: number): ProposalDraft => ({
  amountPaise: amountRupees * 100,
  eventDate: day(12),
  duration: "2 hours",
  deliverables: "Two sets",
  inclusions: ["Vocals"],
  exclusions: [],
  travelNotes: "",
  cancellationTerms: "72h",
  validUntil: day(8),
});

const gigInput = (overrides: Partial<GigDraftInput> = {}): GigDraftInput => ({
  title: "Live band for a launch party",
  category: "music-and-bands",
  eventType: "Launch party",
  description: "Upbeat four-piece band for a product launch evening with 150 guests.",
  eventDate: day(20),
  startTime: "19:00",
  endTime: "22:00",
  city: "Mumbai",
  venueArea: "Lower Parel",
  workingMode: "on_site",
  artistsNeeded: 1,
  durationSummary: "3 hours",
  requirements: "",
  deliverables: "Two 60-minute sets",
  specialInstructions: "",
  references: "",
  equipmentAndSpaceNotes: "",
  budgetMode: "range",
  budgetMinInr: 30000,
  budgetMaxInr: 50000,
  travelCovered: false,
  applicationDeadline: day(10),
  experiencePreference: "",
  locationPreference: "",
  status: "draft",
  ...overrides,
});

describe("demo authentication", () => {
  it("rejects protected actions when signed out", async () => {
    const b = makeBackend();
    await expect(b.market.sendMessage("conv-zoe-rhea", "hi")).rejects.toMatchObject({ code: "unauthenticated" });
  });

  it("signs up, verifies email with the displayed code, and restores the session", async () => {
    const b = makeBackend();
    const { user, demoVerificationCode } = await b.auth.signUp({ email: "new@example.com", password: "longenough", displayName: "New Person", role: "client" });
    expect(user.emailVerified).toBe(false);
    await expect(b.auth.confirmEmailVerification({ code: "000000" })).rejects.toMatchObject({ code: "invalid_input" });
    const verified = await b.auth.confirmEmailVerification({ code: demoVerificationCode });
    expect(verified.emailVerified).toBe(true);
    expect((await b.auth.getSessionUser())?.id).toBe(user.id);
  });

  it("does not allow duplicate accounts or wrong passwords", async () => {
    const b = makeBackend();
    await b.auth.signUp({ email: "a@example.com", password: "password1", displayName: "A", role: "artist" });
    await b.auth.signOut();
    await expect(b.auth.signUp({ email: "A@example.com", password: "password1", displayName: "A", role: "artist" })).rejects.toMatchObject({ code: "duplicate" });
    await expect(b.auth.signIn("a@example.com", "wrongpass")).rejects.toMatchObject({ code: "unauthenticated" });
    expect((await b.auth.signIn("a@example.com", "password1")).email).toBe("a@example.com");
  });
});

describe("visibility rules", () => {
  it("only returns the viewer's own conversations and bookings", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-client-aarav");
    const snap = await b.market.snapshot();
    expect(snap.conversations.every((c) => c.clientUserId === "demo-client-aarav" || c.artistUserId === "demo-client-aarav")).toBe(true);
    expect(snap.conversations.some((c) => c.id === "conv-zoe-rhea")).toBe(false);
    expect(snap.bookings.some((x) => x.id === "booking-zoe-rohan")).toBe(false);
  });

  it("treats another user's conversation as not found", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-client-aarav");
    await expect(b.market.sendMessage("conv-zoe-rhea", "let me in")).rejects.toMatchObject({ code: "not_found" });
    await expect(b.market.transitionBooking("booking-zoe-rohan", "cancelled", "x")).rejects.toMatchObject({ code: "not_found" });
  });
});

describe("versioned negotiation", () => {
  it("accepts the exact current version and creates one booking", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    const bookingId = await b.market.respondToProposal("conv-zoe-rhea", "prop-zr-3", 3, "accept");
    expect(bookingId).toBeTruthy();
    const snap = await b.market.snapshot();
    const thread = snap.conversations.find((c) => c.id === "conv-zoe-rhea")!;
    expect(thread.proposals.map((p) => [p.version, p.status])).toEqual([
      [1, "superseded"],
      [2, "superseded"],
      [3, "accepted"],
    ]);
    const booking = snap.bookings.find((x) => x.id === bookingId)!;
    expect(booking.grossAmountPaise).toBe(2_350_000);
    expect(booking.acceptedProposalVersion).toBe(3);
    expect(booking.status).toBe("awaiting_payment");
    expect(booking.paymentStatus).toBe("provider_unavailable");
    expect(snap.applications.find((a) => a.id === "app-rhea-terrace")?.status).toBe("accepted");
  });

  it("prevents double acceptance", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await b.market.respondToProposal("conv-zoe-rhea", "prop-zr-3", 3, "accept");
    await expect(b.market.respondToProposal("conv-zoe-rhea", "prop-zr-3", 3, "accept")).rejects.toMatchObject({ code: "already_accepted" });
  });

  it("prevents accepting your own offer", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-artist-rhea");
    await expect(b.market.respondToProposal("conv-zoe-rhea", "prop-zr-3", 3, "accept")).rejects.toMatchObject({ code: "own_proposal" });
  });

  it("prevents accepting a stale (superseded) version or a mismatched version number", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await expect(b.market.respondToProposal("conv-zoe-rhea", "prop-zr-1", 1, "accept")).rejects.toMatchObject({ code: "stale_proposal" });
    await expect(b.market.respondToProposal("conv-zoe-rhea", "prop-zr-3", 2, "accept")).rejects.toMatchObject({ code: "stale_proposal" });
  });

  it("counter-offers append a new version and supersede the previous pending one", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await b.market.sendProposal("conv-zoe-rhea", draft(23000));
    const thread = (await b.market.snapshot()).conversations.find((c) => c.id === "conv-zoe-rhea")!;
    expect(thread.proposals).toHaveLength(4);
    expect(thread.proposals.filter((p) => p.status === "pending")).toHaveLength(1);
    const v4 = thread.proposals.find((p) => p.version === 4)!;
    expect(v4.proposedByRole).toBe("client");
    expect(v4.respondsToProposalId).toBe("prop-zr-3");
    expect(thread.proposals.find((p) => p.version === 3)?.status).toBe("superseded");
    // The earlier versions are untouched.
    expect(thread.proposals.find((p) => p.version === 1)?.amountPaise).toBe(2_500_000);
  });

  it("blocks sending a second offer while your own is still pending", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-artist-rhea");
    await expect(b.market.sendProposal("conv-zoe-rhea", draft(23000))).rejects.toMatchObject({ code: "conflict" });
  });

  it("rejecting keeps history and allows a fresh offer", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await b.market.respondToProposal("conv-zoe-rhea", "prop-zr-3", 3, "reject");
    await b.auth.signInAsDemoUser!("demo-artist-rhea");
    await b.market.sendProposal("conv-zoe-rhea", draft(23000));
    const thread = (await b.market.snapshot()).conversations.find((c) => c.id === "conv-zoe-rhea")!;
    expect(thread.proposals.map((p) => p.status)).toEqual(["superseded", "superseded", "rejected", "pending"]);
  });

  it("rejects invalid amounts", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await expect(b.market.sendProposal("conv-zoe-rhea", { ...draft(0) })).rejects.toMatchObject({ code: "invalid_input" });
  });
});

describe("booking lifecycle", () => {
  async function acceptedBooking() {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    const bookingId = (await b.market.respondToProposal("conv-zoe-rhea", "prop-zr-3", 3, "accept"))!;
    return { b, bookingId };
  }

  it("never marks a booking paid; demo confirmation records no payment", async () => {
    const { b, bookingId } = await acceptedBooking();
    await expect(b.market.createPaymentOrder(bookingId)).rejects.toMatchObject({ code: "not_configured" });
    await b.market.confirmBookingWithoutPayment(bookingId);
    const booking = (await b.market.snapshot()).bookings.find((x) => x.id === bookingId)!;
    expect(booking.status).toBe("confirmed");
    expect(booking.paymentStatus).toBe("not_collected_demo");
  });

  it("enforces role-specific transitions and the happy path", async () => {
    const { b, bookingId } = await acceptedBooking();
    await b.market.confirmBookingWithoutPayment(bookingId);
    // Clients can't start the artist's work.
    await expect(b.market.transitionBooking(bookingId, "in_progress")).rejects.toMatchObject({ code: "forbidden" });
    await b.auth.signInAsDemoUser!("demo-artist-rhea");
    await expect(b.market.confirmBookingWithoutPayment(bookingId)).rejects.toMatchObject({ code: "forbidden" });
    await b.market.transitionBooking(bookingId, "in_progress");
    await b.market.transitionBooking(bookingId, "completion_pending");
    // Artist can't confirm their own completion.
    await expect(b.market.transitionBooking(bookingId, "completed")).rejects.toMatchObject({ code: "forbidden" });
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await b.market.transitionBooking(bookingId, "completed");
    const booking = (await b.market.snapshot()).bookings.find((x) => x.id === bookingId)!;
    expect(booking.status).toBe("completed");
    expect(booking.timeline.map((t) => t.status)).toEqual(["offer_accepted", "awaiting_payment", "confirmed", "in_progress", "completion_pending", "completed"]);
  });

  it("prevents invalid jumps and requires a cancellation reason", async () => {
    const { b, bookingId } = await acceptedBooking();
    await expect(b.market.transitionBooking(bookingId, "completed")).rejects.toMatchObject({ code: "invalid_transition" });
    await expect(b.market.transitionBooking(bookingId, "cancelled", "  ")).rejects.toMatchObject({ code: "invalid_input" });
    await b.market.transitionBooking(bookingId, "cancelled", "Venue closed for renovation");
    await expect(b.market.transitionBooking(bookingId, "confirmed")).rejects.toMatchObject({ code: "invalid_transition" });
  });

  it("allows one verified review per completed booking, by the client only", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-artist-meera");
    const ratings = { overall: 5, professionalism: 5, communication: 5, quality: 5, punctuality: 5 };
    await expect(b.market.submitReview("booking-aarav-meera", ratings, "Reviewing myself is not allowed here.")).rejects.toMatchObject({ code: "forbidden" });
    await b.auth.signInAsDemoUser!("demo-client-aarav");
    await expect(b.market.submitReview("booking-aarav-meera", ratings, "A second review for the same booking.")).rejects.toMatchObject({ code: "duplicate" });
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await expect(b.market.submitReview("booking-zoe-rohan", ratings, "Booking is not completed yet so no review.")).rejects.toMatchObject({ code: "invalid_transition" });
  });
});

describe("gigs and applications", () => {
  it("validates before publishing and supports the gig status lifecycle", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await expect(b.market.saveGig(gigInput({ eventDate: day(-1) }), { publish: true })).rejects.toMatchObject({ code: "invalid_input" });
    const draftGig = await b.market.saveGig(gigInput({ description: "short" }), { publish: false });
    expect(draftGig.status).toBe("draft");
    const gig = await b.market.saveGig(gigInput(), { gigId: draftGig.id, publish: true });
    expect(gig.status).toBe("open");
    await b.market.setGigStatus(gig.id, "paused");
    await expect(b.market.setGigStatus(gig.id, "filled")).rejects.toMatchObject({ code: "invalid_transition" });
    await b.market.setGigStatus(gig.id, "open");
    await b.market.setGigStatus(gig.id, "closed");
  });

  it("lets an artist apply once, then the client shortlist and open a negotiation", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    const gig = await b.market.saveGig(gigInput(), { publish: true });
    await b.auth.signInAsDemoUser!("demo-artist-rhea");
    const input = { gigId: gig.id, message: "I'd love to play your launch with my full band.", quotedAmountPaise: 4_000_000, scopeSummary: "Two sets", portfolioItemIds: ["pf-rhea-1", "not-mine"], availabilityConfirmed: true, travelCostPaise: 0, equipmentNotes: "", validUntil: day(9) };
    const app = await b.market.applyToGig(input);
    expect(app.portfolioItemIds).toEqual(["pf-rhea-1"]);
    await expect(b.market.applyToGig(input)).rejects.toMatchObject({ code: "duplicate" });
    // Artist can't shortlist themselves.
    await expect(b.market.setApplicationStatus(app.id, "shortlisted")).rejects.toMatchObject({ code: "not_found" });
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await b.market.setApplicationStatus(app.id, "shortlisted");
    const conversationId = await b.market.openApplicationConversation(app.id);
    const snap = await b.market.snapshot();
    const thread = snap.conversations.find((c) => c.id === conversationId)!;
    expect(thread.proposals).toHaveLength(1);
    expect(thread.proposals[0]).toMatchObject({ version: 1, amountPaise: 4_000_000, proposedByUserId: "demo-artist-rhea" });
    expect(snap.applications.find((a) => a.id === app.id)?.status).toBe("in_negotiation");
  });

  it("stops applications to closed gigs and to your own gig", async () => {
    const b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-artist-meera"); // Meera has both roles.
    const own = await b.market.saveGig(gigInput({ category: "makeup-and-beauty" }), { publish: true });
    const input = { gigId: own.id, message: "Applying to my own gig should not be possible.", quotedAmountPaise: 100_00, scopeSummary: "", portfolioItemIds: [], availabilityConfirmed: true, travelCostPaise: 0, equipmentNotes: "", validUntil: day(5) };
    await expect(b.market.applyToGig(input)).rejects.toMatchObject({ code: "forbidden" });
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await b.market.setGigStatus("gig-terrace-acoustic", "closed");
    await b.auth.signInAsDemoUser!("demo-artist-meera");
    await expect(b.market.applyToGig({ ...input, gigId: "gig-terrace-acoustic" })).rejects.toMatchObject({ code: "invalid_transition" });
  });
});

describe("direct hiring", () => {
  let b: Backend;
  beforeEach(async () => {
    b = makeBackend();
    await b.auth.signInAsDemoUser!("demo-client-aarav");
  });

  it("starts an inquiry and negotiates to a booking", async () => {
    const inquiry = { eventTitle: "Sangeet hosting", eventType: "Sangeet", eventDate: day(30), eventTime: "19:00", city: "Jaipur", venue: "Home", duration: "3 hours", requirements: "Bilingual", estimatedBudgetInr: 20000 };
    const conversationId = await b.market.startInquiry({ artistProfileId: "artist-rohan", inquiry, message: "Would you be available to host our sangeet?" });
    await b.auth.signInAsDemoUser!("demo-artist-rohan");
    await b.market.sendProposal(conversationId, draft(25000));
    await b.auth.signInAsDemoUser!("demo-client-aarav");
    await b.market.sendProposal(conversationId, draft(22000));
    await b.auth.signInAsDemoUser!("demo-artist-rohan");
    let thread = (await b.market.snapshot()).conversations.find((c) => c.id === conversationId)!;
    const v2 = thread.proposals.find((p) => p.version === 2)!;
    await b.market.respondToProposal(conversationId, v2.id, 2, "accept");
    thread = (await b.market.snapshot()).conversations.find((c) => c.id === conversationId)!;
    expect(thread.bookingId).toBeTruthy();
    // Negotiation is closed after acceptance.
    await expect(b.market.sendProposal(conversationId, draft(1000))).rejects.toMatchObject({ code: "already_accepted" });
  });

  it("validates inquiries", async () => {
    const bad = { eventTitle: "", eventType: "", eventDate: day(-2), eventTime: "", city: "", venue: "", duration: "", requirements: "", estimatedBudgetInr: null };
    await expect(b.market.startInquiry({ artistProfileId: "artist-rohan", inquiry: bad, message: "hello there!" })).rejects.toMatchObject({ code: "invalid_input" });
  });
});
