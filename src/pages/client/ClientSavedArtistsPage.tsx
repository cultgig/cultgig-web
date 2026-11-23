import { BookmarkSimple } from "@phosphor-icons/react";
import { ArtistCard } from "@/components/marketplace/ArtistCard";
import { PageHeader } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useMarketplace } from "@/state/MarketplaceContext";

export default function ClientSavedArtistsPage() {
  usePageMeta("Saved artists");
  const { artists, savedArtistIds } = useMarketplace();
  const saved = artists.filter((a) => savedArtistIds.includes(a.id));
  const missing = savedArtistIds.length - saved.length;
  return (
    <div className="space-y-6">
      <PageHeader title="Saved artists" description="Your shortlist. Compare portfolios and contact artists when you're ready." />
      {saved.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{saved.map((a) => <ArtistCard key={a.id} artist={a} />)}</div>
      ) : (
        <EmptyState icon={BookmarkSimple} title="You haven't saved any artists" description="Tap the bookmark on an artist card or profile to add them here." action={{ label: "Explore artists", to: "/explore" }} />
      )}
      {missing > 0 && <p className="type-body-sm text-ink-secondary">{missing} saved {missing === 1 ? "artist has" : "artists have"} hidden their profile.</p>}
    </div>
  );
}
