import { UserRound, Building2 } from "lucide-react";
import { homepageContent, type StepItem } from "../../content/homepage";
import { Button } from "../ui/Button";

type OpenLead = (role?: "artist" | "business") => void;

export function HowItWorksDualSection({ openLead }: { openLead: OpenLead }) {
  const { howItWorks } = homepageContent;
  const { artistTrack, businessTrack } = howItWorks;

  return (
    <section className="section-container bg-neutral-canvas" aria-labelledby="how-it-works-heading">
      <div className="section-header-centered">
        <span className="section-badge">{howItWorks.badge}</span>
        <h2 id="how-it-works-heading" className="section-title">{howItWorks.heading}</h2>
        <p className="section-lead">{howItWorks.lead}</p>
      </div>

      <div className="how-tracks-grid">
        {/* Track 1: For Artists */}
        <div className="how-track-card">
          <div className="how-track-header">
            <div className="how-track-icon">
              <UserRound size={18} className="text-brand" />
            </div>
            <div>
              <h3 className="how-track-title">{artistTrack.title}</h3>
              <p className="how-track-subtitle">{artistTrack.subtitle}</p>
            </div>
          </div>

          <div className="how-steps-list">
            {artistTrack.steps.map((step: StepItem) => (
              <div key={step.number} className="how-step-item">
                <span className="how-step-num">{step.number}</span>
                <div className="how-step-body">
                  <h4 className="how-step-title">{step.title}</h4>
                  <p className="how-step-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-border">
            <Button
              variant="primary"
              onClick={() => openLead("artist")}
              className="w-full"
              aria-label="Join Cultgig as an artist"
            >
              Join as an artist
            </Button>
          </div>
        </div>

        {/* Track 2: For Businesses */}
        <div className="how-track-card">
          <div className="how-track-header">
            <div className="how-track-icon">
              <Building2 size={18} className="text-brand" />
            </div>
            <div>
              <h3 className="how-track-title">{businessTrack.title}</h3>
              <p className="how-track-subtitle">{businessTrack.subtitle}</p>
            </div>
          </div>

          <div className="how-steps-list">
            {businessTrack.steps.map((step: StepItem) => (
              <div key={step.number} className="how-step-item">
                <span className="how-step-num">{step.number}</span>
                <div className="how-step-body">
                  <h4 className="how-step-title">{step.title}</h4>
                  <p className="how-step-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-border">
            <Button
              variant="outline"
              onClick={() => openLead("business")}
              className="w-full"
              aria-label="Get early access for businesses"
            >
              Get early access
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
