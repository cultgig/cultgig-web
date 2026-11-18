# Cultgig — Implementation Status

Last Updated: 2026-11-17

## Status Classification

| Feature / Area | Current Status | Notes |
| --- | --- | --- |
| **Cultgig Brand, Tokens & Lexend Typography** | **Implemented** | Plum `#6A2E62`, canvas `#FCFAFB`, bundled `@fontsource/lexend` (400–700), Pronto branding removed. |
| **Fiverr-inspired Homepage (`/`)** | **Implemented** | Hero search + autocomplete, 9 category tiles, horizontal service showcase, benefits, business/artist spotlights, illustrative moments, guides, closing CTA, 5-column footer. |
| **Public Explore & Category Pages (`/explore`, `/categories`, `/categories/:slug`, `/artists/:slug`)** | **UI Prototype / Sample Fixtures** | Working filters, sorting, save shortlist, inquiry modal, and report form backed by `sampleMarketplace.ts` (`isSample: true`). |
| **Email OTP Auth (`src/lib/appwriteAuth.ts`)** | **Backed by Appwrite when configured / Local Prototype fallback** | Uses Appwrite `account.createEmailToken` when `VITE_APPWRITE_*` vars are set; falls back to local prototype session when unconfigured. |
| **Early-access Lead Capture (`src/lib/appwriteSubmissions.ts`)** | **Backed by Appwrite when configured** | Saves onboarding/sign-up lead records when Appwrite database/collection IDs are configured. |
| **Client & Artist Workspaces (`/client/*`, `/artist/*`)** | **UI Prototype (Local Browser State)** | Gig builder, applications, portfolio preview (10 MB / MIME check), availability calendar, and bookings persist in `localStorage`. Requires Appwrite collections + Functions for multi-user live sync. |
| **Versioned Negotiation & Offer History (`/messages/:conversationId`)** | **UI Prototype (Local Browser State)** | Append-only `Proposal vN` creation, counter-offers, and mutual acceptance updating booking lifecycle. Server-side validation required for production. |
| **Cloudinary Portfolio Delivery** | **Pending Server Function** | Requires a server-side signature endpoint (`CLOUDINARY_API_SECRET` must stay off frontend). |
| **Marketplace Split Payments (Razorpay Route / Cashfree Easy Split)** | **Gated / Not Activated** | Checkout page displays deliverables and blocks payment until legal entity verification and written provider approval. Dodo Payments is explicitly excluded per Merchant Acceptance Policy. |
| **Compliance & Legal Pages (`/legal/*`, `/pricing`, `/contact`, `/support`, `/safety`)** | **Draft — Requires Legal Review** | Driven by `src/config/site.ts` placeholders until owner legal details and counsel sign-off are supplied. |
