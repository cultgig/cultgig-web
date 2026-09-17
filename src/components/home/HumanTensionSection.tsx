import { MessageSquareOff, SearchX } from "lucide-react";
import { homepageContent } from "../../content/homepage";
import { creatorImages } from "../../content/images";

export function HumanTensionSection() {
  const { tension } = homepageContent;

  return (
    <section className="section-container bg-neutral-surface border-y border-neutral-borderLight" aria-labelledby="tension-heading">
      <div className="section-header-centered">
        <span className="section-badge">{tension.badge}</span>
        <h2 id="tension-heading" className="section-title">{tension.heading}</h2>
        <p className="section-lead">{tension.lead}</p>
      </div>

      <div className="tension-editorial-grid">
        {/* Artist Side */}
        <article className="tension-editorial-column">
          <div className="tension-person-header">
            <img
              src={creatorImages.kabir.src}
              alt={creatorImages.kabir.alt}
              className="tension-person-avatar"
              loading="lazy"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="tension-role-label">{tension.sides[0].role}</span>
                <MessageSquareOff size={14} className="text-brand shrink-0" aria-hidden="true" />
              </div>
              <span className="text-xs text-neutral-textSecondary block">Kabir Sen · Live Performer & Guitarist</span>
            </div>
          </div>
          <blockquote className="tension-quote">
            “{tension.sides[0].quote}”
          </blockquote>
          <p className="tension-summary">{tension.sides[0].summary}</p>
        </article>

        {/* Business Side */}
        <article className="tension-editorial-column">
          <div className="tension-person-header">
            <img
              src={creatorImages.arjun.src}
              alt={creatorImages.arjun.alt}
              className="tension-person-avatar"
              loading="lazy"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="tension-role-label">{tension.sides[1].role}</span>
                <SearchX size={14} className="text-brand shrink-0" aria-hidden="true" />
              </div>
              <span className="text-xs text-neutral-textSecondary block">Arjun Varma · Hospitality Curator & Event Lead</span>
            </div>
          </div>
          <blockquote className="tension-quote">
            “{tension.sides[1].quote}”
          </blockquote>
          <p className="tension-summary">{tension.sides[1].summary}</p>
        </article>
      </div>
    </section>
  );
}
