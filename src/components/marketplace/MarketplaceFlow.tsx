import { ArrowRight, BriefcaseBusiness, MessageCircleMore, UserRound } from "lucide-react";

const steps = [
  { number: "01", label: "Discover", detail: "Start with the kind of work you need.", icon: BriefcaseBusiness },
  { number: "02", label: "Explore", detail: "See the person, portfolio and context.", icon: UserRound },
  { number: "03", label: "Talk", detail: "Bring a useful brief into the first message.", icon: MessageCircleMore },
];

export function MarketplaceFlow() {
  return <div className="marketplace-flow" aria-label="Illustrative Cultgig marketplace flow">
    {steps.map(({ number, label, detail, icon: Icon }, index) => <div className="marketplace-flow-step" key={number}>
      <div className="marketplace-flow-icon"><Icon size={19} /></div>
      <span>{number}</span>
      <strong>{label}</strong>
      <p>{detail}</p>
      {index < steps.length - 1 && <ArrowRight className="marketplace-flow-arrow" size={18} aria-hidden="true" />}
    </div>)}
  </div>;
}