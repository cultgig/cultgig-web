export interface NavItem {
  label: string;
  path: string;
}

export const headerNavigation: NavItem[] = [
  { label: "Explore", path: "/explore" },
  { label: "How it works", path: "/how-it-works" },
  { label: "For artists", path: "/for-artists" },
  { label: "For businesses", path: "/for-businesses" },
];

export interface FooterColumn {
  title: string;
  links: { label: string; path: string }[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Categories",
    links: [
      { label: "Music & bands", path: "/categories/music-and-bands" },
      { label: "Singers & vocalists", path: "/categories/singers-and-vocalists" },
      { label: "DJs & instrumentalists", path: "/categories/djs-and-instrumentalists" },
      { label: "Dance & choreography", path: "/categories/dance-and-choreography" },
      { label: "Photography & videography", path: "/categories/photography-and-videography" },
      { label: "Mehendi artists", path: "/categories/mehendi-artists" },
      { label: "Makeup & beauty", path: "/categories/makeup-and-beauty" },
      { label: "Saree draping & styling", path: "/categories/saree-draping-and-styling" },
      { label: "Decorators & florists", path: "/categories/decorators-and-florists" },
      { label: "View all categories", path: "/categories" },
    ],
  },
  {
    title: "For clients",
    links: [
      { label: "Explore artists", path: "/explore" },
      { label: "Post a gig", path: "/client/gigs/new" },
      { label: "For businesses & hosts", path: "/for-businesses" },
      { label: "How Cultgig works", path: "/how-it-works" },
      { label: "Planning guides", path: "/guides" },
      { label: "Client agreement", path: "/legal/client-agreement" },
    ],
  },
  {
    title: "For artists",
    links: [
      { label: "Join as an artist", path: "/for-artists" },
      { label: "Artist dashboard", path: "/artist/dashboard" },
      { label: "Browse open gigs", path: "/artist/opportunities" },
      { label: "Portfolio standards", path: "/guides/building-an-artist-portfolio" },
      { label: "Artist agreement", path: "/legal/artist-agreement" },
      { label: "Pricing & launch fees", path: "/pricing" },
    ],
  },
  {
    title: "Trust & legal",
    links: [
      { label: "Trust & safety", path: "/safety" },
      { label: "Terms & conditions", path: "/legal/terms" },
      { label: "Privacy policy", path: "/legal/privacy" },
      { label: "Refund policy", path: "/legal/refunds" },
      { label: "Cancellation policy", path: "/legal/cancellation" },
      { label: "Community guidelines", path: "/legal/community-guidelines" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Cultgig", path: "/about" },
      { label: "FAQ", path: "/faq" },
      { label: "Contact & support", path: "/contact" },
      { label: "Support centre", path: "/support" },
      { label: "Pricing", path: "/pricing" },
    ],
  },
];
