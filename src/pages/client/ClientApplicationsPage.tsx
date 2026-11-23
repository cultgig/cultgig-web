import { UsersThree } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ApplicationStatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { formatPaise } from "@/domain/money";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { formatRelative } from "@/utils/format";

export default function ClientApplicationsPage() {
  usePageMeta("Applications");
  const { applications, gigs, artists, viewer } = useMarketplace();
  const myGigs = gigs.filter((g) => g.clientId === viewer?.id);
  const byGig = myGigs
    .map((g) => ({ gig: g, apps: applications.filter((a) => a.gigId === g.id && a.status !== "withdrawn").sort((x, y) => y.createdAt.localeCompare(x.createdAt)) }))
    .filter((x) => x.apps.length);

  return (
    <div className="space-y-6">
      <PageHeader title="Applications" description="Every application to your gigs, grouped by gig. Open a gig to shortlist, compare and negotiate." />
      {byGig.length ? (
        byGig.map(({ gig, apps }) => (
          <section key={gig.id} className="rounded-xl border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-4">
              <div>
                <h2 className="type-h4 text-ink">{gig.title}</h2>
                <p className="type-caption text-ink-secondary">{apps.length} {apps.length === 1 ? "application" : "applications"}</p>
              </div>
              <Button asChild size="sm" variant="outline"><Link to={`/client/gigs/${gig.id}`}>Review & compare</Link></Button>
            </div>
            <ul className="divide-y divide-line">
              {apps.map((a) => {
                const artist = artists.find((p) => p.id === a.artistProfileId);
                return (
                  <li key={a.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <span className="min-w-0 flex-1 truncate type-body text-ink">{artist?.displayName ?? "Artist"}</span>
                    <span className="type-caption text-ink-secondary">{formatRelative(a.createdAt)}</span>
                    <span className="type-label tabular-nums text-ink">{formatPaise(a.quotedAmountPaise + a.travelCostPaise)}</span>
                    <ApplicationStatusBadge status={a.status} />
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      ) : (
        <EmptyState
          icon={UsersThree}
          title="No applications yet"
          description={myGigs.some((g) => g.status === "open") ? "Your open gigs haven't received applications yet. You can also contact artists directly." : "Publish a gig to start receiving applications."}
          action={myGigs.some((g) => g.status === "open") ? { label: "Find artists", to: "/explore" } : { label: "Post a gig", to: "/client/gigs/new" }}
        />
      )}
    </div>
  );
}
