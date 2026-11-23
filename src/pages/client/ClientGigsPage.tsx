import { useState } from "react";
import { Briefcase, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GigCard } from "@/components/marketplace/GigCard";
import { PageHeader } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { GIG_STATUS_LABELS } from "@/domain/gigs";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { GigStatus } from "@/types/marketplace";

const tabs: (GigStatus | "all")[] = ["all", "draft", "open", "paused", "filled", "closed"];

export default function ClientGigsPage() {
  usePageMeta("My gigs");
  const { gigs, applications, viewer } = useMarketplace();
  const [tab, setTab] = useState<GigStatus | "all">("all");
  const mine = gigs.filter((g) => g.clientId === viewer?.id);
  const shown = mine.filter((g) => tab === "all" || g.status === tab);

  return (
    <div className="space-y-6">
      <PageHeader title="My gigs" description="Briefs you've posted and their applicants." actions={<Button asChild><Link to="/client/gigs/new"><Plus aria-hidden /> Post a gig</Link></Button>} />
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t === "all" ? "All" : GIG_STATUS_LABELS[t]} ({t === "all" ? mine.length : mine.filter((g) => g.status === t).length})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {shown.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {shown.map((g) => {
            const apps = applications.filter((a) => a.gigId === g.id && a.status !== "withdrawn");
            const fresh = apps.filter((a) => a.status === "submitted").length;
            return (
              <GigCard
                key={g.id}
                gig={g}
                showStatus
                to={`/client/gigs/${g.id}`}
                footer={
                  <span className="type-body-sm text-ink-secondary">
                    {apps.length} {apps.length === 1 ? "applicant" : "applicants"}
                    {fresh > 0 && <span className="ml-1 font-semibold text-brand">· {fresh} new</span>}
                  </span>
                }
              />
            );
          })}
        </div>
      ) : mine.length ? (
        <EmptyState compact icon={Briefcase} title={`No ${tab === "all" ? "" : GIG_STATUS_LABELS[tab as GigStatus].toLowerCase()} gigs`} action={{ label: "Show all gigs", onClick: () => setTab("all") }} />
      ) : (
        <EmptyState icon={Briefcase} title="You haven't posted a gig yet" description="Describe your event once — date, city, budget and what you need — and artists will apply with quotes." action={{ label: "Post your first gig", to: "/client/gigs/new" }} secondaryAction={{ label: "Or contact an artist directly", to: "/explore" }} />
      )}
    </div>
  );
}
