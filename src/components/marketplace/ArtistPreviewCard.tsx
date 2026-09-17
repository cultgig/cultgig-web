import { MapPin } from "lucide-react";
type Props = { name: string; craft: string; city: string; bio: string; portrait: string; portraitAlt: string; portfolio: string; portfolioAlt: string };
export function ArtistPreviewCard({ name, craft, city, bio, portrait, portraitAlt, portfolio, portfolioAlt }: Props) {
  return <article className="artist-preview-card"><div className="artist-preview-image"><img src={portrait} alt={portraitAlt} loading="lazy" /><span className="example-label">Example artist profile</span></div><div className="artist-preview-content"><p className="card-kicker">{craft}</p><h2>{name}</h2><p className="artist-location"><MapPin size={15} /> {city}</p><p>{bio}</p><div className="artist-portfolio"><img src={portfolio} alt={portfolioAlt} loading="lazy" /><span>Portfolio preview<br /><b>See how profiles could work</b></span></div></div></article>;
}
