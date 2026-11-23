import { describe, expect, it } from "vitest";
import { createDemoSeed } from "../../data/demoSeed";
import { defaultArtistFilters, filterArtists, filtersFromQuery, filtersToQuery } from "./filterArtists";

const db = createDemoSeed(new Date("2026-11-23T10:00:00Z"));
const run = (patch: Partial<typeof defaultArtistFilters>) => filterArtists(db.artistProfiles, db.reviews, { ...defaultArtistFilters, ...patch }).map((a) => a.id);

describe("artist discovery", () => {
  it("searches across name, category, services and city", () => {
    expect(run({ q: "mehendi" })).toEqual(["artist-zarina"]);
    expect(run({ q: "rhea" })).toContain("artist-rhea");
    expect(run({ q: "nonexistent-term" })).toEqual([]);
  });
  it("filters by category including secondary categories", () => {
    expect(run({ category: "music-and-bands" })).toContain("artist-rhea");
  });
  it("matches travel cities and respects unavailable dates", () => {
    expect(run({ city: "Goa" })).toEqual(expect.arrayContaining(["artist-rhea", "artist-kabir"]));
    const blocked = db.artistProfiles.find((a) => a.id === "artist-rhea")!.unavailableDates[0];
    expect(run({ availableOn: blocked })).not.toContain("artist-rhea");
  });
  it("sorts by price and keeps quote-only artists last when ascending", () => {
    const ids = run({ sort: "price_asc" });
    expect(ids[0]).toBe("artist-naina");
    expect(ids.at(-1)).toBe("artist-kabir");
  });
  it("filters by rating using only genuine reviews", () => {
    expect(run({ minRating: 4 })).toEqual(["artist-meera"]);
  });
  it("round-trips filters through the URL", () => {
    const f = { ...defaultArtistFilters, q: "band", city: "Pune", maxPrice: 30000, sort: "rating" as const };
    expect(filtersFromQuery(new URLSearchParams(filtersToQuery(f).slice(1)))).toEqual(f);
  });
});
