import heroPerformance from "../assets/images/hero-performance.jpg";
import categoryMusicians from "../assets/images/category-musicians.jpg";
import categoryPhotographers from "../assets/images/category-photographers.jpg";
import categoryDecorators from "../assets/images/category-decorators.jpg";
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

import categoryMehendi from "../assets/images/category-mehendi.jpg";
import categoryMural from "../assets/images/category-mural.jpg";
import categorySaree from "../assets/images/category-saree.jpg";
import categoryDanceClassical from "../assets/images/category-dance-classical.jpg";
import heroWeddingDhol from "../assets/images/hero-wedding-dhol.jpg";
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
  heroWeddingDhol: {
    src: heroWeddingDhol,
    alt: "Dhol drummers performing under marigold décor at an Indian wedding celebration",
    source: "https://www.pexels.com/photo/people-dancing-with-drum-beats-4552397/",
    licenceBasis: "Pexels License (free commercial use, no attribution required)",
    acquiredAt: "2026-11-23",
    cropIntent: "hero",
  },
  heroPerformance: {
    src: heroPerformance,
    alt: "Performer on a lit stage in front of a cheering crowd",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "hero",
  },
  categoryMusicians: {
    src: categoryMusicians,
    alt: "Close-up of a vintage microphone under warm stage lights",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
    category: "Music & bands",
  },
  categoryPhotographers: {
    src: categoryPhotographers,
    alt: "Photographer holding a camera up against a bright sky",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
    category: "Photography & videography",
  },
  categoryDecorators: {
    src: categoryDecorators,
    alt: "Bride holding a bouquet of flowers in soft evening light",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
    category: "Decorators & florists",
  },
  categoryDanceClassical: {
    src: categoryDanceClassical,
    alt: "Indian classical dancer in a red and green costume performing on stage",
    source: "https://www.pexels.com/photo/a-woman-in-green-and-red-dress-smiling-14602476/",
    licenceBasis: "Pexels License (free commercial use, no attribution required)",
    acquiredAt: "2026-11-23",
    cropIntent: "landscape",
    category: "Dance & choreography",
  },
  categoryMehendi: {
    src: categoryMehendi,
    alt: "Bride's hands with intricate mehendi, red bangles and gold jewellery",
    source: "https://www.pexels.com/photo/34245192/",
    licenceBasis: "Pexels License (free commercial use, no attribution required)",
    acquiredAt: "2026-11-23",
    cropIntent: "landscape",
    category: "Mehendi artists",
  },
  categoryMural: {
    src: categoryMural,
    alt: "Artist painting a large mural on an outdoor wall",
    source: "https://www.pexels.com/photo/photo-of-woman-painting-on-wall-1340502/",
    licenceBasis: "Pexels License (free commercial use, no attribution required)",
    acquiredAt: "2026-11-23",
    cropIntent: "landscape",
    category: "Wall art & murals",
  },
  categorySaree: {
    src: categorySaree,
    alt: "Woman wearing a green and red silk saree with a draped pallu",
    source: "https://www.pexels.com/photo/woman-in-traditional-indian-saree-at-market-28943572/",
    licenceBasis: "Pexels License (free commercial use, no attribution required)",
    acquiredAt: "2026-11-23",
    cropIntent: "landscape",
    category: "Saree draping & styling",
  },
  categoryEmcee: {
    src: heroPerformance,
    alt: "Performer on a lit stage in front of a cheering crowd",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
    category: "Emcees & event hosts",
  },
  guideCreativeBrief: {
    src: guideCreativeBrief,
    alt: "Long banquet table set with glassware and flowers for an evening event",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
  },
  pageAbout: {
    src: pageAbout,
    alt: "Confetti falling over a concert crowd",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
  },
  pageStory: {
    src: pageStory,
    alt: "Close-up of a vintage microphone under warm stage lights",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
  },
  pageArtists: {
    src: pageArtists,
    alt: "Festival crowd under colourful stage lights and confetti",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
  },
  pageBusinesses: {
    src: pageBusinesses,
    alt: "Long banquet table set with glassware and flowers for an evening event",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
  },
  pageHowItWorks: {
    src: pageHowItWorks,
    alt: "DJ's hand on a mixing deck under purple light",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "landscape",
  },
  creatorRhea: {
    src: creatorRhea,
    alt: "Portrait of a woman in soft blue light",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "portrait",
  },
  creatorArjun: {
    src: creatorArjun,
    alt: "Portrait of a smiling man",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "portrait",
  },
  creatorMeera: {
    src: creatorMeera,
    alt: "Portrait of a smiling woman in a red top",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "portrait",
  },
  creatorNaina: {
    src: creatorNaina,
    alt: "Portrait of a smiling woman in a denim jacket",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "portrait",
  },
  creatorKabir: {
    src: creatorKabir,
    alt: "Portrait of a man in a grey sweater",
    source: "Cultgig repository asset",
    licenceBasis: "Owner-supplied repository asset",
    acquiredAt: "2026-08-19",
    cropIntent: "portrait",
  },
} satisfies Record<string, ImageAsset>;

export const heroImage = imageManifest.heroWeddingDhol;

export const categoryImages: Record<string, ImageAsset> = {
  musicians: imageManifest.categoryMusicians,
  photographers: imageManifest.categoryPhotographers,
  decorators: imageManifest.categoryDecorators,
  beautyDance: imageManifest.categoryDanceClassical,
  mehendi: imageManifest.categoryMehendi,
  mural: imageManifest.categoryMural,
  saree: imageManifest.categorySaree,
  emcee: imageManifest.categoryEmcee,
  /* Distinct photographs for the three music categories, so the category grid never repeats one. */
  bands: imageManifest.pageArtists,
  djs: imageManifest.pageHowItWorks,
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
