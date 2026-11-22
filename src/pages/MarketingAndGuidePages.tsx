import { ArrowLeft, CheckCircle2, ChevronDown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { NoticeBanner } from "../components/ui/NoticeBanner";
import { SafeImage } from "../components/ui/SafeImage";
import { aboutContent } from "../content/about";
import { detailedFaqList } from "../content/faq";
import { pageImages } from "../content/images";
import { editorialGuides } from "../data/guides";
import { usePageMeta } from "../hooks/usePageMeta";
import { Link } from "../lib/router";

export function HowItWorksPage() {
  usePageMeta(
    "How Cultgig works",
    "Understand how event hosts and artists connect through structured briefs, portfolios, and versioned offers."
  );

  return (
    <main id="main-content" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <p className="type-label text-plum">How Cultgig works</p>
          <h1 className="text-[30px] sm:text-[38px] leading-[1.15] font-bold text-ink-primary">
            From a clear brief to a versioned offer—without forwarded-number chaos.
          </h1>
          <p className="type-body-lg text-ink-secondary">
            Cultgig structures the creative booking workflow so hosts compare real work and artists
            receive the timing, setting, and budget context they need before quoting.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/explore"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-plum text-white hover:bg-plum-hover type-button"
            >
              Explore sample artists
            </Link>
            <Link
              to="/client/gigs/new"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md border border-line-strong text-ink-primary hover:border-plum type-button"
            >
              Post a gig brief
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6 aspect-[16/10] rounded-xl overflow-hidden bg-surface-muted border border-line">
          <SafeImage
            src={pageImages.howItWorksHero.src}
            alt={pageImages.howItWorksHero.alt}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="bg-surface border border-line rounded-xl p-6 sm:p-8 space-y-4">
          <h2 className="type-h2 text-ink-primary">For event hosts, venues & brands</h2>
          <ol className="space-y-3 type-body text-ink-secondary list-decimal list-inside">
            <li>Search 15 creative disciplines by city, pricing mode, and format, or post one brief.</li>
            <li>Compare artist portfolios, inclusions, exclusions, and travel notes side-by-side.</li>
            <li>Discuss logistics inside Cultgig and send or review versioned proposals.</li>
            <li>Confirm the exact proposal version and deliverables before moving to booking confirmation.</li>
          </ol>
        </article>

        <article className="bg-surface border border-line rounded-xl p-6 sm:p-8 space-y-4">
          <h2 className="type-h2 text-ink-primary">For independent artists & collectives</h2>
          <ol className="space-y-3 type-body text-ink-secondary list-decimal list-inside">
            <li>Build an original craft profile with starting rates, packages, or custom quotes.</li>
            <li>Browse structured event briefs with date, city, venue setup, and budget clarity.</li>
            <li>Submit structured proposals spelling out inclusions, travel, and cancellation terms.</li>
            <li>Keep every revision recorded in an append-only offer log—no verbal ambiguity.</li>
          </ol>
        </article>
      </section>
    </main>
  );
}

export function ForArtistsPage() {
  usePageMeta(
    "For artists",
    "Showcase your craft, receive clear event briefs, and negotiate terms directly on Cultgig."
  );

  return (
    <main id="main-content" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <p className="type-label text-plum">For artists & creative professionals</p>
          <h1 className="text-[30px] sm:text-[38px] leading-[1.15] font-bold text-ink-primary">
            Your work deserves better than a cold DM asking &ldquo;What&apos;s your rate?&rdquo;
          </h1>
          <p className="type-body-lg text-ink-secondary">
            Present your live recordings, photography, styling, or visual craft alongside clear
            packages, travel radius, and fair cancellation expectations.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/sign-up?role=artist"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-plum text-white hover:bg-plum-hover type-button"
            >
              Join as an artist
            </Link>
            <Link
              to="/artist/opportunities"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md border border-line-strong text-ink-primary hover:border-plum type-button"
            >
              Browse sample briefs
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6 aspect-[16/10] rounded-xl overflow-hidden bg-surface-muted border border-line">
          <SafeImage
            src={pageImages.forArtistsHero.src}
            alt={pageImages.forArtistsHero.alt}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            title: "Portfolio-first discovery",
            copy: "Lead with real samples of live performances, bridal mehendi, drapes, or murals—not follower counts.",
          },
          {
            title: "Structured briefs upfront",
            copy: "Know the city, timing, indoor/outdoor venue setup, and PA availability before quoting.",
          },
          {
            title: "Peer-respectful terms",
            copy: "Every quote, counter-offer, travel expense, and cancellation note is logged cleanly.",
          },
        ].map((item) => (
          <div key={item.title} className="bg-surface border border-line rounded-lg p-6 space-y-2">
            <h2 className="type-h3 text-ink-primary">{item.title}</h2>
            <p className="type-body text-ink-secondary">{item.copy}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

export function ForBusinessesPage() {
  usePageMeta(
    "For businesses & event hosts",
    "Discover independent artists, compare portfolios, post structured briefs, and manage bookings clearly."
  );

  return (
    <main id="main-content" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <p className="type-label text-plum">For venues, brands & celebration hosts</p>
          <h1 className="text-[30px] sm:text-[38px] leading-[1.15] font-bold text-ink-primary">
            Find creative talent that fits the room—with zero guesswork.
          </h1>
          <p className="type-body-lg text-ink-secondary">
            Whether you curate a hospitality evening, coordinate a brand launch, or plan a family
            celebration, Cultgig helps you brief once and compare artists side by side.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/client/gigs/new"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-plum text-white hover:bg-plum-hover type-button"
            >
              Post a gig brief
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md border border-line-strong text-ink-primary hover:border-plum type-button"
            >
              Explore artists
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6 aspect-[16/10] rounded-xl overflow-hidden bg-surface-muted border border-line">
          <SafeImage
            src={pageImages.forBusinessesHero.src}
            alt={pageImages.forBusinessesHero.alt}
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </main>
  );
}

export function AboutPage() {
  usePageMeta(
    "About Cultgig",
    "Learn why Cultgig is building a respectful, transparent marketplace for creative work in India."
  );

  return (
    <main id="main-content" className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <p className="type-label text-plum">{aboutContent.vision.eyebrow}</p>
          <h1 className="text-[30px] sm:text-[36px] leading-[1.2] font-bold text-ink-primary">
            {aboutContent.vision.heading}
          </h1>
          {aboutContent.vision.paragraphs.map((p) => (
            <p key={p} className="type-body-lg text-ink-secondary">
              {p}
            </p>
          ))}
        </div>
        <div className="lg:col-span-6 aspect-[16/10] rounded-xl overflow-hidden bg-surface-muted border border-line">
          <SafeImage
            src={pageImages.aboutHero.src}
            alt={pageImages.aboutHero.alt}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="bg-surface border border-line rounded-xl p-6 sm:p-8 space-y-3">
        <p className="type-label text-plum">{aboutContent.team.eyebrow}</p>
        <h2 className="type-h2 text-ink-primary">{aboutContent.team.heading}</h2>
        <p className="type-body text-ink-secondary">{aboutContent.team.empty}</p>
      </section>
    </main>
  );
}

export function PricingPage() {
  usePageMeta(
    "Pricing",
    "View Cultgig launch pricing status. No subscription or platform fee is charged through this preview."
  );

  return (
    <main id="main-content" className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      <div className="max-w-[700px] space-y-3">
        <p className="type-label text-plum">Pricing & platform structure</p>
        <h1 className="text-[30px] sm:text-[36px] leading-[1.2] font-bold text-ink-primary">
          Transparent pricing architecture
        </h1>
        <p className="type-body-lg text-ink-secondary">
          Launch pricing is being finalised. No subscription is being charged through this page at present.
        </p>
      </div>

      <NoticeBanner tone="warning" title="Pre-launch pricing notice">
        Cultgig does not display fake crossed-out discounts, preselected paid plans, or hidden fees.
        Final commission and optional subscription terms will be published here with full tax and
        payment-processing disclosures prior to commercial launch.
      </NoticeBanner>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="bg-surface border border-line rounded-xl p-6 space-y-4">
          <div>
            <p className="type-caption text-plum font-semibold">Artists & creative collectives</p>
            <h2 className="type-h2 text-ink-primary mt-1">Artist account</h2>
            <p className="type-h3 text-ink-secondary mt-2">
              Commercial terms under finalisation (No charge in preview)
            </p>
          </div>
          <ul className="space-y-2 type-body-sm text-ink-secondary">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-plum shrink-0 mt-0.5" aria-hidden="true" />
              <span>Create a structured craft profile with portfolio work and starting packages</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-plum shrink-0 mt-0.5" aria-hidden="true" />
              <span>Browse event briefs and submit versioned proposals</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-plum shrink-0 mt-0.5" aria-hidden="true" />
              <span>Any future platform or payment processing fees will be disclosed before proposal acceptance</span>
            </li>
          </ul>
          <Link
            to="/sign-up?role=artist"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-plum text-white hover:bg-plum-hover type-button"
          >
            Create artist profile
          </Link>
        </article>

        <article className="bg-surface border border-line rounded-xl p-6 space-y-4">
          <div>
            <p className="type-caption text-plum font-semibold">Clients, venues & event hosts</p>
            <h2 className="type-h2 text-ink-primary mt-1">Client / Host account</h2>
            <p className="type-h3 text-ink-secondary mt-2">
              Commercial terms under finalisation (No charge in preview)
            </p>
          </div>
          <ul className="space-y-2 type-body-sm text-ink-secondary">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-plum shrink-0 mt-0.5" aria-hidden="true" />
              <span>Post structured event briefs and save shortlisted artists</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-plum shrink-0 mt-0.5" aria-hidden="true" />
              <span>Negotiate scope, timing, travel, and deliverables in versioned offers</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-plum shrink-0 mt-0.5" aria-hidden="true" />
              <span>Online booking checkout activates only after payment-provider approval</span>
            </li>
          </ul>
          <Link
            to="/client/gigs/new"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md border border-line-strong text-ink-primary hover:border-plum type-button"
          >
            Post a gig brief
          </Link>
        </article>
      </div>
    </main>
  );
}

export function GuidesIndexPage() {
  usePageMeta("Guides", "Practical guides for Indian event hosts and independent artists.");
  return (
    <main id="main-content" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      <div className="max-w-[680px] space-y-2">
        <p className="type-label text-plum">Editorial guides</p>
        <h1 className="text-[30px] sm:text-[36px] leading-[1.2] font-bold text-ink-primary">
          Planning & booking guides
        </h1>
        <p className="type-body-lg text-ink-secondary">
          Curated notes to help event hosts write clearer briefs and help artists present their work cleanly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {editorialGuides.map((guide) => (
          <Link
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            className="group bg-surface border border-line rounded-xl overflow-hidden flex flex-col hover:border-plum-border hover:shadow-card"
          >
            <div className="aspect-[16/9] bg-surface-muted overflow-hidden">
              <SafeImage
                src={guide.imageUrl}
                alt={guide.imageAlt}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
              />
            </div>
            <div className="p-6 space-y-2">
              <p className="type-caption text-ink-secondary">
                {guide.categoryLabel} · {guide.readTime}
              </p>
              <h2 className="type-h2 text-ink-primary group-hover:text-plum">{guide.title}</h2>
              <p className="type-body text-ink-secondary">{guide.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export function GuideDetailPage({ slug }: { slug: string }) {
  const guide = editorialGuides.find((g) => g.slug === slug);
  usePageMeta(guide?.title || "Guide not found", guide?.summary);

  if (!guide) return <GuidesIndexPage />;

  return (
    <main id="main-content" className="max-w-[820px] mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-8">
      <Link to="/guides" className="inline-flex items-center gap-1.5 type-label text-ink-secondary hover:text-plum">
        <ArrowLeft size={15} aria-hidden="true" />
        All guides
      </Link>
      <div className="space-y-3">
        <p className="type-caption text-plum font-semibold">
          {guide.categoryLabel} · {guide.readTime}
        </p>
        <h1 className="text-[28px] sm:text-[36px] leading-[1.2] font-bold text-ink-primary">
          {guide.title}
        </h1>
        <p className="type-body-lg text-ink-secondary">{guide.summary}</p>
      </div>
      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surface-muted border border-line">
        <SafeImage src={guide.imageUrl} alt={guide.imageAlt} className="w-full h-full object-cover" />
      </div>
      <div className="space-y-6">
        {guide.sections.map((sec) => (
          <section key={sec.heading} className="space-y-2.5">
            <h2 className="type-h2 text-ink-primary">{sec.heading}</h2>
            {sec.body.map((p) => (
              <p key={p} className="type-body-lg text-ink-secondary">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}

export function FaqPage() {
  usePageMeta(
    "Frequently asked questions",
    "Straight answers about Cultgig profiles, briefs, proposals, payments, and launch readiness.",
    "faq"
  );
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main id="main-content" className="max-w-[880px] mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-8">
      <div className="space-y-2">
        <p className="type-label text-plum">Frequently asked questions</p>
        <h1 className="text-[30px] sm:text-[36px] leading-[1.2] font-bold text-ink-primary">
          Straight answers about Cultgig
        </h1>
      </div>

      <div className="space-y-3">
        {detailedFaqList.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <article key={item.question} className="bg-surface border border-line rounded-lg overflow-hidden">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-plum-soft/40"
              >
                <div>
                  <span className="block type-caption text-plum font-semibold">{item.category}</span>
                  <span className="type-h4 text-ink-primary">{item.question}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-ink-secondary shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-1 type-body text-ink-secondary border-t border-line-light">
                  {item.answer}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}

export function TrustAndSafetyPage() {
  usePageMeta(
    "Trust & safety",
    "Learn how Cultgig approaches identity verification, portfolio ownership, fair cancellations, and safety."
  );

  return (
    <main id="main-content" className="max-w-[960px] mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-8">
      <div className="space-y-3">
        <p className="type-label text-plum">Trust & safety</p>
        <h1 className="text-[30px] sm:text-[36px] leading-[1.2] font-bold text-ink-primary">
          Practical safeguards for artists and hosts
        </h1>
        <p className="type-body-lg text-ink-secondary">
          Cultgig is an intermediary marketplace connecting independent artists and event hosts. We
          never fabricate trust badges or unverified review counts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          {
            title: "Truthful verification labels",
            copy: "Verification badges only describe what is actually checked (for example, email OTP verification). We do not display blanket '100% verified' promises.",
          },
          {
            title: "Original portfolio ownership",
            copy: "Artists must confirm they own or hold permission to publish portfolio media. Suspected stolen or infringing portfolios can be reported for takedown.",
          },
          {
            title: "Privacy-safe gig briefs",
            copy: "Exact home addresses, gate codes, and personal phone numbers are kept out of public gig listings.",
          },
          {
            title: "Lawful & safe categories only",
            copy: "Wall art/murals require property-owner commission. Tattoo offerings are restricted to lawful, licensed, hygienic studio services for eligible adults.",
          },
        ].map((card) => (
          <div key={card.title} className="bg-surface border border-line rounded-lg p-6 space-y-2">
            <ShieldCheck size={20} className="text-plum" aria-hidden="true" />
            <h2 className="type-h3 text-ink-primary">{card.title}</h2>
            <p className="type-body text-ink-secondary">{card.copy}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
