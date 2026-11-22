import { Calendar, Clock, MapPin } from "lucide-react";
import { getCategoryBySlug } from "../../data/categories";
import { Link } from "../../lib/router";
import type { EventGig } from "../../types/marketplace";
import { formatInr, formatReadableDate } from "../../utils/format";

export function GigCard({
  gig,
  href,
  actionLabel = "View brief",
}: {
  gig: EventGig;
  href?: string;
  actionLabel?: string;
}) {
  const category = getCategoryBySlug(gig.category);
  const target = href || `/artist/opportunities/${gig.id}`;

  const budgetLabel =
    gig.budgetMode === "open_to_quotes"
      ? "Open to artist quotes"
      : gig.budgetMode === "fixed" && gig.budgetMinInr
      ? `${formatInr(gig.budgetMinInr)} fixed`
      : gig.budgetMinInr && gig.budgetMaxInr
      ? `${formatInr(gig.budgetMinInr)} – ${formatInr(gig.budgetMaxInr)}`
      : "Budget on inquiry";

  return (
    <article className="bg-surface border border-line rounded-lg p-5 flex flex-col gap-3 hover:border-plum-border hover:shadow-soft transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 text-ink-secondary type-caption">
        <span>
          {category?.label ?? gig.category}
          <span aria-hidden="true"> · </span>
          {gig.eventType}
          {gig.isSample && (
            <>
              <span aria-hidden="true"> · </span>
              <span className="text-plum font-medium">Sample brief</span>
            </>
          )}
        </span>
        <span className="type-label-sm text-ink-secondary capitalize">
          Status: {gig.status}
        </span>
      </div>

      <Link to={target} className="type-h3 text-ink-primary hover:text-plum">
        {gig.title}
      </Link>

      <p className="type-body text-ink-secondary line-clamp-2">{gig.deliverables}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 type-body-sm text-ink-secondary">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} className="text-plum" aria-hidden="true" />
          {gig.city} ({gig.workingMode === "remote" ? "Remote" : "On-site"})
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={14} className="text-plum" aria-hidden="true" />
          {formatReadableDate(gig.eventDate)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} className="text-plum" aria-hidden="true" />
          {gig.durationSummary}
        </span>
      </div>

      <div className="pt-3 mt-auto border-t border-line-light flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="type-caption text-ink-secondary">Budget approach</p>
          <p className="type-h4 text-ink-primary tabular-nums">{budgetLabel}</p>
        </div>
        <Link
          to={target}
          className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-md border border-line-strong text-ink-primary hover:border-plum hover:text-plum type-label whitespace-nowrap"
        >
          {actionLabel}
        </Link>
      </div>
    </article>
  );
}
