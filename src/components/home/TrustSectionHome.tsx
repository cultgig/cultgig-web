import { Smartphone, Sparkles, Star, Unlock, ShieldCheck } from "lucide-react";
import { homepageContent } from "../../content/homepage";

export function TrustSectionHome() {
  const { trust } = homepageContent;
  const icons = [Smartphone, Sparkles, Star, Unlock];

  return (
    <section className="section-container bg-neutral-surface" aria-labelledby="trust-heading">
      <div className="section-header-centered">
        <span className="section-badge">
          <ShieldCheck size={13} className="text-brand mr-1 inline" />
          {trust.badge}
        </span>
        <h2 id="trust-heading" className="section-title">{trust.heading}</h2>
        <p className="section-lead">{trust.lead}</p>
      </div>

      <div className="trust-pillars-grid">
        {trust.pillars.map((pillar, idx) => {
          const Icon = icons[idx];
          return (
            <article key={pillar.title} className="trust-pillar-card">
              <div className="trust-pillar-icon-box">
                <Icon size={18} className="text-brand" aria-hidden="true" />
              </div>
              <h3 className="trust-pillar-title">{pillar.title}</h3>
              <p className="trust-pillar-desc">{pillar.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
