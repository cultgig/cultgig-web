import { ArrowLeft } from "@phosphor-icons/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArtistCard } from "@/components/marketplace/ArtistCard";
import { CategoryIcon } from "@/components/marketplace/CategoryIcon";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { SafeImage } from "@/components/shared/SafeImage";
import { EmptyState, NotFoundState } from "@/components/shared/states";
import { creativeCategories, getCategoryBySlug } from "@/data/categories";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";

const groups = ["Music & performance", "Visual & heritage craft", "Styling & beauty", "Production & spaces"] as const;

export function CategoriesIndexPage() {
  usePageMeta("Creative categories", "Browse 15 creative disciplines on Cultgig for celebrations, hospitality venues and brand events.");
  const { artists } = useMarketplace();
  const countFor = (slug: string) => artists.filter((a) => a.published && (a.primaryCategory === slug || a.secondaryCategories.includes(slug as never))).length;

  return (
    <main id="main-content" className="page-container space-y-14 py-12 lg:py-16">
      <div className="max-w-2xl space-y-4">
        <h1 className="type-title text-ink-strong">Creative categories</h1>
        <p className="type-body-lg text-ink-secondary">The creative professions behind Indian weddings, venues, brand launches and private commissions.</p>
      </div>
      {groups.map((group) => (
        <section key={group} className="space-y-4" aria-labelledby={`g-${group}`}>
          <h2 id={`g-${group}`} className="border-b border-line pb-3 type-h2 text-ink-strong">
            {group}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {creativeCategories
              .filter((c) => c.parentGroup === group)
              .map((c) => {
                const n = countFor(c.slug);
                return (
                  <li key={c.slug}>
                    <Link to={`/categories/${c.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-line-strong">
                      <div className="overflow-hidden">
                        <SafeImage src={c.imageUrl} alt={c.imageAlt} className="aspect-[16/10] w-full object-cover transition-transform duration-enter group-hover:scale-[1.02]" />
                      </div>
                      <div className="flex flex-1 flex-col gap-2 p-5">
                        <div className="flex items-center gap-2">
                          <CategoryIcon slug={c.slug} size={18} className="text-ink-secondary" />
                          <h3 className="type-h4 text-ink-strong">{c.label}</h3>
                        </div>
                        <p className="type-body-sm text-ink-secondary">{c.description}</p>
                        <p className="mt-auto pt-2 type-caption text-ink-secondary">{n ? `${n} ${n === 1 ? "artist" : "artists"}` : "Artists joining soon"}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </main>
  );
}

export function CategoryDetailPage({ slug }: { slug: string }) {
  const category = getCategoryBySlug(slug);
  usePageMeta(category ? `${category.label} in India` : "Category not found", category?.description);
  const { artists, gigs } = useMarketplace();
  if (!category) return <NotFoundState title="That category doesn't exist" description="It may have been renamed. Browse all creative categories instead." backTo="/categories" backLabel="All categories" />;

  const inCategory = artists.filter((a) => a.published && (a.primaryCategory === category.slug || a.secondaryCategories.includes(category.slug)));
  const openGigs = gigs.filter((g) => g.status === "open" && g.category === category.slug).length;
  const related = creativeCategories.filter((c) => c.parentGroup === category.parentGroup && c.slug !== category.slug);

  return (
    <main id="main-content">
      <section className="border-b border-line bg-surface-low">
        <div className="page-container grid items-center gap-8 py-10 lg:grid-cols-2">
          <div className="space-y-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/categories">Categories</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{category.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="type-display text-ink-strong">{category.label}</h1>
            <p className="type-body-lg text-ink-secondary">{category.description}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={`/explore?category=${category.slug}`}>Search {category.shortLabel.toLowerCase()}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={`/client/gigs/new?category=${category.slug}`}>Post a gig</Link>
              </Button>
            </div>
            {openGigs > 0 && <p className="type-body-sm text-ink-secondary">{openGigs} open {openGigs === 1 ? "gig" : "gigs"} in this category right now.</p>}
          </div>
          <SafeImage src={category.imageUrl} alt={category.imageAlt} loading="eager" className="hidden aspect-[16/10] w-full rounded-2xl object-cover lg:block" />
        </div>
      </section>

      <section className="page-container space-y-5 py-10">
        {category.complianceNote && <NoticeBanner tone="warning" title="Before you book">{category.complianceNote}</NoticeBanner>}
        <div className="flex items-end justify-between">
          <h2 className="type-h2 text-ink-strong">
            {inCategory.length} {inCategory.length === 1 ? "artist" : "artists"}
          </h2>
          {inCategory.length > 0 && (
            <Link to={`/explore?category=${category.slug}`} className="type-label text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:text-brand-hover hover:decoration-brand">
              Filter and sort
            </Link>
          )}
        </div>
        {inCategory.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {inCategory.map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No ${category.shortLabel.toLowerCase()} profiles yet`}
            description="Artists in this category are still joining. Post a gig and we'll show it to them as they sign up, or browse related categories below."
            action={{ label: "Post a gig", to: `/client/gigs/new?category=${category.slug}` }}
            secondaryAction={{ label: "Are you one? Join as an artist", to: "/sign-up?role=artist" }}
          />
        )}
      </section>

      {related.length > 0 && (
        <section className="page-container space-y-4 pb-14">
          <h2 className="type-h3 text-ink">Related categories</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((c) => (
              <Link key={c.slug} to={`/categories/${c.slug}`} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 type-label text-ink hover:bg-surface-low">
                <CategoryIcon slug={c.slug} size={16} className="text-brand" /> {c.label}
              </Link>
            ))}
          </div>
          <Link to="/categories" className="inline-flex items-center gap-1 type-label text-ink-secondary hover:text-ink">
            <ArrowLeft aria-hidden /> All categories
          </Link>
        </section>
      )}
    </main>
  );
}
