import { categoryLabel } from "@/data/categories";
import type { ArtistFormat, ArtistProfile, CategorySlug, Review, WorkingMode } from "@/types/marketplace";

export type ArtistSort = "relevance" | "recommended" | "price_asc" | "price_desc" | "rating";

export interface ArtistFilters {
  q: string;
  category: CategorySlug | "";
  city: string;
  maxPrice: number | null;
  availableOn: string;
  minExperience: number;
  minRating: number;
  format: ArtistFormat | "";
  serviceFormat: WorkingMode | "";
  sort: ArtistSort;
}

export const defaultArtistFilters: ArtistFilters = {
  q: "",
  category: "",
  city: "",
  maxPrice: null,
  availableOn: "",
  minExperience: 0,
  minRating: 0,
  format: "",
  serviceFormat: "",
  sort: "relevance",
};

export function filtersFromQuery(query: URLSearchParams): ArtistFilters {
  const num = (key: string) => {
    const v = Number(query.get(key));
    return Number.isFinite(v) && v > 0 ? v : null;
  };
  const sort = query.get("sort") as ArtistSort | null;
  return {
    q: query.get("q") ?? "",
    category: (query.get("category") as CategorySlug | null) ?? "",
    city: query.get("city") ?? "",
    maxPrice: num("maxPrice"),
    availableOn: /^\d{4}-\d{2}-\d{2}$/.test(query.get("date") ?? "") ? (query.get("date") as string) : "",
    minExperience: num("exp") ?? 0,
    minRating: num("rating") ?? 0,
    format: (query.get("format") as ArtistFormat | null) ?? "",
    serviceFormat: (query.get("mode") as WorkingMode | null) ?? "",
    sort: sort && ["relevance", "recommended", "price_asc", "price_desc", "rating"].includes(sort) ? sort : "relevance",
  };
}

export function filtersToQuery(f: ArtistFilters): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.category) p.set("category", f.category);
  if (f.city) p.set("city", f.city);
  if (f.maxPrice) p.set("maxPrice", String(f.maxPrice));
  if (f.availableOn) p.set("date", f.availableOn);
  if (f.minExperience) p.set("exp", String(f.minExperience));
  if (f.minRating) p.set("rating", String(f.minRating));
  if (f.format) p.set("format", f.format);
  if (f.serviceFormat) p.set("mode", f.serviceFormat);
  if (f.sort !== "relevance") p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function activeFilterCount(f: ArtistFilters): number {
  return [f.category, f.city, f.maxPrice, f.availableOn, f.minExperience, f.minRating, f.format, f.serviceFormat].filter(Boolean).length;
}

function ratingFor(reviews: Review[], artistId: string): number {
  const mine = reviews.filter((r) => r.artistProfileId === artistId && r.status === "published");
  return mine.length ? mine.reduce((s, r) => s + r.ratings.overall, 0) / mine.length : 0;
}

function relevanceScore(artist: ArtistProfile, terms: string[]): number {
  if (!terms.length) return 0;
  const fields: [string, number][] = [
    [artist.displayName, 5],
    [categoryLabel(artist.primaryCategory), 4],
    [artist.secondaryCategories.map(categoryLabel).join(" "), 2],
    [artist.tagline, 3],
    [artist.packages.map((p) => `${p.title} ${p.description}`).join(" "), 3],
    [`${artist.city} ${artist.travelCities.join(" ")}`, 2],
    [artist.bio, 1],
    [artist.languages.join(" "), 1],
  ];
  let score = 0;
  for (const term of terms) {
    let matched = false;
    for (const [text, weight] of fields) {
      if (text.toLowerCase().includes(term)) {
        score += weight;
        matched = true;
      }
    }
    if (!matched) return -1; // Every term must match somewhere.
  }
  return score;
}

/** Search, filter and sort public artist profiles. Pure and deterministic. */
export function filterArtists(artists: ArtistProfile[], reviews: Review[], f: ArtistFilters): ArtistProfile[] {
  const terms = f.q.toLowerCase().split(/\s+/).map((t) => t.trim()).filter((t) => t.length > 1);
  const city = f.city.toLowerCase();
  const scored = artists
    .filter((a) => a.published)
    .filter((a) => !f.category || a.primaryCategory === f.category || a.secondaryCategories.includes(f.category))
    .filter((a) => !city || a.city.toLowerCase() === city || a.travelCities.some((c) => c.toLowerCase() === city) || a.workingMode === "remote")
    .filter((a) => !f.maxPrice || (a.startingPriceInr !== null && a.startingPriceInr <= f.maxPrice) || a.pricingMode === "quote_required")
    .filter((a) => !f.availableOn || !a.unavailableDates.includes(f.availableOn))
    .filter((a) => a.experienceYears >= f.minExperience)
    .filter((a) => !f.minRating || ratingFor(reviews, a.id) >= f.minRating)
    .filter((a) => !f.format || a.artistFormat === f.format)
    .filter((a) => !f.serviceFormat || a.workingMode === f.serviceFormat || a.workingMode === "both")
    .map((a) => ({ a, score: relevanceScore(a, terms) }))
    .filter(({ score }) => score >= 0);

  const price = (a: ArtistProfile) => a.startingPriceInr ?? Number.POSITIVE_INFINITY;
  const completeness = (a: ArtistProfile) => a.portfolio.length + a.packages.length + (a.bio.length > 120 ? 2 : 0);
  scored.sort((x, y) => {
    switch (f.sort) {
      case "price_asc":
        return price(x.a) - price(y.a);
      case "price_desc":
        return (y.a.startingPriceInr ?? -1) - (x.a.startingPriceInr ?? -1);
      case "rating":
        return ratingFor(reviews, y.a.id) - ratingFor(reviews, x.a.id);
      case "recommended":
        return completeness(y.a) + y.a.experienceYears - (completeness(x.a) + x.a.experienceYears);
      default:
        return y.score - x.score || completeness(y.a) - completeness(x.a);
    }
  });
  return scored.map(({ a }) => a);
}
