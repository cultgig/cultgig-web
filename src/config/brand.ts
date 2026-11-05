export interface BrandConfig {
  name: string;
  tagline: string;
  heroHeadline: string;
  heroParagraph: string;
  logo: {
    green: string;
    white: string;
    alt: string;
  };
  appStoreBadges: {
    googlePlay: {
      image: string;
      url: string;
      alt: string;
    };
    appStore: {
      image: string;
      url: string;
      alt: string;
    };
  };
  requestLocalityUrl: string;
  rating: {
    score: number;
    totalRatings: string;
  };
  heroChip: string;
  emails: {
    support: string;
    careers: string;
    press: string;
  };
  socials: {
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  linkMode: "placeholder" | "external";
  copyrightYear: number;
}

export const brandConfig: BrandConfig = {
  name: "Pronto",
  tagline: "Trusted house help in minutes!",
  heroHeadline: "Trusted house help in minutes!",
  heroParagraph: "Your home, professionally cleaned - exactly when you need it.",
  logo: {
    green: "/assets/brand/logo-green.svg",
    white: "/assets/brand/logo-white.svg",
    alt: "Pronto Logo",
  },
  appStoreBadges: {
    googlePlay: {
      image: "/assets/brand/badge-google-play.png",
      url: "https://play.google.com/store/apps/details?id=com.company.pronto&hl=en_IN",
      alt: "Get it on Google Play",
    },
    appStore: {
      image: "/assets/brand/badge-app-store.png",
      url: "https://apps.apple.com/in/app/pronto-house-help-in-minutes/id6743402816",
      alt: "Download on the App Store",
    },
  },
  requestLocalityUrl: "https://tally.so/r/rjRabo",
  rating: {
    score: 4.5,
    totalRatings: "42,700+",
  },
  heroChip: "Trusted by 500,000+ homes · 11 cities live",
  emails: {
    support: "help@withpronto.com",
    careers: "careers@withpronto.com",
    press: "press@withpronto.com",
  },
  socials: {
    instagram: "https://www.instagram.com/withpronto/",
    linkedin: "https://www.linkedin.com/company/withpronto",
    youtube: "https://www.youtube.com/@with_pronto",
  },
  linkMode: "placeholder",
  copyrightYear: 2026,
};
