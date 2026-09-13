import { BriefcaseBusiness, MapPin } from "lucide-react";
type Props = { title?: string; category?: string; city?: string; description?: string };
export function OpportunityPreviewCard({ title = "Weekend cultural evening", category = "Live music", city = "Mumbai", description = "A venue is looking for the right creative partner for an intimate evening programme." }: Props) {
  return <article className="opportunity-card"><div><span className="example-label">ILLUSTRATIVE OPPORTUNITY</span><p className="card-kicker">{category}</p><h2>{title}</h2><p>{description}</p><div className="opportunity-meta"><span><MapPin size={16} /> {city}</span><span><BriefcaseBusiness size={16} /> Budget discussed in conversation</span></div></div><div className="opportunity-status"><b>What happens next</b><span>Explore the brief</span><span>Share relevant work</span><span>Start a conversation</span></div></article>;
}
