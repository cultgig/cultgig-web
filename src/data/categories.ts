import { categoryImages } from "../content/images";
import type { CategorySlug } from "../types/marketplace";

export interface CreativeCategory {
  slug: CategorySlug;
  parentGroup: "Music & performance" | "Visual & heritage craft" | "Styling & beauty" | "Production & spaces";
  label: string;
  shortLabel: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  iconName:
    | "Music"
    | "Mic"
    | "Disc3"
    | "Sparkles"
    | "Camera"
    | "Flower2"
    | "Palette"
    | "Scissors"
    | "Brush"
    | "PaintBucket"
    | "UserCheck"
    | "ShieldCheck"
    | "Lamp"
    | "Radio"
    | "Layers";
  popular: boolean;
  active: boolean;
  complianceNote?: string;
}

export const creativeCategories: CreativeCategory[] = [
  {
    slug: "music-and-bands",
    parentGroup: "Music & performance",
    label: "Music & bands",
    shortLabel: "Music & bands",
    description: "Indie bands, acoustic duos, Sufi ensembles, and percussion groups for receptions and venues.",
    imageUrl: categoryImages.musicians.src,
    imageAlt: categoryImages.musicians.alt,
    iconName: "Music",
    popular: true,
    active: true,
  },
  {
    slug: "singers-and-vocalists",
    parentGroup: "Music & performance",
    label: "Singers & vocalists",
    shortLabel: "Vocalists",
    description: "Solo vocalists across contemporary indie, ghazal, classical, acoustic, and multilingual sets.",
    imageUrl: categoryImages.musicians.src,
    imageAlt: categoryImages.musicians.alt,
    iconName: "Mic",
    popular: true,
    active: true,
  },
  {
    slug: "djs-and-instrumentalists",
    parentGroup: "Music & performance",
    label: "DJs & instrumentalists",
    shortLabel: "DJs & soloists",
    description: "Saxophonists, flautists, sitar and tabla artists, and DJs for curated sundowners and events.",
    imageUrl: categoryImages.musicians.src,
    imageAlt: categoryImages.musicians.alt,
    iconName: "Disc3",
    popular: false,
    active: true,
  },
  {
    slug: "dance-and-choreography",
    parentGroup: "Music & performance",
    label: "Dance & choreography",
    shortLabel: "Dance",
    description: "Classical ensembles, contemporary troupes, folk dancers, and family sangeet choreographers.",
    imageUrl: categoryImages.beautyDance.src,
    imageAlt: categoryImages.beautyDance.alt,
    iconName: "Sparkles",
    popular: true,
    active: true,
  },
  {
    slug: "photography-and-videography",
    parentGroup: "Production & spaces",
    label: "Photography & videography",
    shortLabel: "Photo & video",
    description: "Candid celebration photographers, portrait specialists, and documentary event filmmakers.",
    imageUrl: categoryImages.photographers.src,
    imageAlt: categoryImages.photographers.alt,
    iconName: "Camera",
    popular: true,
    active: true,
  },
  {
    slug: "mehendi-artists",
    parentGroup: "Visual & heritage craft",
    label: "Mehendi artists",
    shortLabel: "Mehendi",
    description: "Traditional bridal mehendi, minimalist guest henna, and natural organic cone specialists.",
    imageUrl: categoryImages.mehendi.src,
    imageAlt: categoryImages.mehendi.alt,
    iconName: "Flower2",
    popular: true,
    active: true,
  },
  {
    slug: "makeup-and-beauty",
    parentGroup: "Styling & beauty",
    label: "Makeup & beauty",
    shortLabel: "Makeup",
    description: "Bridal, editorial, and subtle event makeup and hair styling professionals.",
    imageUrl: categoryImages.beautyDance.src,
    imageAlt: categoryImages.beautyDance.alt,
    iconName: "Palette",
    popular: true,
    active: true,
  },
  {
    slug: "saree-draping-and-styling",
    parentGroup: "Styling & beauty",
    label: "Saree draping & styling",
    shortLabel: "Saree draping",
    description: "Precision regional saree draping, pleating, and wardrobe styling for celebrations and shoots.",
    imageUrl: categoryImages.saree.src,
    imageAlt: categoryImages.saree.alt,
    iconName: "Scissors",
    popular: true,
    active: true,
  },
  {
    slug: "painters-and-illustrators",
    parentGroup: "Visual & heritage craft",
    label: "Painters & illustrators",
    shortLabel: "Painters",
    description: "Live event sketchers, guest portrait illustrators, and commissioned fine artists.",
    imageUrl: categoryImages.mural.src,
    imageAlt: categoryImages.mural.alt,
    iconName: "Brush",
    popular: false,
    active: true,
  },
  {
    slug: "wall-art-and-murals",
    parentGroup: "Visual & heritage craft",
    label: "Wall art & murals",
    shortLabel: "Murals",
    description: "Lawful, property-owner-commissioned wall murals for cafés, studios, homes, and offices.",
    imageUrl: categoryImages.mural.src,
    imageAlt: categoryImages.mural.alt,
    iconName: "PaintBucket",
    popular: true,
    active: true,
    complianceNote: "Only lawful, owner-commissioned mural projects are permitted.",
  },
  {
    slug: "models-and-fashion-talent",
    parentGroup: "Styling & beauty",
    label: "Models & fashion talent",
    shortLabel: "Models",
    description: "Editorial lookbook talent, runway models, and commercial campaign talent.",
    imageUrl: categoryImages.saree.src,
    imageAlt: categoryImages.saree.alt,
    iconName: "UserCheck",
    popular: false,
    active: true,
  },
  {
    slug: "tattoo-artists",
    parentGroup: "Visual & heritage craft",
    label: "Tattoo artists",
    shortLabel: "Tattoo studios",
    description: "Licensed, studio-grade tattoo professionals adhering to strict hygiene and age compliance.",
    imageUrl: categoryImages.mural.src,
    imageAlt: categoryImages.mural.alt,
    iconName: "ShieldCheck",
    popular: false,
    active: true,
    complianceNote: "Restricted to lawful, licensed, hygienic studio offerings for eligible adults.",
  },
  {
    slug: "decorators-and-florists",
    parentGroup: "Production & spaces",
    label: "Decorators & florists",
    shortLabel: "Decor & florals",
    description: "Bespoke floral stylists, mandap and courtyard scenographers, and ambient lighting designers.",
    imageUrl: categoryImages.decorators.src,
    imageAlt: categoryImages.decorators.alt,
    iconName: "Lamp",
    popular: true,
    active: true,
  },
  {
    slug: "emcees-and-event-hosts",
    parentGroup: "Music & performance",
    label: "Emcees & event hosts",
    shortLabel: "Emcees & hosts",
    description: "Multilingual stage hosts, cultural anchors, and panel moderators for seamless flow.",
    imageUrl: categoryImages.emcee.src,
    imageAlt: categoryImages.emcee.alt,
    iconName: "Radio",
    popular: true,
    active: true,
  },
  {
    slug: "other-creative-professionals",
    parentGroup: "Production & spaces",
    label: "Other creative professionals",
    shortLabel: "Other craft",
    description: "Calligraphers, spoken-word poets, sound engineers, and bespoke cultural practitioners.",
    imageUrl: categoryImages.decorators.src,
    imageAlt: categoryImages.decorators.alt,
    iconName: "Layers",
    popular: false,
    active: true,
  },
];

export const popularServiceShowcaseSlugs: CategorySlug[] = [
  "music-and-bands",
  "mehendi-artists",
  "photography-and-videography",
  "saree-draping-and-styling",
  "decorators-and-florists",
  "wall-art-and-murals",
  "dance-and-choreography",
  "emcees-and-event-hosts",
];

export const indianCities = [
  "Mumbai",
  "Bengaluru",
  "New Delhi",
  "Jaipur",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Goa",
  "Udaipur",
  "Ahmedabad",
  "Kochi",
] as const;

export function getCategoryBySlug(slug: string): CreativeCategory | undefined {
  return creativeCategories.find((c) => c.slug === slug);
}

export const getCategory = getCategoryBySlug;

export function categoryLabel(slug: string): string {
  return getCategoryBySlug(slug)?.label ?? "Creative services";
}

export const eventTypes = [
  "Wedding",
  "Sangeet",
  "Mehendi",
  "Engagement",
  "Birthday",
  "Corporate event",
  "Product launch",
  "Restaurant or café evening",
  "Hotel or venue programming",
  "Festival",
  "Private party",
  "Photo or video shoot",
  "Interior commission",
  "Other",
] as const;

export const commonLanguages = ["English", "Hindi", "Bengali", "Marathi", "Tamil", "Telugu", "Kannada", "Malayalam", "Gujarati", "Punjabi", "Urdu", "Odia", "Assamese"] as const;
