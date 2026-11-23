import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Faders, MagnifyingGlass, X } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArtistCard } from "@/components/marketplace/ArtistCard";
import { DatePicker } from "@/components/shared/primitives";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryLabel, creativeCategories, indianCities } from "@/data/categories";
import {
  activeFilterCount,
  filterArtists,
  filtersFromQuery,
  filtersToQuery,
  type ArtistFilters,
  type ArtistSort,
} from "@/features/discovery/filterArtists";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link, useRouter } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { formatDate, todayDateOnly } from "@/utils/format";

const ANY = "any";

function FilterSelect({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="type-label text-ink">
        {label}
      </Label>
      <Select value={value || ANY} onValueChange={(v) => onChange(v === ANY ? "" : v)}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function FilterFields({ f, set }: { f: ArtistFilters; set: (patch: Partial<ArtistFilters>) => void }) {
  return (
    <div className="space-y-4">
      <FilterSelect id="f-category" label="Creative category" value={f.category} onChange={(v) => set({ category: v as ArtistFilters["category"] })} options={[{ value: ANY, label: "All categories" }, ...creativeCategories.map((c) => ({ value: c.slug, label: c.label }))]} />
      <FilterSelect id="f-city" label="City" value={f.city} onChange={(v) => set({ city: v })} options={[{ value: ANY, label: "Anywhere in India" }, ...indianCities.map((c) => ({ value: c, label: c }))]} />
      <FilterSelect
        id="f-price"
        label="Starting price up to"
        value={f.maxPrice ? String(f.maxPrice) : ""}
        onChange={(v) => set({ maxPrice: v ? Number(v) : null })}
        options={[{ value: ANY, label: "Any budget" }, ...[10000, 20000, 30000, 50000, 100000].map((n) => ({ value: String(n), label: `₹${n.toLocaleString("en-IN")}` }))]}
      />
      <div className="space-y-1.5">
        <Label htmlFor="f-date" className="type-label text-ink">
          Available on
        </Label>
        <div className="flex gap-2">
          <DatePicker id="f-date" value={f.availableOn} onChange={(v) => set({ availableOn: v })} minDate={todayDateOnly()} placeholder="Any date" />
          {f.availableOn && (
            <Button variant="ghost" size="icon" onClick={() => set({ availableOn: "" })} aria-label="Clear date">
              <X aria-hidden />
            </Button>
          )}
        </div>
      </div>
      <FilterSelect id="f-exp" label="Experience" value={f.minExperience ? String(f.minExperience) : ""} onChange={(v) => set({ minExperience: v ? Number(v) : 0 })} options={[{ value: ANY, label: "Any experience" }, { value: "2", label: "2+ years" }, { value: "5", label: "5+ years" }, { value: "8", label: "8+ years" }]} />
      <FilterSelect id="f-rating" label="Rating" value={f.minRating ? String(f.minRating) : ""} onChange={(v) => set({ minRating: v ? Number(v) : 0 })} options={[{ value: ANY, label: "Any rating" }, { value: "4", label: "4.0 and above" }, { value: "4.5", label: "4.5 and above" }]} />
      <FilterSelect id="f-format" label="Artist or group" value={f.format} onChange={(v) => set({ format: v as ArtistFilters["format"] })} options={[{ value: ANY, label: "Solo or group" }, { value: "solo", label: "Solo artist" }, { value: "group", label: "Group or team" }]} />
      <FilterSelect id="f-mode" label="Service format" value={f.serviceFormat} onChange={(v) => set({ serviceFormat: v as ArtistFilters["serviceFormat"] })} options={[{ value: ANY, label: "On-site or remote" }, { value: "on_site", label: "On-site" }, { value: "remote", label: "Remote" }]} />
    </div>
  );
}

function Chip({ children, onRemove }: { children: ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-subtle py-1 pl-3 pr-1.5 type-label-sm text-brand">
      {children}
      <button type="button" onClick={onRemove} className="rounded-full p-0.5 hover:bg-surface" aria-label={`Remove filter ${String(children)}`}>
        <X size={12} weight="bold" aria-hidden />
      </button>
    </span>
  );
}

export function ExplorePage() {
  usePageMeta("Explore artists & creative services", "Search and filter creative talent by category, city, price and availability across India.");
  const { query, navigate, pathname } = useRouter();
  const { artists, reviews, loading, loadError, refresh } = useMarketplace();
  const filters = useMemo(() => filtersFromQuery(query), [query]);
  const [text, setText] = useState(filters.q);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => setText(filters.q), [filters.q]);

  const set = (patch: Partial<ArtistFilters>) => navigate(`${pathname}${filtersToQuery({ ...filters, ...patch })}`, { replace: true });
  const clearAll = () => {
    setText("");
    navigate(pathname, { replace: true });
  };
  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    set({ q: text.trim() });
  };

  const results = useMemo(() => filterArtists(artists, reviews, filters), [artists, reviews, filters]);
  const count = activeFilterCount(filters);

  return (
    <main id="main-content" className="page-container space-y-6 py-8 lg:py-10">
      <div className="space-y-2">
        <h1 className="type-h1 text-ink-strong">Explore artists</h1>
        <p className="type-body text-ink-secondary">Search by name, craft, service or city. Every result has a portfolio and clear pricing or quotation terms.</p>
      </div>

      <form onSubmit={onSearch} role="search" className="flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" aria-hidden />
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Artist name, service, style or city" aria-label="Search artists" className="h-11 pl-10" />
        </div>
        <Button type="submit" className="h-11">
          Search
        </Button>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-11 lg:hidden" aria-label={`Filters${count ? `, ${count} active` : ""}`}>
              <Faders aria-hidden />
              <span className="hidden sm:inline">Filters</span>
              {count > 0 && <Badge className="ml-1 h-5 px-1.5">{count}</Badge>}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
            <SheetHeader>
              <SheetTitle className="text-left">Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <FilterFields f={filters} set={set} />
            </div>
            <SheetFooter className="sticky bottom-0 flex-row gap-2 bg-surface pt-2">
              <Button variant="outline" className="flex-1" onClick={clearAll}>
                Clear all
              </Button>
              <Button className="flex-1" onClick={() => setSheetOpen(false)}>
                Show {results.length} {results.length === 1 ? "artist" : "artists"}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block" aria-label="Filters">
          <div className="sticky top-[calc(var(--header-height)+16px)] space-y-4 rounded-xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="type-h4 text-ink">Filters</h2>
              {count > 0 && (
                <button type="button" onClick={clearAll} className="type-label-sm text-brand hover:text-brand-hover">
                  Clear all
                </button>
              )}
            </div>
            <FilterFields f={filters} set={set} />
          </div>
        </aside>

        <section className="min-w-0 flex-1 space-y-4" aria-label="Results">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="type-body-sm text-ink-secondary" aria-live="polite">
              {loading ? "Loading artists…" : `${results.length} ${results.length === 1 ? "artist" : "artists"}${filters.q ? ` for “${filters.q}”` : ""}`}
            </p>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="type-body-sm text-ink-secondary">
                Sort by
              </Label>
              <Select value={filters.sort} onValueChange={(v) => set({ sort: v as ArtistSort })}>
                <SelectTrigger id="sort" className="h-9 w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price_asc">Price: low to high</SelectItem>
                  <SelectItem value="price_desc">Price: high to low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {count > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.category && <Chip onRemove={() => set({ category: "" })}>{categoryLabel(filters.category)}</Chip>}
              {filters.city && <Chip onRemove={() => set({ city: "" })}>{filters.city}</Chip>}
              {filters.maxPrice && <Chip onRemove={() => set({ maxPrice: null })}>Up to ₹{filters.maxPrice.toLocaleString("en-IN")}</Chip>}
              {filters.availableOn && <Chip onRemove={() => set({ availableOn: "" })}>Free on {formatDate(filters.availableOn)}</Chip>}
              {filters.minExperience > 0 && <Chip onRemove={() => set({ minExperience: 0 })}>{filters.minExperience}+ years</Chip>}
              {filters.minRating > 0 && <Chip onRemove={() => set({ minRating: 0 })}>{filters.minRating}+ rating</Chip>}
              {filters.format && <Chip onRemove={() => set({ format: "" })}>{filters.format === "solo" ? "Solo" : "Group"}</Chip>}
              {filters.serviceFormat && <Chip onRemove={() => set({ serviceFormat: "" })}>{filters.serviceFormat === "remote" ? "Remote" : "On-site"}</Chip>}
            </div>
          )}

          {loadError ? (
            <ErrorState title="We couldn't load artists" description={loadError} onRetry={() => void refresh()} />
          ) : loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : results.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((a) => (
                <ArtistCard key={a.id} artist={a} />
              ))}
            </div>
          ) : artists.length === 0 ? (
            <EmptyState title="No artist profiles yet" description="Artists are still joining. Post a gig and artists will apply to you as they come on board." action={{ label: "Post a gig", to: "/client/gigs/new" }} />
          ) : (
            <EmptyState
              title="No artists match these filters"
              description="Try removing a filter or searching for a broader term. You can also post a gig and let artists come to you."
              action={{ label: "Clear all filters", onClick: clearAll }}
              secondaryAction={{ label: "Post a gig instead", to: "/client/gigs/new" }}
            />
          )}

          {!loading && results.length > 0 && (
            <div className="rounded-xl border border-line bg-surface-low p-5 text-center">
              <p className="type-body text-ink">Not finding the right fit?</p>
              <p className="type-body-sm text-ink-secondary">
                <Link to="/client/gigs/new" className="font-semibold text-brand hover:text-brand-hover">
                  Post a gig
                </Link>{" "}
                with your date, city and budget, and artists will apply with quotes.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
