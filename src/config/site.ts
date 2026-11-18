function safeHttpsUrl(value: string | undefined) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function safeEmail(value: string | undefined) {
  return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : "";
}

const legalEntityName = import.meta.env.VITE_LEGAL_ENTITY_NAME || "";
const entityType = import.meta.env.VITE_ENTITY_TYPE || "";
const registeredAddress = import.meta.env.VITE_REGISTERED_ADDRESS || "";
const supportEmail = safeEmail(import.meta.env.VITE_SUPPORT_EMAIL);
const supportPhone = import.meta.env.VITE_SUPPORT_PHONE || "";
const grievanceOfficerName = import.meta.env.VITE_GRIEVANCE_OFFICER_NAME || "";
const grievanceOfficerEmail = safeEmail(import.meta.env.VITE_GRIEVANCE_OFFICER_EMAIL);
const cinOrLlpin = import.meta.env.VITE_CIN_LLPIN || "";
const gstin = import.meta.env.VITE_GSTIN || "";

export const siteConfig = {
  name: "Cultgig",
  tagline: "Find the artists who make the moment.",
  country: "India",
  currency: "INR",
  supportEmail,
  supportPhone,
  legalEntityName: legalEntityName || "Cultgig (Legal entity pending confirmation)",
  entityType: entityType || "Pending confirmation",
  registeredAddress: registeredAddress || "Principal address pending owner confirmation",
  grievanceOfficerName: grievanceOfficerName || "Pending appointment",
  grievanceOfficerEmail: grievanceOfficerEmail || supportEmail,
  cinOrLlpin,
  gstin,
  policiesLastUpdated: "2026-11-17 (Draft — requires legal review)",
  isBusinessIdentityComplete: Boolean(
    legalEntityName && registeredAddress && supportEmail && grievanceOfficerEmail
  ),
  socialLinks: {
    instagram: safeHttpsUrl(import.meta.env.VITE_INSTAGRAM_URL),
    linkedin: safeHttpsUrl(import.meta.env.VITE_LINKEDIN_URL),
    youtube: safeHttpsUrl(import.meta.env.VITE_YOUTUBE_URL),
  },
} as const;

export const pageDescriptions: Record<string, string> = {
  "Find the artists who make the moment":
    "Discover independent musicians, mehendi artists, photographers, decorators, dancers, and creative professionals across India.",
  "Explore artists & creative services":
    "Search and filter creative talent by category, city, pricing mode, and working style across India.",
  "Creative categories":
    "Browse 15 creative disciplines on Cultgig for celebrations, hospitality venues, and brand events.",
  "How Cultgig works":
    "Understand how event hosts and artists connect through structured briefs, portfolios, and versioned offers.",
  "For artists":
    "Showcase your craft, receive clear event briefs, and negotiate terms directly on Cultgig.",
  "For businesses & event hosts":
    "Discover independent artists, compare portfolios, post structured briefs, and manage bookings clearly.",
  "About Cultgig":
    "Learn why Cultgig is building a respectful, transparent marketplace for creative work in India.",
  "Pricing":
    "View Cultgig launch pricing status. No subscription or platform fee is charged through this preview.",
  "Guides":
    "Practical guides on writing creative briefs, artist pricing, portfolio presentation, and fair booking terms.",
  "Frequently asked questions":
    "Straight answers about Cultgig profiles, briefs, proposals, payments, and launch readiness.",
  "Contact & support":
    "Reach Cultgig support, raise an inquiry with a reference ID, or review grievance contact details.",
  "Trust & safety":
    "Learn how Cultgig approaches identity verification, portfolio ownership, fair cancellations, and safety.",
  "Privacy policy":
    "Read how Cultgig handles personal data, aligned with India's DPDP Act, 2023 (draft requiring legal review).",
  "Terms & conditions":
    "Read the platform terms governing Cultgig accounts, briefs, proposals, and bookings (draft requiring legal review).",
  "Refund & cancellation policy":
    "Understand how cancellations, rescheduling, no-shows, and refund workflows operate (draft requiring legal review).",
};
