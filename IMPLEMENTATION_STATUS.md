# Implementation status

Last updated: 23 November 2026 (branch `feat/marketplace-rebuild`).

Legend: ✅ done and tested · 🧪 done in demo mode (needs the Appwrite backend for multi-user use) ·
⏳ waiting on external setup · ⛔ blocked by a third party.

| Area | Status | Notes |
|---|---|---|
| Design system (DESIGN.md olive palette, Bricolage Grotesque + Poppins, shadcn/ui, Phosphor) | ✅ | Single-source CSS tokens. No Lucide icons remain |
| Public marketplace (home, explore, categories, profiles) | ✅ | URL-synced search, 8 filters, 5 sorts, no-result states |
| Marketing, FAQ, guides, support, accessibility | ✅ | Copy updated to match real behaviour |
| Legal & compliance pages (11) | ✅ draft | Every page carries "Draft — requires legal review" |
| Auth screens + session handling | ✅ demo · ✅ Appwrite auth | Email/password, verification, recovery, OAuth callback |
| Artist & client onboarding | 🧪 | Step validation, draft save, preview |
| Artist workspace (10 screens) | 🧪 | |
| Client workspace (8 screens incl. gig wizard and comparison) | 🧪 | |
| Messaging + versioned negotiation | 🧪 | Rules in `src/domain/proposals.ts` (unit-tested) |
| Booking lifecycle | 🧪 | State machine in `src/domain/bookings.ts` (unit-tested) |
| Notifications, reviews, reports, blocking, settings | 🧪 | |
| Appwrite marketplace data + Functions | ⏳ | `docs/APPWRITE_SETUP.md` |
| Google OAuth | ⏳ | Code done, needs credentials (`docs/INTEGRATIONS.md`) |
| SMTP email | ⏳ | Configure in Appwrite and test delivery |
| Payments, refunds, payouts | ⛔ | Needs provider approval (Razorpay Route / Cashfree Easy Split) |

## Verification (23 Nov 2026)
- `tsc --noEmit`: 0 errors · `vite build`: passes (entry chunk 325 kB / 87 kB gzip).
- Vitest: 45 tests passing (domain rules, backend authorisation, security, discovery, routing).
- Headless Chrome: 156 page loads (69 routes × 2 widths, 3 sign-in states), with 0 console errors,
  0 horizontal overflow and 0 blank pages. The full negotiate → book → complete → review and
  post-gig → apply → compare → counter-offer journeys pass at 1366 px and 390 px, including against
  the production build with the production CSP.
- `bun audit`: 0 known vulnerabilities.

## Known limitations
- Demo mode is single-browser. Tabs in the same browser stay in sync, but different devices don't.
- Audio and video portfolio items are links (https). Direct audio/video upload arrives with Appwrite
  storage.
- Search runs in the browser over the loaded profiles. With Appwrite, move it to indexed queries.
- Platform fee is ₹0 until the fee policy is decided. The data model already carries it.
- Some legacy photographs are generic stock. Replace them with real artist work as artists join.
