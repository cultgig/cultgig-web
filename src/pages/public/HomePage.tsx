import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Buildings,
  ChatsCircle,
  CheckCircle,
  FileText,
  HandCoins,
  MagnifyingGlass,
  MapPin,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArtistCard } from "@/components/marketplace/ArtistCard";
import { CategoryIcon } from "@/components/marketplace/CategoryIcon";
import { SafeImage } from "@/components/shared/SafeImage";
import { EmptyState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { creativeCategories, indianCities, popularServiceShowcaseSlugs } from "@/data/categories";
import { detailedFaqList } from "@/content/faq";
import { heroImage, pageImages } from "@/content/images";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link, useRouter } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";

const steps = [
  { icon: MagnifyingGlass, title: "Discover or post", body: "Search portfolios by craft, city and budget — or post a gig and let artists come to you." },
  { icon: ChatsCircle, title: "Talk it through", body: "Message in one thread. Share timings, venue details and references without swapping numbers." },
  { icon: HandCoins, title: "Agree a versioned offer", body: "Offers and counter-offers are kept as numbered versions, so both sides know exactly what was agreed." },
  { icon: CheckCircle, title: "Manage the booking", body: "Track every booking from confirmation to completion, then leave a verified review." },
];

export function HomePage() {
  usePageMeta("Find the talent behind unforgettable moments", "Discover independent musicians, mehendi artists, photographers, decorators, dancers and creative professionals across India.");
  const { navigate } = useRouter();
  const { artists, loading } = useMarketplace();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (city !== "all") params.set("city", city);
    navigate(`/explore${params.toString() ? `?${params}` : ""}`);
  };

  const featured = artists.filter((a) => a.published).slice(0, 4);
  const showcase = popularServiceShowcaseSlugs.map((slug) => creativeCategories.find((c) => c.slug === slug)).filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <main id="main-content">
      {/* Hero */}
      <section className="border-b border-line bg-surface-low">
        <div className="page-container grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 type-label-sm text-ink-secondary shadow-xs">
              <Sparkle size={14} weight="fill" className="text-brand-ink" aria-hidden /> India's marketplace for creative services
            </p>
            <h1 className="type-display text-ink-strong">Find the talent behind unforgettable moments.</h1>
            <p className="max-w-xl type-body-lg text-ink-secondary">
              Musicians, mehendi artists, photographers, decorators, dancers and hosts — compare real portfolios, agree clear terms and manage bookings in one place.
            </p>
            <form onSubmit={onSearch} role="search" className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-2 shadow-md sm:flex-row sm:items-center">
              <label htmlFor="hero-search" className="sr-only">
                What are you looking for?
              </label>
              <div className="relative flex-1">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" aria-hidden />
                <Input
                  id="hero-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try ‘sufi band’, ‘bridal mehendi’ or ‘wedding photographer’"
                  className="h-12 border-0 pl-10 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="flex gap-2">
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger aria-label="City" className="h-12 w-full border-0 bg-surface-low shadow-none sm:w-40">
                    <MapPin size={16} aria-hidden className="text-ink-secondary" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All cities</SelectItem>
                    {indianCities.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" size="lg" className="h-12 shrink-0">
                  Search
                </Button>
              </div>
            </form>
            <div className="flex flex-wrap items-center gap-2">
              <span className="type-caption text-ink-secondary">Popular:</span>
              {showcase.slice(0, 5).map((c) => (
                <Link key={c.slug} to={`/categories/${c.slug}`} className="rounded-full border border-line bg-surface px-3 py-1 type-label-sm text-ink hover:bg-surface-container">
                  {c.shortLabel}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg">
                <Link to="/explore">Find an artist</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/sign-up?role=artist">Join as an artist</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <SafeImage src={heroImage.src} alt={heroImage.alt} loading="eager" fetchPriority="high" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lg" />
            <div className="absolute -bottom-5 -left-6 max-w-[240px] rounded-xl border border-line bg-surface p-4 shadow-md">
              <p className="type-label text-ink">Proposal v3 accepted</p>
              <p className="type-caption text-ink-secondary">Every offer and counter-offer is kept on record.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="page-container py-14" aria-labelledby="categories-heading">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="categories-heading" className="type-h1 text-ink-strong">
              Browse by craft
            </h2>
            <p className="type-body text-ink-secondary">15 creative disciplines, from stage to studio.</p>
          </div>
          <Link to="/categories" className="hidden items-center gap-1 type-label text-brand hover:text-brand-hover sm:inline-flex">
            All categories <ArrowRight aria-hidden />
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {creativeCategories.slice(0, 10).map((c) => (
            <li key={c.slug}>
              <Link to={`/categories/${c.slug}`} className="flex h-full flex-col gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-surface-low">
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-subtle text-brand">
                  <CategoryIcon slug={c.slug} size={22} />
                </span>
                <span className="type-label text-ink">{c.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/categories" className="mt-4 inline-flex items-center gap-1 type-label text-brand sm:hidden">
          All categories <ArrowRight aria-hidden />
        </Link>
      </section>

      {/* Popular services */}
      <section className="bg-surface-low py-14" aria-labelledby="services-heading">
        <div className="page-container">
          <h2 id="services-heading" className="mb-6 type-h1 text-ink-strong">
            Popular creative services
          </h2>
          <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {showcase.slice(0, 8).map((c) => (
              <li key={c.slug} className="w-[240px] shrink-0 snap-start sm:w-auto">
                <Link to={`/categories/${c.slug}`} className="group block overflow-hidden rounded-xl border border-line bg-surface">
                  <SafeImage src={c.imageUrl} alt={c.imageAlt} className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                  <div className="p-4">
                    <p className="type-h4 text-ink">{c.label}</p>
                    <p className="mt-1 line-clamp-2 type-body-sm text-ink-secondary">{c.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured artists */}
      <section className="page-container py-14" aria-labelledby="featured-heading">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="featured-heading" className="type-h1 text-ink-strong">
              Featured artists
            </h2>
            <p className="type-body text-ink-secondary">Complete profiles with services, portfolios and availability.</p>
          </div>
          <Link to="/explore" className="hidden items-center gap-1 type-label text-brand hover:text-brand-hover sm:inline-flex">
            Explore all <ArrowRight aria-hidden />
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : featured.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        ) : (
          <EmptyState title="Artist profiles are on their way" description="We're onboarding our first artists. Join as an artist to be among the first profiles clients see." action={{ label: "Join as an artist", to: "/sign-up?role=artist" }} />
        )}
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-surface-low py-14" aria-labelledby="how-heading">
        <div className="page-container">
          <h2 id="how-heading" className="type-h1 text-ink-strong">
            How Cultgig works
          </h2>
          <p className="mb-8 type-body text-ink-secondary">From first message to completed booking, without forwarded numbers or lost terms.</p>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-line bg-surface p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand text-ink-inverse type-label">{i + 1}</span>
                  <s.icon size={22} className="text-ink-secondary" aria-hidden />
                </div>
                <h3 className="type-h4 text-ink">{s.title}</h3>
                <p className="mt-1 type-body-sm text-ink-secondary">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Two audiences */}
      <section className="page-container grid gap-6 py-14 lg:grid-cols-2">
        <article className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-7">
          <span className="flex size-11 items-center justify-center rounded-xl bg-surface-container text-ink">
            <Buildings size={24} aria-hidden />
          </span>
          <h2 className="type-h2 text-ink-strong">For clients, venues and event planners</h2>
          <ul className="space-y-2.5 type-body text-ink-secondary">
            {["Compare portfolios, prices and availability side by side", "Post a gig once and receive structured applications", "Keep every offer and counter-offer on record", "Shortlist, message and book in one workspace"].map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            <Button asChild>
              <Link to="/client/gigs/new">Post a gig</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/for-businesses">For businesses</Link>
            </Button>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border border-line-subtle bg-brand-light-subtle p-7">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-light text-ink">
            <Sparkle size={24} aria-hidden />
          </span>
          <h2 className="type-h2 text-ink-strong">For artists and creative teams</h2>
          <ul className="space-y-2.5 type-body text-ink-secondary">
            {["A professional profile with services, packages and media", "Gigs matched to your craft and city", "Quote your way: fixed, range or quotation-based", "Track proposals, bookings and earnings"].map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            <Button asChild>
              <Link to="/sign-up?role=artist">Join as an artist</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/for-artists">Learn more</Link>
            </Button>
          </div>
        </article>
      </section>

      {/* Business banner */}
      <section className="page-container pb-14">
        <div className="grid items-center gap-8 overflow-hidden rounded-2xl bg-ink-strong text-ink-inverse lg:grid-cols-2">
          <div className="space-y-4 p-8 lg:p-12">
            <h2 className="type-h1">Programming a venue or planning a launch?</h2>
            <p className="type-body-lg text-ink-inverse/80">
              Restaurants, hotels, studios and brands use Cultgig to book recurring live music, décor and hosts — with clear scope, dates and cancellation terms for every booking.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-brand-light text-ink hover:bg-brand-light-hover">
                <Link to="/for-businesses">See how businesses hire</Link>
              </Button>
            </div>
          </div>
          <SafeImage src={pageImages.forBusinessesHero.src} alt={pageImages.forBusinessesHero.alt} className="hidden h-full min-h-[320px] w-full object-cover lg:block" />
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-line bg-surface-low py-14">
        <div className="page-container grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-3">
            <ShieldCheck size={32} className="text-brand" aria-hidden />
            <h2 className="type-h1 text-ink-strong">Questions, answered</h2>
            <p className="type-body text-ink-secondary">
              Straight answers about hiring, negotiation and payments. Read the <Link to="/safety" className="text-brand underline-offset-4 hover:underline">trust & safety</Link> page for how we handle reports and disputes.
            </p>
            <Button asChild variant="outline">
              <Link to="/faq">
                <FileText aria-hidden /> All FAQs
              </Link>
            </Button>
          </div>
          <Accordion type="single" collapsible className="rounded-xl border border-line bg-surface px-5">
            {detailedFaqList.slice(0, 5).map((f) => (
              <AccordionItem key={f.question} value={f.question}>
                <AccordionTrigger className="text-left type-h4 text-ink">{f.question}</AccordionTrigger>
                <AccordionContent className="type-body text-ink-secondary">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
}
