export interface FAQItemData { category: "General" | "For Artists" | "For Businesses"; question: string; answer: string; }
export const detailedFaqList: FAQItemData[] = [
  { category: "General", question: "What is Cultgig?", answer: "Cultgig is building a clearer, more human way for independent artists and businesses to discover each other with real context and verified portfolios." },
  { category: "General", question: "Who is Cultgig for?", answer: "For independent artists, performers, visual creators, hospitality venues, brands, and hosts planning cultural occasions in India." },
  { category: "For Artists", question: "How can artists join?", answer: "Join the early-access cohort through our website. We will share launch updates and priority onboarding as we prepare the initial launch." },
  { category: "For Businesses", question: "How can businesses join?", answer: "Select 'For businesses' or 'Get early access' and share a few details so we can understand your creative requirements and keep you updated." },
  { category: "General", question: "Can I book an artist through the website?", answer: "No. The website is currently an early-access preview and sign-up platform. The upcoming Cultgig application will provide the complete booking and messaging experience." },
  { category: "For Businesses", question: "Can I post an event brief right now?", answer: "Not yet on the website. Businesses can join early access to receive priority access when brief submissions and direct discovery go live." },
  { category: "General", question: "When is Cultgig launching?", answer: "We are onboarding our initial cohort of artists and event hosts across select Indian cities. Sign up to get early access." },
];
export const faqItems = detailedFaqList.map((item) => [item.question, item.answer]) as [string, string][];

