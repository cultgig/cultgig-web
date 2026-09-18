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
    badge: "Creative discovery across India",
    heading: "The right creative person changes the whole feel of a moment.",
    lead: "Cultgig connects independent musicians, photographers, decorators, and performers with venues, brands, and celebrations looking for them across India. Real craft. Clear briefs. Direct conversations.",
    primaryCta: "Join as an artist",
    secondaryCta: "For businesses",
    clarityNote: "Free at launch · Phone-verified early access · Zero commission",
    briefPreview: {
      tag: "Event brief",
      title: "Sunset acoustic terrace set",
      location: "Bandra West, Mumbai",
      format: "2-hour sunset set · In-house PA provided",
    },
    artistPreview: {
      name: "Rhea Kapoor",
      role: "Acoustic Vocalist & Songwriter · Mumbai",
      status: "Open for weekend bookings",
    }
  },

  tension: {
    badge: "Why Cultgig exists",
    heading: "Creative booking is broken on both sides.",
    lead: "Today, connecting an artist to a real event relies on forwarded phone numbers, vague WhatsApp DMs, and zero creative context.",
    sides: [
      {
        role: "The artist's reality",
        quote: "You spend years perfecting your sound. Then someone forwards your number to a WhatsApp group asking: 'Can you play Saturday? Rate?' with zero word on the room, crowd, or sound setup.",
        summary: "Artists are treated like commodity rate cards instead of craftspeople with a distinct style.",
      },
      {
        role: "The business reality",
        quote: "You are hosting an intimate dinner or a rooftop launch. You need talent whose style fits the room, but your search is limited to whoever a friend happens to remember.",
        summary: "Curators waste days chasing dead-end recommendations without knowing fit or availability.",
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
        title: "See the craft first",
        description: "Explore focused portfolios with real audio clips, recorded acoustic sets, and photography samples — not follower vanity metrics.",
      },
      {
        number: "02",
        title: "Understand the brief",
        description: "Every opportunity includes the date, venue atmosphere, timing, and sound requirements so expectations are aligned upfront.",
      },
      {
        number: "03",
        title: "Start a direct conversation",
        description: "Connect directly with complete context in hand. Discuss details, logistics, and soundcheck without middleman friction.",
      }
    ] as StepItem[]
  },

  categories: {
    badge: "Explore creative categories",
    heading: "Craft that shapes Indian gatherings.",
    lead: "From intimate café sets to multi-day celebrations, discover independent talent across four core creative disciplines.",
    list: [
      {
        slug: "musicians-djs",
        key: "musicians",
        number: "01",
        title: "Musicians & DJs",
        description: "Acoustic soloists, indie bands, percussionists, and DJs for sundowners, receptions, and cultural evenings.",
        examples: "Acoustic sets · Sangeet music · Rooftop jazz · Indie folk",
      },
      {
        slug: "photo-video",
        key: "photographers",
        number: "02",
        title: "Photographers & Videographers",
        description: "Visual storytellers, candid wedding photographers, and cinematic filmmakers who capture authentic emotion.",
        examples: "Candid wedding · Brand editorial · Live concert · Portraiture",
      },
      {
        slug: "decor-event",
        key: "decorators",
        number: "03",
        title: "Decorators & Scenographers",
        description: "Creative event designers, floral stylists, and ambient lighting artists who transform spaces into memorable environments.",
        examples: "Terrace ambiance · Floral styling · Stage aesthetic · Intimate dinners",
      },
      {
        slug: "beauty-dance",
        key: "beautyDance",
        number: "04",
        title: "Makeup, Beauty & Dance",
        description: "Bridal and editorial makeup artists, hair stylists, and expressive classical or contemporary dancers.",
        examples: "Bridal styling · Contemporary dance · Editorial makeup · Cultural sets",
      },
    ]
  },

  marketplaceShowcase: {
    badge: "The product in practice",
    heading: "What a thoughtful introduction looks like.",
    lead: "Here is how a real requirement and a verified creative profile meet on Cultgig. These examples illustrate the upcoming product experience.",
    opportunity: {
      badge: "01 · The Event Brief",
      category: "Musicians & live performers",
      title: "Weekend acoustic evening for terrace dining",
      hostName: "Naina Mathur",
      hostRole: "Hospitality Curator · Bandra Boutique Hotel",
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
      badge: "02 · The Artist Profile",
      name: "Rhea Kapoor",
      craft: "Vocalist · Acoustic Performer",
      city: "Mumbai",
      bio: "Crafting intimate acoustic sets and soulful renditions for hospitality evenings, cultural gatherings, and celebrations.",
      tags: ["Soul & Indie", "Acoustic Duo", "English & Hindi"],
      sampleTitle: "Live sunset session at Carter Road (2:45 min audio)",
    },
    conversation: {
      badge: "03 · The Direct Conversation",
      title: "First message with full context attached",
      messages: [
        {
          sender: "Naina Mathur",
          role: "Venue Curator",
          time: "Thursday 6:12 PM",
          text: "Hi Rhea, loved your Carter Road acoustic set. We're hosting 60 guests for an intimate sunset terrace dinner this Saturday — your sound fits the room's mood perfectly."
        },
        {
          sender: "Rhea Kapoor",
          role: "Artist",
          time: "Thursday 6:28 PM",
          text: "Thank you Naina! A warm 2-hour set sounds ideal for that crowd. I'll bring my acoustic guitar and vocal mic for the 6:30 PM soundcheck."
        }
      ]
    }
  },

  whoItsFor: {
    badge: "Two sides. One shared standard.",
    heading: "Built with quiet respect for the people behind the work.",
    lead: "Whether you create the art or curate the room, Cultgig gives you the clarity you have been missing.",
    artist: {
      badge: "For independent artists",
      heading: "A portfolio that speaks before a rate card.",
      personName: "Meera Joshi",
      personRole: "Visual Storyteller & Photographer · New Delhi",
      lead: "Your work deserves better than a cold comment asking 'What is your price?' Cultgig lets you show your style, repertoire, equipment needs, and past performances so hosts approach you with genuine appreciation for your craft.",
      points: [
        "Present audio, video, and high-resolution visual proof in one clean profile.",
        "Receive inquiries that already include the date, vibe, format, and sound setup.",
        "Keep full control over your calendar, rates, and artistic choices.",
        "Build a verified reputation backed by genuine post-event reviews."
      ],
      cta: "Join as an artist"
    },
    business: {
      badge: "For venues, brands & hosts",
      heading: "Find talent that genuinely elevates your experience.",
      personName: "Arjun Varma",
      personRole: "Hospitality Curator & Event Lead · Mumbai",
      lead: "Whether you run a café residency, coordinate a brand launch, or plan an intimate celebration, Cultgig helps you discover creative professionals whose aesthetic already aligns with your vision.",
      points: [
        "Filter by specific creative category, city, and performance style.",
        "Review actual recordings and portfolios rather than forwarded phone contacts.",
        "Send your brief once instead of repeating details across ten phone calls.",
        "Work directly with verified professionals who take their craft seriously."
      ],
      cta: "For businesses"
    }
  },

  artistStory: {
    badge: "For independent artists",
    heading: "A portfolio that speaks before a rate card.",
    personName: "Meera Joshi",
    personRole: "Visual Storyteller & Photographer · New Delhi",
    lead: "Your work deserves better than a cold comment asking 'What is your price?' Cultgig lets you show your style, repertoire, equipment needs, and past performances so hosts approach you with genuine appreciation for your craft.",
    points: [
      "Present audio, video, and high-resolution visual proof in one clean profile.",
      "Receive inquiries that already include the date, vibe, format, and sound setup.",
      "Keep full control over your calendar, rates, and artistic choices.",
      "Build a verified reputation backed by genuine post-event reviews."
    ],
    cta: "Join as an artist"
  },

  businessStory: {
    badge: "For venues, brands & hosts",
    heading: "Find talent that genuinely elevates your experience.",
    personName: "Arjun Varma",
    personRole: "Hospitality Curator & Event Lead · Mumbai",
    lead: "Whether you run a café residency, coordinate a brand launch, or plan an intimate celebration, Cultgig helps you discover creative professionals whose aesthetic already aligns with your vision.",
    points: [
      "Filter by specific creative category, city, and performance style.",
      "Review actual recordings and portfolios rather than forwarded phone contacts.",
      "Send your brief once instead of repeating details across ten phone calls.",
      "Work directly with verified professionals who take their craft seriously."
    ],
    cta: "For businesses"
  },

  howItWorks: {
    badge: "Two simple pathways",
    heading: "How Cultgig works for both sides.",
    lead: "Whether you create the craft or curate the room, the process is clear and direct.",
    artistTrack: {
      title: "For independent artists",
      subtitle: "From creating your profile to arriving at soundcheck",
      steps: [
        { number: "01", title: "Build your craft profile", description: "Upload audio, video clips, and high-resolution photo proof of your live performances." },
        { number: "02", title: "Review incoming briefs", description: "Receive direct booking requests with clear date, venue, timing, and sound requirements." },
        { number: "03", title: "Confirm & soundcheck", description: "Agree on details directly with the host and arrive ready for a great performance." }
      ]
    },
    businessTrack: {
      title: "For venues, brands & hosts",
      subtitle: "From creative requirement to a memorable gathering",
      steps: [
        { number: "01", title: "Post a focused brief", description: "Describe the vibe, date, timing, and sound setup you need for your space or event." },
        { number: "02", title: "Explore verified portfolios", description: "Listen to real recordings and review past performances of verified talent." },
        { number: "03", title: "Direct introduction", description: "Connect directly with complete context in hand without middleman friction." }
      ]
    }
  },

  moments: {
    badge: "Real creative moments",
    heading: "Built for the cultural occasions that bring India together.",
    lead: "From intimate café sessions to multi-day celebrations, creative craft is woven into how India celebrates, gathers, and connects.",
    list: [
      {
        id: "shaadi",
        title: "Sangeet & courtyard celebrations",
        setting: "Heritage courtyard, Jaipur",
        category: "Live musicians & choreographers",
        description: "Folk-fusion singers, acoustic sets, and choreographers crafting unforgettable family memories.",
        imageKey: "decorators"
      },
      {
        id: "hospitality",
        title: "Hotel cultural evenings & sundowners",
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

  finalCta: {
    badge: "Join the early cohort",
    heading: "Good creative work deserves the right room.",
    lead: "Whether you want to be found for your craft or find the right person for your moment, join Cultgig early access today.",
    artistButton: "Join as an artist",
    businessButton: "For businesses",
    note: "Phone-verified early access · Free at launch · Priority profile onboarding"
  }
} as const;
