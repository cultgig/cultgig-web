import { Check, Sparkles } from "lucide-react";
import { homepageContent } from "../../content/homepage";
import { pageImages } from "../../content/images";
import { Button } from "../ui/Button";

type OpenLead = (role?: "artist" | "business") => void;

export function BusinessStorySection({ openLead }: { openLead: OpenLead }) {
  const { businessStory } = homepageContent;

  return (
    <section className="section-container bg-neutral-canvas" aria-labelledby="business-story-heading">
      <div className="story-split-layout story-split-reverse">
        {/* Left/Content Column */}
        <div className="story-content-column">
          <div className="section-badge">
            <Sparkles size={13} className="text-brand" aria-hidden="true" />
            <span>{businessStory.badge}</span>
          </div>

          <h2 id="business-story-heading" className="section-title text-left">
            {businessStory.heading}
          </h2>

          <p className="section-lead text-left mb-6">
            {businessStory.lead}
          </p>

          <ul className="story-points-list" role="list">
            {businessStory.points.map((point: string) => (
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
              variant="outline"
              onClick={() => openLead("business")}
              aria-label="Explore Cultgig for businesses"
            >
              {businessStory.cta}
            </Button>
          </div>
        </div>

        {/* Right/Visual Column */}
        <div className="story-visual-column">
          <div className="story-image-frame">
            <img
              src={pageImages.forBusinessesHero.src}
              alt={pageImages.forBusinessesHero.alt}
              className="story-featured-image"
              loading="lazy"
            />
            <div className="story-image-badge">
              <span className="font-semibold text-neutral-textPrimary text-xs block">Event curator & hospitality team</span>
              <span className="text-neutral-textSecondary text-[11.5px] block">Setting up an evening gathering with curated live music</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
