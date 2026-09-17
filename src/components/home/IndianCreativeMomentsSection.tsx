import { MapPin, Sparkles } from "lucide-react";
import { homepageContent } from "../../content/homepage";
import { categoryImages, heroImage } from "../../content/images";

export function IndianCreativeMomentsSection() {
  const { moments } = homepageContent;

  const imageMap: Record<string, { src: string; alt: string }> = {
    decorators: categoryImages.decorators,
    musicians: heroImage,
    beautyDance: categoryImages.beautyDance,
    photographers: categoryImages.photographers,
  };

  return (
    <section className="section-container bg-neutral-surface border-t border-neutral-borderLight" aria-labelledby="moments-heading">
      <div className="section-header-centered">
        <span className="section-badge">
          <Sparkles size={13} className="text-brand mr-1 inline" aria-hidden="true" />
          {moments.badge}
        </span>
        <h2 id="moments-heading" className="section-title">{moments.heading}</h2>
        <p className="section-lead">{moments.lead}</p>
      </div>

      <div className="moments-editorial-mosaic">
        {moments.list.map((moment, index) => {
          const img = imageMap[moment.imageKey] || categoryImages.musicians;
          const isFeatured = index === 0;

          return (
            <article
              key={moment.id}
              className={`moment-mosaic-item ${isFeatured ? "moment-mosaic-featured" : ""}`}
            >
              <div className="moment-mosaic-media">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="moment-mosaic-image"
                  loading="lazy"
                />
                <div className="moment-mosaic-overlay" />
                <div className="moment-mosaic-tags">
                  <span className="moment-tag-category">{moment.category}</span>
                </div>
              </div>
              <div className="moment-mosaic-caption">
                <div className="flex items-center gap-1.5 text-xs text-brand font-medium mb-1">
                  <MapPin size={12} className="shrink-0" />
                  <span>{moment.setting}</span>
                </div>
                <h3 className="moment-mosaic-title">{moment.title}</h3>
                <p className="moment-mosaic-desc">{moment.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
