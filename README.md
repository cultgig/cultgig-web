# Cultgig

**Cultgig is a two-sided marketplace for creative services in India.** People and businesses who
need creative talent (**clients**) find, message, negotiate with and book independent musicians,
mehendi artists, photographers, decorators, dancers, hosts and other creative professionals
(**artists**).

One account can do both: hire artists *and* offer services. You switch between the client and
artist workspaces from the account menu.

---

## Contents

1. [Quick start](#1-quick-start)
2. [Try it: demo accounts and journeys](#2-try-it-demo-accounts-and-journeys)
3. [What's working and what isn't yet](#3-whats-working-and-what-isnt-yet)
4. [How Cultgig works (the product)](#4-how-cultgig-works-the-product)
5. [How the code is organised](#5-how-the-code-is-organised)
6. [Design system](#6-design-system)
7. [Tests and quality checks](#7-tests-and-quality-checks)
8. [Configuration and environment variables](#8-configuration-and-environment-variables)
9. [Deploying to Vercel](#9-deploying-to-vercel)
10. [Going to production](#10-going-to-production)
11. [All pages and routes](#11-all-pages-and-routes)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Quick start

You need **Node.js 20+**. The repository includes a `bun.lock`, so [Bun](https://bun.sh) is the
preferred installer, but npm works too.

```bash
# 1. Install dependencies
bun install            # or: npm install

# 2. Create your local settings file (demo mode works with no other changes)
cp .env.example .env

# 3. Start the app
bun run dev            # or: npm run dev
```

Open **http://localhost:3000**. You'll see a small **lime "Demo mode" button** in the bottom-left
corner. That means the app is running on sample data stored in your browser, with no server needed.

---

## 2. Try it: demo accounts and journeys

Go to **Sign in**. In demo mode you'll see one-click demo accounts:

| Account | Role | Good for trying |
|---|---|---|
| **Zoe Fernandes** | Client (Bandra Terrace Bistro, Mumbai) | Accepting an offer, bookings, posting gigs, comparing applicants |
| **Rhea Kapoor** | Artist (acoustic vocalist, Mumbai) | Artist dashboard, responding to offers, running a booking |
| **Aarav Mehta** | Client (family wedding, Jaipur) | A completed booking with a verified review |
| **Meera Joshi** | Artist *and* client (photographer) | Switching roles, applying to gigs |

You can switch account at any time from the **Demo mode** button, without signing out. You can also
create your own account on **Sign up**. In demo mode the email verification code is shown on screen,
because no email is sent.

### Journey A: negotiate and book (about 3 minutes)
1. Sign in as **Zoe** → the dashboard shows "1 artist has sent you an offer".
2. Open the offer. The conversation with Rhea shows **Proposal v3 (₹23,500)**. Select
   **Show offer history** to see v1 (₹25,000 from Rhea) and v2 (₹22,000, Zoe's counter-offer).
   Nothing is ever overwritten.
3. **Accept v3** → confirm. A booking is created from *exactly* that version.
4. On the booking, select **Confirm without payment (demo)**. Online payment isn't live, so the
   booking records "No payment collected (demo)". Nothing is marked as paid.
5. Switch to **Rhea** → open the same booking → **Start work** → **Mark work delivered**.
6. Switch back to **Zoe** → **Confirm completion** → leave a **verified review**. It appears on
   Rhea's public profile.

### Journey B: post a gig and hire through applications
1. As **Zoe**: **Post a gig** → a 6-step brief (basics, event details, requirements, budget,
   preferences, review) → **Publish**.
2. Switch to **Meera** → **Discover gigs** → open the gig → **Apply** with a quote.
3. Switch to **Zoe** → open the gig → **Shortlist** → tick two applicants → **Compare** →
   **Message & negotiate**. The artist's quote becomes Proposal v1, and you can counter-offer.

### Journey C: hire directly without a gig
**Explore** → open any artist → **Request a quote** or **Contact artist** → fill in the event
details → a conversation opens. The artist replies with an offer, and you negotiate as in Journey A.

### Reset
**Demo mode → Reset data** restores the original sample data.

---

## 3. What's working and what isn't yet

| Area | Status |
|---|---|
| Public marketplace: home, search & filters, categories, artist profiles | ✅ Working |
| Sign up / sign in / verify email / forgot & reset password | ✅ Working in demo mode · ✅ Appwrite auth wired in production mode |
| Artist and client onboarding (with draft save) | ✅ Working (demo) |
| Artist workspace: profile, portfolio, services, gigs, applications, proposals, availability, earnings | ✅ Working (demo) |
| Client workspace: dashboard, saved artists, gig wizard, applicants & comparison, bookings, payments | ✅ Working (demo) |
| Messaging and versioned negotiation | ✅ Working (demo) |
| Booking lifecycle with timeline, cancellation, disputes | ✅ Working (demo) |
| Notifications, verified reviews, reports, blocking, settings | ✅ Working (demo) |
| Legal & compliance pages (terms, privacy, refunds, cancellation, grievance, cookies, payments, disputes, agreements, accessibility) | ✅ Published as **drafts pending legal review** |
| Marketplace data on Appwrite (multi-device, multi-user) | ⏳ Needs collections + Functions (`docs/APPWRITE_SETUP.md`) |
| Google sign-in | ⏳ Needs Google credentials in Appwrite (`docs/INTEGRATIONS.md`) |
| Transactional email | ⏳ Needs SMTP in Appwrite |
| Online payments and payouts | ⛔ Blocked until a marketplace payment provider approves Cultgig |

**Demo mode is a fully clickable product, but it is not a real backend.** Data lives in one
browser. Two people on different computers can't talk to each other until Appwrite is connected.
You *can* test both sides in two tabs of the same browser: changes sync between tabs.

---

## 4. How Cultgig works (the product)

**Two ways to hire**
- **Direct:** a client contacts an artist from their profile with event details.
- **Gigs:** a client posts a brief, artists apply with quotes, and the client shortlists and compares them.

**Negotiation:** either side can send an *offer* (amount, date, duration, deliverables, inclusions,
exclusions, travel, cancellation terms, validity). A counter-offer creates a **new version**, and the
earlier one is marked *superseded*. Only one offer is open at a time. You can't accept your own
offer, an expired offer, or an out-of-date version.

**Booking lifecycle**

```
Inquiry → Proposal received → Negotiating → Offer accepted → Awaiting payment
        → Confirmed → In progress → Completion pending → Completed
                        (Cancelled and Disputed are possible along the way)
```

| Step | Who can do it |
|---|---|
| Accept an offer (creates the booking) | The participant who *didn't* send that version |
| Awaiting payment → Confirmed | Payment webhook only (demo: client, "no payment collected") |
| Confirmed → In progress → Completion pending | Artist |
| Completion pending → Completed | Client |
| Cancel (needs a reason) | Either side, before work starts |
| Raise a dispute (needs a reason) | Either side, once work has started |

---

## 5. How the code is organised

Stack: **React 18 + TypeScript + Vite**, Tailwind CSS, **shadcn/ui** components (Radix), **Phosphor**
icons, a small built-in router, and an **Appwrite** adapter. Deployed on **Vercel**.

```
src/
  app/            App shell, route table (routes.tsx) and route guards
  domain/         ★ Business rules as pure functions: proposals, bookings, gigs, money (unit-tested)
  services/
    backend/      ★ The Backend interface + demoBackend (browser) + appwriteBackend (production)
    storage.ts    Typed browser/in-memory persistence (only services touch localStorage)
    media.ts      Image validation and resizing, https link checks
  state/          MarketplaceContext (loads the viewer's data, runs actions) and selectors
  pages/          public/, auth/, artist/, client/, shared/ (messages, bookings, settings, …)
  components/
    ui/           shadcn/ui primitives (button, dialog, select, calendar, …)
    layout/       Header, footer, workspace shell (sidebar + mobile bottom bar), demo control
    marketplace/  Artist and gig cards, inquiry dialog, category icons
    messaging/    Proposal card and composer
    artist/       Service, portfolio and availability editors
    shared/       Empty/loading/error/404 states, status badges, form fields, dialogs
  data/           Categories and the demo seed (all sample data is labelled "Demo")
  config/         Environment/readiness, navigation, site/legal identity
  types/          Domain types (marketplace.ts)
```

**The key idea:** pages never decide what's allowed. They call `run((b) => b.market.someAction())`.
The backend checks who's signed in, applies the rules in `src/domain`, and returns only what that
person may see. Replacing the demo backend with Appwrite doesn't require touching any page.

---

## 6. Design system

- **Colour:** the warm olive system in [`DESIGN.md`](DESIGN.md). Every colour is a CSS variable in
  `src/styles/globals.css`, and Tailwind and shadcn read those variables. Don't hard-code hex values.
- **Type:** Bricolage Grotesque (primary: headings, wordmark, large figures) and Poppins (secondary: body, labels, buttons, forms), both bundled locally via `@fontsource-variable/bricolage-grotesque` and `@fontsource/poppins`. Change them in one place: the `--font-display` and `--font-sans` tokens in `src/styles/globals.css`.
- **Components:** shadcn/ui in `src/components/ui` (add more with `npx shadcn@latest add <name>`).
  Icons come from Phosphor only.
- **States:** every list has an empty state, every page has a loading skeleton, unknown or
  inaccessible records show a 404, and screen crashes are caught by an error boundary.
- **Accessibility:** keyboard-friendly, visible focus, labelled form fields, status shown as text +
  icon (never colour alone), and reduced-motion support. See `/accessibility`.

---

## 7. Tests and quality checks

```bash
bun run lint     # TypeScript type-check (no errors allowed)
bun run test     # 45 unit + integration tests (Vitest)
bun run build    # type-check + production build into dist/
```

The tests cover:
- the negotiation rules (versioning, stale/own/double acceptance),
- the booking state machine and role permissions,
- gigs and applications (validation, duplicates, closed gigs),
- direct hiring,
- privacy (no cross-user data, no account enumeration, blocking),
- mass-assignment protection,
- search and filters,
- open-redirect protection,
- app-level routing (404s, guards, legal pages).

Release QA also included a headless-browser pass over every route at desktop (1366 px) and mobile
(390 px) widths, signed out, as a client and as an artist, plus the full A/B journeys, run against the
production build with the production Content-Security-Policy.

---

## 8. Configuration and environment variables

All variables are documented in [`.env.example`](.env.example). The important ones:

| Variable | Meaning |
|---|---|
| `VITE_APP_MODE` | `demo` (sample data in the browser) or `production` (Appwrite). Unset: dev = demo, build = production |
| `VITE_APPWRITE_*` | Public Appwrite endpoint, project, database, bucket and collection IDs |
| `VITE_GOOGLE_OAUTH_ENABLED` | `true` only after Google is configured in Appwrite |
| `VITE_PAYMENTS_ENABLED` | Keep `false` until a payment provider is approved and Functions are live |
| `VITE_LEGAL_*`, `VITE_SUPPORT_*`, `VITE_GRIEVANCE_*` | Business identity shown on legal pages |

⚠️ Anything starting with `VITE_` is visible to every visitor. **Never** put secrets there.

Open **`/system/readiness`** on any deployment to see what is configured, what is running on demo
stand-ins, and what is blocked.

---

## 9. Deploying to Vercel

1. Import the repository in Vercel. Build command `npm run build`, output directory `dist`.
2. Add environment variables in **Project → Settings → Environment Variables**.
   - To publish a clickable preview: `VITE_APP_MODE=demo`.
   - For the real launch: `VITE_APP_MODE=production` plus all Appwrite variables.
3. `vercel.json` already handles deep links (e.g. `/artists/…`) and sets security headers (CSP, HSTS
   and more) and long-term caching for hashed assets.

If a production build has no backend configured, visitors see a friendly "temporarily unavailable"
page. It never silently shows demo data.

---

## 10. Going to production

Follow these, in order:
1. [`docs/APPWRITE_SETUP.md`](docs/APPWRITE_SETUP.md): project, auth, collections, permissions,
   storage, Functions.
2. [`docs/INTEGRATIONS.md`](docs/INTEGRATIONS.md): Google OAuth, SMTP email, payment provider.
3. [`PAYMENTS_AND_COMPLIANCE.md`](PAYMENTS_AND_COMPLIANCE.md): provider choice and Indian
   marketplace compliance.
4. [`SECURITY.md`](SECURITY.md): the pre-launch security checklist.
5. Have the legal pages (`/legal/*`) reviewed by Indian counsel, and fill in the business identity
   variables.

---

## 11. All pages and routes

**Public:** `/` · `/explore` · `/categories` · `/categories/:slug` · `/artists/:slug` ·
`/how-it-works` · `/for-artists` · `/for-businesses` · `/pricing` · `/faq` · `/about` · `/guides` ·
`/guides/:slug` · `/safety` · `/support` (`/contact`) · `/accessibility` · `/system/readiness`

**Legal & compliance:** `/legal/terms` · `privacy` · `refunds` · `cancellation` ·
`community-guidelines` · `artist-agreement` · `client-agreement` · `grievance` · `cookies` ·
`payments-and-fees` · `disputes`

**Auth:** `/sign-in` · `/sign-up` · `/verify-email` · `/forgot-password` · `/reset-password` ·
`/auth/callback` · `/onboarding` · `/onboarding/artist` · `/onboarding/client`

**Artist workspace:** `/artist/dashboard` · `profile` · `portfolio` · `services` · `gigs` ·
`gigs/:gigId` · `applications` · `proposals` · `bookings` · `availability` · `earnings`

**Client workspace:** `/client/dashboard` · `saved` · `gigs` · `gigs/new` · `gigs/:gigId` ·
`gigs/:gigId/edit` · `applications` · `bookings` · `payments`

**Shared (signed in):** `/messages` · `/messages/:conversationId` · `/bookings/:bookingId` ·
`/notifications` · `/settings` · `/checkout/:bookingId` · `/payment/success|pending|failed`

Old links from the previous version (for example `/artist/opportunities`) redirect to their new
locations.

---

## 12. Troubleshooting

| Problem | Fix |
|---|---|
| "Cultgig is temporarily unavailable" | You're in production mode without Appwrite. Set `VITE_APP_MODE=demo` for local work |
| Demo data looks odd after many experiments | **Demo mode → Reset data** |
| A demo account says "Use the one-click demo sign-in" | Sample accounts have no password. Use the buttons on the sign-in page |
| Images missing after a deploy | Demo data reseeds automatically when bundled assets change. Reload once |
| `npx shadcn add` fails with `spawn bun ENOENT` | Install Bun (`npm i -g bun`), because the CLI follows `bun.lock` |

Photography: category and hero images marked "Pexels" in `src/content/images.ts` are used under the
[Pexels License](https://www.pexels.com/license/). Other images are owner-supplied repository assets.
