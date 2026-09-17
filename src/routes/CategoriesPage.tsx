import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "../app/App";
import { Button } from "../components/ui/Button";
import { CategoryGrid, categoryDetails } from "../components/marketplace/CategoryGrid";
import { ArtistPreviewCard } from "../components/marketplace/ArtistPreviewCard";
import { OpportunityPreviewCard } from "../components/marketplace/OpportunityPreviewCard";
import { categoryImages, creatorImages } from "../content/images";
import { usePageMeta } from "../hooks/usePageMeta";

type OpenLead = (role?: "artist" | "business") => void;

export function CategoriesPage() {
  usePageMeta(
    "Creative categories",
    "Explore the creative categories Cultgig is building for artists and businesses."
  );

  return (
    <main className="marketing-page">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Explore the marketplace</p>
          <h1>Start with the creative work you need.</h1>
          <p className="lede">
            Cultgig is being designed around four launch categories. Browse the kinds of talent and
            opportunities the product will make easier to find.
          </p>
        </div>
        <img src={categoryImages.musicians.src} alt={categoryImages.musicians.alt} />
      </section>

      <section className="categories-section category-index">
        <div className="section-heading">
          <p className="eyebrow">Launch categories</p>
          <h2>Made for the work that brings people together.</h2>
          <p>
            These are categories, not live inventory. Profiles and requests shown in product previews
            are illustrative.
          </p>
        </div>
        <CategoryGrid />
      </section>
    </main>
  );
}

export function CategoryDetailPage({
  slug,
  openLead,
}: {
  slug: string;
  openLead: OpenLead;
}) {
  const category = categoryDetails.find((item) => item.slug === slug);
  if (!category) return <CategoriesPage />;

  const image = categoryImages[category.key];
  usePageMeta(
    `${image.category} | Categories`,
    `Discover how Cultgig is being built for ${image.category}.`
  );

  const profile =
    category.key === "musicians"
      ? creatorImages.rhea
      : category.key === "photographers"
      ? creatorImages.meera
      : category.key === "beautyDance"
      ? creatorImages.naina
      : creatorImages.kabir;

  const profileCraft =
    category.key === "musicians"
      ? "Singer · Live performer"
      : image.category ?? "Creative professional";

  return (
    <main className="marketing-page">
      <section
        className="category-detail-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, #1b1119e8 20%, #1b11197a), url(${image.src})`,
        }}
      >
        <Link className="back-link" to="/categories">
          <ArrowLeft size={16} /> All categories
        </Link>
        <div>
          <p className="eyebrow">Category {category.number}</p>
          <h1>{image.category}</h1>
          <p>{category.description}</p>
        </div>
      </section>

      <section className="opportunity-section">
        <div className="category-detail-intro">
          <p className="eyebrow">See the marketplace in context</p>
          <h2>Start with the work. Then understand the fit.</h2>
          <p>
            These examples are illustrative previews of how a creative category can hold both a clear
            opportunity and the person behind the work.
          </p>
        </div>

        <OpportunityPreviewCard
          category={image.category}
          timing="Date and duration shared in the brief"
        />

        <section className="category-detail-story">
          <div>
            <p className="eyebrow">Example artist profile</p>
            <h2>Meet the person behind the category.</h2>
            <p>
              Profiles can give businesses a better sense of craft, working style and relevant
              experience before the first conversation.
            </p>
          </div>
          <ArtistPreviewCard
            name={
              profile === creatorImages.rhea
                ? "Rhea Kapoor"
                : profile === creatorImages.meera
                ? "Meera Shah"
                : profile === creatorImages.naina
                ? "Naina Rao"
                : "Kabir Malhotra"
            }
            craft={profileCraft}
            city="Mumbai"
            bio="An illustrative creative profile showing how work, context and personality can sit together."
            portrait={profile.src}
            portraitAlt={profile.alt}
            portfolio={image.src}
            portfolioAlt={image.alt}
          />
        </section>

        <div className="category-detail-cta">
          <h2>Building this category on Cultgig?</h2>
          <p>Join the early cohort so the right people can find each other when the marketplace opens.</p>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Button onClick={() => openLead("artist")}>
              Join as an artist <ArrowUpRight size={16} />
            </Button>
            <Button variant="outline-light" onClick={() => openLead("business")}>
              Get early access
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

