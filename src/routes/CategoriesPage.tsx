import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "../app/App";
import { Button } from "../components/ui/Button";
import { CategoryGrid, categoryDetails } from "../components/marketplace/CategoryGrid";
import { OpportunityPreviewCard } from "../components/marketplace/OpportunityPreviewCard";
import { categoryImages } from "../content/images";
import { usePageMeta } from "../hooks/usePageMeta";
type OpenLead = (role?: "artist" | "business") => void;
export function CategoriesPage() { usePageMeta("Creative categories", "Explore the creative categories Cultgig is building for artists and businesses."); return <main className="marketing-page"><section className="page-hero"><div><p className="eyebrow">EXPLORE THE MARKETPLACE</p><h1>Start with the creative work you need.</h1><p className="lede">Cultgig is being designed around four launch categories. Browse the kinds of talent and opportunities the product will make easier to find.</p></div><img src={categoryImages.musicians.src} alt={categoryImages.musicians.alt} /></section><section className="categories-section category-index"><div className="section-heading"><p className="eyebrow">LAUNCH CATEGORIES</p><h2>Made for the work that brings people together.</h2><p>These are categories, not live inventory. Profiles and requests shown in product previews are illustrative.</p></div><CategoryGrid /></section></main>; }
export function CategoryDetailPage({ slug, openLead }: { slug: string; openLead: OpenLead }) {
  const category = categoryDetails.find((item) => item.slug === slug); if (!category) return <CategoriesPage />;
  const image = categoryImages[category.key]; usePageMeta(`${image.category} | Categories`, `Discover how Cultgig is being built for ${image.category}.`);
  return <main className="marketing-page"><section className="category-detail-hero" style={{ backgroundImage: `linear-gradient(90deg, #1b1119e8 20%, #1b11197a), url(${image.src})` }}><Link className="back-link" to="/categories"><ArrowLeft size={16} /> All categories</Link><div><p className="eyebrow">CATEGORY {category.number}</p><h1>{image.category}</h1><p>{category.description}</p></div></section><section className="opportunity-section"><OpportunityPreviewCard category={image.category} /><div className="category-detail-cta"><h2>Building this category on Cultgig?</h2><p>Join the early cohort so the right people can find each other when the marketplace opens.</p><Button onClick={() => openLead("artist")}>Join as an Artist <ArrowUpRight size={16} /></Button><Button variant="outline-light" onClick={() => openLead("business")}>Get early access</Button></div></section></main>;
}
