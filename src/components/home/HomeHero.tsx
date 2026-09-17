import { ArrowUpRight, ShieldCheck, Sparkles, MapPin, Calendar } from "lucide-react";
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

        {/* Right Column: Real Indian Creative World Visual Composition */}
        <div className="home-hero-visual-wrapper">
          <div className="home-hero-main-card">
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="home-hero-main-image"
              loading="eager"
            />
            <div className="home-hero-image-overlay" />
            
            {/* Supporting artist badge */}
            <div className="hero-floating-artist">
              <img
                src={creatorImages.rhea.src}
                alt={creatorImages.rhea.alt}
                className="hero-floating-avatar"
                loading="eager"
              />
              <div>
                <span className="hero-floating-name">Rhea Kapoor</span>
                <span className="hero-floating-role">Acoustic vocalist · Mumbai</span>
              </div>
            </div>

            {/* Illustrative brief preview fragment */}
            <div className="hero-brief-card">
              <span className="card-badge">{hero.briefPreview.tag}</span>
              <h4 className="hero-brief-title">{hero.briefPreview.title}</h4>
              <div className="hero-brief-meta">
                <span>
                  <MapPin size={12} className="inline mr-1" />
                  {hero.briefPreview.location}
                </span>
                <span>
                  <Calendar size={12} className="inline mr-1" />
                  {hero.briefPreview.format}
                </span>
              </div>
              <button
                type="button"
                className="hero-brief-link"
                onClick={() => openLead("artist")}
              >
                <span>View brief format</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
