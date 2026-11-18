import {
  ArrowRight,
  Brush,
  CalendarCheck,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Disc3,
  FileText,
  Flower2,
  Lamp,
  Layers,
  MessageSquareText,
  Mic,
  Music,
  PaintBucket,
  Palette,
  Radio,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { SafeImage } from "../components/ui/SafeImage";
import { imageManifest } from "../content/images";
import {
  creativeCategories,
  indianCities,
  popularServiceShowcaseSlugs,
  type CreativeCategory,
} from "../data/categories";
import { editorialGuides } from "../data/guides";
import { sampleArtists } from "../data/sampleMarketplace";
import { usePageMeta } from "../hooks/usePageMeta";
import { Link, useRouter } from "../lib/router";

const iconMap: Record<CreativeCategory["iconName"], typeof Music> = {
  Music,
  Mic,
  Disc3,
  Sparkles,
  Camera,
  Flower2,
  Palette,
  Scissors,
  Brush,
  PaintBucket,
  UserCheck,
  ShieldCheck,
  Lamp,
  Radio,
  Layers,
};

const cardSurfaceTones = [
  "bg-[#421A3D]",
  "bg-[#54234E]",
  "bg-[#3B2639]",
  "bg-[#6A2E62]",
  "bg-[#2F1D2E]",
  "bg-[#5A3248]",
  "bg-[#472540]",
  "bg-[#3E2438]",
];

const illustrativeMoments = [
  {
    id: "hospitality",
    label: "Hospitality evening",
    title: "Intimate sunset acoustic sets for cafés and boutique venues",
    description:
      "Illustrative scenario: A venue shares timing, guest count, and PA availability upfront so solo musicians and bands submit accurate proposals.",
    imageUrl: imageManifest.categoryMusicians.src,
    imageAlt: imageManifest.categoryMusicians.alt,
  },
  {
    id: "celebration",
    label: "Family celebrations",
    title: "Coordinated mehendi, saree draping, and photography for sangeets",
    description:
      "Illustrative scenario: Families compare real daylight craft portfolios and lock in arrival times and deliverables clearly.",
    imageUrl: imageManifest.categoryMehendi.src,
    imageAlt: imageManifest.categoryMehendi.alt,
  },
  {
    id: "commissions",
    label: "Studio & space commissions",
    title: "Lawful, owner-commissioned wall murals and bespoke decor",
    description:
      "Illustrative scenario: Studios review past architectural projects, agree on concept sketches, and track scope in versioned offers.",
    imageUrl: imageManifest.categoryMural.src,
    imageAlt: imageManifest.categoryMural.alt,
  },
];

export function HomePage() {
  usePageMeta(
    "Find the artists who make the moment",
    "Discover independent musicians, mehendi artists, photographers, decorators, dancers, and creative professionals across India."
  );

  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeMomentIndex, setActiveMomentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const matchingCategories = creativeCategories
      .filter((c) => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .slice(0, 4)
      .map((c) => ({
        label: c.label,
        hint: "Category",
        path: `/categories/${c.slug}`,
      }));

    const matchingArtists = sampleArtists
      .filter(
        (a) =>
          a.displayName.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((a) => ({
        label: a.displayName,
        hint: `${a.city} · Sample profile`,
        path: `/artists/${a.slug}`,
      }));

    return [...matchingCategories, ...matchingArtists];
  }, [searchQuery]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCity) params.set("city", selectedCity);
    const qs = params.toString();
    navigate(qs ? `/explore?${qs}` : "/explore");
  };

  const scrollServices = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const offset = direction === "left" ? -320 : 320;
    carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  const topCategories = creativeCategories.slice(0, 9);
  const popularServices = popularServiceShowcaseSlugs
    .map((slug) => creativeCategories.find((c) => c.slug === slug))
    .filter((c): c is CreativeCategory => Boolean(c));

  const activeMoment = illustrativeMoments[activeMomentIndex];

  return (
    <main id="main-content" className="bg-canvas text-ink-primary">
      {/* 1. Image-Led Search Hero */}
      <section className="relative w-full overflow-hidden bg-ink-dark">
        <div className="max-w-[1360px] mx-auto relative min-h-[500px] lg:min-h-[540px] flex items-center">
          <SafeImage
            src={imageManifest.heroPerformance.src}
            alt={imageManifest.heroPerformance.alt}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#181016]/90 via-[#181016]/75 to-[#181016]/45"
          />

          <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
            <div className="max-w-[680px] space-y-6">
              <h1 className="text-[32px] sm:text-[42px] lg:text-[50px] leading-[1.15] tracking-[-0.02em] font-bold text-white">
                Find the artists who make the moment.
              </h1>
              <p className="text-[16px] leading-[24px] text-white/90 max-w-[580px]">
                Discover independent artists for celebrations, venues, brands and everything worth
                bringing to life across India.
              </p>

              {/* Search Bar with Autocomplete */}
              <div className="relative">
                <form
                  onSubmit={handleHeroSearch}
                  role="search"
                  aria-label="Search Cultgig artists and categories"
                  className="bg-surface rounded-lg p-1.5 shadow-elevated flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5"
                >
                  <div className="flex-1 flex items-center gap-2.5 px-3 min-w-0">
                    <Search size={18} className="text-ink-muted shrink-0" aria-hidden="true" />
                    <label htmlFor="hero-search-input" className="sr-only">
                      Search by artist, creative category, or event type
                    </label>
                    <input
                      id="hero-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setTimeout(() => setSearchFocused(false), 160)}
                      placeholder="Try ‘live band’, ‘mehendi artist’ or ‘wedding dancer’"
                      className="w-full py-2.5 text-[15px] leading-[20px] text-ink-primary placeholder:text-ink-muted bg-transparent border-0 focus:outline-none"
                    />
                  </div>

                  <div className="sm:border-l border-line sm:pl-2 flex items-center gap-2">
                    <label htmlFor="hero-city-select" className="sr-only">
                      City
                    </label>
                    <select
                      id="hero-city-select"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full sm:w-[140px] py-2.5 px-2 text-[14px] text-ink-secondary bg-transparent border-0 focus:outline-none"
                    >
                      <option value="">All cities</option>
                      {indianCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      className="min-h-[44px] px-6 py-2.5 rounded-md bg-plum text-white hover:bg-plum-hover font-semibold text-[15px] leading-[20px] whitespace-nowrap shrink-0"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {searchFocused && suggestions.length > 0 && (
                  <div
                    role="listbox"
                    aria-label="Search suggestions"
                    className="absolute left-0 right-0 top-full mt-2 bg-surface border border-line rounded-lg shadow-elevated p-2 z-30"
                  >
                    {suggestions.map((item) => (
                      <Link
                        key={item.path + item.label}
                        to={item.path}
                        className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-plum-soft text-ink-primary"
                      >
                        <span className="type-body font-medium">{item.label}</span>
                        <span className="type-caption text-ink-muted">{item.hint}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Suggested Categories + Primary CTAs */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="type-body-sm text-white/80 mr-1">Popular:</span>
                {[
                  { label: "Music & bands", slug: "music-and-bands" },
                  { label: "Mehendi artists", slug: "mehendi-artists" },
                  { label: "Photography", slug: "photography-and-videography" },
                  { label: "Saree draping", slug: "saree-draping-and-styling" },
                  { label: "Decorators", slug: "decorators-and-florists" },
                ].map((chip) => (
                  <Link
                    key={chip.slug}
                    to={`/categories/${chip.slug}`}
                    className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-md border border-white/30 bg-white/10 text-white hover:bg-white/20 text-[13px] font-medium whitespace-nowrap"
                  >
                    <span>{chip.label}</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-white text-ink-primary hover:bg-plum-soft font-semibold text-[15px]"
                >
                  Explore artists
                </Link>
                <Link
                  to="/client/gigs/new"
                  className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md border border-white/40 text-white hover:bg-white/10 font-semibold text-[15px]"
                >
                  Post a gig
                </Link>
                <Link
                  to="/for-artists"
                  className="text-[14px] font-medium text-white/90 hover:text-white underline underline-offset-4"
                >
                  Join as an artist
                </Link>
              </div>
            </div>

            {/* Verified Truth Strip */}
            <div className="mt-10 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-white/80 type-body-sm">
              <span>Artist profiles · Event briefs · Direct conversations</span>
              <span>Illustrative sample previews active — live marketplace onboarding open</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Browse Categories Compact Tiles */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {topCategories.map((cat) => {
            const Icon = iconMap[cat.iconName];
            return (
              <Link
                key={cat.slug}
                to={`/categories/${cat.slug}`}
                className="group bg-surface border border-line rounded-lg p-3.5 flex flex-col items-start justify-between gap-3 min-h-[104px] hover:border-plum hover:shadow-soft"
              >
                <Icon
                  size={20}
                  className="text-ink-primary group-hover:text-plum transition-colors"
                  aria-hidden="true"
                />
                <span className="text-[13px] leading-[17px] font-semibold text-ink-primary group-hover:text-plum">
                  {cat.shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Popular Creative Services Horizontal Showcase */}
      <section
        className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
        aria-labelledby="popular-services-heading"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2
              id="popular-services-heading"
              className="text-[24px] sm:text-[28px] leading-[1.2] font-bold text-ink-primary"
            >
              Popular creative services
            </h2>
            <p className="type-body text-ink-secondary mt-1">
              Explore disciplines built around Indian celebrations, hospitality spaces, and creative commissions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollServices("left")}
              aria-label="Scroll services left"
              className="w-10 h-10 rounded-full border border-line bg-surface flex items-center justify-center text-ink-primary hover:border-plum hover:text-plum"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollServices("right")}
              aria-label="Scroll services right"
              className="w-10 h-10 rounded-full border border-line bg-surface flex items-center justify-center text-ink-primary hover:border-plum hover:text-plum"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
            <Link
              to="/categories"
              className="ml-2 type-label text-plum hover:text-plum-hover whitespace-nowrap"
            >
              All 15 categories
            </Link>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory"
        >
          {popularServices.map((service, index) => (
            <Link
              key={service.slug}
              to={`/categories/${service.slug}`}
              className={`snap-start shrink-0 w-[210px] sm:w-[225px] rounded-xl p-4 flex flex-col justify-between gap-4 text-white hover:opacity-95 ${
                cardSurfaceTones[index % cardSurfaceTones.length]
              }`}
            >
              <h3 className="text-[16px] leading-[21px] font-semibold text-white min-h-[42px]">
                {service.label}
              </h3>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black/20">
                <SafeImage
                  src={service.imageUrl}
                  alt={service.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Make It Happen With Artists — 4 Pillars */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 border-t border-line-light">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <h2 className="text-[24px] sm:text-[28px] leading-[1.2] font-bold text-ink-primary">
            Make it all happen with independent artists
          </h2>
          <Link
            to="/sign-up"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-ink-primary text-white hover:bg-plum font-semibold text-[14px]"
          >
            Join Cultgig
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Search size={24} className="text-plum" aria-hidden="true" />
            <h3 className="type-h3 text-ink-primary">Compare real craft</h3>
            <p className="type-body text-ink-secondary">
              Explore category-specific portfolios, recordings, and starting packages instead of forwarded phone numbers.
            </p>
          </div>
          <div className="space-y-3">
            <FileText size={24} className="text-plum" aria-hidden="true" />
            <h3 className="type-h3 text-ink-primary">Share a clear brief</h3>
            <p className="type-body text-ink-secondary">
              Include timing, city, venue setup, and budget approach upfront so every reply is relevant.
            </p>
          </div>
          <div className="space-y-3">
            <MessageSquareText size={24} className="text-plum" aria-hidden="true" />
            <h3 className="type-h3 text-ink-primary">Versioned negotiation</h3>
            <p className="type-body text-ink-secondary">
              Agree on scope, travel, and deliverables inside structured counter-offers with full version history.
            </p>
          </div>
          <div className="space-y-3">
            <CalendarCheck size={24} className="text-plum" aria-hidden="true" />
            <h3 className="type-h3 text-ink-primary">Transparent booking terms</h3>
            <p className="type-body text-ink-secondary">
              Documented cancellation notes, privacy-safe venue sharing, and a clear booking lifecycle.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Feature Promotion for Businesses & Event Hosts */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-xl bg-plum-active text-white p-8 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="type-label text-plum-tint">For businesses, venues & celebration hosts</p>
            <h2 className="text-[26px] sm:text-[34px] leading-[1.2] font-bold text-white">
              Post one structured brief and compare artists who fit your room
            </h2>
            <ul className="space-y-2.5 text-[15px] leading-[22px] text-white/90">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-plum-tint shrink-0 mt-0.5" aria-hidden="true" />
                <span>Specify event date, duration, PA or staging notes, and INR budget range</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-plum-tint shrink-0 mt-0.5" aria-hidden="true" />
                <span>Invite shortlisted artists directly or receive structured applications</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-plum-tint shrink-0 mt-0.5" aria-hidden="true" />
                <span>Keep exact venue addresses private until a proposal progresses</span>
              </li>
            </ul>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/client/gigs/new"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-white text-plum-active hover:bg-plum-soft font-semibold text-[15px]"
              >
                Post a gig
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md border border-white/35 text-white hover:bg-white/10 font-semibold text-[15px]"
              >
                Explore artists
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-surface text-ink-primary rounded-lg p-5 shadow-elevated space-y-4">
              <div className="flex items-center justify-between gap-2 text-ink-muted type-caption">
                <span>Illustrative event brief</span>
                <span>Bandra West · Mumbai</span>
              </div>
              <h3 className="type-h3 text-ink-primary">
                Saturday sunset acoustic set for 60-seat terrace dinner
              </h3>
              <p className="type-body-sm text-ink-secondary">
                7:00 PM – 9:00 PM · In-house PA & mixer provided · Range ₹15,000 – ₹22,000
              </p>
              <div className="pt-3 border-t border-line-light flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <SafeImage
                    src={imageManifest.creatorRhea.src}
                    alt={imageManifest.creatorRhea.alt}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="type-label text-ink-primary">Rhea Kapoor (Sample)</p>
                    <p className="type-caption text-ink-muted">Proposal v2 · ₹20,500</p>
                  </div>
                </div>
                <Link
                  to="/messages/sample-thread-1"
                  className="type-label text-plum hover:text-plum-hover"
                >
                  Inspect offer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Feature Promotion for Independent Artists */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-xl bg-plum-soft border border-plum-border p-8 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="type-label text-plum">For independent artists & collectives</p>
            <h2 className="text-[26px] sm:text-[34px] leading-[1.2] font-bold text-ink-primary">
              Present your portfolio, set clear pricing modes, and negotiate respectfully
            </h2>
            <p className="type-body-lg text-ink-secondary max-w-[560px]">
              Whether you charge starting rates, fixed packages, or custom quotes, Cultgig puts your
              original craft, availability, and travel terms first.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/for-artists"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-plum text-white hover:bg-plum-hover font-semibold text-[15px]"
              >
                Create artist profile
              </Link>
              <Link
                to="/artist/opportunities"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md border border-line-strong bg-surface text-ink-primary hover:border-plum hover:text-plum font-semibold text-[15px]"
              >
                Browse sample briefs
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg overflow-hidden aspect-[4/3] bg-surface border border-line">
              <SafeImage
                src={imageManifest.categoryMehendi.src}
                alt={imageManifest.categoryMehendi.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden aspect-[4/3] bg-surface border border-line">
              <SafeImage
                src={imageManifest.categorySaree.src}
                alt={imageManifest.categorySaree.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Illustrative Creative Moments Showcase */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <p className="type-label text-plum mb-1">Illustrative creative moments</p>
            <h2 className="text-[24px] sm:text-[28px] leading-[1.2] font-bold text-ink-primary">
              How creative bookings come together across India
            </h2>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Illustrative creative moments">
            {illustrativeMoments.map((moment, idx) => (
              <button
                key={moment.id}
                type="button"
                role="tab"
                aria-selected={activeMomentIndex === idx}
                onClick={() => setActiveMomentIndex(idx)}
                className={`min-h-[40px] px-4 py-2 rounded-md text-[13px] font-semibold border whitespace-nowrap ${
                  activeMomentIndex === idx
                    ? "bg-plum text-white border-plum"
                    : "bg-surface text-ink-secondary border-line hover:border-plum hover:text-plum"
                }`}
              >
                {moment.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden aspect-[16/9] max-h-[460px] w-full bg-ink-dark">
          <SafeImage
            src={activeMoment.imageUrl}
            alt={activeMoment.imageAlt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#181016]/90 via-[#181016]/35 to-transparent"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white max-w-[720px] space-y-2">
            <h3 className="text-[20px] sm:text-[26px] leading-[1.25] font-bold text-white">
              {activeMoment.title}
            </h3>
            <p className="type-body text-white/90">{activeMoment.description}</p>
          </div>
        </div>
      </section>

      {/* 8. Editorial Guides */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-line-light">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[24px] sm:text-[28px] leading-[1.2] font-bold text-ink-primary">
              Guides to help you plan & book
            </h2>
            <p className="type-body text-ink-secondary mt-1">
              Practical checklists for hosts, event planners, and independent artists.
            </p>
          </div>
          <Link to="/guides" className="type-label text-plum hover:text-plum-hover whitespace-nowrap">
            See all guides
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {editorialGuides.slice(0, 3).map((guide) => (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="group bg-surface border border-line rounded-lg overflow-hidden flex flex-col hover:border-plum-border hover:shadow-card"
            >
              <div className="aspect-[16/10] bg-surface-muted overflow-hidden">
                <SafeImage
                  src={guide.imageUrl}
                  alt={guide.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                />
              </div>
              <div className="p-5 space-y-2 flex-1 flex flex-col">
                <p className="type-caption text-ink-muted">
                  {guide.categoryLabel}
                  <span aria-hidden="true"> · </span>
                  {guide.readTime}
                </p>
                <h3 className="type-h3 text-ink-primary group-hover:text-plum">{guide.title}</h3>
                <p className="type-body-sm text-ink-secondary line-clamp-2">{guide.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. Closing CTA */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-16">
        <div className="rounded-xl bg-plum-active text-white px-6 py-12 sm:px-12 sm:py-14 text-center space-y-5">
          <h2 className="text-[28px] sm:text-[36px] leading-[1.2] font-bold text-white max-w-[680px] mx-auto">
            Creative talent & event briefs, thoughtfully matched.
          </h2>
          <p className="type-body-lg text-white/85 max-w-[540px] mx-auto">
            Explore illustrative sample profiles, post a structured gig brief, or join Cultgig early
            access as an artist or event host.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-md bg-white text-plum-active hover:bg-plum-soft font-semibold text-[15px]"
            >
              Explore artists
            </Link>
            <Link
              to="/client/gigs/new"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-md border border-white/40 text-white hover:bg-white/10 font-semibold text-[15px]"
            >
              Post a gig
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
