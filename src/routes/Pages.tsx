import { ArrowUpRight, ChevronDown, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "../app/App";
import { Button } from "../components/ui/Button";
import { aboutContent } from "../content/about";
import { creatorImages, pageImages } from "../content/images";
import { detailedFaqList } from "../content/faq";
import { usePageMeta } from "../hooks/usePageMeta";
import { OpportunityPreviewCard } from "../components/marketplace/OpportunityPreviewCard";
import { MarketplaceFlow } from "../components/marketplace/MarketplaceFlow";
import { ConversationPreview } from "../components/marketplace/ConversationPreview";

// Homepage Sections
import { HomeHero } from "../components/home/HomeHero";
import { HumanTensionSection } from "../components/home/HumanTensionSection";
import { TheCultgigIdeaSection } from "../components/home/TheCultgigIdeaSection";
import { MarketplacePreviewSection } from "../components/home/MarketplacePreviewSection";
import { CategoryShowcaseSection } from "../components/home/CategoryShowcaseSection";
import { WhoItsForSection } from "../components/home/WhoItsForSection";
import { ArtistStorySection } from "../components/home/ArtistStorySection";
import { BusinessStorySection } from "../components/home/BusinessStorySection";
import { IndianCreativeMomentsSection } from "../components/home/IndianCreativeMomentsSection";
import { HowItWorksDualSection } from "../components/home/HowItWorksDualSection";
import { TrustSectionHome } from "../components/home/TrustSectionHome";
import { BookingScenarioSection } from "../components/home/BookingScenarioSection";
import { FinalCTASection } from "../components/home/FinalCTASection";

type LeadRole = "artist" | "business";
type OpenLead = (role?: LeadRole) => void;

function Page({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  usePageMeta(title, description);
  return <main className="marketing-page">{children}</main>;
}

function PageHero({
  eyebrow,
  title,
  copy,
  image,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  image?: { src: string; alt: string };
}) {
  return (
    <section className="page-hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{copy}</p>
      </div>
      {image && <img src={image.src} alt={image.alt} />}
    </section>
  );
}

function ClosingCTA({ openLead }: { openLead: OpenLead }) {
  return (
    <section className="closing-cta">
      <div>
        <p className="eyebrow">Make the introduction count</p>
        <h2>Bring your next creative idea into focus.</h2>
        <p>
          Join the early cohort — whether you want to be found for your work or find the right person for it.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Button onClick={() => openLead("artist")}>Join as an artist</Button>
          <Button variant="outline-light" onClick={() => openLead("business")}>
            Get early access
          </Button>
        </div>
      </div>
    </section>
  );
}

function HowSection({ openLead }: { openLead: OpenLead }) {
  const tracks = [
    {
      title: "For artists",
      steps: [
        "Shape a portfolio with work and context",
        "Be discoverable to businesses with a real brief",
        "Share why your craft fits the moment",
        "Take the conversation forward with clarity",
      ],
    },
    {
      title: "For businesses",
      steps: [
        "Describe the event, timing and feel",
        "Browse the category that fits",
        "Compare work, not just a forwarded number",
        "Start a focused conversation",
      ],
    },
  ];

  return (
    <section className="how-section">
      <div className="section-heading">
        <p className="eyebrow">A practical way to connect</p>
        <h2>Less chasing. More context from the start.</h2>
        <p>
          Designed for the real work behind a creative booking: a good brief, relevant work, and a clear next step.
        </p>
      </div>
      <div className="tracks">
        {tracks.map((track) => (
          <article className="track" key={track.title}>
            <h3>{track.title}</h3>
            {track.steps.map((step, index) => (
              <div className="step" key={step}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span>{step}</span>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => openLead(track.title === "For artists" ? "artist" : "business")}
            >
              {track.title === "For artists" ? "Join as an artist" : "Get early access"}
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HomePage({ openLead }: { openLead: OpenLead }) {
  return (
    <Page
      title="Where artists & gigs get discovered"
      description="Cultgig connects independent musicians, photographers, decorators, and performers with venues, brands, and celebrations looking for them across India."
    >
      <HomeHero openLead={openLead} />
      <HumanTensionSection />
      <TheCultgigIdeaSection />
      <MarketplacePreviewSection />
      <CategoryShowcaseSection />
      <WhoItsForSection openLead={openLead} />
      <IndianCreativeMomentsSection />
      <BookingScenarioSection />
      <TrustSectionHome />
      <FinalCTASection openLead={openLead} />
    </Page>
  );
}

export function HowItWorksPage({ openLead }: { openLead: OpenLead }) {
  return (
    <Page title="How Cultgig works">
      <PageHero
        eyebrow="How it works"
        title="A clearer path from a creative brief to a real conversation."
        copy="Browse a relevant category, see the work behind a profile, then decide whether to take the conversation further."
        image={pageImages.howItWorksHero}
      />
      <section className="preview-section">
        <div className="section-heading">
          <p className="eyebrow">The marketplace flow</p>
          <h2>From a useful brief to a better first conversation.</h2>
          <p>These previews show the shape of the experience Cultgig is building.</p>
        </div>
        <MarketplaceFlow />
        <OpportunityPreviewCard
          title="Launch gathering with live set"
          category="Musicians & DJs"
          description="A brand team needs a performer who can set the tone for an intimate launch evening."
        />
      </section>
      <HowSection openLead={openLead} />
      <ClosingCTA openLead={openLead} />
    </Page>
  );
}

export function AudiencePage({ kind, openLead }: { kind: LeadRole; openLead: OpenLead }) {
  const artist = kind === "artist";
  const items = artist
    ? [
        "Build your profile",
        "Get found for relevant work",
        "Review a clear opportunity",
        "Share why you fit",
        "Build a reputation through finished work",
      ]
    : [
        "Describe the brief",
        "Browse relevant talent",
        "Explore the portfolio",
        "Compare the fit",
        "Start the right conversation",
      ];
  const copy = artist
    ? [
        "Make room for your work, style, location and the story behind it.",
        "Be visible to businesses who are actively looking in your category.",
        "Know the format, feeling and context before you reply.",
        "Move beyond a rate card with the work that makes you the right choice.",
        "Future reviews will reflect completed bookings, not vague endorsements.",
      ]
    : [
        "Capture what the moment needs before you start looking.",
        "Start in the creative category that fits your event or idea.",
        "Understand style and relevant work before sending a message.",
        "Choose based on a real creative match rather than a forwarded contact.",
        "Carry your brief into a focused conversation.",
      ];

  return (
    <Page title={artist ? "For artists" : "For businesses"}>
      <PageHero
        eyebrow={artist ? "For artists" : "For businesses"}
        title={
          artist
            ? "Your work has more to say than a social bio can hold."
            : "Finding the right creative person should not take three phone calls."
        }
        copy={
          artist
            ? "Cultgig is being built to give independent artists a clearer way to show what they do and be approached with relevant work."
            : "Bring your brief, then browse work with enough context to decide who feels right for the job."
        }
        image={artist ? pageImages.forArtistsHero : pageImages.forBusinessesHero}
      />
      <section className="feature-list">
        <p className="eyebrow">{artist ? "The artist journey" : "The business journey"}</p>
        {items.map((item, index) => (
          <article key={item}>
            <b>0{index + 1}</b>
            <div>
              <h2>{item}</h2>
              <p>{copy[index]}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="preview-section preview-section-compact">
        <div className="section-heading">
          <p className="eyebrow">{artist ? "The artist's next step" : "The business's next step"}</p>
          <h2>
            {artist
              ? "A proposal can carry the reason behind the work."
              : "A conversation can start with more than a forwarded contact."}
          </h2>
        </div>
        <ConversationPreview kind={kind} />
      </section>
      <ClosingCTA openLead={openLead} />
    </Page>
  );
}

export function AboutPage({ openLead }: { openLead: OpenLead }) {
  return (
    <Page title="Why Cultgig exists">
      <PageHero
        eyebrow="About Cultgig"
        title="Creative work is personal. Finding it should be more thoughtful."
        copy="Artists build careers one project at a time. Businesses build experiences one idea at a time. Cultgig is being built for the introduction between them."
        image={pageImages.aboutHero}
      />
      <section className="split-story">
        <img src={pageImages.aboutStory.src} alt={pageImages.aboutStory.alt} />
        <div>
          <p className="eyebrow">{aboutContent.vision.eyebrow}</p>
          <h2>{aboutContent.vision.heading}</h2>
          {aboutContent.vision.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section className="story-intro compact">
        <p className="eyebrow">{aboutContent.team.eyebrow}</p>
        <h2>{aboutContent.team.heading}</h2>
        <p>{aboutContent.team.empty}</p>
      </section>
      <ClosingCTA openLead={openLead} />
    </Page>
  );
}

export function FAQPage() {
  const [active, setActive] = useState<number | null>(null);
  const groups = ["General", "For Artists", "For Businesses"] as const;

  return (
    <Page title="Frequently asked questions">
      <PageHero
        eyebrow="FAQ"
        title="Good questions deserve clear answers."
        copy="A straightforward guide to what Cultgig is building and what is still to come."
      />
      <section className="faq-layout">
        <div className="faq-intro">
          <p className="eyebrow">Start here</p>
          <h2>Clear answers before the first conversation.</h2>
          <p>Explore the basics of Cultgig, how each side will use it, and what is still in development.</p>
        </div>
        <div className="faq-groups">
          {groups.map((group) => (
            <div className="faq-group" key={group}>
              <p className="faq-group-title">{group}</p>
              {detailedFaqList.map(
                (item, index) =>
                  item.category === group && (
                    <article key={item.question}>
                      <button
                        aria-expanded={active === index}
                        onClick={() => setActive(active === index ? null : index)}
                      >
                        <span>{item.question}</span>
                        <ChevronDown className={active === index ? "rotated" : ""} />
                      </button>
                      {active === index && <p>{item.answer}</p>}
                    </article>
                  )
              )}
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}

export function ContactPage({ openLead }: { openLead: OpenLead }) {
  return (
    <Page title="Contact Cultgig">
      <PageHero
        eyebrow="Contact"
        title="Start a conversation with Cultgig."
        copy="For general questions, partnerships, artist interest or business interest, get in touch or join the early cohort."
      />
      <section className="contact-story">
        <div className="contact-story-image">
          <img src={creatorImages.meera.src} alt={creatorImages.meera.alt} />
        </div>
        <div className="contact-story-copy">
          <Mail size={22} />
          <p className="eyebrow">Make an introduction</p>
          <h2>Bring a question, an idea, or the work you are making.</h2>
          <p>
            We would love to hear from artists, businesses and people building creative work in their communities.
          </p>
          {import.meta.env.VITE_SUPPORT_EMAIL && (
            <a className="text-link" href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`}>
              {import.meta.env.VITE_SUPPORT_EMAIL} <ArrowUpRight size={16} />
            </a>
          )}
          <div className="contact-actions">
            <Button onClick={() => openLead("artist")}>Join as an artist</Button>
            <Button variant="outline" onClick={() => openLead("business")}>
              Get early access
            </Button>
          </div>
        </div>
      </section>
    </Page>
  );
}

export function LegalPage({ kind }: { kind: "Privacy Policy" | "Terms" }) {
  return (
    <Page title={kind}>
      <section className="legal-page">
        <p className="eyebrow">Cultgig</p>
        <h1>{kind}</h1>
        <p>
          This pre-launch page describes the information shared through early-access forms. Legal review is required before product launch.
        </p>
        <h2>Information we collect</h2>
        <p>
          We collect information you choose to share, such as your name, contact details, city and interest in Cultgig.
        </p>
      </section>
    </Page>
  );
}

export function NotFoundPage({ openLead }: { openLead: OpenLead }) {
  return (
    <Page title="Page not found">
      <section className="not-found">
        <Sparkles />
        <h1>This page is not here yet.</h1>
        <p>Return home to explore Cultgig.</p>
        <Button onClick={() => openLead()}>Get early access</Button>
      </section>
    </Page>
  );
}

