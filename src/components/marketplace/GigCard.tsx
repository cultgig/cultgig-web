import { CalendarBlank, Clock, MapPin, UsersThree } from "@phosphor-icons/react";
import { DemoBadge, GigStatusBadge } from "@/components/shared/StatusBadge";
import { getCategory } from "@/data/categories";
import { formatInr } from "@/domain/money";
import { Link } from "@/lib/router";
import type { EventGig } from "@/types/marketplace";
import { daysUntil, formatDate, formatTime24 } from "@/utils/format";
import type { ReactNode } from "react";

export function budgetLabel(gig: Pick<EventGig, "budgetMode" | "budgetMinInr" | "budgetMaxInr">): string {
  if (gig.budgetMode === "open_to_quotes") return "Open to quotes";
  if (gig.budgetMode === "fixed" && gig.budgetMaxInr) return `${formatInr(gig.budgetMaxInr)} fixed`;
  if (gig.budgetMinInr && gig.budgetMaxInr) return `${formatInr(gig.budgetMinInr)}–${formatInr(gig.budgetMaxInr)}`;
  return "Budget to be discussed";
}

export function deadlineLabel(deadline: string): { text: string; urgent: boolean } {
  const days = daysUntil(deadline);
  if (days < 0) return { text: "Applications closed", urgent: true };
  if (days === 0) return { text: "Closes today", urgent: true };
  if (days === 1) return { text: "Closes tomorrow", urgent: true };
  return { text: `Closes in ${days} days`, urgent: days <= 3 };
}

/** Summarises everything an artist needs to decide whether to open a gig. */
export function GigCard({ gig, to, footer, showStatus = false }: { gig: EventGig; to: string; footer?: ReactNode; showStatus?: boolean }) {
  const category = getCategory(gig.category);
  const deadline = deadlineLabel(gig.applicationDeadline);
  return (
    <article className="relative flex flex-col gap-3 rounded-xl border border-line bg-surface p-5 shadow-xs transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface-low px-2.5 py-0.5 type-label-sm text-ink-secondary">{category?.label ?? gig.category}</span>
        {showStatus && <GigStatusBadge status={gig.status} />}
        {gig.isSample && <DemoBadge />}
        <span className={`ml-auto type-caption ${deadline.urgent ? "font-semibold text-status-warning" : "text-ink-secondary"}`}>{deadline.text}</span>
      </div>
      <div>
        <h3 className="type-h4 text-ink">
          <Link to={to} className="after:absolute after:inset-0 focus-visible:outline-none">
            {gig.title}
          </Link>
        </h3>
        <p className="mt-0.5 type-caption text-ink-secondary">
          {gig.eventType} · posted by {gig.clientDisplayName}
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 type-body-sm text-ink-secondary sm:grid-cols-2">
        <li className="flex items-center gap-1.5">
          <CalendarBlank size={15} aria-hidden /> {formatDate(gig.eventDate)}
        </li>
        <li className="flex items-center gap-1.5">
          <Clock size={15} aria-hidden /> {formatTime24(gig.startTime)}–{formatTime24(gig.endTime)}
        </li>
        <li className="flex items-center gap-1.5">
          <MapPin size={15} aria-hidden /> {gig.workingMode === "remote" ? "Remote" : gig.city}
        </li>
        <li className="flex items-center gap-1.5">
          <UsersThree size={15} aria-hidden /> {gig.artistsNeeded} {gig.artistsNeeded === 1 ? "artist" : "artists"} needed
        </li>
      </ul>
      <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
        <span className="type-label text-ink">{budgetLabel(gig)}</span>
        {gig.travelCovered && <span className="type-caption text-ink-secondary">Travel covered</span>}
      </div>
      {footer && <div className="relative z-10">{footer}</div>}
    </article>
  );
}
