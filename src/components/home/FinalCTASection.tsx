import { Sparkles } from "lucide-react";
import { homepageContent } from "../../content/homepage";
import { Button } from "../ui/Button";

type OpenLead = (role?: "artist" | "business") => void;

export function FinalCTASection({ openLead }: { openLead: OpenLead }) {
  const { finalCta } = homepageContent;

  return (
    <section className="final-cta-section" aria-labelledby="final-cta-heading">
      <div className="final-cta-inner">
        <div className="section-badge">
          <Sparkles size={13} className="text-brand" aria-hidden="true" />
          <span>{finalCta.badge}</span>
        </div>

        <h2 id="final-cta-heading" className="final-cta-heading">
          {finalCta.heading}
        </h2>

        <p className="final-cta-lead">
          {finalCta.lead}
        </p>

        <div className="final-cta-buttons">
          <Button
            variant="primary"
            onClick={() => openLead("artist")}
            aria-label="Join Cultgig early access as an artist"
          >
            {finalCta.artistButton}
          </Button>
          <Button
            variant="outline"
            onClick={() => openLead("business")}
            aria-label="Get early access for businesses"
          >
            {finalCta.businessButton}
          </Button>
        </div>

        <p className="final-cta-note">
          {finalCta.note}
        </p>
      </div>
    </section>
  );
}
