export interface FAQItemData {
  category: "General" | "For Artists" | "For Businesses" | "Payments & safety";
  question: string;
  answer: string;
}

export const detailedFaqList: FAQItemData[] = [
  { category: "General", question: "What is Cultgig?", answer: "Cultgig is a creative-services marketplace for India. Clients find independent artists, post gigs and agree terms in one place; artists show their work, apply to gigs and manage bookings." },
  { category: "General", question: "Can one account hire and offer services?", answer: "Yes. A single Cultgig account can use both the client and artist workspaces. Switch between them from the account menu. You only fill in the details each side needs." },
  { category: "General", question: "Which cities does Cultgig cover?", answer: "Artists list the city they're based in and the cities they travel to, so you can search anywhere in India. Remote services such as illustration or choreography videos work nationwide." },
  { category: "For Businesses", question: "How do I hire an artist?", answer: "Two ways. Contact an artist directly from their profile with your event details, or post a gig and let artists apply. Either way you agree the price and scope in a versioned offer before a booking is created." },
  { category: "For Businesses", question: "How does negotiation work?", answer: "Either side can send an offer with an amount, date, deliverables and cancellation terms. Every counter-offer becomes a new version. Nothing is overwritten, and a booking is created only when someone accepts an exact version." },
  { category: "For Businesses", question: "Can I compare applicants?", answer: "Yes. Open any gig in My gigs to shortlist applicants, compare quotes, experience, availability and scope side by side, and start a conversation with the artists you like." },
  { category: "For Artists", question: "How do I get discovered?", answer: "Complete your profile: services with clear pricing or quotation-based pricing, at least three portfolio items, your languages, travel cities and availability. Complete profiles appear in search and category pages." },
  { category: "For Artists", question: "Do I have to show a price?", answer: "No. You can show a starting price, a range, fixed packages, or mark a service as quotation-based. Many event services are best priced after you see the brief." },
  { category: "For Artists", question: "How do I apply to gigs?", answer: "Open Discover gigs in your artist workspace, filter by category, city and date, and apply with your quote, scope, availability confirmation and selected portfolio work. You can apply to each gig once." },
  { category: "Payments & safety", question: "Can I pay through Cultgig?", answer: "Not yet. Online checkout will open only after a marketplace payment provider (such as Razorpay Route or Cashfree Easy Split) approves Cultgig. Until then, bookings show that online payment isn't available, and Cultgig never marks a booking as paid without a verified payment." },
  { category: "Payments & safety", question: "Are reviews verified?", answer: "Only the client on a completed booking can review that artist, once per booking. Anyone can report a review for moderation." },
  { category: "Payments & safety", question: "How do I report a problem?", answer: "Use Report on a profile, gig or review, raise a dispute from a booking, block a user from a conversation, or contact support. A grievance officer is listed on the grievance redressal page." },
];

export const faqItems = detailedFaqList.map((item) => [item.question, item.answer]) as [string, string][];
