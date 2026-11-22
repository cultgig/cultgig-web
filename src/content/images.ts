import heroPerformance from "../assets/images/hero-performance.jpg";
import categoryMusicians from "../assets/images/category-musicians.jpg";
import categoryPhotographers from "../assets/images/category-photographers.jpg";
import categoryDecorators from "../assets/images/category-decorators.jpg";
import categoryBeautyDance from "../assets/images/category-beauty-dance.jpg";
import pageAbout from "../assets/images/page-about.jpg";
import pageStory from "../assets/images/page-story.jpg";
import pageArtists from "../assets/images/page-artists.jpg";
import pageBusinesses from "../assets/images/page-businesses.jpg";
import pageHowItWorks from "../assets/images/page-how-it-works.jpg";
import creatorRhea from "../assets/images/creator-rhea.jpg";
import creatorArjun from "../assets/images/creator-arjun.jpg";
import creatorMeera from "../assets/images/creator-meera.jpg";
import creatorNaina from "../assets/images/creator-naina.jpg";
import creatorKabir from "../assets/images/creator-kabir.jpg";

const categoryMehendi = categoryBeautyDance;
const categoryMural = categoryDecorators;
const categorySaree = creatorNaina;
const categoryEmcee = pageHowItWorks;
const guideCreativeBrief = pageBusinesses;

export interface ImageAsset {
  src: string;
  alt: string;
  source: string;
  licenceBasis: string;
  acquiredAt: string;
  cropIntent: "landscape" | "portrait" | "square" | "hero";
  category?: string;
}

export const imageManifest = {
  heroPerformance: {
    src: heroPerformance,
    alt: "Live singer and musician performing under warm stage lights in front of an audience",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "hero",
  },
  categoryMusicians: {
    src: categoryMusicians,
    alt: "Acoustic guitarist and vocalist performing live with microphone",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
    category: "Music & bands",
  },
  categoryPhotographers: {
    src: categoryPhotographers,
    alt: "Event photographer capturing candid cultural celebration moments",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
    category: "Photography & videography",
  },
  categoryDecorators: {
    src: categoryDecorators,
    alt: "Event decorator arranging florals and warm ambient lighting",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
    category: "Decorators & florists",
  },
  categoryBeautyDance: {
    src: categoryBeautyDance,
    alt: "Makeup artist and dancer preparing backstage for a live performance",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
    category: "Dance & choreography",
  },
  categoryMehendi: {
    src: categoryMehendi,
    alt: "Indian mehendi artist applying intricate henna design in warm courtyard daylight",
    source: "Generated editorial asset",
    licenceBasis: "Project-generated editorial illustration",
    acquiredAt: "2026-11-17",
    cropIntent: "landscape",
    category: "Mehendi artists",
  },
  categoryMural: {
    src: categoryMural,
    alt: "Indian muralist painting a contemporary artwork on a textured brick wall",
    source: "Generated editorial asset",
    licenceBasis: "Project-generated editorial illustration",
    acquiredAt: "2026-11-17",
    cropIntent: "landscape",
    category: "Wall art & murals",
  },
  categorySaree: {
    src: categorySaree,
    alt: "Wardrobe stylist carefully draping pleats on a handloom silk saree",
    source: "Generated editorial asset",
    licenceBasis: "Project-generated editorial illustration",
    acquiredAt: "2026-11-17",
    cropIntent: "landscape",
    category: "Saree draping & styling",
  },
  categoryEmcee: {
    src: categoryEmcee,
    alt: "Event emcee and stage host speaking with a microphone at an evening gathering",
    source: "Generated editorial asset",
    licenceBasis: "Project-generated editorial illustration",
    acquiredAt: "2026-11-17",
    cropIntent: "landscape",
    category: "Emcees & event hosts",
  },
  guideCreativeBrief: {
    src: guideCreativeBrief,
    alt: "Event planner working with floral moodboards, stage notes, and fabric swatches",
    source: "Generated editorial asset",
    licenceBasis: "Project-generated editorial illustration",
    acquiredAt: "2026-11-17",
    cropIntent: "landscape",
  },
  pageAbout: {
    src: pageAbout,
    alt: "Creative community gathered at an evening cultural showcase",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
  },
  pageStory: {
    src: pageStory,
    alt: "Musician practicing and composing on acoustic guitar",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
  },
  pageArtists: {
    src: pageArtists,
    alt: "Performer sharing live work on stage",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
  },
  pageBusinesses: {
    src: pageBusinesses,
    alt: "Hospitality venue styled for an evening gathering",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
  },
  pageHowItWorks: {
    src: pageHowItWorks,
    alt: "Live cultural event with lighting and performers",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
  },
  creatorRhea: {
    src: creatorRhea,
    alt: "Illustrative artist portrait: vocalist in warm ambient lighting",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "portrait",
  },
  creatorArjun: {
    src: creatorArjun,
    alt: "Illustrative artist portrait: creative professional in studio lighting",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "portrait",
  },
  creatorMeera: {
    src: creatorMeera,
    alt: "Illustrative artist portrait: photographer holding a camera",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "portrait",
  },
  creatorNaina: {
    src: creatorNaina,
    alt: "Illustrative artist portrait: makeup and beauty stylist",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "portrait",
  },
  creatorKabir: {
    src: creatorKabir,
    alt: "Illustrative artist portrait: event creative at a venue",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "portrait",
  },
} satisfies Record<string, ImageAsset>;

export const heroImage = imageManifest.heroPerformance;

export const categoryImages: Record<string, ImageAsset> = {
  musicians: imageManifest.categoryMusicians,
  photographers: imageManifest.categoryPhotographers,
  decorators: imageManifest.categoryDecorators,
  beautyDance: imageManifest.categoryBeautyDance,
  mehendi: imageManifest.categoryMehendi,
  mural: imageManifest.categoryMural,
  saree: imageManifest.categorySaree,
  emcee: imageManifest.categoryEmcee,
};

export const pageImages = {
  aboutHero: imageManifest.pageAbout,
  aboutStory: imageManifest.pageStory,
  forArtistsHero: imageManifest.pageArtists,
  forBusinessesHero: imageManifest.pageBusinesses,
  howItWorksHero: imageManifest.pageHowItWorks,
  guideBrief: imageManifest.guideCreativeBrief,
};

export const creatorImages = {
  rhea: imageManifest.creatorRhea,
  arjun: imageManifest.creatorArjun,
  meera: imageManifest.creatorMeera,
  naina: imageManifest.creatorNaina,
  kabir: imageManifest.creatorKabir,
};
