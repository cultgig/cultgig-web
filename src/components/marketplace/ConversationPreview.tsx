import { ArrowUpRight, MessageCircleMore } from "lucide-react";

export function ConversationPreview({ kind }: { kind: "artist" | "business" }) {
  const artist = kind === "artist";
  return <article className="conversation-preview">
    <div className="conversation-preview-topline"><span className="example-label">PRODUCT PREVIEW</span><MessageCircleMore size={18} /></div>
    <p className="card-kicker">{artist ? "ILLUSTRATIVE PROPOSAL" : "ILLUSTRATIVE CONVERSATION"}</p>
    <h3>{artist ? "Share why the work fits" : "Start with useful context"}</h3>
    <p>{artist ? "Rhea Kapoor · Singer · Live performer" : "Weekend cultural evening · Musicians & DJs"}</p>
    <div className="conversation-preview-note">{artist ? "I would be a strong fit because my live sets are built for intimate cultural evenings and hospitality spaces." : "We are looking for a warm live set, a flexible 2–3 hour format and a clear sense of the evening's mood."}</div>
    <a href="/how-it-works">View the next step <ArrowUpRight size={15} /></a>
  </article>;
}