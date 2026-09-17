/**
 * Cultgig Homepage Content Data
 * 
 * Strict copywriting adherence:
 * - Sentence case everywhere
 * - No buzzwords ("seamless", "empowering", "revolutionary", "ecosystem")
 * - No fabricated user counts, ratings, or partner logos
 * - Authentic Indian creative context (sangeet, hotel events, café residencies, brand launches)
 * - Clear two-sided narrative: independent artists & businesses/curators
 */

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface CreativeMoment {
  id: string;
  title: string;
  setting: string;
  category: string;
  description: string;
  imageKey: string;
}

export const homepageContent = {
  hero: {
    badge: "Creative discovery in India",
    heading: "Where artists and events find each other with context.",
    lead: "Cultgig gives independent musicians, photographers, decorators, and stylists a place to show real work — and gives businesses a clear brief to start the conversation.",
    primaryCta: "Join as an artist",
    secondaryCta: "For businesses",
    clarityNote: "Free at launch · Phone-verified sign-up · Direct conversations",
    briefPreview: {
      tag: "Illustrative brief",
      title: "Weekend acoustic terrace residency",
      location: "Bandra West, Mumbai",
      format: "2-hour sunset set · Warm contemporary sound",
    }
  },

  tension: {
    badge: "The gap today",
    heading: "Creative booking is broken on both sides.",
    lead: "Today, connecting an artist to a real event relies on forwarded phone numbers, messy DMs, and zero creative context.",
    sides: [
      {
        role: "The artist's reality",
        quote: "You spend years perfecting your acoustic set or visual craft. Then someone forwards your number to a WhatsApp group asking: 'Can you play Saturday? Rate?' with no word on the room, crowd, or sound setup.",
        summary: "Artists are treated like commodity rate cards rather than creative professionals with a distinct style.",
      },
      {
        role: "The business reality",
        quote: "You are hosting a boutique hotel evening or an intimate wedding dinner. You want talent whose style genuinely fits the room, but your search is limited to whoever a friend happens to remember.",
        summary: "Organizers waste days chasing dead-end recommendations and scrolling social media without knowing availability or fit.",
      }
    ]
  },

  concept: {
    badge: "The Cultgig bridge",
    heading: "Three steps from an idea to a confirmed booking.",
    lead: "We replace scattered forwards with a structured, respectful introduction.",
    steps: [
      {
        number: "01",
        title: "See the work first",
        description: "Explore focused portfolios with real performance clips, photography samples, and style notes — not follower vanity metrics.",
      },
      {
        number: "02",
        title: "Understand the brief",
        description: "Every opportunity includes the date, venue atmosphere, timing, and sound requirements so expectations are aligned upfront.",
      },
      {
        number: "03",
        title: "Start a direct conversation",
        description: "Connect directly with complete context in hand. Discuss details, logistics, and arrangements without middleman friction.",
      }
    ] as StepItem[]
  },

  marketplaceShowcase: {
    badge: "The product in practice",
    heading: "What a thoughtful booking looks like.",
    lead: "Here is how a real requirement and a creative profile meet on Cultgig. These examples illustrate the upcoming product experience.",
    opportunity: {
      badge: "Illustrative event brief",
      category: "Musicians & live performers",
      title: "Weekend acoustic evening for terrace dining",
      venue: "Boutique hospitality space · Bandra West, Mumbai",
      timing: "Saturday, 7:00 PM – 9:30 PM",
      scope: "Looking for an acoustic duo or solo vocalist capable of building a warm, contemporary ambiance. In-house PA and basic monitor provided.",
      statusList: [
        "Event date and format defined",
        "Acoustic and sound specs clear",
        "Direct dialogue with the venue curator"
      ]
    },
    artist: {
      badge: "Illustrative artist profile",
      name: "Rhea Kapoor",
      craft: "Vocalist · Acoustic performer",
      city: "Mumbai",
      bio: "Crafting intimate acoustic sets and soulful renditions for hospitality evenings, cultural gatherings, and celebrations.",
      tags: ["Soul & Indie", "Acoustic Duo", "English & Hindi"],
      sampleTitle: "Live sunset session at Carter Road",
    }
  },

  artistStory: {
    badge: "For independent artists",
    heading: "A portfolio that speaks before a rate card.",
    lead: "Your work deserves better than a brief comment asking 'What is your price?' Cultgig lets you show your style, repertoire, equipment needs, and past performances so hosts approach you with genuine appreciation for your craft.",
    points: [
      "Present audio, video, and high-resolution visual proof in one clean profile.",
      "Receive inquiries that already include the date, vibe, and format.",
      "Keep full control over your calendar, rates, and artistic choices.",
      "Build a verified reputation backed by genuine post-event reviews."
    ],
    cta: "Join as an artist"
  },

  businessStory: {
    badge: "For venues, brands & hosts",
    heading: "Find talent that elevates your experience.",
    lead: "Whether you run a café residency, coordinate a brand launch, or plan a family sangeet, Cultgig helps you discover creative professionals whose aesthetic already aligns with your vision.",
    points: [
      "Filter by specific creative category, city, and performance style.",
      "Review actual recordings and portfolios rather than forwarded contacts.",
      "Send a clear brief once instead of repeating details across multiple phone calls.",
      "Work directly with verified professionals who take their craft seriously."
    ],
    cta: "Explore for businesses"
  },

  moments: {
    badge: "Real creative moments",
    heading: "Built for the cultural occasions that bring India together.",
    lead: "From intimate café sessions to multi-day celebrations, discover how different spaces and occasions connect with creative talent.",
    list: [
      {
        id: "shaadi",
        title: "Sangeet & intimate celebrations",
        setting: "Heritage courtyard, Jaipur",
        category: "Live musicians & choreographers",
        description: "Folk-fusion singers, acoustic sets, and choreographers crafting unforgettable family memories.",
        imageKey: "decorators"
      },
      {
        id: "hospitality",
        title: "Hotel cultural evenings",
        setting: "Rooftop lounge, Bengaluru",
        category: "Jazz trios & instrumentalists",
        description: "Curated soundscapes that turn dinner into an immersive sensory experience.",
        imageKey: "musicians"
      },
      {
        id: "cafe",
        title: "Café weekend residencies",
        setting: "Neighbourhood bistro, Mumbai",
        category: "Acoustic songwriters & poets",
        description: "Intimate afternoon acoustic sets that build regular community audiences.",
        imageKey: "beautyDance"
      },
      {
        id: "brand",
        title: "Brand launches & editorial shoots",
        setting: "Creative studio, New Delhi",
        category: "Photographers & makeup artists",
        description: "Visual storytellers capturing authentic aesthetic narratives for modern brands.",
        imageKey: "photographers"
      }
    ]
  },

  howItWorks: {
    badge: "How it works",
    heading: "A simple, parallel path for both sides.",
    lead: "No complicated commission models or opaque algorithms. Just a clear sequence from requirement to soundcheck.",
    artistTrack: {
      title: "For artists",
      subtitle: "Showcase your craft and receive qualified inquiries.",
      steps: [
        {
          number: "01",
          title: "Build your verified profile",
          description: "Upload your performance reels, portfolio galleries, city availability, and sound requirements."
        },
        {
          number: "02",
          title: "Review incoming event briefs",
          description: "See the date, location, atmosphere, and format upfront before deciding to respond."
        },
        {
          number: "03",
          title: "Direct confirmation & prep",
          description: "Message directly with the host to finalize logistics, setlists, and schedule soundcheck."
        }
      ]
    },
    businessTrack: {
      title: "For businesses & hosts",
      subtitle: "Find the right creative partner with total clarity.",
      steps: [
        {
          number: "01",
          title: "Describe your occasion",
          description: "Specify the timing, venue ambiance, sound setup, and the creative mood you are looking for."
        },
        {
          number: "02",
          title: "Explore relevant artists",
          description: "Browse portfolios with real audio and visual samples tailored to your event category."
        },
        {
          number: "03",
          title: "Connect directly",
          description: "Start a conversation with all brief details attached, ensuring a smooth collaboration."
        }
      ]
    }
  },

  trust: {
    badge: "Trust through transparency",
    heading: "Honest foundations. No fabricated metrics.",
    lead: "We do not manufacture fake review counts or claim thousands of phantom bookings. Trust on Cultgig is earned through practical product safeguards.",
    pillars: [
      {
        title: "Phone-verified sign-up",
        description: "Every artist and business account is verified via phone OTP before connecting, eliminating anonymous spam."
      },
      {
        title: "Proof before conversation",
        description: "Real portfolios, video excerpts, and photos are required so hosts can assess craft before reaching out."
      },
      {
        title: "Mutual post-event reviews",
        description: "Reviews can only be submitted after a verified booking takes place, ensuring authentic peer accountability."
      },
      {
        title: "Direct terms & free at launch",
        description: "No hidden middleman cuts during our early launch period. Conversations and negotiations remain transparent."
      }
    ]
  },

  scenario: {
    badge: "How a booking unfolds",
    heading: "A realistic timeline: from brief to soundcheck.",
    lead: "An illustrative walkthrough showing how a café manager and an acoustic musician connect smoothly without guesswork.",
    timeline: [
      {
        time: "Thursday · 11:00 AM",
        label: "Brief created",
        detail: "The café manager outlines a Saturday acoustic evening with timing, genre preference, and sound system details."
      },
      {
        time: "Thursday · 3:30 PM",
        label: "Direct discovery",
        detail: "The manager listens to Rhea's live acoustic performance clips and sees her style fits the room's mood."
      },
      {
        time: "Thursday · 6:00 PM",
        label: "Conversation starts",
        detail: "A direct message is sent with the complete brief already linked. No repeated questions about dates or format."
      },
      {
        time: "Friday · 10:00 AM",
        label: "Details confirmed",
        detail: "Rhea confirms her setlist and soundcheck timing. Both sides have complete mutual clarity."
      },
      {
        time: "Saturday · 6:30 PM",
        label: "Soundcheck & live set",
        detail: "Smooth arrival, soundcheck at 6:30 PM, and a full terrace enjoying live acoustic music at 7:00 PM."
      }
    ]
  },

  finalCta: {
    badge: "Join the early cohort",
    heading: "Be part of a better way to book creative work.",
    lead: "Whether you are an independent artist looking for quality gigs or a business searching for the right creative fit, join early access today.",
    artistButton: "Join as an artist",
    businessButton: "For businesses",
    note: "Early access members receive priority onboarding and direct profile review."
  }
} as const;
