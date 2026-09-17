import { ArrowUpRight, ShieldCheck, Sparkles, MapPin, Calendar, CheckCircle2, Music2 } from "lucide-react";
import { homepageContent } from "../../content/homepage";
import { heroImage, creatorImages } from "../../content/images";
import { Button } from "../ui/Button";

type OpenLead = (role?: "artist" | "business") => void;

export function HomeHero({ openLead }: { openLead: OpenLead }) {
  const { hero } = homepageContent;

  return (
    <section className="home-hero-section" aria-label="Cultgig introduction">
      <div className="home-hero-inner">
        {/* Left Column: Story & Actions */}
        <div className="home-hero-content">
          <div className="section-badge">
            <Sparkles size={13} className="text-brand" aria-hidden="true" />
            <span>{hero.badge}</span>
          </div>

          <h1 className="home-hero-title">{hero.heading}</h1>

          <p className="home-hero-lead">{hero.lead}</p>

          <div className="home-hero-actions">
            <Button
              variant="primary"
              onClick={() => openLead("artist")}
              aria-label="Join Cultgig as an artist"
            >
              {hero.primaryCta}
            </Button>
            <Button
              variant="outline"
              onClick={() => openLead("business")}
              aria-label="Explore Cultgig for businesses"
            >
              {hero.secondaryCta}
            </Button>
          </div>

          <p className="home-hero-clarity">
            <ShieldCheck size={14} className="text-brand inline-block mr-1.5" aria-hidden="true" />
            {hero.clarityNote}
          </p>
        </div>

        {/* Right Column: Editorial Visual Composition (Person + Work + Opportunity) */}
        <div className="home-hero-visual-wrapper">
          <div className="home-hero-main-card">
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="home-hero-main-image"
              loading="eager"
            />
            <div className="home-hero-image-overlay" />
            
            {/* Top floating badge: The Person */}
            <div className="hero-floating-artist">
              <img
                src={creatorImages.rhea.src}
                alt={creatorImages.rhea.alt}
                className="hero-floating-avatar"
                loading="eager"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="hero-floating-name">{hero.artistPreview.name}</span>
                  <CheckCircle2 size={12} className="text-brand shrink-0" aria-label="Verified artist" />
                </div>
                <span className="hero-floating-role">{hero.artistPreview.role}</span>
              </div>
            </div>

            {/* Middle floating badge: Audio / Craft sample */}
            <div className="hero-floating-sample hidden sm:flex items-center gap-2 bg-neutral-surface/95 backdrop-blur-sm border border-neutral-border px-3 py-1.5 rounded-full shadow-sm">
              <div className="w-5 h-5 rounded-full bg-brand-soft flex items-center justify-center text-brand">
                <Music2 size={11} />
              </div>
              <span className="text-xs text-neutral-textPrimary font-medium">Live sunset session (2:45 min)</span>
              <span className="text-[10px] text-brand font-semibold px-1.5 py-0.5 bg-brand-tint/60 rounded">Soul & Indie</span>
            </div>

            {/* Bottom floating card: The Opportunity / Brief */}
            <div className="hero-brief-card">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="card-badge">{hero.briefPreview.tag}</span>
                <span className="text-[11px] text-brand font-medium">Verified brief</span>
              </div>
              <h4 className="hero-brief-title">{hero.briefPreview.title}</h4>
              <div className="hero-brief-meta">
                <span>
                  <MapPin size={12} className="inline mr-1 text-brand" />
                  {hero.briefPreview.location}
                </span>
                <span>
                  <Calendar size={12} className="inline mr-1 text-brand" />
                  {hero.briefPreview.format}
                </span>
              </div>
              <button
                type="button"
                className="hero-brief-link"
                onClick={() => openLead("artist")}
              >
                <span>Preview brief structure</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
