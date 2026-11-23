import { CheckCircle, MinusCircle } from "@phosphor-icons/react";
import { ProposalStatusBadge } from "@/components/shared/StatusBadge";
import { formatPaise } from "@/domain/money";
import { cn } from "@/lib/utils";
import type { ProposalVersion } from "@/types/marketplace";
import { formatDate, formatRelative } from "@/utils/format";
import type { ReactNode } from "react";

export function ProposalCard({ proposal, viewerId, actions, compact = false, previous }: { proposal: ProposalVersion; viewerId: string; actions?: ReactNode; compact?: boolean; previous?: ProposalVersion | null }) {
  const mine = proposal.proposedByUserId === viewerId;
  const delta = previous ? proposal.amountPaise - previous.amountPaise : 0;
  return (
    <article
      aria-label={`Proposal version ${proposal.version}`}
      className={cn(
        "rounded-xl border bg-surface",
        proposal.status === "pending" ? "border-line-selected shadow-sm" : proposal.status === "accepted" ? "border-status-success-border" : "border-line",
        compact ? "p-3" : "p-4",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="type-label text-ink">
            Proposal v{proposal.version}
          </p>
          <p className="type-caption text-ink-secondary">
            From {mine ? "you" : `${proposal.proposedByName} (${proposal.proposedByRole})`}, {formatRelative(proposal.createdAt)}
          </p>
          <p className={cn("figure mt-1 font-display font-semibold tracking-[-0.03em] text-ink-strong", compact ? "text-xl" : "text-[30px] leading-8")}>
            {formatPaise(proposal.amountPaise)}
            {previous && delta !== 0 && (
              <span className={cn("ml-2 type-caption font-medium", delta < 0 ? "text-status-success" : "text-status-warning")}>
                {delta < 0 ? "−" : "+"}
                {formatPaise(Math.abs(delta))} vs v{previous.version}
              </span>
            )}
          </p>
        </div>
        <ProposalStatusBadge status={proposal.status} />
      </div>
      {!compact && (
        <>
          <dl className="mt-3 grid gap-x-4 gap-y-2 type-body-sm sm:grid-cols-2">
            <div>
              <dt className="type-caption text-ink-secondary">Event date</dt>
              <dd className="text-ink">{formatDate(proposal.eventDate)}</dd>
            </div>
            <div>
              <dt className="type-caption text-ink-secondary">Duration</dt>
              <dd className="text-ink">{proposal.duration}</dd>
            </div>
            {proposal.deliverables && (
              <div className="sm:col-span-2">
                <dt className="type-caption text-ink-secondary">Deliverables</dt>
                <dd className="text-ink">{proposal.deliverables}</dd>
              </div>
            )}
            {proposal.travelNotes && (
              <div className="sm:col-span-2">
                <dt className="type-caption text-ink-secondary">Travel</dt>
                <dd className="text-ink">{proposal.travelNotes}</dd>
              </div>
            )}
            <div className="sm:col-span-2">
              <dt className="type-caption text-ink-secondary">Cancellation terms</dt>
              <dd className="text-ink">{proposal.cancellationTerms || "Not specified"}</dd>
            </div>
            <div>
              <dt className="type-caption text-ink-secondary">Valid until</dt>
              <dd className="text-ink">{formatDate(proposal.validUntil)}</dd>
            </div>
          </dl>
          {(proposal.inclusions.length > 0 || proposal.exclusions.length > 0) && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <ul className="space-y-1">
                {proposal.inclusions.map((i) => (
                  <li key={i} className="flex gap-1.5 type-body-sm text-ink">
                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-status-success" aria-hidden /> {i}
                  </li>
                ))}
              </ul>
              <ul className="space-y-1">
                {proposal.exclusions.map((i) => (
                  <li key={i} className="flex gap-1.5 type-body-sm text-ink-secondary">
                    <MinusCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
                    <span>
                      <span className="sr-only">Not included: </span>
                      {i}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      {actions && <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">{actions}</div>}
    </article>
  );
}
