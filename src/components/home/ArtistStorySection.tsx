import { Check, Sparkles } from "lucide-react";
import { homepageContent } from "../../content/homepage";
import { creatorImages } from "../../content/images";
import { Button } from "../ui/Button";

type OpenLead = (role?: "artist" | "business") => void;

export function ArtistStorySection({ openLead }: { openLead: OpenLead }) {
  const { artistStory } = homepageContent;

  return (
    <section className="section-container bg-neutral-surface" aria-labelledby="artist-story-heading">
      <div className="story-split-layout">
        {/* Left Visual: Authentic creator photography */}
        <div className="story-visual-column">
          <div className="story-image-frame">
            <img
              src={creatorImages.meera.src}
              alt={creatorImages.meera.alt}
              className="story-featured-image"
              loading="lazy"
            />
            <div className="story-image-badge">
              <span className="font-semibold text-neutral-textPrimary text-xs block">Meera Shah</span>
              <span className="text-neutral-textSecondary text-[11.5px] block">Event & cultural photographer · Mumbai</span>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="story-content-column">
          <div className="section-badge">
            <Sparkles size={13} className="text-brand" aria-hidden="true" />
            <span>{artistStory.badge}</span>
          </div>

          <h2 id="artist-story-heading" className="section-title text-left">
            {artistStory.heading}
          </h2>

          <p className="section-lead text-left mb-6">
            {artistStory.lead}
          </p>

          <ul className="story-points-list" role="list">
            {artistStory.points.map((point: string) => (
              <li key={point} className="story-point-item">
                <span className="story-point-icon">
                  <Check size={14} className="text-brand" />
                </span>
                <span className="story-point-text">{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button
              variant="primary"
              onClick={() => openLead("artist")}
              aria-label="Join Cultgig as an artist"
            >
              {artistStory.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
