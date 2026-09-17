import { Clock } from "lucide-react";
import { homepageContent } from "../../content/homepage";

export function BookingScenarioSection() {
  const { scenario } = homepageContent;

  return (
    <section className="section-container bg-neutral-canvas" aria-labelledby="scenario-heading">
      <div className="section-header-centered">
        <span className="section-badge">{scenario.badge}</span>
        <h2 id="scenario-heading" className="section-title">{scenario.heading}</h2>
        <p className="section-lead">{scenario.lead}</p>
      </div>

      <div className="scenario-timeline-card">
        <div className="scenario-timeline-header">
          <span className="card-badge">Illustrative walkthrough</span>
          <span className="text-xs text-neutral-textMuted">Bandra boutique café & acoustic duo</span>
        </div>

        <div className="scenario-steps">
          {scenario.timeline.map((step, idx) => (
            <div key={step.time} className="scenario-step-row">
              <div className="scenario-time-col">
                <Clock size={13} className="text-brand inline mr-1" />
                <span>{step.time}</span>
              </div>

              <div className="scenario-marker-col">
                <div className="scenario-marker-dot" />
                {idx < scenario.timeline.length - 1 && <div className="scenario-marker-line" />}
              </div>

              <div className="scenario-body-col">
                <h4 className="scenario-step-label">{step.label}</h4>
                <p className="scenario-step-detail">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
