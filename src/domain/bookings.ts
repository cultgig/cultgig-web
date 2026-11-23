import type { BookingLifecycleStatus, BookingRecord, MarketplaceRole, PaymentStatus } from "../types/marketplace";
import { DomainError } from "./errors";

/**
 * Booking lifecycle state machine.
 *
 * Pre-booking stages (inquiry → proposal_received → negotiating → offer_accepted) live on the
 * conversation. A booking record is created when an exact proposal version is accepted, and starts
 * in `awaiting_payment`.
 *
 * `system` transitions can only be performed by the trusted backend (payment webhooks, admin
 * moderation). In demo mode a clearly-labelled `demo` actor may confirm a booking WITHOUT collecting
 * money; the payment status is then `not_collected_demo`, never `paid`.
 */

export type BookingActor = MarketplaceRole | "system" | "demo";

interface TransitionRule {
  to: BookingLifecycleStatus;
  by: BookingActor[];
  label: string;
  requiresReason?: boolean;
}

export const BOOKING_TRANSITIONS: Record<BookingLifecycleStatus, TransitionRule[]> = {
  inquiry: [],
  proposal_received: [],
  negotiating: [],
  offer_accepted: [{ to: "awaiting_payment", by: ["system"], label: "Move to payment" }],
  awaiting_payment: [
    { to: "confirmed", by: ["system", "demo"], label: "Confirm booking" },
    { to: "cancelled", by: ["client", "artist"], label: "Cancel booking", requiresReason: true },
  ],
  confirmed: [
    { to: "in_progress", by: ["artist"], label: "Start work" },
    { to: "cancelled", by: ["client", "artist"], label: "Cancel booking", requiresReason: true },
  ],
  in_progress: [
    { to: "completion_pending", by: ["artist"], label: "Mark work delivered" },
    { to: "disputed", by: ["client", "artist"], label: "Raise a dispute", requiresReason: true },
  ],
  completion_pending: [
    { to: "completed", by: ["client"], label: "Confirm completion" },
    { to: "disputed", by: ["client", "artist"], label: "Raise a dispute", requiresReason: true },
  ],
  completed: [],
  cancelled: [],
  disputed: [
    { to: "completed", by: ["system"], label: "Resolve as completed" },
    { to: "cancelled", by: ["system"], label: "Resolve as cancelled" },
  ],
};

export const BOOKING_STATUS_LABELS: Record<BookingLifecycleStatus, string> = {
  inquiry: "Inquiry",
  proposal_received: "Proposal received",
  negotiating: "Negotiating",
  offer_accepted: "Offer accepted",
  awaiting_payment: "Awaiting payment",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completion_pending: "Completion pending",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

/** Canonical order used for timelines and progress display. */
export const BOOKING_HAPPY_PATH: BookingLifecycleStatus[] = [
  "inquiry",
  "proposal_received",
  "negotiating",
  "offer_accepted",
  "awaiting_payment",
  "confirmed",
  "in_progress",
  "completion_pending",
  "completed",
];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  provider_unavailable: "Online payment not available yet",
  not_collected_demo: "No payment collected (demo)",
  pending: "Payment pending",
  paid: "Paid",
  failed: "Payment failed",
  refund_pending: "Refund pending",
  refunded: "Refunded",
};

export function allowedTransitions(
  booking: Pick<BookingRecord, "status">,
  actor: BookingActor,
): TransitionRule[] {
  return BOOKING_TRANSITIONS[booking.status].filter((rule) => rule.by.includes(actor));
}

export function canTransition(
  booking: Pick<BookingRecord, "status">,
  to: BookingLifecycleStatus,
  actor: BookingActor,
): boolean {
  return allowedTransitions(booking, actor).some((rule) => rule.to === to);
}

export function assertTransition(
  booking: Pick<BookingRecord, "status">,
  to: BookingLifecycleStatus,
  actor: BookingActor,
  reason?: string,
): TransitionRule {
  const rule = BOOKING_TRANSITIONS[booking.status].find((r) => r.to === to);
  if (!rule) {
    throw new DomainError(
      "invalid_transition",
      `A booking that is ${BOOKING_STATUS_LABELS[booking.status].toLowerCase()} can't move to ${BOOKING_STATUS_LABELS[to].toLowerCase()}.`,
    );
  }
  if (!rule.by.includes(actor)) {
    throw new DomainError("forbidden", `You don't have permission to ${rule.label.toLowerCase()} for this booking.`);
  }
  if (rule.requiresReason && !reason?.trim()) {
    throw new DomainError("invalid_input", "Add a short reason so the other side and support understand what happened.");
  }
  return rule;
}

export function bookingRoleFor(booking: Pick<BookingRecord, "clientUserId" | "artistUserId">, userId: string): MarketplaceRole | null {
  if (booking.clientUserId === userId) return "client";
  if (booking.artistUserId === userId) return "artist";
  return null;
}

export function isActiveBooking(status: BookingLifecycleStatus): boolean {
  return ["awaiting_payment", "confirmed", "in_progress", "completion_pending", "disputed"].includes(status);
}
