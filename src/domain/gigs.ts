import type { ApplicationStatus, EventGig, GigApplication, GigStatus } from "../types/marketplace";
import { DomainError } from "./errors";

export const GIG_STATUS_LABELS: Record<GigStatus, string> = {
  draft: "Draft",
  open: "Open",
  paused: "Paused",
  filled: "Filled",
  closed: "Closed",
};

const GIG_TRANSITIONS: Record<GigStatus, GigStatus[]> = {
  draft: ["open", "closed"],
  open: ["paused", "filled", "closed"],
  paused: ["open", "closed"],
  filled: ["open", "closed"],
  closed: ["open"],
};

export function canTransitionGig(from: GigStatus, to: GigStatus): boolean {
  return GIG_TRANSITIONS[from].includes(to);
}

export function assertGigTransition(from: GigStatus, to: GigStatus): void {
  if (!canTransitionGig(from, to)) {
    throw new DomainError("invalid_transition", `A ${GIG_STATUS_LABELS[from].toLowerCase()} gig can't be marked ${GIG_STATUS_LABELS[to].toLowerCase()}.`);
  }
}

export type GigDraftInput = Omit<EventGig, "id" | "isSample" | "clientId" | "clientDisplayName" | "clientType" | "createdAt" | "updatedAt">;

/** Validate a gig before it can be published. Drafts may be incomplete. */
export function validateGigForPublish(gig: GigDraftInput, today: string): string[] {
  const problems: string[] = [];
  if (gig.title.trim().length < 6) problems.push("Give the gig a descriptive title (at least 6 characters).");
  if (!gig.eventType.trim()) problems.push("Add the event type.");
  if (gig.description.trim().length < 20) problems.push("Describe the gig in at least 20 characters.");
  if (!gig.eventDate) problems.push("Add the event date.");
  else if (gig.eventDate < today) problems.push("The event date can't be in the past.");
  if (gig.workingMode === "on_site" && !gig.city.trim()) problems.push("Add the city for an on-site gig.");
  if (gig.artistsNeeded < 1) problems.push("At least one artist is needed.");
  if (!gig.applicationDeadline) problems.push("Add an application deadline.");
  else if (gig.eventDate && gig.applicationDeadline > gig.eventDate) problems.push("The application deadline must be on or before the event date.");
  if (gig.budgetMode === "fixed" && !(gig.budgetMaxInr && gig.budgetMaxInr > 0)) problems.push("Add the fixed budget.");
  if (gig.budgetMode === "range") {
    if (!(gig.budgetMinInr && gig.budgetMinInr > 0) || !(gig.budgetMaxInr && gig.budgetMaxInr > 0)) problems.push("Add both ends of the budget range.");
    else if (gig.budgetMinInr > gig.budgetMaxInr) problems.push("The minimum budget can't be above the maximum.");
  }
  return problems;
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  shortlisted: "Shortlisted",
  in_negotiation: "In negotiation",
  accepted: "Accepted",
  declined: "Declined",
  withdrawn: "Withdrawn",
};

/** Who may move an application where. Clients act on applications to their gigs; artists withdraw their own. */
const APPLICATION_TRANSITIONS: Record<ApplicationStatus, { to: ApplicationStatus; by: "client" | "artist" | "system" }[]> = {
  submitted: [
    { to: "shortlisted", by: "client" },
    { to: "in_negotiation", by: "system" },
    { to: "declined", by: "client" },
    { to: "withdrawn", by: "artist" },
  ],
  shortlisted: [
    { to: "in_negotiation", by: "system" },
    { to: "declined", by: "client" },
    { to: "withdrawn", by: "artist" },
  ],
  in_negotiation: [
    { to: "accepted", by: "system" },
    { to: "declined", by: "client" },
    { to: "withdrawn", by: "artist" },
  ],
  accepted: [],
  declined: [],
  withdrawn: [],
};

export function assertApplicationTransition(
  from: ApplicationStatus,
  to: ApplicationStatus,
  by: "client" | "artist" | "system",
): void {
  const ok = APPLICATION_TRANSITIONS[from].some((t) => t.to === to && (t.by === by || by === "system"));
  if (!ok) {
    throw new DomainError(
      "invalid_transition",
      `An application that is ${APPLICATION_STATUS_LABELS[from].toLowerCase()} can't be marked ${APPLICATION_STATUS_LABELS[to].toLowerCase()}.`,
    );
  }
}

export function assertCanApply(params: {
  gig: EventGig;
  artistProfileId: string;
  artistUserId: string;
  existing: GigApplication[];
  today: string;
}): void {
  const { gig, artistProfileId, artistUserId, existing, today } = params;
  if (gig.status !== "open") throw new DomainError("invalid_transition", "This gig is not accepting applications.");
  if (gig.applicationDeadline && gig.applicationDeadline < today) throw new DomainError("expired", "The application deadline for this gig has passed.");
  if (gig.clientId === artistUserId) throw new DomainError("forbidden", "You can't apply to your own gig.");
  const duplicate = existing.some(
    (a) => a.gigId === gig.id && a.artistProfileId === artistProfileId && a.status !== "withdrawn",
  );
  if (duplicate) throw new DomainError("duplicate", "You've already applied to this gig. Check My applications for its status.");
}
