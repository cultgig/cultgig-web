import { BookmarkSimple, MapPin } from "@phosphor-icons/react";
import { DemoBadge } from "@/components/shared/StatusBadge";
import { RatingStars, UserAvatar } from "@/components/shared/primitives";
import { SafeImage } from "@/components/shared/SafeImage";
import { getCategory } from "@/data/categories";
import { formatInr } from "@/domain/money";
import { Link, useRouter } from "@/lib/router";
import { cn } from "@/lib/utils";
import { useMarketplace } from "@/state/MarketplaceContext";
import { artistRating } from "@/state/selectors";
import type { ArtistProfile } from "@/types/marketplace";

export function priceLabel(artist: Pick<ArtistProfile, "pricingMode" | "startingPriceInr" | "priceMaxInr">): string {
  if (artist.pricingMode === "quote_required" || artist.startingPriceInr === null) return "Quote on request";
  if (artist.pricingMode === "range" && artist.priceMaxInr) return `${formatInr(artist.startingPriceInr)} to ${formatInr(artist.priceMaxInr)}`;
  if (artist.pricingMode === "fixed_package") return `${formatInr(artist.startingPriceInr)} package`;
  return `From ${formatInr(artist.startingPriceInr)}`;
}

export function SaveArtistButton({ artistId, className, withLabel = false }: { artistId: string; className?: string; withLabel?: boolean }) {
  const { viewer, savedArtistIds, run } = useMarketplace();
  const { navigate, pathname } = useRouter();
  const saved = savedArtistIds.includes(artistId);
  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!viewer) {
      navigate(`/sign-in?next=${encodeURIComponent(pathname)}`);
      return;
    }
    await run((b) => b.market.toggleSavedArtist(artistId), { success: saved ? "Removed from saved artists" : "Saved to your shortlist" });
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved artists" : "Save artist"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 type-label-sm shadow-xs transition-colors",
        saved ? "border-line-selected bg-brand-subtle text-brand" : "border-line bg-surface text-ink hover:bg-surface-low",
        className,
      )}
    >
      <BookmarkSimple size={16} weight={saved ? "fill" : "regular"} aria-hidden />
      {withLabel && (saved ? "Saved" : "Save")}
    </button>
  );
}

export function ArtistCard({ artist }: { artist: ArtistProfile }) {
  const { reviews } = useMarketplace();
  const category = getCategory(artist.primaryCategory);
  const rating = artistRating(reviews, artist.id);
  const featured = artist.portfolio.find((p) => p.featured && p.type === "image") ?? artist.portfolio.find((p) => p.type === "image");
  const cover = featured?.mediaUrl ?? artist.coverUrl;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-line-strong has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-line-focus">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
        <SafeImage src={cover} alt={featured?.title ?? artist.coverAlt} className="size-full object-cover transition-transform duration-enter group-hover:scale-[1.02]" />
        <div className="absolute right-3 top-3 z-10">
          <SaveArtistButton artistId={artist.id} />
        </div>
        {artist.isSample && <DemoBadge className="absolute left-3 top-3" />}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          <UserAvatar name={artist.displayName} src={artist.avatarUrl} className="size-9" />
          <div className="min-w-0">
            <h3 className="truncate type-h4 text-ink-strong">
              <Link to={`/artists/${artist.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                {artist.displayName}
              </Link>
            </h3>
            <p className="truncate type-caption text-ink-secondary">
              {category?.label ?? "Creative professional"}, {artist.artistFormat === "group" ? "Group" : "Solo"}
            </p>
          </div>
        </div>
        <p className="line-clamp-2 type-body-sm text-ink-secondary">{artist.tagline}</p>
        <p className="inline-flex items-center gap-1.5 type-caption text-ink-secondary">
          <MapPin size={14} className="shrink-0" aria-hidden /> {artist.city}, {artist.experienceYears} yrs experience
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
          <p className="figure type-label text-ink-strong">{priceLabel(artist)}</p>
          {rating ? <RatingStars value={rating.average} count={rating.count} /> : <span className="type-caption text-ink-secondary">No reviews yet</span>}
        </div>
      </div>
    </article>
  );
}
