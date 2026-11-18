# Cultgig — Creative Services Marketplace for India

Cultgig connects people and businesses who need independent artists for events, venues, brands, and commissions with artists who want to showcase their craft, receive structured briefs, and agree on fair booking terms.

---

## 1. What Cultgig Currently Does (and What Is Prototype Only)

- **Implemented & Live-Ready UI**:
  - Light-first Cultgig design system (`#6A2E62` plum, `#FCFAFB` canvas, bundled `Lexend` typography weights 400–700).
  - Homepage following a search-first marketplace layout across 15 Indian creative categories (Music & bands, Mehendi artists, Photography & videography, Saree draping & styling, Decorators & florists, Wall art & murals, Emcees & hosts, and more).
  - Public Explore search (`/explore`), Category index & detail pages (`/categories`, `/categories/:slug`), and Artist profile pages (`/artists/:slug`).
  - Editorial Guides (`/guides`), FAQ (`/faq`), Trust & Safety (`/safety`), Pre-launch Pricing (`/pricing`), Support & Contact (`/contact`, `/support`), and Draft Legal pages (`/legal/*`).
- **Appwrite-Backed (when environment variables are set)**:
  - Email OTP verification (`src/lib/appwriteAuth.ts`).
  - Early-access / sign-up submissions (`src/lib/appwriteSubmissions.ts`).
  - File upload validation & storage client (`src/lib/appwriteStorage.ts`).
- **Interactive Prototype Mode (Browser Local Storage — Not Multi-User Server Sync Yet)**:
  - Sample artist listings and sample event briefs (`isSample: true`).
  - Client gig creation (`/client/gigs/new`), saved artists, and applications.
  - Artist portfolio preview, open-gig applications, availability dates, and versioned offer negotiation (`/messages/:conversationId`).
- **Pending Provider / Backend Approval (Not Active)**:
  - Server-side Appwrite collections & Appwrite Functions.
  - Cloudinary signed upload signature endpoint.
  - Live marketplace split-payment checkout (Razorpay Route or Cashfree Easy Split).

---

## 2. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, `@fontsource/lexend`, `lucide-react`
- **Backend / Auth**: Appwrite Web SDK (`appwrite`) — plus future Appwrite Functions for privileged transitions & webhooks
- **Media CDN (Planned)**: Cloudinary with server-signed uploads
- **Hosting**: Vercel (`vercel.json` SPA routing + baseline security headers)

---

## 3. Folder Structure

- `src/app/` — Application shell, route matcher, and auth guards (`App.tsx`)
- `src/components/` — Reusable UI (`ui/`), navigation/footer (`layout/`), artist & gig cards (`marketplace/`)
- `src/config/` — Brand/legal placeholders (`site.ts`) and navigation (`navigation.ts`)
- `src/content/` — Central `imageManifest` (`images.ts`), FAQ, About copy
- `src/data/` — 15 creative categories (`categories.ts`), editorial guides (`guides.ts`), sample prototype fixtures (`sampleMarketplace.ts`)
- `src/lib/` — Router (`router.tsx`), Appwrite client/auth/storage/submissions
- `src/pages/` — Modular route pages (Home, Explore, Categories, Artist Profile, Auth, Client Workspace, Artist Workspace, Negotiation, Compliance & Checkout)
- `src/state/` — `AuthContext.tsx` and `MarketplaceContext.tsx`
- `src/styles/` — Design tokens (`tokens.ts`) and global Tailwind/Lexend rules (`globals.css`)
- `src/types/` — Shared marketplace and onboarding TypeScript interfaces

---

## 4. Local Setup (Step-by-Step for Beginners)

1. **Install dependencies**:
   ```bash
   npm install
   ```
   This downloads React, Vite, Tailwind, Lexend fonts, and the Appwrite SDK into `node_modules/`.
2. **Create your local environment file**:
   Copy `.env.example` to `.env` and leave blank anything you haven't set up yet:
   ```bash
   cp .env.example .env
   ```
3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open the local URL shown in your terminal (port `3000`). If Appwrite variables are empty, Cultgig runs cleanly in local prototype mode so you can test every page and workflow.
4. **Typecheck & build**:
   ```bash
   npm run lint
   npm run build
   ```
   A successful build outputs production files into `dist/` with zero TypeScript errors.

---

## 5. Appwrite Setup & Security Permissions

1. Create a project in your Appwrite Console and copy the **API Endpoint** and **Project ID** into `VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT_ID` inside `.env`.
2. Create a Database and Collection for onboarding/submissions and a Storage Bucket for portfolio files, then copy their IDs into `.env`.
3. **Critical Permissions Rule**:
   - On the onboarding/submissions collection, grant `Any / Guests` **`create` permission ONLY**. Never grant `read` to guests, otherwise anyone could read personal emails/cities via the public API.
   - Grant `read`, `update`, and `delete` only to authenticated admin/team roles or server Functions.
4. Never place Appwrite Server API Keys inside `VITE_*` variables—anything starting with `VITE_` is shipped to every user's browser.

---

## 6. Cloudinary & Payment Provider Rules

### Cloudinary Signed Uploads
Do **not** put `CLOUDINARY_API_SECRET` in `.env` as a `VITE_*` variable. Create a small server endpoint / Appwrite Function that verifies the logged-in user and returns a short-lived upload signature.

### Why Dodo Payments Is NOT Used for Marketplace Checkout
Per Dodo Payments' Merchant Acceptance Policy, Dodo does not support manual human services (freelancing/custom artist work), multi-vendor marketplaces, or event bookings. Cultgig never misclassifies human artist bookings as SaaS or digital downloads.

### Razorpay Route / Cashfree Easy Split Sequence
1. Confirm legal entity, registered address, PAN/GSTIN, and bank account.
2. Submit Cultgig's marketplace model, category list, and policy pages for written review to **Razorpay Route** or **Cashfree Easy Split**.
3. Deploy server-side payment order creation, HMAC webhook verification, idempotency keys, and split transfer functions before enabling live checkout.

---

## 7. Vercel Deployment

1. Import the repository in Vercel (`Build Command`: `npm run build`, `Output Directory`: `dist`).
2. Add your `VITE_*` variables in **Vercel Project Settings → Environment Variables** (never commit `.env`).
3. `vercel.json` is already included so refreshing direct routes like `/explore` or `/legal/privacy` loads `index.html` cleanly.

---

## 8. Available Routes

- **Public**: `/`, `/explore`, `/categories`, `/categories/:slug`, `/artists/:slug`, `/how-it-works`, `/for-artists`, `/for-businesses`, `/about`, `/pricing`, `/guides`, `/guides/:slug`, `/faq`, `/contact`, `/support`, `/safety`
- **Auth**: `/sign-in`, `/sign-up`, `/verify-email`, `/forgot-password`, `/reset-password`, `/onboarding`
- **Client Workspace (Protected)**: `/client/dashboard`, `/client/gigs`, `/client/gigs/new`, `/client/gigs/:gigId`, `/client/artists/saved`, `/client/applications`, `/client/messages`, `/client/bookings`, `/client/bookings/:bookingId`, `/client/settings/profile`, `/client/settings/billing`
- **Artist Workspace (Protected)**: `/artist/dashboard`, `/artist/profile/edit`, `/artist/portfolio`, `/artist/opportunities`, `/artist/opportunities/:gigId`, `/artist/applications`, `/artist/proposals`, `/artist/bookings`, `/artist/bookings/:bookingId`, `/artist/availability`, `/artist/earnings`, `/artist/settings`
- **Shared & Legal**: `/messages/:conversationId`, `/notifications`, `/checkout/:bookingId`, `/payment/success`, `/payment/failed`, `/payment/pending`, `/legal/terms`, `/legal/privacy`, `/legal/refunds`, `/legal/cancellation`, `/legal/community-guidelines`, `/legal/artist-agreement`, `/legal/client-agreement`

---

## 9. Pre-Launch Owner Checklist & Known Limitations

- [ ] Confirm `VITE_LEGAL_ENTITY_NAME`, `VITE_ENTITY_TYPE`, `VITE_REGISTERED_ADDRESS`, `VITE_SUPPORT_EMAIL`, and Grievance Officer details.
- [ ] Obtain Indian legal counsel sign-off on all `/legal/*` drafts (DPDP Act 2023 + E-Commerce Rules 2020).
- [ ] Provision production Appwrite collections, strict document permissions, and server-side Functions.
- [ ] Obtain written Razorpay Route or Cashfree Easy Split marketplace approval before disabling the checkout gate.
- **Known limitation**: Without provisioned Appwrite Functions and payment backend, workspaces operate in browser-local prototype mode and sample listings (`isSample: true`) are displayed for preview only.
