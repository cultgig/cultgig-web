import { ArrowLeft, CheckCircle as CheckCircle2, CaretDown as ChevronDown, ShieldCheck } from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { SafeImage } from "@/components/shared/SafeImage";
import { aboutContent } from "@/content/about";
import { detailedFaqList } from "@/content/faq";
import { pageImages } from "@/content/images";
import { editorialGuides } from "@/data/guides";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";

/** Split intro shared by the marketing pages: text on the left, one photograph on the right. */
function SplitIntro({ title, lede, actions, image }: { title: ReactNode; lede: ReactNode; actions?: ReactNode; image: { src: string; alt: string } }) {
  return (
    <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="space-y-5 lg:col-span-6">
        <h1 className="type-title text-ink-strong">{title}</h1>
        <div className="max-w-xl space-y-4 type-body-lg text-ink-secondary">{lede}</div>
        {actions && <div className="flex flex-wrap gap-3 pt-1">{actions}</div>}
      </div>
      <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface-container lg:col-span-6">
        <SafeImage src={image.src} alt={image.alt} loading="eager" className="size-full object-cover" />
      </div>
    </section>
  );
}

/** Intro for text-led pages (pricing, guides, FAQ, safety). */
function TextIntro({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="type-title text-ink-strong">{title}</h1>
      {children && <div className="type-body-lg text-ink-secondary">{children}</div>}
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 type-body text-ink-secondary">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function HowItWorksPage() {
  usePageMeta(
    "How Cultgig works",
    "Understand how event hosts and artists connect through structured briefs, portfolios, and versioned offers."
  );

  return (
    <main id="main-content" className="page-container space-y-12 py-12 lg:space-y-16 lg:py-16">
      <SplitIntro
        title="From a clear brief to a versioned offer"
        lede={
          <p>
            No forwarded numbers, no lost terms. Hosts compare real work, and artists get the timing, setting and budget
            they need before quoting.
          </p>
        }
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/explore">Explore artists</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/client/gigs/new">Post a gig brief</Link>
            </Button>
          </>
        }
        image={pageImages.howItWorksHero}
      />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[
          {
            title: "For event hosts, venues & brands",
            steps: [
              "Search 15 creative disciplines by city, pricing mode and format, or post one brief.",
              "Compare artist portfolios, inclusions, exclusions and travel notes side by side.",
              "Discuss logistics inside Cultgig and send or review versioned proposals.",
              "Confirm the exact proposal version and deliverables before moving to booking confirmation.",
            ],
          },
          {
            title: "For independent artists & collectives",
            steps: [
              "Build an original craft profile with starting rates, packages or custom quotes.",
              "Browse structured event briefs with date, city, venue setup and budget clarity.",
              "Submit structured proposals spelling out inclusions, travel and cancellation terms.",
              "Keep every revision recorded in an append-only offer log, so nothing rests on a verbal promise.",
            ],
          },
        ].map((col) => (
          <article key={col.title} className="space-y-5 rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <h2 className="type-h2 text-ink-strong">{col.title}</h2>
            <ol className="space-y-4">
              {col.steps.map((step, i) => (
                <li key={step} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 type-body text-ink-secondary">
                  <span className="flex size-7 items-center justify-center rounded-full border border-line-strong type-label-sm text-ink figure" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </article>
        ))}
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
    <main id="main-content" className="page-container space-y-12 py-12 lg:space-y-16 lg:py-16">
      <SplitIntro
        title={<>Your work deserves better than a cold DM asking &ldquo;What&apos;s your rate?&rdquo;</>}
        lede={
          <p>
            Present your live recordings, photography, styling or visual craft alongside clear packages, travel radius and
            fair cancellation expectations.
          </p>
        }
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/sign-up?role=artist">Join as an artist</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/artist/gigs">Browse open gigs</Link>
            </Button>
          </>
        }
        image={pageImages.forArtistsHero}
      />

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          {
            title: "Portfolio-first discovery",
            copy: "Lead with real samples of live performances, bridal mehendi, drapes or murals, not follower counts.",
          },
          {
            title: "Structured briefs upfront",
            copy: "Know the city, timing, indoor or outdoor venue setup and PA availability before quoting.",
          },
          {
            title: "Peer-respectful terms",
            copy: "Every quote, counter-offer, travel expense and cancellation note is logged cleanly.",
          },
        ].map((item) => (
          <div key={item.title} className="space-y-2 border-t border-line-strong pt-5">
            <h2 className="type-h3 text-ink-strong">{item.title}</h2>
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
    <main id="main-content" className="page-container py-12 lg:py-16">
      <SplitIntro
        title="Find creative talent that fits the room"
        lede={
          <p>
            Whether you curate a hospitality evening, coordinate a brand launch or plan a family celebration, Cultgig helps
            you brief once and compare artists side by side.
          </p>
        }
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/client/gigs/new">Post a gig brief</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/explore">Explore artists</Link>
            </Button>
          </>
        }
        image={pageImages.forBusinessesHero}
      />
    </main>
  );
}

export function AboutPage() {
  usePageMeta(
    "About Cultgig",
    "Learn why Cultgig is building a respectful, transparent marketplace for creative work in India."
  );

  return (
    <main id="main-content" className="page-container space-y-12 py-12 lg:space-y-16 lg:py-16">
      <SplitIntro
        title={aboutContent.vision.heading}
        lede={aboutContent.vision.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        image={pageImages.aboutHero}
      />

      <section className="max-w-3xl space-y-3 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="type-h2 text-ink-strong">{aboutContent.team.heading}</h2>
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

  const plans = [
    {
      audience: "Artists & creative collectives",
      title: "Artist account",
      items: [
        "Create a structured craft profile with portfolio work and starting packages",
        "Browse event briefs and submit versioned proposals",
        "Any future platform or payment processing fees will be disclosed before proposal acceptance",
      ],
      action: { label: "Create artist profile", to: "/sign-up?role=artist", primary: true },
    },
    {
      audience: "Clients, venues & event hosts",
      title: "Client / Host account",
      items: [
        "Post structured event briefs and save shortlisted artists",
        "Negotiate scope, timing, travel and deliverables in versioned offers",
        "Online booking checkout activates only after payment-provider approval",
      ],
      action: { label: "Post a gig brief", to: "/client/gigs/new", primary: false },
    },
  ];

  return (
    <main id="main-content" className="page-container space-y-8 py-12 lg:py-16">
      <TextIntro title="Transparent pricing">
        <p>Launch pricing is being finalised. No subscription is being charged through this page at present.</p>
      </TextIntro>

      <NoticeBanner tone="warning" title="Pre-launch pricing notice">
        Cultgig does not display fake crossed-out discounts, preselected paid plans, or hidden fees.
        Final commission and optional subscription terms will be published here with full tax and
        payment-processing disclosures prior to commercial launch.
      </NoticeBanner>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.title} className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <div className="space-y-1">
              <h2 className="type-h2 text-ink-strong">{plan.title}</h2>
              <p className="type-body-sm text-ink-secondary">{plan.audience}</p>
            </div>
            <p className="type-h3 text-ink">
              No charge during preview
              <span className="mt-1 block type-body-sm text-ink-secondary">Commercial terms are being finalised</span>
            </p>
            <CheckList items={plan.items} />
            <div className="mt-auto pt-1">
              <Button asChild size="lg" variant={plan.action.primary ? "default" : "outline"}>
                <Link to={plan.action.to}>{plan.action.label}</Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export function GuidesIndexPage() {
  usePageMeta("Guides", "Practical guides for Indian event hosts and independent artists.");
  return (
    <main id="main-content" className="page-container space-y-10 py-12 lg:py-16">
      <TextIntro title="Planning & booking guides">
        <p>Notes to help event hosts write clearer briefs and help artists present their work well.</p>
      </TextIntro>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {editorialGuides.map((guide) => (
          <Link
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-line-strong"
          >
            <div className="aspect-[16/9] overflow-hidden bg-surface-container">
              <SafeImage
                src={guide.imageUrl}
                alt={guide.imageAlt}
                className="size-full object-cover transition-transform duration-enter group-hover:scale-[1.02]"
              />
            </div>
            <div className="space-y-2 p-6">
              <p className="type-caption text-ink-secondary">
                {guide.categoryLabel}, {guide.readTime}
              </p>
              <h2 className="type-h2 text-ink-strong transition-colors group-hover:text-brand">{guide.title}</h2>
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
    <main id="main-content" className="page-container py-12 lg:py-16">
      <article className="mx-auto max-w-3xl space-y-8">
        <Link to="/guides" className="inline-flex items-center gap-1.5 type-label text-ink-secondary transition-colors hover:text-brand">
          <ArrowLeft size={16} aria-hidden="true" />
          All guides
        </Link>
        <header className="space-y-4">
          <h1 className="type-title text-ink-strong">{guide.title}</h1>
          <p className="type-body-lg text-ink-secondary">{guide.summary}</p>
          <p className="type-caption text-ink-secondary">
            {guide.categoryLabel}, {guide.readTime}
          </p>
        </header>
        <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-surface-container">
          <SafeImage src={guide.imageUrl} alt={guide.imageAlt} loading="eager" className="size-full object-cover" />
        </div>
        <div className="space-y-8">
          {guide.sections.map((sec) => (
            <section key={sec.heading} className="space-y-3">
              <h2 className="type-h2 text-ink-strong">{sec.heading}</h2>
              {sec.body.map((p) => (
                <p key={p} className="type-body-lg text-ink-secondary">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
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
    <main id="main-content" className="page-container py-12 lg:py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <TextIntro title="Straight answers about Cultgig" />

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {detailedFaqList.map((item, idx) => {
            const isOpen = openIndex === idx;
            const panelId = `faq-panel-${idx}`;
            return (
              <article key={item.question} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-low sm:px-6"
                >
                  <span className="space-y-0.5">
                    <span className="block type-caption text-ink-secondary">{item.category}</span>
                    <span className="block type-h4 text-ink-strong">{item.question}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-ink-secondary transition-transform duration-short ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div id={panelId} className="animate-fade-in px-5 pb-5 type-body text-ink-secondary sm:px-6">
                    {item.answer}
                  </div>
                )}
              </article>
            );
          })}
        </div>
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
    <main id="main-content" className="page-container space-y-10 py-12 lg:py-16">
      <TextIntro title="Practical safeguards for artists and hosts">
        <p>
          Cultgig is an intermediary marketplace connecting independent artists and event hosts. We never fabricate trust
          badges or unverified review counts.
        </p>
      </TextIntro>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {[
          {
            title: "Truthful verification labels",
            copy: "Verification badges only describe what is actually checked (for example, email OTP verification). We do not display blanket “100% verified” promises.",
          },
          {
            title: "Original portfolio ownership",
            copy: "Artists must confirm they own or hold permission to publish portfolio media. Suspected stolen or infringing portfolios can be reported for takedown.",
          },
          {
            title: "Privacy-safe gig briefs",
            copy: "Exact home addresses, gate codes and personal phone numbers are kept out of public gig listings.",
          },
          {
            title: "Lawful & safe categories only",
            copy: "Wall art and murals require a property-owner commission. Tattoo offerings are restricted to lawful, licensed, hygienic studio services for eligible adults.",
          },
        ].map((card) => (
          <div key={card.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-6">
            <ShieldCheck size={22} className="mt-0.5 shrink-0 text-ink-secondary" aria-hidden="true" />
            <div className="space-y-1.5">
              <h2 className="type-h3 text-ink-strong">{card.title}</h2>
              <p className="type-body text-ink-secondary">{card.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
