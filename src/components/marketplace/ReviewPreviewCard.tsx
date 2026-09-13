type Props = { name: string; role: string; quote: string; image: string; alt: string };
export function ReviewPreviewCard({ name, role, quote, image, alt }: Props) { return <article className="review-preview-card"><img src={image} alt={alt} /><div><span className="example-label">ILLUSTRATIVE FEEDBACK</span><blockquote>“{quote}”</blockquote><p><b>{name}</b> · {role}</p></div></article>; }
