import { MapPin } from "lucide-react";
import { homepageContent } from "../../content/homepage";
import { categoryImages } from "../../content/images";

export function IndianCreativeMomentsSection() {
  const { moments } = homepageContent;

  const imageMap: Record<string, { src: string; alt: string }> = {
    decorators: categoryImages.decorators,
    musicians: categoryImages.musicians,
    beautyDance: categoryImages.beautyDance,
    photographers: categoryImages.photographers,
  };

  return (
    <section className="section-container bg-neutral-surface" aria-labelledby="moments-heading">
      <div className="section-header-centered">
        <span className="section-badge">{moments.badge}</span>
        <h2 id="moments-heading" className="section-title">{moments.heading}</h2>
        <p className="section-lead">{moments.lead}</p>
      </div>

      <div className="moments-grid">
        {moments.list.map((moment) => {
          const img = imageMap[moment.imageKey] || categoryImages.musicians;
          return (
            <article key={moment.id} className="moment-card">
              <div className="moment-image-wrapper">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="moment-image"
                  loading="lazy"
                />
                <div className="moment-image-overlay" />
                <span className="moment-category-badge">{moment.category}</span>
              </div>
              <div className="moment-content">
                <h3 className="moment-title">{moment.title}</h3>
                <p className="moment-setting">
                  <MapPin size={13} className="inline mr-1 text-brand" />
                  {moment.setting}
                </p>
                <p className="moment-desc">{moment.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
