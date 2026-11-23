import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArtistCard } from "../components/marketplace/ArtistCard";
import { Button } from "../components/shared/LegacyButton";
import { NoticeBanner } from "../components/shared/NoticeBanner";
import { creativeCategories, indianCities } from "../data/categories";
import { usePageMeta } from "../hooks/usePageMeta";
import { Link, useRouter } from "../lib/router";
import { useMarketplace } from "../state/MarketplaceContext";
import type { ArtistFormat, PricingMode, WorkingMode } from "../types/marketplace";

type SortKey = "relevance" | "price_asc" | "price_desc" | "experience_desc";

export function ExplorePage() {
  usePageMeta(
    "Explore artists & creative services",
    "Search and filter creative talent by category, city, pricing mode, and working style across India."
  );

  const { query, navigate } = useRouter();
  const { artists } = useMarketplace();

  const [searchText, setSearchText] = useState(query.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState(query.get("category") || "");
  const [cityFilter, setCityFilter] = useState(query.get("city") || "");
  const [pricingFilter, setPricingFilter] = useState<PricingMode | "">("");
  const [workingModeFilter, setWorkingModeFilter] = useState<WorkingMode | "">("");
  const [formatFilter, setFormatFilter] = useState<ArtistFormat | "">("");
  const [maxBudgetInr, setMaxBudgetInr] = useState("");
  const [audioOrVideoOnly, setAudioOrVideoOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("relevance");
  const [visibleCount, setVisibleCount] = useState(8);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    setSearchText(query.get("q") || "");
    setCategoryFilter(query.get("category") || "");
    setCityFilter(query.get("city") || "");
  }, [query]);

  const filteredArtists = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    const maxBudget = maxBudgetInr ? Number(maxBudgetInr) : null;

    const list = artists.filter((artist) => {
      if (q) {
        const haystack = [
          artist.displayName,
          artist.tagline,
          artist.bio,
          artist.city,
          ...artist.travelCities,
          ...artist.languages,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (
        categoryFilter &&
        artist.primaryCategory !== categoryFilter &&
        !artist.secondaryCategories.includes(categoryFilter as typeof artist.primaryCategory)
      ) {
        return false;
      }

      if (
        cityFilter &&
        artist.city.toLowerCase() !== cityFilter.toLowerCase() &&
        !artist.travelCities.some((c) => c.toLowerCase() === cityFilter.toLowerCase())
      ) {
        return false;
      }

      if (pricingFilter && artist.pricingMode !== pricingFilter) return false;
      if (workingModeFilter && artist.workingMode !== workingModeFilter && artist.workingMode !== "both")
        return false;
      if (formatFilter && artist.artistFormat !== formatFilter) return false;
      if (maxBudget && artist.startingPriceInr !== null && artist.startingPriceInr > maxBudget)
        return false;
      if (audioOrVideoOnly && !artist.hasAudioSample && !artist.hasVideoSample) return false;

      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "price_asc") {
        return (a.startingPriceInr ?? Number.MAX_SAFE_INTEGER) - (b.startingPriceInr ?? Number.MAX_SAFE_INTEGER);
      }
      if (sortBy === "price_desc") {
        return (b.startingPriceInr ?? 0) - (a.startingPriceInr ?? 0);
      }
      if (sortBy === "experience_desc") {
        return b.experienceYears - a.experienceYears;
      }
      return 0;
    });
  }, [
    artists,
    searchText,
    categoryFilter,
    cityFilter,
    pricingFilter,
    workingModeFilter,
    formatFilter,
    maxBudgetInr,
    audioOrVideoOnly,
    sortBy,
  ]);

  const activeFilters = [
    searchText && { label: `Search: "${searchText}"`, clear: () => setSearchText("") },
    categoryFilter && {
      label: `Category: ${creativeCategories.find((c) => c.slug === categoryFilter)?.label ?? categoryFilter}`,
      clear: () => setCategoryFilter(""),
    },
    cityFilter && { label: `City: ${cityFilter}`, clear: () => setCityFilter("") },
    pricingFilter && { label: `Pricing: ${pricingFilter.replace("_", " ")}`, clear: () => setPricingFilter("") },
    workingModeFilter && { label: `Mode: ${workingModeFilter.replace("_", " ")}`, clear: () => setWorkingModeFilter("") },
    formatFilter && { label: `Format: ${formatFilter}`, clear: () => setFormatFilter("") },
    maxBudgetInr && { label: `Max ₹${Number(maxBudgetInr).toLocaleString("en-IN")}`, clear: () => setMaxBudgetInr("") },
    audioOrVideoOnly && { label: "Audio/video sample", clear: () => setAudioOrVideoOnly(false) },
  ].filter((x): x is { label: string; clear: () => void } => Boolean(x));

  const clearAll = () => {
    setSearchText("");
    setCategoryFilter("");
    setCityFilter("");
    setPricingFilter("");
    setWorkingModeFilter("");
    setFormatFilter("");
    setMaxBudgetInr("");
    setAudioOrVideoOnly(false);
    setSortBy("relevance");
    navigate("/explore", { replace: true });
  };

  return (
    <main id="main-content" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-[28px] sm:text-[34px] leading-[1.2] font-bold text-ink">
          Explore creative talent across India
        </h1>
        <p className="type-body-lg text-ink-secondary max-w-[720px]">
          Filter by discipline, city, pricing mode, and format — or publish a structured gig brief for artists to apply.
        </p>
      </div>

      <NoticeBanner tone="info" title="Sample preview listings">
        Profiles shown below are illustrative sample fixtures demonstrating search, filtering, and
        portfolio structure while live Appwrite artist onboarding is being populated.
      </NoticeBanner>

      {/* Search & Filter Bar */}
      <section
        aria-label="Filter artists"
        className="bg-surface border border-line rounded-lg p-4 sm:p-5 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <label htmlFor="explore-search" className="sr-only">
              Search keywords
            </label>
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary"
              aria-hidden="true"
            />
            <input
              id="explore-search"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search artists, instruments, styles, or cities"
              className="w-full min-h-[44px] pl-10 pr-3 py-2 rounded-md border border-line bg-surface-low text-[15px] text-ink"
            />
          </div>

          <div className="md:col-span-4">
            <label htmlFor="explore-category" className="sr-only">
              Category
            </label>
            <select
              id="explore-category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[14px] text-ink"
            >
              <option value="">All 15 creative categories</option>
              {creativeCategories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="explore-city" className="sr-only">
              City
            </label>
            <select
              id="explore-city"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[14px] text-ink"
            >
              <option value="">All cities</option>
              {indianCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          <select
            aria-label="Pricing mode"
            value={pricingFilter}
            onChange={(e) => setPricingFilter(e.target.value as PricingMode | "")}
            className="min-h-[40px] px-3 py-2 rounded-md border border-line bg-surface text-[13px] text-ink"
          >
            <option value="">Any pricing mode</option>
            <option value="starting_at">Starting at</option>
            <option value="range">Price range</option>
            <option value="fixed_package">Fixed package</option>
            <option value="quote_required">Quote required</option>
          </select>

          <select
            aria-label="Max starting budget in INR"
            value={maxBudgetInr}
            onChange={(e) => setMaxBudgetInr(e.target.value)}
            className="min-h-[40px] px-3 py-2 rounded-md border border-line bg-surface text-[13px] text-ink"
          >
            <option value="">Any budget</option>
            <option value="15000">Up to ₹15,000</option>
            <option value="25000">Up to ₹25,000</option>
            <option value="50000">Up to ₹50,000</option>
          </select>

          <select
            aria-label="Working mode"
            value={workingModeFilter}
            onChange={(e) => setWorkingModeFilter(e.target.value as WorkingMode | "")}
            className="min-h-[40px] px-3 py-2 rounded-md border border-line bg-surface text-[13px] text-ink"
          >
            <option value="">On-site or remote</option>
            <option value="on_site">On-site events</option>
            <option value="remote">Remote / online</option>
          </select>

          <select
            aria-label="Solo or group"
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value as ArtistFormat | "")}
            className="min-h-[40px] px-3 py-2 rounded-md border border-line bg-surface text-[13px] text-ink"
          >
            <option value="">Solo or group</option>
            <option value="solo">Solo artist</option>
            <option value="group">Group / ensemble</option>
          </select>

          <select
            aria-label="Sort results"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="min-h-[40px] px-3 py-2 rounded-md border border-line bg-surface text-[13px] text-ink"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="price_asc">Starting price: Low to high</option>
            <option value="price_desc">Starting price: High to low</option>
            <option value="experience_desc">Most experienced</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-line">
          <label className="inline-flex items-center gap-2 text-[13px] text-ink-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={audioOrVideoOnly}
              onChange={(e) => setAudioOrVideoOnly(e.target.checked)}
              className="w-4 h-4 accent-brand rounded"
            />
            <span>Includes audio or video portfolio sample</span>
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setLoadingPreview(true);
                setTimeout(() => setLoadingPreview(false), 350);
              }}
              className="type-caption text-ink-secondary hover:text-brand inline-flex items-center gap-1"
            >
              <SlidersHorizontal size={13} aria-hidden="true" />
              Refresh results
            </button>
            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="type-label text-brand hover:text-brand-hover"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Active Filter Chips (Interactive Buttons) */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
          {activeFilters.map((filter) => (
            <button
              key={filter.label}
              type="button"
              onClick={filter.clear}
              className="inline-flex items-center gap-1.5 min-h-[34px] px-3 py-1 rounded-md bg-brand-subtle border border-[color:var(--color-border-subtle)] text-brand type-caption font-semibold hover:bg-brand-subtle hover:text-ink"
            >
              <span>{filter.label}</span>
              <X size={13} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {/* Results Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="type-body-sm text-ink-secondary tabular-nums">
          Showing {Math.min(visibleCount, filteredArtists.length)} of {filteredArtists.length} sample
          {filteredArtists.length === 1 ? " profile" : " profiles"}
        </p>
        <Link to="/client/gigs/new" className="type-label text-brand hover:text-brand-hover">
          Need custom quotes? Post an event gig →
        </Link>
      </div>

      {/* Results Grid / Skeleton / Empty State */}
      {loadingPreview ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" aria-busy="true">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-surface border border-line rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-surface-container" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-surface-container rounded w-2/3" />
                <div className="h-3 bg-surface-container rounded w-full" />
                <div className="h-4 bg-surface-container rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="bg-surface border border-line rounded-lg p-8 sm:p-12 text-center space-y-4">
          <h2 className="type-h2 text-ink">No sample artists match those exact filters</h2>
          <p className="type-body text-ink-secondary max-w-[520px] mx-auto">
            Try clearing a filter, expanding to nearby travel cities, or posting a structured event brief so matching artists can reach out directly.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button variant="outline" onClick={clearAll}>
              Reset all filters
            </Button>
            <Link
              to="/client/gigs/new"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-brand text-white hover:bg-brand-hover type-button"
            >
              Post a gig brief
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredArtists.slice(0, visibleCount).map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
          {visibleCount < filteredArtists.length && (
            <div className="pt-4 text-center">
              <Button variant="outline" onClick={() => setVisibleCount((c) => c + 8)}>
                Load more artists
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
