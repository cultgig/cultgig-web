import { useState } from "react";
import {
  CalendarCheck,
  ChatCircleText,
  CheckCircle,
  Flag,
  GlobeHemisphereEast,
  MapPin,
  MinusCircle,
  MusicNotes,
  PencilSimple,
  Translate,
  UsersThree,
  VideoCamera,
} from "@phosphor-icons/react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtistCard, priceLabel, SaveArtistButton } from "@/components/marketplace/ArtistCard";
import { CategoryIcon } from "@/components/marketplace/CategoryIcon";
import { InquiryDialog } from "@/components/marketplace/InquiryDialog";
import { DemoBadge } from "@/components/shared/StatusBadge";
import { RatingStars, UserAvatar } from "@/components/shared/primitives";
import { ReportDialog } from "@/components/shared/ReportDialog";
import { SafeImage } from "@/components/shared/SafeImage";
import { EmptyState, NotFoundState, PageSkeleton } from "@/components/shared/states";
import { categoryLabel } from "@/data/categories";
import { formatInr } from "@/domain/money";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { artistRating, averageRatings } from "@/state/selectors";
import type { PortfolioItem } from "@/types/marketplace";
import { formatDate, parseDateOnly, toDateOnly } from "@/utils/format";

const workingModeLabel = { on_site: "On-site", remote: "Remote", both: "On-site and remote" } as const;

function PortfolioTile({ item, onOpen }: { item: PortfolioItem; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="group relative overflow-hidden rounded-xl border border-line bg-surface-container text-left focus-visible:outline-2">
      {item.type === "image" ? (
        <SafeImage src={item.mediaUrl} alt={item.title} className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
      ) : (
        <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 text-ink-secondary">
          {item.type === "audio" ? <MusicNotes size={32} aria-hidden /> : <VideoCamera size={32} aria-hidden />}
          <span className="type-label-sm">{item.type === "audio" ? "Audio sample" : "Video sample"}</span>
        </div>
      )}
      <div className="p-3">
        <p className="truncate type-label text-ink">{item.title}</p>
        {item.caption && <p className="line-clamp-1 type-caption text-ink-secondary">{item.caption}</p>}
      </div>
    </button>
  );
}

export function ArtistProfilePage({ slug }: { slug: string }) {
  const { artists, reviews, viewer, loading } = useMarketplace();
  const artist = artists.find((a) => a.slug === slug);
  usePageMeta(artist ? `${artist.displayName}, ${categoryLabel(artist.primaryCategory)}` : "Artist not found", artist?.tagline);
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

  if (loading) return <PageSkeleton rows={1} />;
  if (!artist) {
    return <NotFoundState title="This artist profile isn't available" description="The artist may have hidden their profile or changed its address. Explore other artists in the same category." backTo="/explore" backLabel="Explore artists" />;
  }

  const isOwner = viewer?.id === artist.ownerUserId;
  const artistReviews = reviews.filter((r) => r.artistProfileId === artist.id && r.status === "published");
  const rating = artistRating(reviews, artist.id);
  const breakdown = averageRatings(artistReviews);
  const similar = artists.filter((a) => a.id !== artist.id && a.published && (a.primaryCategory === artist.primaryCategory || a.city === artist.city)).slice(0, 3);
  const unavailable = artist.unavailableDates.map(parseDateOnly);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ctas = (
    <div className="flex flex-col gap-2">
      {isOwner ? (
        <Button asChild size="lg">
          <Link to="/artist/profile">
            <PencilSimple aria-hidden /> Edit your profile
          </Link>
        </Button>
      ) : (
        <>
          <InquiryDialog artist={artist} mode="quote" trigger={<Button size="lg">Request a quote</Button>} />
          <InquiryDialog
            artist={artist}
            trigger={
              <Button size="lg" variant="outline">
                <ChatCircleText aria-hidden /> Contact artist
              </Button>
            }
          />
        </>
      )}
    </div>
  );

  return (
    <main id="main-content" className="pb-24 lg:pb-14">
      <div className="page-container">
        <Breadcrumb className="py-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/explore">Explore</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/categories/${artist.primaryCategory}`}>{categoryLabel(artist.primaryCategory)}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{artist.displayName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="relative h-44 overflow-hidden rounded-2xl bg-surface-container sm:h-72">
          <SafeImage src={artist.coverUrl} alt={artist.coverAlt} loading="eager" className="size-full object-cover" />
        </div>
        <div className="flex items-start justify-between gap-4">
          <UserAvatar name={artist.displayName} src={artist.avatarUrl} className="-mt-12 ml-4 size-24 border-4 border-surface shadow-md sm:-mt-14 sm:ml-6 sm:size-28" />
          <div className="flex gap-2 pt-4">
            <SaveArtistButton artistId={artist.id} withLabel />
            {!isOwner && (
              <ReportDialog
                targetType="artist_profile"
                targetId={artist.id}
                targetLabel="this profile"
                trigger={
                  <Button variant="ghost" size="sm" aria-label="Report profile">
                    <Flag aria-hidden /> <span className="hidden sm:inline">Report</span>
                  </Button>
                }
              />
            )}
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="type-title text-ink-strong">{artist.displayName}</h1>
            {artist.isSample && <DemoBadge />}
            {!artist.published && <span className="rounded-md bg-status-warning-soft px-2 py-0.5 type-label-sm text-status-warning">Draft, only you can see this</span>}
          </div>
          <p className="max-w-2xl type-body-lg text-ink-secondary">{artist.tagline}</p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          <div className="min-w-0 space-y-8">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 type-body-sm text-ink-secondary">
              <li className="flex items-center gap-1.5">
                <CategoryIcon slug={artist.primaryCategory} size={16} /> {categoryLabel(artist.primaryCategory)}
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={16} aria-hidden /> {artist.city}
              </li>
              <li className="flex items-center gap-1.5">
                <UsersThree size={16} aria-hidden /> {artist.artistFormat === "group" ? "Group" : "Solo"}, {artist.experienceYears} years
              </li>
              <li className="flex items-center gap-1.5">
                <Translate size={16} aria-hidden /> {artist.languages.join(", ") || "Languages not listed"}
              </li>
              {rating && (
                <li>
                  <RatingStars value={rating.average} count={rating.count} />
                </li>
              )}
            </ul>

            <Tabs defaultValue="overview">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio ({artist.portfolio.length})</TabsTrigger>
                <TabsTrigger value="services">Services ({artist.packages.length})</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({artistReviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 pt-4">
                <section className="space-y-2">
                  <h2 className="type-h3 text-ink">About</h2>
                  <p className="whitespace-pre-line type-body text-ink-secondary">{artist.bio || "This artist hasn't written a bio yet."}</p>
                </section>
                {artist.secondaryCategories.length > 0 && (
                  <section className="space-y-2">
                    <h2 className="type-h4 text-ink">Also offers</h2>
                    <div className="flex flex-wrap gap-2">
                      {artist.secondaryCategories.map((c) => (
                        <Link key={c} to={`/categories/${c}`} className="rounded-full bg-surface-low px-3 py-1 type-label-sm text-ink hover:bg-surface-container">
                          {categoryLabel(c)}
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
                <section className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-line p-4">
                    <h2 className="mb-2 flex items-center gap-1.5 type-h4 text-ink">
                      <GlobeHemisphereEast size={18} aria-hidden /> Travel
                    </h2>
                    <p className="type-body-sm text-ink-secondary">
                      {workingModeLabel[artist.workingMode]}. Travels up to {artist.travelRadiusKm} km from {artist.city}
                      {artist.travelCities.length ? `, including ${artist.travelCities.join(", ")}` : ""}.
                    </p>
                  </div>
                  <div className="rounded-xl border border-line p-4">
                    <h2 className="mb-2 type-h4 text-ink">Equipment</h2>
                    <p className="type-body-sm text-ink-secondary">{artist.equipmentNotes || "Discuss equipment needs in your inquiry."}</p>
                  </div>
                </section>
                {artist.portfolio.length > 0 && (
                  <section className="space-y-3">
                    <h2 className="type-h3 text-ink">Featured work</h2>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {artist.portfolio.slice(0, 3).map((p) => (
                        <PortfolioTile key={p.id} item={p} onOpen={() => setLightbox(p)} />
                      ))}
                    </div>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="portfolio" className="pt-4">
                {artist.portfolio.length ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {artist.portfolio.map((p) => (
                      <PortfolioTile key={p.id} item={p} onOpen={() => setLightbox(p)} />
                    ))}
                  </div>
                ) : (
                  <EmptyState compact title="No portfolio items yet" description="Ask the artist for recent work in your inquiry." />
                )}
              </TabsContent>

              <TabsContent value="services" className="space-y-3 pt-4">
                {artist.packages.length ? (
                  artist.packages.map((pkg) => (
                    <article key={pkg.id} className="rounded-xl border border-line bg-surface p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="type-h4 text-ink">{pkg.title}</h3>
                          <p className="type-caption text-ink-secondary">
                            {pkg.duration}, {workingModeLabel[pkg.format]}
                          </p>
                        </div>
                        <p className="type-h4 text-ink">{pkg.priceInr === null ? "Quote on request" : formatInr(pkg.priceInr)}</p>
                      </div>
                      {pkg.description && <p className="mt-2 type-body-sm text-ink-secondary">{pkg.description}</p>}
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <ul className="space-y-1">
                          {pkg.inclusions.map((i) => (
                            <li key={i} className="flex gap-2 type-body-sm text-ink">
                              <CheckCircle size={16} className="mt-0.5 shrink-0 text-status-success" aria-hidden /> {i}
                            </li>
                          ))}
                        </ul>
                        <ul className="space-y-1">
                          {pkg.exclusions.map((i) => (
                            <li key={i} className="flex gap-2 type-body-sm text-ink-secondary">
                              <MinusCircle size={16} className="mt-0.5 shrink-0" aria-hidden /> <span><span className="sr-only">Not included: </span>{i}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {!isOwner && (
                        <InquiryDialog artist={artist} mode="quote" trigger={<Button variant="outline" size="sm" className="mt-4">Request this service</Button>} />
                      )}
                    </article>
                  ))
                ) : (
                  <EmptyState compact title="No services listed yet" description="You can still describe what you need in an inquiry." />
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 pt-4">
                {breakdown && (
                  <div className="grid gap-2 rounded-xl border border-line bg-surface-low p-4 sm:grid-cols-5">
                    {(["overall", "professionalism", "communication", "quality", "punctuality"] as const).map((k) => (
                      <div key={k}>
                        <p className="type-caption capitalize text-ink-secondary">{k}</p>
                        <p className="type-h4 text-ink">{breakdown[k].toFixed(1)}</p>
                      </div>
                    ))}
                  </div>
                )}
                {artistReviews.length ? (
                  artistReviews.map((r) => (
                    <article key={r.id} className="rounded-xl border border-line p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <RatingStars value={r.ratings.overall} />
                          <span className="type-label text-ink">{r.reviewerName}</span>
                          <span className="inline-flex items-center gap-1 type-caption text-status-success">
                            <CalendarCheck size={14} aria-hidden /> Verified booking
                          </span>
                          {r.isSample && <DemoBadge />}
                        </div>
                        <ReportDialog targetType="review" targetId={r.id} targetLabel="this review" trigger={<Button variant="ghost" size="sm">Report</Button>} />
                      </div>
                      <p className="mt-2 type-body text-ink-secondary">{r.text}</p>
                      <p className="mt-1 type-caption text-ink-secondary">{formatDate(r.createdAt)}</p>
                    </article>
                  ))
                ) : (
                  <EmptyState compact title="No reviews yet" description="Reviews come only from clients with a completed booking, so new artists start with none." />
                )}
              </TabsContent>
            </Tabs>
          </div>

          <aside className="space-y-4">
            <div className="space-y-4 rounded-xl border border-line bg-surface p-5 shadow-sm lg:sticky lg:top-[calc(var(--header-height)+16px)]">
              <div>
                <p className="type-caption text-ink-secondary">Pricing</p>
                <p className="type-h2 text-ink-strong">{priceLabel(artist)}</p>
                <p className="type-caption text-ink-secondary">Final price is agreed in a versioned offer before booking.</p>
              </div>
              <div className="hidden lg:block">{ctas}</div>
              <div className="border-t border-line pt-4">
                <p className="mb-2 type-label text-ink">Availability</p>
                <Calendar
                  mode="multiple"
                  selected={[]}
                  disabled={(d) => d < today || unavailable.some((u) => toDateOnly(u) === toDateOnly(d))}
                  className="rounded-lg border border-line p-2"
                  aria-label="Availability calendar. Unavailable dates are disabled."
                />
                <p className="mt-2 type-caption text-ink-secondary">Greyed-out dates are unavailable. Confirm your date in the inquiry.</p>
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-14 space-y-4">
            <h2 className="type-h2 text-ink">Similar artists</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((a) => (
                <ArtistCard key={a.id} artist={a} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky actions */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-header border-t border-line bg-surface p-3 lg:hidden">{ctas}</div>

      <Dialog open={Boolean(lightbox)} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="sm:max-w-3xl">
          {lightbox && (
            <>
              <DialogHeader>
                <DialogTitle>{lightbox.title}</DialogTitle>
                <DialogDescription>{lightbox.caption}</DialogDescription>
              </DialogHeader>
              {lightbox.type === "image" ? (
                <SafeImage src={lightbox.mediaUrl} alt={lightbox.title} className="max-h-[70vh] w-full rounded-lg object-contain" />
              ) : lightbox.type === "audio" ? (
                <audio controls src={lightbox.mediaUrl} className="w-full">
                  Your browser can't play this audio sample.
                </audio>
              ) : (
                <video controls preload="metadata" poster={artist.coverUrl} src={lightbox.mediaUrl} className="max-h-[70vh] w-full rounded-lg">
                  Your browser can't play this video sample.
                </video>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
