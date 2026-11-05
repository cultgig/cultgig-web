# Pronto — Household Services Landing Page Recreation

A production-ready, pixel-faithful, responsive recreation of the Pronto household services landing page built with React 18, Vite, TypeScript, and Tailwind CSS.

## Architecture

- **Primary Visual Reference**: Built to faithfully match the composition, layout, color rhythm, typography, card structures, and visual assets of the live Pronto website.
- **Brand Centralization (`src/config/brand.ts`)**: All brand-specific configuration (brand name, logos, app store URLs, ratings, emails, social handles, links) is isolated in a single config file so the brand can be rebranded or swapped in one place.
- **Typed Datasets (`src/data/`)**:
  - `services.ts` — 20 household service offerings in exact catalogue order
  - `cities.ts` — 11 live Indian cities with popular badges
  - `stats.ts` — 3 key proof statistics (181,379+ Homes, 362,759+ Hours saved, 3,627+ Pros)
  - `steps.ts` — 3 How-It-Works steps with multi-screen phone frames
  - `testimonials.ts` — 8 verified customer reviews split across two marquee rows
  - `faqs.ts` — 21 collapsible FAQ accordions
  - `press.ts` — 7 featured publication logos
  - `footer.ts` — Support, Company, Legal, Press, All Services, and All Cities links
- **Typography**:
  - Headings, Big Numbers, and Card Titles: **League Spartan** (500, 600, 700, 800)
  - Body, Navigation, Buttons, Badges, and FAQs: **DM Sans** (400, 500, 600, 700)
- **Design Tokens**:
  - Emerald Green: `#05AC5F` (primary accent, chips, icons, active borders)
  - Mint: `#DAF3E7` (stat cards, closing CTA panel, soft hero wash)
  - Ink: `#0C0C0C` (How-It-Works section, footer, deep text)
  - Grey: `#F9FAFC` (Why-Us section background)

## Section Order

1. **Header**: Sticky navigation with green wordmark, Services dropdown (20 services), Cities dropdown (11 cities), anchor links, and mobile slide-down menu.
2. **Hero**: Split layout with trust chip, H1 ("Trusted house help in minutes!"), value proposition, tally.so locality link, store badges, star rating, city tags, and cutout of the Pronto professional.
3. **Featured In**: 7 press publications (TechCrunch, Bloomberg, Business Standard, The Economic Times, India Today, YourStory, Inc42).
4. **Why Us**: 3 mint stat cards with animated count-up numbers.
5. **Our Services**: 6-column desktop catalogue of 20 services with 3D diorama illustrations.
6. **How It Works**: Dark background with 3 step cards featuring emerald phone frames with auto-cycling screens.
7. **Testimonials**: Two-row infinite auto-scrolling marquee pausing on hover/focus.
8. **FAQs**: 21 accessible accordions with smooth height transitions and single-open state.
9. **Closing CTA**: Centered mint panel with fanned smartphone mockups and store download badges.
10. **Footer**: 5-column navigation, full services/cities SEO link lists, and social channels.

## Asset Replacement Guide

All visual assets reside in `/public/assets/` and can be replaced directly:
- `/assets/brand/logo-green.svg` & `logo-white.svg` — Brand wordmarks
- `/assets/brand/badge-google-play.png` & `badge-app-store.png` — Official app store badges
- `/assets/hero/hero-pro-namaste.png` — Hero professional cutout
- `/assets/press/*.svg` — Press logos
- `/assets/services/*.webp` — 20 service 3D diorama cards
- `/assets/app-screens/*.webp` — App UI mockup screens
- `/assets/cta/closing-cta-fan.webp` — Fanned phones illustration

## Commands

```bash
npm install
npm run dev      # Starts dev server on port 3000
npm run build    # Typechecks and builds production dist
npm run lint     # Runs TypeScript verification
```
