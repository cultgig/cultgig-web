import { MessageSquareOff, SearchX } from "lucide-react";
import { homepageContent } from "../../content/homepage";

export function HumanTensionSection() {
  const { tension } = homepageContent;

  return (
    <section className="section-container bg-neutral-canvas" aria-labelledby="tension-heading">
      <div className="section-header-centered">
        <span className="section-badge">{tension.badge}</span>
        <h2 id="tension-heading" className="section-title">{tension.heading}</h2>
        <p className="section-lead">{tension.lead}</p>
      </div>

      <div className="tension-grid">
        {/* Artist Side */}
        <article className="tension-card">
          <div className="tension-card-header">
            <div className="tension-icon-wrapper">
              <MessageSquareOff size={18} className="text-brand" aria-hidden="true" />
            </div>
            <span className="tension-role-label">{tension.sides[0].role}</span>
          </div>
          <blockquote className="tension-quote">
            “{tension.sides[0].quote}”
          </blockquote>
          <p className="tension-summary">{tension.sides[0].summary}</p>
        </article>

        {/* Business Side */}
        <article className="tension-card">
          <div className="tension-card-header">
            <div className="tension-icon-wrapper">
              <SearchX size={18} className="text-brand" aria-hidden="true" />
            </div>
            <span className="tension-role-label">{tension.sides[1].role}</span>
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
