import { HandCoins } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ProposalStatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader, SectionCard } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { formatPaise } from "@/domain/money";
import { latestProposal } from "@/domain/proposals";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { ConversationThread } from "@/types/marketplace";
import { formatRelative } from "@/utils/format";

function Row({ thread, viewerId }: { thread: ConversationThread; viewerId: string }) {
  const latest = latestProposal(thread);
  if (!latest) return null;
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate type-h4 text-ink">{thread.subject}</p>
        <p className="type-caption text-ink-secondary">
          {thread.clientName}, v{latest.version} by {latest.proposedByUserId === viewerId ? "you" : latest.proposedByName}, {formatRelative(latest.createdAt)}, {thread.proposals.length} {thread.proposals.length === 1 ? "version" : "versions"}
        </p>
      </div>
      <span className="type-label tabular-nums text-ink">{formatPaise(latest.amountPaise)}</span>
      <ProposalStatusBadge status={latest.status} />
      <Button asChild size="sm" variant="outline"><Link to={`/messages/${thread.id}`}>Open</Link></Button>
    </li>
  );
}

export default function ArtistProposalsPage() {
  usePageMeta("Proposals");
  const { conversations, viewer } = useMarketplace();
  if (!viewer) return null;
  const mine = conversations.filter((c) => c.artistUserId === viewer.id);
  const needsYou = mine.filter((c) => c.proposals.some((p) => p.status === "pending" && p.proposedByUserId !== viewer.id));
  const waiting = mine.filter((c) => c.proposals.some((p) => p.status === "pending" && p.proposedByUserId === viewer.id));
  const accepted = mine.filter((c) => c.proposals.some((p) => p.status === "accepted"));
  const noOffer = mine.filter((c) => !c.proposals.some((p) => p.status === "pending" || p.status === "accepted"));

  if (!mine.some((c) => c.proposals.length) && !noOffer.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="Proposals" />
        <EmptyState icon={HandCoins} title="No proposals yet" description="When a client contacts you or opens your application, send an offer from the conversation. Every version is tracked here." action={{ label: "Discover gigs", to: "/artist/gigs" }} />
      </div>
    );
  }

  const section = (title: string, list: ConversationThread[], empty: string) => (
    <SectionCard title={`${title} (${list.length})`}>
      {list.length ? <ul className="space-y-2">{list.map((t) => <Row key={t.id} thread={t} viewerId={viewer.id} />)}</ul> : <p className="type-body-sm text-ink-secondary">{empty}</p>}
    </SectionCard>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Proposals" description="Every offer you've sent or received, with full version history in each conversation." />
      {section("Needs your response", needsYou, "Nothing waiting on you.")}
      {section("Waiting for the client", waiting, "No offers awaiting a client response.")}
      {section("Accepted", accepted, "No accepted offers yet.")}
      {noOffer.length > 0 && (
        <SectionCard title={`Conversations without an open offer (${noOffer.length})`} description="Send an offer to move these forward.">
          <ul className="space-y-2">
            {noOffer.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 rounded-lg border border-line p-3">
                <span className="truncate type-body-sm text-ink">{t.subject}, {t.clientName}</span>
                <Button asChild size="sm"><Link to={`/messages/${t.id}`}>Send offer</Link></Button>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
