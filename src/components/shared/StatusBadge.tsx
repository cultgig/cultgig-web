import { CheckCircle, Circle, Clock, Prohibit, Warning, type Icon } from "@phosphor-icons/react";
import { APPLICATION_STATUS_LABELS, GIG_STATUS_LABELS } from "@/domain/gigs";
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/domain/bookings";
import type { ApplicationStatus, BookingLifecycleStatus, GigStatus, PaymentStatus, ProposalStatus } from "@/types/marketplace";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "success" | "warning" | "error" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface-container text-ink-secondary",
  brand: "bg-brand-subtle text-brand",
  success: "bg-status-success-soft text-status-success",
  warning: "bg-status-warning-soft text-status-warning",
  error: "bg-status-error-soft text-status-error",
  info: "bg-status-info-soft text-status-info",
};

const toneIcons: Record<Tone, Icon> = {
  neutral: Circle,
  brand: Circle,
  success: CheckCircle,
  warning: Clock,
  error: Prohibit,
  info: Warning,
};

/** Status is never conveyed by colour alone: every badge has a text label and an icon. */
export function ToneBadge({ tone, label, className }: { tone: Tone; label: string; className?: string }) {
  const IconCmp = toneIcons[tone];
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 type-label-sm", toneClasses[tone], className)}>
      <IconCmp size={12} weight="bold" aria-hidden />
      {label}
    </span>
  );
}

const bookingTone: Record<BookingLifecycleStatus, Tone> = {
  inquiry: "neutral",
  proposal_received: "info",
  negotiating: "info",
  offer_accepted: "brand",
  awaiting_payment: "warning",
  confirmed: "success",
  in_progress: "brand",
  completion_pending: "warning",
  completed: "success",
  cancelled: "error",
  disputed: "error",
};

export function BookingStatusBadge({ status }: { status: BookingLifecycleStatus }) {
  return <ToneBadge tone={bookingTone[status]} label={BOOKING_STATUS_LABELS[status]} />;
}

const paymentTone: Record<PaymentStatus, Tone> = {
  provider_unavailable: "neutral",
  not_collected_demo: "warning",
  pending: "warning",
  paid: "success",
  failed: "error",
  refund_pending: "warning",
  refunded: "neutral",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <ToneBadge tone={paymentTone[status]} label={PAYMENT_STATUS_LABELS[status]} />;
}

const gigTone: Record<GigStatus, Tone> = { draft: "neutral", open: "success", paused: "warning", filled: "brand", closed: "neutral" };

export function GigStatusBadge({ status }: { status: GigStatus }) {
  return <ToneBadge tone={gigTone[status]} label={GIG_STATUS_LABELS[status]} />;
}

const applicationTone: Record<ApplicationStatus, Tone> = {
  submitted: "neutral",
  shortlisted: "brand",
  in_negotiation: "info",
  accepted: "success",
  declined: "error",
  withdrawn: "neutral",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <ToneBadge tone={applicationTone[status]} label={APPLICATION_STATUS_LABELS[status]} />;
}

const proposalTone: Record<ProposalStatus, Tone> = {
  pending: "warning",
  accepted: "success",
  rejected: "error",
  withdrawn: "neutral",
  superseded: "neutral",
  expired: "neutral",
};

const proposalLabel: Record<ProposalStatus, string> = {
  pending: "Awaiting response",
  accepted: "Accepted",
  rejected: "Declined",
  withdrawn: "Withdrawn",
  superseded: "Superseded",
  expired: "Expired",
};

export function ProposalStatusBadge({ status }: { status: ProposalStatus }) {
  return <ToneBadge tone={proposalTone[status]} label={proposalLabel[status]} />;
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      title="Demo data: illustrative, not a real person or transaction"
      className={cn("inline-flex items-center rounded-md bg-surface/90 px-1.5 py-0.5 type-metadata text-ink-secondary ring-1 ring-inset ring-line", className)}
    >
      Demo
    </span>
  );
}
