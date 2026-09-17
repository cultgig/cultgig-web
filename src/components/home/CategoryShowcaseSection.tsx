import { ArrowUpRight, Compass } from "lucide-react";
import { Link } from "../../app/App";
import { homepageContent } from "../../content/homepage";
import { categoryImages } from "../../content/images";

export function CategoryShowcaseSection() {
  const { categories } = homepageContent;

  return (
    <section className="section-container bg-neutral-surface" aria-labelledby="categories-heading">
      <div className="section-header-centered">
        <span className="section-badge">
          <Compass size={13} className="text-brand mr-1 inline" aria-hidden="true" />
          {categories.badge}
        </span>
        <h2 id="categories-heading" className="section-title">{categories.heading}</h2>
        <p className="section-lead">{categories.lead}</p>
      </div>

      <div className="home-category-grid">
        {categories.list.map((cat) => {
          const img = categoryImages[cat.key];
          return (
            <Link
              key={cat.slug}
              to={`/categories/${cat.slug}`}
              className="home-category-card group"
              aria-label={`Explore ${cat.title}`}
            >
              <div className="home-category-media">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="home-category-img"
                  loading="lazy"
                />
                <div className="home-category-overlay" />
                <span className="home-category-number">{cat.number}</span>
              </div>
              
              <div className="home-category-content">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="home-category-title">{cat.title}</h3>
                  <div className="home-category-arrow group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
                <p className="home-category-desc">{cat.description}</p>
                <div className="home-category-examples">
                  <span>{cat.examples}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
