import { useState } from "react";
import { CheckCircle2, Sparkles, UserRound, Building2 } from "lucide-react";
import { homepageContent } from "../../content/homepage";
import { creatorImages } from "../../content/images";
import { Button } from "../ui/Button";

type OpenLead = (role?: "artist" | "business") => void;

export function WhoItsForSection({ openLead }: { openLead: OpenLead }) {
  const [activeTab, setActiveTab] = useState<"artist" | "business">("artist");
  const { whoItsFor } = homepageContent;
  const current = activeTab === "artist" ? whoItsFor.artist : whoItsFor.business;

  return (
    <section className="section-container bg-neutral-canvas border-y border-neutral-borderLight" aria-labelledby="who-heading">
      <div className="section-header-centered">
        <span className="section-badge">
          <Sparkles size={13} className="text-brand mr-1 inline" aria-hidden="true" />
          {whoItsFor.badge}
        </span>
        <h2 id="who-heading" className="section-title">{whoItsFor.heading}</h2>
        <p className="section-lead">{whoItsFor.lead}</p>

        {/* Audience Toggle Switcher */}
        <div className="who-tab-switcher" role="tablist" aria-label="Select audience perspective">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "artist"}
            className={`who-tab-btn ${activeTab === "artist" ? "active" : ""}`}
            onClick={() => setActiveTab("artist")}
          >
            <UserRound size={15} />
            <span>For independent artists</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "business"}
            className={`who-tab-btn ${activeTab === "business" ? "active" : ""}`}
            onClick={() => setActiveTab("business")}
          >
            <Building2 size={15} />
            <span>For venues, brands & hosts</span>
          </button>
        </div>
      </div>

      <div className="who-showcase-grid">
        {/* Left Column: Authentic Human Portrait & Story */}
        <div className="who-person-card">
          <div className="who-person-media">
            <img
              src={activeTab === "artist" ? creatorImages.meera.src : creatorImages.arjun.src}
              alt={activeTab === "artist" ? creatorImages.meera.alt : creatorImages.arjun.alt}
              className="who-person-image"
              loading="lazy"
            />
            <div className="who-person-overlay" />
            <div className="who-person-caption">
              <span className="who-person-badge">
                {activeTab === "artist" ? "Featured creator profile" : "Hospitality curator"}
              </span>
              <h4 className="who-person-name">{current.personName}</h4>
              <p className="who-person-role">{current.personRole}</p>
            </div>
          </div>
          <div className="who-person-quote-box">
            <p className="who-person-quote">
              {activeTab === "artist"
                ? "“I want hosts to reach out because my photographic style matches their event, not because someone forwarded my number with no context.”"
                : "“When you are hosting 80 guests on a Saturday terrace evening, you cannot afford to guess if the artist will understand the room's mood.”"}
            </p>
          </div>
        </div>

        {/* Right Column: Concrete Value & Human Dignity */}
        <div className="who-content-column">
          <span className="card-badge">{current.badge}</span>
          <h3 className="who-heading-large">{current.heading}</h3>
          <p className="who-lead-copy">{current.lead}</p>

          <div className="who-points-list">
            {current.points.map((point) => (
              <div key={point} className="who-point-item">
                <CheckCircle2 size={17} className="text-brand shrink-0 mt-0.5" />
                <span className="who-point-text">{point}</span>
              </div>
            ))}
          </div>

          <div className="who-action-row">
            <Button
              variant={activeTab === "artist" ? "primary" : "outline"}
              onClick={() => openLead(activeTab)}
              aria-label={current.cta}
            >
              {current.cta}
            </Button>
            <span className="text-xs text-neutral-textMuted">
              {activeTab === "artist"
                ? "Takes 2 minutes · No subscription or listing fee"
                : "Describe your brief once · Direct introductions"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
