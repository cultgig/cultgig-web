export interface Service {
  id: string;
  name: string;
  slug: string;
  image: string;
  href: string;
  description?: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  isPopular?: boolean;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string | string[];
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatarLetter: string;
}

export interface Step {
  stepNumber: number;
  stepLabel: string;
  title: string;
  description: string;
  screens: string[];
}

export interface PressLogo {
  id: string;
  name: string;
  svgPath: string;
  alt: string;
  href?: string;
  width?: number;
  height?: number;
}

export interface StatItem {
  id: string;
  number: number;
  suffix: string;
  formattedDisplay: string;
  label: string;
  iconType: "home" | "clock" | "user";
}

export interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}
