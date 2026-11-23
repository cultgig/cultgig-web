import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { siteConfig } from "@/config/site";
import { usePageMeta } from "@/hooks/usePageMeta";

import type { LegalKind } from "./legalKinds";

export type { LegalKind };

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
  grievance: {
    title: "Grievance Redressal",
    summary: "How to raise a complaint with Cultgig and how it will be handled, as required for e-commerce entities operating in India.",
    sections: [
      {
        heading: "1. Grievance Officer",
        body: [
          `Name: ${siteConfig.grievanceOfficerName}. Email: ${siteConfig.grievanceOfficerEmail || "to be published before launch"}. Address: ${siteConfig.registeredAddress}.`,
          "These details are published in line with the Consumer Protection (E-Commerce) Rules, 2020 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. They must be confirmed by the owner before commercial launch.",
        ],
      },
      {
        heading: "2. How to raise a grievance",
        body: [
          "Use the Support page and choose the issue type, or email the Grievance Officer with your account email, the booking or conversation reference, a description of the issue and any supporting screenshots.",
          "For a problem with a specific booking, you can also raise a dispute from the booking page; this records a support ticket linked to that booking.",
        ],
      },
      {
        heading: "3. Timelines",
        body: [
          "We acknowledge grievances within 48 hours of receipt and aim to resolve them within one month. Requests to remove unlawful content are handled within the timelines set by applicable law.",
          "If you are not satisfied with the outcome, you may approach the consumer forum or other authority with jurisdiction.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie & Local Storage Policy",
    summary: "What Cultgig stores in your browser and why.",
    sections: [
      {
        heading: "1. Essential storage only",
        body: [
          "Cultgig uses essential browser storage to keep you signed in, remember your active workspace and, in demo mode, hold the demo marketplace data on your device. We do not use advertising cookies.",
        ],
      },
      {
        heading: "2. Demo mode",
        body: [
          "When the site runs in demo mode, all accounts, messages and bookings you create are stored only in your browser's local storage. Clearing site data or using “Reset data” removes them. Nothing is sent to a server.",
        ],
      },
      {
        heading: "3. Analytics",
        body: [
          "If privacy-respecting analytics are enabled in future, this page will be updated and, where required, your consent requested before any non-essential storage is used.",
        ],
      },
    ],
  },
  "payments-and-fees": {
    title: "Payments & Fees",
    summary: "How payments will work on Cultgig, and why online checkout is not live yet.",
    sections: [
      {
        heading: "1. Current status",
        body: [
          "Online payment is not available yet. Cultgig will enable checkout only after a marketplace payment provider that supports human creative services and split settlements (for example Razorpay Route or Cashfree Easy Split) approves the account in writing.",
          "Until then, bookings show “Online payment not available yet” and Cultgig never marks a booking as paid.",
        ],
      },
      {
        heading: "2. How payments will work",
        body: [
          "The amount charged will always be the amount in the accepted proposal version, computed by Cultgig's servers in Indian rupees. A booking is confirmed only after the payment provider's signed webhook verifies the payment — never on the basis of a browser redirect.",
          "Artist payouts will be settled through the provider's split-settlement feature after the booking is completed, net of any platform fee disclosed before you accept an offer.",
        ],
      },
      {
        heading: "3. Platform fees",
        body: ["No platform fee is charged during the preview. Any future fee will be shown clearly before an offer is accepted and will never be applied retroactively to accepted offers."],
      },
      {
        heading: "4. Paying outside Cultgig",
        body: ["Paying outside the platform removes booking records, dispute support and refund protection. Report anyone who pressures you to pay off-platform."],
      },
    ],
  },
  disputes: {
    title: "Dispute Resolution",
    summary: "What happens when a booking goes wrong.",
    sections: [
      {
        heading: "1. Raise a dispute",
        body: [
          "Either participant can raise a dispute from a booking that is in progress or awaiting completion confirmation. Add a short reason; this creates a support ticket linked to the booking and pauses further status changes.",
        ],
      },
      {
        heading: "2. Review",
        body: [
          "Cultgig reviews the conversation history, the accepted proposal version and any evidence both sides provide. Because every offer is versioned and append-only, the agreed scope and price are always on record.",
        ],
      },
      {
        heading: "3. Outcome",
        body: [
          "A dispute is resolved as completed or cancelled by Cultgig support. Refunds, where applicable and once payments are live, follow the Refund and Cancellation policies and the cancellation terms in the accepted proposal.",
        ],
      },
    ],
  },
};

export function LegalDocumentPage({ kind }: { kind: LegalKind }) {
  const doc = legalDocs[kind];
  usePageMeta(doc.title, doc.summary);

  return (
    <main id="main-content" className="page-container py-12 lg:py-16">
      <div className="mx-auto max-w-3xl space-y-10">
      <NoticeBanner tone="warning" title="Draft — requires legal review">
        This document is a structured pre-launch draft. Final legal wording, jurisdiction,
        configured entity name ({siteConfig.legalEntityName}), principal address (
        {siteConfig.registeredAddress}), and effective dates require formal review by Indian legal
        counsel prior to commercial launch.
      </NoticeBanner>

      <header className="space-y-4 border-b border-line pb-8">
        <h1 className="type-title text-ink-strong">{doc.title}</h1>
        <p className="type-body-lg text-ink-secondary">{doc.summary}</p>
        <p className="type-caption text-ink-secondary">Cultgig Legal, updated {siteConfig.policiesLastUpdated}</p>
      </header>

      <div className="space-y-8">
        {doc.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="type-h2 text-ink-strong">{section.heading}</h2>
            {section.body.map((para) => (
              <p key={para} className="max-w-[68ch] text-[15px] leading-7 text-ink">
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>
      </div>
    </main>
  );
}

