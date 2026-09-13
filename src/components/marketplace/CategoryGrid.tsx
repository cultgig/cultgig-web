import { Link } from "../../app/App";
import { categoryImages } from "../../content/images";
import { CategoryCard } from "../ui/CategoryCard";
export const categoryDetails = [
  { slug: "musicians-djs", key: "musicians", number: "01", description: "Live musicians, DJs, bands and performers for gatherings with a pulse." },
  { slug: "photo-video", key: "photographers", number: "02", description: "Photographers and videographers who turn a moment into a lasting story." },
  { slug: "decor-event", key: "decorators", number: "03", description: "Decorators and event specialists who shape the atmosphere around an idea." },
  { slug: "beauty-dance", key: "beautyDance", number: "04", description: "Makeup artists, beauty professionals and dancers for expressive experiences." },
] as const;
export function CategoryGrid() { return <div className="category-grid">{categoryDetails.map(({ slug, key, number }) => { const image = categoryImages[key]; return <Link key={slug} to={`/categories/${slug}`} aria-label={`Explore ${image.category}`}><CategoryCard number={number} label={image.category ?? ""} image={image.src} alt={image.alt} /></Link>; })}</div>; }
