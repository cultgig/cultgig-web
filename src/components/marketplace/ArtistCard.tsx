import { Bookmark, MapPin } from "lucide-react";
import { getCategoryBySlug } from "../../data/categories";
import { Link } from "../../lib/router";
import { useMarketplace } from "../../state/MarketplaceContext";
import type { SampleArtist } from "../../types/marketplace";
import { formatArtistPrice } from "../../utils/format";
import { SafeImage } from "../ui/SafeImage";

export function ArtistCard({ artist }: { artist: SampleArtist }) {
  const { savedArtistIds, toggleSaveArtist } = useMarketplace();
  const isSaved = savedArtistIds.includes(artist.id);
  const category = getCategoryBySlug(artist.primaryCategory);
  const priceText = formatArtistPrice(
    artist.pricingMode,
    artist.startingPriceInr,
    artist.priceMaxInr
  );

  return (
    <article className="group bg-surface border border-line rounded-lg overflow-hidden flex flex-col hover:border-plum-border hover:shadow-card transition-all">
      <div className="relative aspect-[4/3] bg-surface-muted overflow-hidden">
        <Link to={`/artists/${artist.slug}`} className="block w-full h-full">
          <SafeImage
            src={artist.coverUrl}
            alt={artist.coverAlt}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleSaveArtist(artist.id)}
          aria-label={isSaved ? `Remove ${artist.displayName} from saved` : `Save ${artist.displayName}`}
          aria-pressed={isSaved}
          className={`absolute top-3 right-3 w-10 h-10 rounded-md flex items-center justify-center border shadow-soft ${
            isSaved
              ? "bg-plum text-white border-plum"
              : "bg-surface/95 text-ink-primary border-line hover:text-plum"
          }`}
        >
          <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2.5">
        <div className="flex items-center gap-2.5">
          <SafeImage
            src={artist.avatarUrl}
            alt={artist.avatarAlt}
            className="w-8 h-8 rounded-full object-cover border border-line shrink-0"
          />
          <div className="min-w-0">
            <Link
              to={`/artists/${artist.slug}`}
              className="type-h4 text-ink-primary hover:text-plum block truncate"
            >
              {artist.displayName}
            </Link>
            <p className="type-caption text-ink-secondary truncate">
              {category?.label ?? "Creative talent"}
            </p>
          </div>
        </div>

        <Link
          to={`/artists/${artist.slug}`}
          className="type-body text-ink-secondary hover:text-ink-primary line-clamp-2"
        >
          {artist.tagline}
        </Link>

        <div className="mt-auto pt-3 border-t border-line-light flex items-center justify-between gap-3">
          <span className="type-body-sm text-ink-secondary inline-flex items-center gap-1 truncate">
            <MapPin size={13} className="text-plum shrink-0" aria-hidden="true" />
            <span>{artist.city}</span>
            <span aria-hidden="true">·</span>
            <span>{artist.artistFormat === "group" ? "Group" : "Solo"}</span>
          </span>
          <span className="type-h4 text-ink-primary tabular-nums whitespace-nowrap shrink-0">
            {priceText}
          </span>
        </div>
      </div>
    </article>
  );
}
