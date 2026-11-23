import { imageManifest } from "../content/images";

export interface EditorialGuide {
  slug: string;
  title: string;
  categoryLabel: string;
  readTime: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  sections: { heading: string; body: string[] }[];
}

export const editorialGuides: EditorialGuide[] = [
  {
    slug: "writing-a-clear-event-brief",
    title: "How to write an event brief artists actually want to answer",
    categoryLabel: "For event hosts",
    readTime: "4 min read",
    summary: "Save days of back-and-forth by sharing timing, room atmosphere, technical setup, and realistic budget range upfront.",
    imageUrl: imageManifest.guideCreativeBrief.src,
    imageAlt: imageManifest.guideCreativeBrief.alt,
    sections: [
      {
        heading: "Start with the room, not just the date",
        body: [
          "Artists adjust their performance, pacing, and equipment based on the venue. An acoustic duet for 45 dinner guests on a terrace requires a different setup than a 300-guest sangeet courtyard.",
          "Include the city, neighbourhood, approximate guest count, indoor or outdoor setting, and whether the timing is fixed or flexible.",
        ],
      },
      {
        heading: "Clarify logistics and sound early",
        body: [
          "State clearly whether the venue has a PA system, stage lighting, green room access, or power points. If an artist needs to bring their own sound equipment or travel outside their city, call that out in the brief so quotes reflect real costs.",
        ],
      },
      {
        heading: "State your budget approach honestly",
        body: [
          "Whether you have a fixed budget, a target range, or are open to structured quotes, transparency prevents wasted conversations and helps artists submit accurate proposals.",
        ],
      },
    ],
  },
  {
    slug: "building-an-artist-portfolio",
    title: "Presenting your craft without relying on follower vanity metrics",
    categoryLabel: "For artists",
    readTime: "5 min read",
    summary: "What hosts, venues, and brands look for when comparing real creative work before sending an inquiry.",
    imageUrl: imageManifest.categoryMusicians.src,
    imageAlt: imageManifest.categoryMusicians.alt,
    sections: [
      {
        heading: "Lead with raw, unedited samples of live work",
        body: [
          "Hosts booking live performers, mehendi artists, or photographers want to see what you actually deliver in real event lighting, not only heavily filtered studio reels.",
          "Include two or three clear audio/video clips or high-resolution photos with short context captions: event type, setting, and your exact role.",
        ],
      },
      {
        heading: "Define clear starting packages and exclusions",
        body: [
          "Listing a starting price or package structure (such as a 90-minute acoustic set or bridal mehendi for both hands and arms) helps hosts benchmark fit immediately. Always spell out what is excluded (e.g., outstation travel, PA rental, extra hours).",
        ],
      },
    ],
  },
  {
    slug: "how-versioned-offers-protect-both-sides",
    title: "Why structured offers beat informal WhatsApp agreements",
    categoryLabel: "Booking clarity",
    readTime: "4 min read",
    summary: "How capturing scope, deliverables, travel costs, and cancellation terms in versioned proposals prevents misunderstandings.",
    imageUrl: imageManifest.categoryDecorators.src,
    imageAlt: imageManifest.categoryDecorators.alt,
    sections: [
      {
        heading: "Every change becomes a clear new version",
        body: [
          "In creative bookings, scope often evolves: an extra hour of photography, an added sangeet rehearsal, or outstation travel. Instead of burying updates inside dozens of chat messages, versioned proposals keep one shared summary of price, timing, and inclusions.",
        ],
      },
      {
        heading: "Mutual acceptance before payment",
        body: [
          "Neither side should feel surprised on event day. A booking only advances when both the host and the artist explicitly confirm the same offer version and cancellation terms.",
        ],
      },
    ],
  },
  {
    slug: "preparing-for-sangeet-and-wedding-bookings",
    title: "Planning multi-day celebration talent: timing, trials & coordination",
    categoryLabel: "Event planning",
    readTime: "5 min read",
    summary: "Practical timelines for coordinating mehendi artists, saree drapers, makeup teams, and live performers smoothly.",
    imageUrl: imageManifest.categorySaree.src,
    imageAlt: imageManifest.categorySaree.alt,
    sections: [
      {
        heading: "Book heritage craft and styling slots around daylight",
        body: [
          "Mehendi application, bridal saree draping, and editorial portraits depend heavily on natural daylight and quiet dressing spaces. Lock in exact arrival windows and dedicated seating in your brief.",
        ],
      },
      {
        heading: "Allow soundcheck buffers between ceremonies",
        body: [
          "When live bands or emcees share a stage with dance performances, schedule a minimum 45-minute technical check prior to guest arrival.",
        ],
      },
    ],
  },
];
