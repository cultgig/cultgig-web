import type { ConversationThread, MarketplaceRole, ProposalVersion } from "../types/marketplace";
import { DomainError } from "./errors";
import { isValidPaise } from "./money";

/**
 * Versioned proposal rules.
 *
 * Invariants:
 *  - Proposals are append-only: an existing version is never edited, only its status changes.
 *  - Every new offer or counter-offer gets version = highest version + 1.
 *  - At most one proposal per conversation is `pending` at any time.
 *  - Acceptance names an exact proposal id AND version; anything else is rejected as stale.
 *  - A participant can never accept or reject their own proposal.
 *  - Once a proposal is accepted the negotiation is closed.
 */

export interface ProposalActor {
  userId: string;
  role: MarketplaceRole;
  name: string;
}

export type ProposalDraft = Pick<
  ProposalVersion,
  | "amountPaise"
  | "eventDate"
  | "duration"
  | "deliverables"
  | "inclusions"
  | "exclusions"
  | "travelNotes"
  | "cancellationTerms"
  | "validUntil"
>;

export function participantRole(thread: ConversationThread, userId: string): MarketplaceRole | null {
  if (thread.clientUserId === userId) return "client";
  if (thread.artistUserId === userId) return "artist";
  return null;
}

export function assertParticipant(thread: ConversationThread, actor: ProposalActor): void {
  const role = participantRole(thread, actor.userId);
  if (!role || role !== actor.role) {
    throw new DomainError("forbidden", "You are not a participant in this conversation.");
  }
}

export function currentPendingProposal(thread: ConversationThread): ProposalVersion | null {
  return thread.proposals.find((p) => p.status === "pending") ?? null;
}

export function latestProposal(thread: ConversationThread): ProposalVersion | null {
  return thread.proposals.reduce<ProposalVersion | null>(
    (latest, p) => (!latest || p.version > latest.version ? p : latest),
    null,
  );
}

export function acceptedProposal(thread: ConversationThread): ProposalVersion | null {
  return thread.proposals.find((p) => p.status === "accepted") ?? null;
}

export function isProposalExpired(proposal: ProposalVersion, today: string): boolean {
  return Boolean(proposal.validUntil) && proposal.validUntil < today;
}

export function validateProposalDraft(draft: ProposalDraft, today: string): void {
  if (!isValidPaise(draft.amountPaise)) {
    throw new DomainError("invalid_input", "Enter an amount greater than zero.");
  }
  if (draft.amountPaise > 10_000_000_00) {
    throw new DomainError("invalid_input", "That amount is above the ₹1 crore limit for a single booking.");
  }
  if (!draft.eventDate) throw new DomainError("invalid_input", "Add the event date.");
  if (!draft.duration.trim()) throw new DomainError("invalid_input", "Add the performance or service duration.");
  if (!draft.validUntil) throw new DomainError("invalid_input", "Add how long this offer is valid.");
  if (draft.validUntil < today) throw new DomainError("invalid_input", "The offer validity date can't be in the past.");
}

export interface CreateProposalResult {
  proposals: ProposalVersion[];
  created: ProposalVersion;
  superseded: ProposalVersion | null;
}

/** Create a new offer or counter-offer. Returns the new proposal list; does not mutate input. */
export function createProposal(params: {
  thread: ConversationThread;
  actor: ProposalActor;
  draft: ProposalDraft;
  id: string;
  now: string;
  today: string;
}): CreateProposalResult {
  const { thread, actor, draft, id, now, today } = params;
  assertParticipant(thread, actor);
  if (acceptedProposal(thread) || thread.bookingId) {
    throw new DomainError("already_accepted", "An offer in this conversation has already been accepted.");
  }
  validateProposalDraft(draft, today);

  const pending = currentPendingProposal(thread);
  if (pending && pending.proposedByUserId === actor.userId) {
    throw new DomainError(
      "conflict",
      `Your Proposal v${pending.version} is still awaiting a response. Withdraw it before sending a new version.`,
    );
  }

  const nextVersion = (latestProposal(thread)?.version ?? 0) + 1;
  const created: ProposalVersion = {
    ...draft,
    inclusions: draft.inclusions.map((s) => s.trim()).filter(Boolean),
    exclusions: draft.exclusions.map((s) => s.trim()).filter(Boolean),
    id,
    conversationId: thread.id,
    version: nextVersion,
    proposedByUserId: actor.userId,
    proposedByRole: actor.role,
    proposedByName: actor.name,
    currency: "INR",
    status: "pending",
    respondsToProposalId: pending?.id ?? null,
    createdAt: now,
    respondedAt: null,
  };

  const proposals = thread.proposals.map((p) =>
    p.status === "pending" ? { ...p, status: "superseded" as const, respondedAt: now } : p,
  );
  return { proposals: [...proposals, created], created, superseded: pending };
}

export type ProposalResponse = "accept" | "reject";

/**
 * Accept or reject an exact proposal version.
 * Guards: participant, not own proposal, exact current pending version, not expired, not already accepted.
 */
export function respondToProposal(params: {
  thread: ConversationThread;
  actor: ProposalActor;
  proposalId: string;
  expectedVersion: number;
  response: ProposalResponse;
  now: string;
  today: string;
}): { proposals: ProposalVersion[]; target: ProposalVersion } {
  const { thread, actor, proposalId, expectedVersion, response, now, today } = params;
  assertParticipant(thread, actor);

  if (acceptedProposal(thread)) {
    throw new DomainError("already_accepted", "An offer in this conversation has already been accepted.");
  }

  const target = thread.proposals.find((p) => p.id === proposalId);
  if (!target) throw new DomainError("not_found", "That proposal no longer exists.");
  if (target.version !== expectedVersion) {
    throw new DomainError("stale_proposal", "This offer has changed. Review the latest version before responding.");
  }
  if (target.status !== "pending") {
    throw new DomainError(
      "stale_proposal",
      `Proposal v${target.version} is ${target.status} and can no longer be ${response === "accept" ? "accepted" : "rejected"}.`,
    );
  }
  const latest = latestProposal(thread);
  if (!latest || latest.id !== target.id) {
    throw new DomainError("stale_proposal", "A newer version of this offer exists. Review it before responding.");
  }
  if (target.proposedByUserId === actor.userId) {
    throw new DomainError("own_proposal", "You can't respond to your own offer. Wait for the other side to reply.");
  }
  if (response === "accept" && isProposalExpired(target, today)) {
    throw new DomainError("expired", `Proposal v${target.version} expired on ${target.validUntil}. Ask for a renewed offer.`);
  }

  const nextStatus = response === "accept" ? ("accepted" as const) : ("rejected" as const);
  const updated: ProposalVersion = { ...target, status: nextStatus, respondedAt: now };
  return {
    proposals: thread.proposals.map((p) => (p.id === target.id ? updated : p)),
    target: updated,
  };
}

/** Withdraw your own pending proposal. */
export function withdrawProposal(params: {
  thread: ConversationThread;
  actor: ProposalActor;
  proposalId: string;
  now: string;
}): { proposals: ProposalVersion[]; target: ProposalVersion } {
  const { thread, actor, proposalId, now } = params;
  assertParticipant(thread, actor);
  const target = thread.proposals.find((p) => p.id === proposalId);
  if (!target) throw new DomainError("not_found", "That proposal no longer exists.");
  if (target.proposedByUserId !== actor.userId) {
    throw new DomainError("forbidden", "Only the person who sent an offer can withdraw it.");
  }
  if (target.status !== "pending") {
    throw new DomainError("invalid_transition", `Proposal v${target.version} is ${target.status} and can't be withdrawn.`);
  }
  const updated: ProposalVersion = { ...target, status: "withdrawn", respondedAt: now };
  return { proposals: thread.proposals.map((p) => (p.id === target.id ? updated : p)), target: updated };
}

/** Negotiation stage shown before a booking exists. */
export function negotiationStage(thread: ConversationThread): "inquiry" | "proposal_received" | "negotiating" | "offer_accepted" {
  if (acceptedProposal(thread)) return "offer_accepted";
  if (thread.proposals.length === 0) return "inquiry";
  if (thread.proposals.length === 1) return "proposal_received";
  return "negotiating";
}
