import { useState } from "react";
import { FileText } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ApplicationStatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { APPLICATION_STATUS_LABELS } from "@/domain/gigs";
import { formatPaise } from "@/domain/money";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { ApplicationStatus } from "@/types/marketplace";
import { formatDate, formatRelative } from "@/utils/format";

const tabs: (ApplicationStatus | "all")[] = ["all", "submitted", "shortlisted", "in_negotiation", "accepted", "declined", "withdrawn"];

export default function ArtistApplicationsPage() {
  usePageMeta("My applications");
  const { applications, gigs, viewer, run } = useMarketplace();
  const [tab, setTab] = useState<ApplicationStatus | "all">("all");
  const mine = applications.filter((a) => a.artistUserId === viewer?.id);
  const shown = mine.filter((a) => tab === "all" || a.status === tab);

  return (
    <div className="space-y-6">
      <PageHeader title="My applications" description="Track every gig you've applied to." actions={<Button asChild><Link to="/artist/gigs">Find more gigs</Link></Button>} />
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t === "all" ? "All" : APPLICATION_STATUS_LABELS[t]} ({t === "all" ? mine.length : mine.filter((a) => a.status === t).length})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {shown.length ? (
        <ul className="space-y-3">
          {shown.map((a) => {
            const gig = gigs.find((g) => g.id === a.gigId);
            const canWithdraw = ["submitted", "shortlisted", "in_negotiation"].includes(a.status);
            return (
              <li key={a.id} className="rounded-xl border border-line bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/artist/gigs/${a.gigId}`} className="type-h4 text-ink hover:text-brand">{gig?.title ?? "Gig no longer available"}</Link>
                    <p className="type-caption text-ink-secondary">
                      {gig ? `${gig.clientDisplayName}, ${formatDate(gig.eventDate)}, ${gig.city}` : "The client removed this gig."}, applied {formatRelative(a.createdAt)}
                    </p>
                  </div>
                  <ApplicationStatusBadge status={a.status} />
                </div>
                <p className="mt-2 line-clamp-2 type-body-sm text-ink-secondary">{a.message}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                  <span className="mr-auto type-label tabular-nums text-ink">Quote {formatPaise(a.quotedAmountPaise + a.travelCostPaise)}</span>
                  {a.conversationId && <Button asChild size="sm"><Link to={`/messages/${a.conversationId}`}>Open conversation</Link></Button>}
                  {canWithdraw && (
                    <ConfirmDialog
                      trigger={<Button size="sm" variant="outline">Withdraw</Button>}
                      title="Withdraw this application?"
                      description="The client will be told you withdrew. You can apply again while the gig is open."
                      confirmLabel="Withdraw application"
                      destructive
                      onConfirm={() => run((b) => b.market.withdrawApplication(a.id), { success: "Application withdrawn" })}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : mine.length ? (
        <EmptyState compact icon={FileText} title={`No ${tab === "all" ? "" : APPLICATION_STATUS_LABELS[tab as ApplicationStatus].toLowerCase()} applications`} action={{ label: "Show all", onClick: () => setTab("all") }} />
      ) : (
        <EmptyState icon={FileText} title="You haven't applied to any gigs yet" description="Browse open briefs and apply with a quote and your best work." action={{ label: "Discover gigs", to: "/artist/gigs" }} />
      )}
    </div>
  );
}
