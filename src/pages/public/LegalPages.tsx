import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { siteConfig } from "@/config/site";
import { usePageMeta } from "@/hooks/usePageMeta";

export type LegalKind =
  | "terms"
  | "privacy"
  | "refunds"
  | "cancellation"
  | "community-guidelines"
  | "artist-agreement"
  | "client-agreement";

const legalDocs: Record<
  LegalKind,
  { title: string; summary: string; sections: { heading: string; body: string[] }[] }
> = {
  terms: {
    title: "Terms & Conditions",
    summary:
      "Platform rules governing Cultgig accounts, creative briefs, versioned proposals, and bookings in India.",
    sections: [
      {
        heading: "1. Role of Cultgig",
        body: [
          "Cultgig operates as an intermediary technology marketplace enabling event hosts/clients and independent artists to discover each other, exchange briefs, and negotiate booking proposals. Unless explicitly stated in writing, Cultgig is not the employer of any artist nor the direct performer of creative services.",
        ],
      },
      {
        heading: "2. Eligibility, accounts & prohibited offerings",
        body: [
          "Users must provide accurate information and maintain account security. Illegal services, unlicensed regulated activities, hazardous acts, infringing portfolio uploads, and harassing behaviour are strictly prohibited. Wall mural commissions require lawful owner permission; tattoo offerings are limited to licensed, hygienic studio services for eligible adults.",
        ],
      },
      {
        heading: "3. Proposals, accepted offers & governing law",
        body: [
          "Negotiations should be captured in versioned proposals specifying date, venue city, duration, inclusions, exclusions, travel costs, and cancellation terms. Governing law, jurisdiction city, and limitation-of-liability clauses require final Indian legal counsel sign-off prior to commercial launch.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy (DPDP Act 2023 Aligned Draft)",
    summary:
      "How Cultgig collects, uses, retains, and protects personal data in line with India's Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025.",
    sections: [
      {
        heading: "1. Personal data we collect",
        body: [
          "We collect data you directly submit: display name, email address, city, artist/client onboarding details, portfolio media you upload with ownership confirmation, event briefs, proposals, and support requests. Cultgig does NOT request Gmail OAuth or read user email inboxes.",
        ],
      },
      {
        heading: "2. Infrastructure processors & sharing",
        body: [
          "Cultgig uses Appwrite for authentication/database storage, Vercel for frontend hosting, and (when configured) Cloudinary for media delivery and an approved Indian payment gateway for booking transactions. Personal venue addresses and contact details are shared between booking participants only as required and consented.",
        ],
      },
      {
        heading: "3. Your rights & grievance mechanism",
        body: [
          "Under India's DPDP framework, Data Principals have rights to access, correction, erasure, and withdrawal of consent, plus grievance redressal via our configured Grievance Officer. Final retention schedules and counsel review must be completed before live launch.",
        ],
      },
    ],
  },
  refunds: {
    title: "Refund & Cancellation Policy",
    summary:
      "Structured policy framework governing cancellations, rescheduling, force majeure, and gateway processing constraints.",
    sections: [
      {
        heading: "1. Stage-based cancellation treatment",
        body: [
          "• Cancellation before artist acceptance: No booking commitment exists; pending inquiries can be withdrawn freely.",
          "• Cancellation after offer acceptance / before event: Governed by the notice window stated in the mutually accepted Proposal version and the finalised platform cancellation schedule.",
          "• Artist cancellation or no-show: Buyer is entitled to raise a priority support ticket for full refund review and alternative artist assistance subject to provider settlement rules.",
          "• Buyer cancellation or rescheduling: Subject to the notice window, committed preparation costs, and mutual date availability.",
        ],
      },
      {
        heading: "2. Scope changes, force majeure & disputes",
        body: [
          "Scope changes must be recorded as a new proposal version. Force majeure (severe weather, government restrictions), partial completion, or disputed service quality are reviewed via evidence-backed support tickets.",
          "Duplicate payments or gateway failures are reconciled against provider settlement logs and refunded to the original payment method within provider-confirmed timelines.",
        ],
      },
    ],
  },
  cancellation: {
    title: "Cancellation Policy",
    summary: "Operational cancellation, rescheduling, and evidence guidelines for Cultgig bookings.",
    sections: [
      {
        heading: "1. Written notice inside booking thread",
        body: [
          "All cancellation or rescheduling requests must be logged on the booking record so timestamps and reasons are preserved cleanly for both buyer and artist.",
        ],
      },
      {
        heading: "2. Payment provider constraints",
        body: [
          "Once live payments are activated via an approved Indian split-payment provider, refunds are always returned to the original payment instrument subject to gateway processing windows and non-refundable gateway charges if applicable.",
        ],
      },
    ],
  },
  "community-guidelines": {
    title: "Community Guidelines",
    summary: "Standards of mutual respect, portfolio originality, and lawful conduct on Cultgig.",
    sections: [
      {
        heading: "1. Respectful peer conduct",
        body: [
          "Artists and hosts interact as professionals. Harassment, discriminatory remarks, unsafe venue demands, and bait-and-switch pricing are prohibited.",
        ],
      },
      {
        heading: "2. Authentic portfolios only",
        body: [
          "Never upload another artist's work, scraped social photos, or watermarked stock imagery claiming it as your own performance or craft.",
        ],
      },
    ],
  },
  "artist-agreement": {
    title: "Artist Agreement (Draft)",
    summary: "Terms covering independent artist status, portfolio licensing, service delivery, and payout compliance.",
    sections: [
      {
        heading: "1. Independent creative status",
        body: [
          "Artists operate as independent professionals or collectives responsible for fulfilling the deliverables agreed in their accepted proposal version, as well as applicable KYC and tax obligations.",
        ],
      },
    ],
  },
  "client-agreement": {
    title: "Client / Host Agreement (Draft)",
    summary: "Terms covering brief accuracy, safe venue conditions, and payment obligations for event hosts.",
    sections: [
      {
        heading: "1. Accurate briefs & safe venue access",
        body: [
          "Clients must provide accurate event timing, technical setup disclosures, and safe working conditions matching the agreed proposal.",
        ],
      },
    ],
  },
};

export function LegalDocumentPage({ kind }: { kind: LegalKind }) {
  const doc = legalDocs[kind];
  usePageMeta(doc.title, doc.summary);

  return (
    <main id="main-content" className="max-w-[860px] mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-8">
      <NoticeBanner tone="warning" title="Draft — requires legal review">
        This document is a structured pre-launch draft. Final legal wording, jurisdiction,
        configured entity name ({siteConfig.legalEntityName}), principal address (
        {siteConfig.registeredAddress}), and effective dates require formal review by Indian legal
        counsel prior to commercial launch.
      </NoticeBanner>

      <header className="space-y-2 border-b border-line pb-6">
        <p className="type-caption text-brand font-semibold">
          Cultgig Legal · Updated {siteConfig.policiesLastUpdated}
        </p>
        <h1 className="text-[28px] sm:text-[36px] leading-[1.2] font-bold text-ink">
          {doc.title}
        </h1>
        <p className="type-body-lg text-ink-secondary">{doc.summary}</p>
      </header>

      <div className="space-y-6">
        {doc.sections.map((section) => (
          <section key={section.heading} className="space-y-2.5">
            <h2 className="type-h2 text-ink">{section.heading}</h2>
            {section.body.map((para) => (
              <p key={para} className="type-body text-ink-secondary">
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}

