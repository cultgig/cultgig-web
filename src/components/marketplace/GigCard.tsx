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
  if (gig.budgetMinInr && gig.budgetMaxInr) return `${formatInr(gig.budgetMinInr)} to ${formatInr(gig.budgetMaxInr)}`;
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
    <article className="relative flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-line-strong has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-line-focus">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-surface-low px-2 py-0.5 type-label-sm text-ink-secondary">{category?.label ?? gig.category}</span>
        {showStatus && <GigStatusBadge status={gig.status} />}
        {gig.isSample && <DemoBadge />}
        <span className={`ml-auto type-caption ${deadline.urgent ? "font-medium text-status-warning" : "text-ink-secondary"}`}>{deadline.text}</span>
      </div>
      <div>
        <h3 className="type-h3 text-ink-strong">
          <Link to={to} className="after:absolute after:inset-0 focus-visible:outline-none">
            {gig.title}
          </Link>
        </h3>
        <p className="mt-1 type-caption text-ink-secondary">
          {gig.eventType}, posted by {gig.clientDisplayName}
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-x-4 gap-y-2 type-body-sm text-ink-secondary sm:grid-cols-2">
        <li className="flex items-center gap-2">
          <CalendarBlank size={16} aria-hidden className="shrink-0" /> {formatDate(gig.eventDate)}
        </li>
        <li className="flex items-center gap-2">
          <Clock size={16} aria-hidden className="shrink-0" /> {formatTime24(gig.startTime)} to {formatTime24(gig.endTime)}
        </li>
        <li className="flex items-center gap-2">
          <MapPin size={16} aria-hidden className="shrink-0" /> {gig.workingMode === "remote" ? "Remote" : gig.city}
        </li>
        <li className="flex items-center gap-2">
          <UsersThree size={16} aria-hidden className="shrink-0" /> {gig.artistsNeeded} {gig.artistsNeeded === 1 ? "artist" : "artists"} needed
        </li>
      </ul>
      <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
        <span className="figure type-label text-ink-strong">{budgetLabel(gig)}</span>
        {gig.travelCovered && <span className="type-caption text-ink-secondary">Travel covered</span>}
      </div>
      {footer && <div className="relative z-10">{footer}</div>}
    </article>
  );
}
