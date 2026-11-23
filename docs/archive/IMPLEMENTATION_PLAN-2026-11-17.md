# Cultgig — Implementation Plan (Phase 0 Audit)

Audit Date: 2026-11-17  
Repository: `cultgig/cultgig-web`

---

## 1. Repository Audit Findings

### 1.1 Stale Pronto Contamination Found
During Phase 0 inspection, the following files contained mismatched **Pronto** (household cleaning) branding, green `#05AC5F` tokens, and `League Spartan` / `DM Sans` fonts:
- `index.html` (Pronto title, description, schema, `#05AC5F` theme color, Google Fonts League Spartan & DM Sans)
- `src/app/App.tsx` (rendered Pronto landing page sections instead of Cultgig router)
- `src/styles/globals.css` and `tailwind.config.ts` (Pronto green `#05AC5F`, mint `#DAF3E7`, Pronto CSS classes)
- `src/config/brand.ts` (Pronto config, emails, app store links)
- `src/components/layout/Header.tsx`, `Footer.tsx`, `NavDropdown.tsx`, `MobileMenu.tsx`
- `src/components/sections/*` and `src/data/*` (Pronto Hero, PressStrip, WhyUs, Services, HowItWorks, Testimonials, Faq, ClosingCta)
- `README.md` (described Pronto recreation)

### 1.2 Reusable Cultgig Assets & Modules Preserved
The following genuine Cultgig modules and assets were preserved in the checkout and form the foundation of the evolved marketplace:
- `src/styles/tokens.ts` (Authoritative `#6A2E62` plum palette + Lexend typography scale)
- `src/assets/images/*` (15 local photographic assets) + 5 newly generated Indian creative photography assets (`category_mehendi_artist_*`, `category_mural_artist_*`, `category_saree_stylist_*`, `category_emcee_host_*`, `guide_creative_brief_*`)
- `src/lib/appwrite.ts`, `appwriteAuth.ts`, `appwriteSubmissions.ts`, `appwriteStorage.ts`
- `src/state/onboardingContext.tsx`, `src/types/onboarding.ts`
- `src/hooks/useFocusTrap.ts`, `usePageMeta.ts`, `useReducedMotion.ts`, `useClickOutside.ts`
- `src/content/about.ts`, `src/content/faq.ts`, `src/content/images.ts`
- `src/components/early-access/LeadCaptureModal.tsx`

### 1.3 Design & Typography Reconciliation
- **Authoritative Palette**: Light-first canvas `#FCFAFB`, primary plum `#6A2E62`, hover `#54234E`, deep `#421A3D`, soft tint `#F8F3F7`, border tint `#DFC9DA`, primary ink `#20151E`, secondary `#5C4E58`, muted `#84747F`, warm ochre accent `#B88E52`.
- **Authoritative Font**: `@fontsource/lexend` (weights 400, 500, 600, 700 only; no 800/900; explicit line heights; sentence case throughout).
- **Information Architecture**: Inspired by the Fiverr screenshot composition — slim 3-zone header, full-width image hero with search + category suggestions, compact category row, horizontal service showcase cards, 4-pillar marketplace benefits, dedicated Business/Event-planner plum banner, complementary Artist spotlight banner, illustrative creative moments showcase, editorial guides, closing CTA, and multi-column structured footer.

---

## 2. Technical Gaps, Payment Risks & Legal Blockers

1. **Appwrite Backend Provisioning**: Currently configured via `VITE_APPWRITE_*` env vars for email OTP and lead submission. Full marketplace collections (`artistProfiles`, `gigs`, `applications`, `proposals`, `conversations`, `messages`, `bookings`, `paymentRecords`, `reviews`) and server-side Appwrite Functions are NOT provisioned in this static frontend repo; workspaces operate in clearly labelled **Prototype / Local Preview Mode** backed by typed domain models and session/local persistence until Appwrite collections & functions are deployed.
2. **Cloudinary Signed Uploads**: Requires a server-side signature endpoint (`CLOUDINARY_API_SECRET` must never be placed in `VITE_*`). Client-side upload preview validates MIME type and 10 MB size limit.
3. **Payment Provider Compliance Blocker**:
   - **Dodo Payments**: Published Merchant Acceptance Policy excludes manual human services (freelancing, custom creative services), multi-vendor marketplaces, and event booking models. Must NOT be used for Cultgig booking checkout without explicit written compliance approval.
   - **Razorpay Route / Cashfree Easy Split**: Both require registered legal entity verification, merchant/marketplace onboarding, seller KYC/bank verification, and written category approval before live transactions.
4. **Business & Legal Identity Placeholders**: Owner must supply `VITE_LEGAL_ENTITY_NAME`, entity type, `VITE_REGISTERED_ADDRESS`, `VITE_SUPPORT_EMAIL`, grievance officer name/email, and PAN/GSTIN/CIN where applicable. All legal pages include a `"Draft — requires legal review"` banner.

---

## 3. Phased Execution Plan

- **Phase 0**: Audit & Plan (`IMPLEMENTATION_PLAN.md`, `PAYMENTS_AND_COMPLIANCE.md`)
- **Phase 1**: Brand, Lexend typography, `#6A2E62` tokens, Header, Footer, shared UI primitives, remove Pronto contamination
- **Phase 2**: Fiverr-inspired Cultgig Homepage (`/`)
- **Phase 3**: Public Browse & Profiles (`/explore`, `/categories`, `/categories/:slug`, `/artists/:slug`)
- **Phase 4**: Auth & Role Onboarding (`/sign-in`, `/sign-up`, `/verify-email`, `/forgot-password`, `/reset-password`, `/onboarding`)
- **Phase 5**: Client & Artist Workspaces, Gig Creation, Versioned Proposals/Negotiation & Booking Lifecycle (`/client/*`, `/artist/*`, `/messages/:conversationId`, `/notifications`)
- **Phase 6**: Compliance, Pricing, Editorial Guides, Support & Checkout Gate (`/pricing`, `/guides/*`, `/legal/*`, `/safety`, `/contact`, `/support`, `/checkout/:bookingId`, `/payment/*`)
- **Phase 7**: Production Hardening (`vercel.json`, `SECURITY.md`, `README.md`, `IMPLEMENTATION_STATUS.md`, TypeScript & Vite build verification)
