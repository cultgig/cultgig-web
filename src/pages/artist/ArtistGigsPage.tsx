import { useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { GigCard } from "@/components/marketplace/GigCard";
import { ApplicationStatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { categoryLabel, creativeCategories, indianCities } from "@/data/categories";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useRouter } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { gigMatchesArtist } from "@/state/selectors";
import { todayDateOnly } from "@/utils/format";

type Sort = "relevance" | "deadline" | "event_date" | "budget";
const ANY = "any";

export default function ArtistGigsPage() {
  usePageMeta("Discover gigs");
  const { gigs, applications, viewer, myArtistProfile } = useMarketplace();
  const { query } = useRouter();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [mode, setMode] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [sort, setSort] = useState<Sort>("relevance");
  const [matchOnly, setMatchOnly] = useState(query.get("match") === "1");
  const today = todayDateOnly();

  const appByGig = useMemo(() => new Map(applications.filter((a) => a.artistUserId === viewer?.id).map((a) => [a.gigId, a])), [applications, viewer]);
  const open = gigs.filter((g) => g.status === "open" && g.clientId !== viewer?.id && g.applicationDeadline >= today);
  const results = open
    .filter((g) => !q || `${g.title} ${g.description} ${g.eventType} ${g.city} ${categoryLabel(g.category)}`.toLowerCase().includes(q.toLowerCase()))
    .filter((g) => !category || g.category === category)
    .filter((g) => !city || g.city === city)
    .filter((g) => !mode || g.workingMode === mode)
    .filter((g) => !minBudget || g.budgetMode === "open_to_quotes" || (g.budgetMaxInr ?? 0) >= Number(minBudget))
    .filter((g) => !matchOnly || gigMatchesArtist(g, myArtistProfile))
    .sort((a, b) => {
      if (sort === "deadline") return a.applicationDeadline.localeCompare(b.applicationDeadline);
      if (sort === "event_date") return a.eventDate.localeCompare(b.eventDate);
      if (sort === "budget") return (b.budgetMaxInr ?? 0) - (a.budgetMaxInr ?? 0);
      const score = (g: typeof a) => (gigMatchesArtist(g, myArtistProfile) ? 2 : 0) + (myArtistProfile && g.city === myArtistProfile.city ? 1 : 0);
      return score(b) - score(a) || a.applicationDeadline.localeCompare(b.applicationDeadline);
    });

  const clear = () => {
    setQ("");
    setCategory("");
    setCity("");
    setMode("");
    setMinBudget("");
    setMatchOnly(false);
  };

  const sel = (id: string, label: string, value: string, onChange: (v: string) => void, options: { value: string; label: string }[]) => (
    <div className="space-y-1">
      <Label htmlFor={id} className="type-caption text-ink-secondary">{label}</Label>
      <Select value={value || ANY} onValueChange={(v) => onChange(v === ANY ? "" : v)}>
        <SelectTrigger id={id} className="h-9"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Discover gigs" description="Open briefs from clients. Apply with a quote, your scope and relevant work." />
      <div className="space-y-3 rounded-xl border border-line bg-surface p-4">
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search gigs by title, event type or city" aria-label="Search gigs" className="pl-9" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {sel("g-cat", "Category", category, setCategory, [{ value: ANY, label: "All" }, ...creativeCategories.map((c) => ({ value: c.slug, label: c.shortLabel }))])}
          {sel("g-city", "City", city, setCity, [{ value: ANY, label: "Any city" }, ...indianCities.map((c) => ({ value: c, label: c }))])}
          {sel("g-mode", "Format", mode, setMode, [{ value: ANY, label: "Any" }, { value: "on_site", label: "On-site" }, { value: "remote", label: "Remote" }])}
          {sel("g-budget", "Budget at least", minBudget, setMinBudget, [{ value: ANY, label: "Any" }, ...[10000, 20000, 35000, 50000].map((n) => ({ value: String(n), label: `₹${n.toLocaleString("en-IN")}` }))])}
          {sel("g-sort", "Sort", sort, (v) => setSort((v || "relevance") as Sort), [{ value: "relevance", label: "Relevance" }, { value: "deadline", label: "Closing soon" }, { value: "event_date", label: "Event date" }, { value: "budget", label: "Highest budget" }])}
        </div>
        <label className="flex items-center gap-2 type-body-sm text-ink">
          <Switch checked={matchOnly} onCheckedChange={setMatchOnly} /> Only gigs in my categories
        </label>
      </div>
      <p className="type-body-sm text-ink-secondary" aria-live="polite">{results.length} open {results.length === 1 ? "gig" : "gigs"}</p>
      {results.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {results.map((g) => {
            const app = appByGig.get(g.id);
            return <GigCard key={g.id} gig={g} to={`/artist/gigs/${g.id}`} footer={app ? <span className="flex items-center gap-2 type-body-sm text-ink-secondary">You applied <ApplicationStatusBadge status={app.status} /></span> : undefined} />;
          })}
        </div>
      ) : open.length ? (
        <EmptyState title="No gigs match these filters" description="Try a broader search or clear the filters." action={{ label: "Clear filters", onClick: clear }} />
      ) : (
        <EmptyState title="No open gigs right now" description="New briefs are posted regularly. Make sure your profile is complete so clients can also find and contact you directly." action={{ label: "Improve my profile", to: "/artist/profile" }} />
      )}
    </div>
  );
}
