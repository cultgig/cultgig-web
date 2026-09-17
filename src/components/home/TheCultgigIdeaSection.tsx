import { ArrowRight, Eye, FileText, MessagesSquare } from "lucide-react";
import { homepageContent } from "../../content/homepage";

export function TheCultgigIdeaSection() {
  const { concept } = homepageContent;
  const icons = [Eye, FileText, MessagesSquare];

  return (
    <section className="section-container bg-neutral-surface" aria-labelledby="concept-heading">
      <div className="section-header-centered">
        <span className="section-badge">{concept.badge}</span>
        <h2 id="concept-heading" className="section-title">{concept.heading}</h2>
        <p className="section-lead">{concept.lead}</p>
      </div>

      <div className="concept-sequence">
        {concept.steps.map((step, idx) => {
          const Icon = icons[idx];
          return (
            <div key={step.number} className="concept-step-item">
              <div className="concept-step-indicator">
                <div className="concept-step-icon">
                  <Icon size={18} className="text-brand" aria-hidden="true" />
                </div>
                <span className="concept-step-number">{step.number}</span>
                {idx < concept.steps.length - 1 && (
                  <div className="concept-step-divider" aria-hidden="true">
                    <ArrowRight size={14} className="text-neutral-textMuted hidden md:block" />
                  </div>
                )}
              </div>
              <h3 className="concept-step-title">{step.title}</h3>
              <p className="concept-step-desc">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
