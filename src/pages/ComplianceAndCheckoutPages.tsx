import { AlertTriangle, CheckCircle2, Clock, Mail, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { NoticeBanner } from "../components/ui/NoticeBanner";
import { siteConfig } from "../config/site";
import { usePageMeta } from "../hooks/usePageMeta";
import { Link } from "../lib/router";
import { useMarketplace } from "../state/MarketplaceContext";
import { formatPaiseToInr, formatReadableDate } from "../utils/format";

export function ContactAndSupportPage({ ticketId }: { ticketId?: string }) {
  usePageMeta(
    "Contact & support",
    "Reach Cultgig support, raise an inquiry with a reference ID, or review grievance contact details."
  );

  const { supportTickets, createSupportTicket } = useMarketplace();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issueType, setIssueType] = useState<
    "booking_issue" | "cancellation_refund" | "artist_safety" | "account_help" | "partnership"
  >("account_help");
  const [bookingReference, setBookingReference] = useState("");
  const [message, setMessage] = useState("");
  const [createdId, setCreatedId] = useState<string | null>(ticketId || null);
  const [error, setError] = useState("");

  const existingTicket = createdId
    ? supportTickets.find((t) => t.id === createdId)
    : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message.trim()) {
      setError("Please enter your name, a valid email address, and details of your inquiry.");
      return;
    }
    const created = createSupportTicket({
      name: name.trim(),
      email: email.trim(),
      issueType,
      bookingReference: bookingReference.trim() || undefined,
      message: message.trim(),
    });
    setCreatedId(created.id);
    setMessage("");
  };

  return (
    <main id="main-content" className="max-w-[1040px] mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-8">
      <div className="space-y-2 max-w-[700px]">
        <p className="type-label text-plum">Contact & customer support</p>
        <h1 className="text-[30px] sm:text-[36px] leading-[1.2] font-bold text-ink-primary">
          How to reach Cultgig
        </h1>
        <p className="type-body-lg text-ink-secondary">
          Log a support request with an optional booking reference ID, or inspect our configured
          operator and grievance contact details.
        </p>
      </div>

      {!siteConfig.isBusinessIdentityComplete && (
        <NoticeBanner tone="warning" title="Business contact configuration pending">
          Owner-supplied `VITE_SUPPORT_EMAIL`, `VITE_LEGAL_ENTITY_NAME`, `VITE_REGISTERED_ADDRESS`,
          and grievance officer details are not yet configured in environment variables.
        </NoticeBanner>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 bg-surface border border-line rounded-xl p-6 space-y-4">
          <h2 className="type-h2 text-ink-primary">Raise a support request</h2>
          {createdId ? (
            <div className="bg-plum-soft border border-plum-border rounded-lg p-5 space-y-2">
              <p className="type-h4 text-plum inline-flex items-center gap-2">
                <CheckCircle2 size={18} aria-hidden="true" />
                Request recorded (Reference: {createdId})
              </p>
              <p className="type-body-sm text-ink-secondary">
                This support ticket is saved locally in prototype preview mode. In production, it
                routes to Cultgig&apos;s support queue with email confirmation.
              </p>
              {existingTicket && (
                <p className="type-caption text-ink-muted">
                  Issue: {existingTicket.issueType} · Logged {formatReadableDate(existingTicket.createdAt)}
                </p>
              )}
              <Button size="sm" variant="outline" onClick={() => setCreatedId(null)}>
                Submit another inquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sup-name" className="block type-label text-ink-primary mb-1.5">
                    Your name *
                  </label>
                  <input
                    id="sup-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[14px]"
                  />
                </div>
                <div>
                  <label htmlFor="sup-email" className="block type-label text-ink-primary mb-1.5">
                    Email address *
                  </label>
                  <input
                    id="sup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[14px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sup-type" className="block type-label text-ink-primary mb-1.5">
                    Issue type
                  </label>
                  <select
                    id="sup-type"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value as typeof issueType)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[14px]"
                  >
                    <option value="account_help">Account & onboarding help</option>
                    <option value="booking_issue">Booking or proposal dispute</option>
                    <option value="cancellation_refund">Cancellation / refund request</option>
                    <option value="artist_safety">Safety or copyright report</option>
                    <option value="partnership">Venue / brand partnership</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="sup-ref" className="block type-label text-ink-primary mb-1.5">
                    Booking reference ID (optional)
                  </label>
                  <input
                    id="sup-ref"
                    type="text"
                    value={bookingReference}
                    onChange={(e) => setBookingReference(e.target.value)}
                    placeholder="e.g., sample-booking-1"
                    className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[14px]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sup-msg" className="block type-label text-ink-primary mb-1.5">
                  Details *
                </label>
                <textarea
                  id="sup-msg"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-md border border-line bg-canvas text-[14px]"
                />
              </div>

              {error && (
                <p role="alert" className="type-body-sm text-semantic-error">
                  {error}
                </p>
              )}

              <Button type="submit">Submit support inquiry</Button>
            </form>
          )}
        </section>

        <aside className="lg:col-span-5 space-y-4">
          <div className="bg-surface border border-line rounded-xl p-6 space-y-3">
            <h2 className="type-h3 text-ink-primary">Operator & grievance details</h2>
            <dl className="space-y-2 type-body-sm">
              <div>
                <dt className="text-ink-muted">Legal entity</dt>
                <dd className="text-ink-primary font-medium">{siteConfig.legalEntityName}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Entity form</dt>
                <dd className="text-ink-primary">{siteConfig.entityType}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Principal address</dt>
                <dd className="text-ink-primary">{siteConfig.registeredAddress}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Support email</dt>
                <dd className="text-ink-primary">
                  {siteConfig.supportEmail ? (
                    <a
                      href={`mailto:${siteConfig.supportEmail}`}
                      className="text-plum hover:underline inline-flex items-center gap-1"
                    >
                      <Mail size={14} aria-hidden="true" />
                      {siteConfig.supportEmail}
                    </a>
                  ) : (
                    "Pending configuration (VITE_SUPPORT_EMAIL)"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">Grievance officer</dt>
                <dd className="text-ink-primary">
                  {siteConfig.grievanceOfficerName}
                  {siteConfig.grievanceOfficerEmail ? ` · ${siteConfig.grievanceOfficerEmail}` : ""}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  );
}

type LegalKind =
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
        <p className="type-caption text-plum font-semibold">
          Cultgig Legal · Updated {siteConfig.policiesLastUpdated}
        </p>
        <h1 className="text-[28px] sm:text-[36px] leading-[1.2] font-bold text-ink-primary">
          {doc.title}
        </h1>
        <p className="type-body-lg text-ink-secondary">{doc.summary}</p>
      </header>

      <div className="space-y-6">
        {doc.sections.map((section) => (
          <section key={section.heading} className="space-y-2.5">
            <h2 className="type-h2 text-ink-primary">{section.heading}</h2>
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

export function CheckoutPage({ bookingId }: { bookingId: string }) {
  usePageMeta("Booking checkout readiness", "Review service deliverables and gateway readiness.");
  const { bookings } = useMarketplace();
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <main id="main-content" className="max-w-[780px] mx-auto px-4 py-14 space-y-4">
        <h1 className="type-h1">Booking not found</h1>
        <Link to="/client/bookings" className="type-label text-plum">
          Back to bookings
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="max-w-[840px] mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-6">
      <div className="space-y-1">
        <p className="type-caption text-plum font-semibold">Booking reference: {booking.id}</p>
        <h1 className="text-[28px] font-bold text-ink-primary">
          Booking confirmation & payment readiness
        </h1>
      </div>

      <NoticeBanner tone="warning" title="Live payment checkout gated on provider approval">
        Cultgig does NOT process artist marketplace bookings through Dodo Payments (excluded under
        Dodo&apos;s Merchant Acceptance Policy for manual human services and multi-vendor
        marketplaces). Live INR split checkout via <strong>Razorpay Route</strong> or{" "}
        <strong>Cashfree Easy Split</strong> will activate only after entity registration, KYC, and
        written provider approval.
      </NoticeBanner>

      <section className="bg-surface border border-line rounded-xl p-6 space-y-4">
        <h2 className="type-h2 text-ink-primary">What this booking pays for</h2>
        <p className="type-body text-ink-secondary">
          You are reviewing payment for the specific artist service and deliverables agreed in{" "}
          <strong>Proposal v{booking.acceptedProposalVersion}</strong> (not a vague membership):
        </p>

        <div className="bg-canvas border border-line rounded-lg p-4 space-y-2 type-body-sm">
          <p>
            <strong>Event & service:</strong> {booking.gigTitle}
          </p>
          <p>
            <strong>Artist:</strong> {booking.artistName}
          </p>
          <p>
            <strong>Event date & city:</strong> {formatReadableDate(booking.eventDate)} ·{" "}
            {booking.city}
          </p>
          <p>
            <strong>Agreed deliverables:</strong> {booking.serviceSummary}
          </p>
        </div>

        <div className="border-t border-line pt-4 space-y-2 type-body tabular-nums">
          <div className="flex justify-between">
            <span className="text-ink-secondary">Agreed artist service amount</span>
            <span className="font-semibold text-ink-primary">
              {formatPaiseToInr(booking.grossAmountPaise)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-secondary">Platform fee (preview)</span>
            <span className="text-ink-primary">
              {booking.platformFeePaise === 0
                ? "₹0 (Launch commercial terms pending)"
                : formatPaiseToInr(booking.platformFeePaise)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-line-light type-h3">
            <span>Total payable (once gateway live)</span>
            <span className="text-plum">{formatPaiseToInr(booking.grossAmountPaise)}</span>
          </div>
        </div>

        <div className="pt-3 flex flex-wrap gap-3">
          <Button disabled>Pay online (Awaiting Razorpay Route / Cashfree approval)</Button>
          <Link
            to={`/client/bookings/${booking.id}`}
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-md border border-line-strong text-ink-primary type-label"
          >
            Back to booking details
          </Link>
        </div>
      </section>
    </main>
  );
}

export function PaymentStatusPage({ status }: { status: "success" | "failed" | "pending" }) {
  usePageMeta(`Payment ${status}`, "Booking payment status.");

  const config = {
    success: {
      title: "Payment confirmation verified",
      copy: "In live production, bookings only confirm after server-side webhook signature verification—never solely from a browser redirect.",
      Icon: CheckCircle2,
      tone: "text-semantic-success",
    },
    failed: {
      title: "Payment did not complete",
      copy: "No funds were captured, or the provider returned a failure status. You can retry once approved checkout is active.",
      Icon: AlertTriangle,
      tone: "text-semantic-error",
    },
    pending: {
      title: "Payment verification pending",
      copy: "Waiting for asynchronous webhook confirmation from the payment gateway.",
      Icon: Clock,
      tone: "text-semantic-warning",
    },
  }[status];

  const Icon = config.Icon;

  return (
    <main id="main-content" className="max-w-[640px] mx-auto px-4 py-14 space-y-5 text-center">
      <Icon size={40} className={`mx-auto ${config.tone}`} aria-hidden="true" />
      <h1 className="type-h1 text-ink-primary">{config.title}</h1>
      <p className="type-body text-ink-secondary">{config.copy}</p>
      <div className="flex justify-center gap-3 pt-2">
        <Link
          to="/client/bookings"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-plum text-white type-button"
        >
          View bookings
        </Link>
        <Link
          to="/support"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md border border-line-strong text-ink-primary type-button"
        >
          Contact support
        </Link>
      </div>
    </main>
  );
}

export function NotFoundPage() {
  usePageMeta("Page not found", "The requested Cultgig page could not be found.");
  return (
    <main id="main-content" className="max-w-[640px] mx-auto px-4 py-20 text-center space-y-4">
      <ShieldAlert size={36} className="mx-auto text-plum" aria-hidden="true" />
      <h1 className="type-h1 text-ink-primary">This page could not be found</h1>
      <p className="type-body text-ink-secondary">
        Check the web address or explore creative categories and artist profiles on Cultgig.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-plum text-white type-button"
        >
          Return home
        </Link>
        <Link
          to="/explore"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md border border-line-strong text-ink-primary type-button"
        >
          Explore artists
        </Link>
      </div>
    </main>
  );
}
