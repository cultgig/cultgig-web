import { ArrowLeft } from "lucide-react";
import { ArtistCard } from "../components/marketplace/ArtistCard";
import { GigCard } from "../components/marketplace/GigCard";
import { NoticeBanner } from "../components/shared/NoticeBanner";
import { SafeImage } from "../components/shared/SafeImage";
import { creativeCategories, getCategoryBySlug } from "../data/categories";
import { usePageMeta } from "../hooks/usePageMeta";
import { Link } from "../lib/router";
import { useMarketplace } from "../state/MarketplaceContext";

export function CategoriesIndexPage() {
  usePageMeta(
    "Creative categories",
    "Browse 15 creative disciplines on Cultgig for celebrations, hospitality venues, and brand events."
  );

  const groups = [
    "Music & performance",
    "Visual & heritage craft",
    "Styling & beauty",
    "Production & spaces",
  ] as const;

  return (
    <main id="main-content" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
      <div className="max-w-[740px] space-y-3">
        <p className="type-label text-brand">Creative taxonomy</p>
        <h1 className="text-[28px] sm:text-[36px] leading-[1.2] font-bold text-ink">
          All 15 creative categories on Cultgig
        </h1>
        <p className="type-body-lg text-ink-secondary">
          Built around the real creative professions shaping Indian weddings, hospitality venues,
          brand launches, and private commissions.
        </p>
      </div>

      {groups.map((group) => {
        const items = creativeCategories.filter((c) => c.parentGroup === group);
        return (
          <section key={group} className="space-y-5">
            <h2 className="type-h2 text-ink border-b border-line pb-3">{group}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/categories/${cat.slug}`}
                  className="group bg-surface border border-line rounded-lg overflow-hidden flex flex-col hover:border-line-strong hover:shadow-sm"
                >
                  <div className="aspect-[16/10] bg-surface-container overflow-hidden">
                    <SafeImage
                      src={cat.imageUrl}
                      alt={cat.imageAlt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                    />
                  </div>
                  <div className="p-5 space-y-2 flex-1">
                    <h3 className="type-h3 text-ink group-hover:text-brand">{cat.label}</h3>
                    <p className="type-body-sm text-ink-secondary">{cat.description}</p>
                    {cat.complianceNote && (
                      <p className="type-caption text-ink-secondary pt-1">{cat.complianceNote}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}

export function CategoryDetailPage({ slug }: { slug: string }) {
  const category = getCategoryBySlug(slug);
  const { artists, gigs } = useMarketplace();

  usePageMeta(
    category ? category.label : "Creative categories",
    category?.description || "Browse creative disciplines on Cultgig."
  );

  if (!category) {
    return <CategoriesIndexPage />;
  }

  const matchingArtists = artists.filter(
    (a) => a.primaryCategory === category.slug || a.secondaryCategories.includes(category.slug)
  );
  const matchingGigs = gigs.filter((g) => g.category === category.slug);

  return (
    <main id="main-content" className="pb-16">
      <section className="relative bg-ink-strong text-white overflow-hidden">
        <SafeImage
          src={category.imageUrl}
          alt={category.imageAlt}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink-strong/95 via-ink-strong/80 to-ink-strong/50"
        />
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-4">
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 type-label text-brand-subtle hover:text-white"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            All creative categories
          </Link>
          <p className="type-caption text-white/75">{category.parentGroup}</p>
          <h1 className="text-[30px] sm:text-[38px] leading-[1.15] font-bold text-white max-w-[680px]">
            {category.label}
          </h1>
          <p className="type-body-lg text-white/90 max-w-[620px]">{category.description}</p>
          {category.complianceNote && (
            <p className="type-body-sm text-brand-subtle">{category.complianceNote}</p>
          )}
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to={`/explore?category=${category.slug}`}
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-white text-ink hover:bg-brand-subtle font-semibold text-[15px]"
            >
              Filter in Explore
            </Link>
            <Link
              to={`/client/gigs/new?category=${category.slug}`}
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md border border-white/40 text-white hover:bg-white/10 font-semibold text-[15px]"
            >
              Post a brief in this category
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <NoticeBanner tone="info" title="Illustrative category preview">
          Any artist profiles and event briefs shown below are sample prototype items demonstrating
          how {category.label.toLowerCase()} appear on Cultgig.
        </NoticeBanner>

        <section className="space-y-5">
          <h2 className="type-h2 text-ink">Sample artists in {category.label}</h2>
          {matchingArtists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {matchingArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-line rounded-lg p-6 flex flex-wrap items-center justify-between gap-4">
              <p className="type-body text-ink-secondary">
                No sample profiles are seeded for this discipline yet. You can create an artist
                profile or post an event brief for {category.label.toLowerCase()}.
              </p>
              <Link
                to="/for-artists"
                className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-hover type-label"
              >
                Join as an artist
              </Link>
            </div>
          )}
        </section>

        <section className="space-y-5">
          <h2 className="type-h2 text-ink">Open sample briefs in {category.label}</h2>
          {matchingGigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {matchingGigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-line rounded-lg p-6 flex flex-wrap items-center justify-between gap-4">
              <p className="type-body text-ink-secondary">
                No open sample briefs in {category.label} yet. Event hosts can post a brief in under
                two minutes.
              </p>
              <Link
                to={`/client/gigs/new?category=${category.slug}`}
                className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-md border border-line-strong text-ink hover:border-brand hover:text-brand type-label"
              >
                Post a gig brief
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
