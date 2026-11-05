import { FooterColumn } from "../types";

export const footerColumns: FooterColumn[] = [
  {
    title: "SUPPORT",
    links: [
      { label: "Contact Us", href: "#contact" },
      { label: "Blog", href: "#blog" },
      { label: "Frequently Asked Questions", href: "#faqs" },
      { label: "Delete Account", href: "#delete-account" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "Become a Pronto Professional", href: "#pro" },
      { label: "Become a Pronto Buddy", href: "#buddy" },
      {
        label: "Request Pronto in your locality",
        href: "https://tally.so/r/rjRabo",
        isExternal: true,
      },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Terms & Conditions", href: "#terms" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Cancellation Policy", href: "#cancellation-policy" },
      { label: "Photo Credits", href: "#photo-credits" },
    ],
  },
  {
    title: "PRESS",
    links: [
      { label: "press@withpronto.com", href: "mailto:press@withpronto.com" },
      { label: "Press Kit", href: "#press-kit" },
    ],
  },
];
