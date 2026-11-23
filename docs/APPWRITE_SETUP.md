# Appwrite setup guide

This guide takes Cultgig from **demo mode** (data in the browser) to **production mode** (data in
Appwrite). Do the steps in order. Nothing here requires changing React components: the UI talks to
the `Backend` interface in `src/services/backend/types.ts`, and you replace the demo implementation
with Appwrite.

> **What already works with Appwrite today:** sign-up, sign-in, sign-out, session restore, email
> verification links, password recovery links and Google OAuth (once enabled). See
> `src/services/backend/appwriteBackend.ts`.
>
> **What still needs building:** the marketplace data methods. In production mode they currently
> fail safely with "The Cultgig marketplace backend isn't connected yet" — they never fall back to
> demo data.

---

## 1. Create the project

1. Create a project in the Appwrite Console (Cloud or self-hosted).
2. **Settings → Platforms → Add platform → Web.** Add `localhost` and your production domain
   (`www.cultgig.com`) and every Vercel preview domain you use.
3. Copy the **API endpoint** and **Project ID** into `.env`:
   ```
   VITE_APPWRITE_ENDPOINT=https://<region>.cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=<project id>
   ```

## 2. Authentication

1. **Auth → Settings:** enable *Email/Password*. Set password length ≥ 8 and enable password
   dictionary/history checks.
2. **Auth → Security:** enable session limits and set a sensible session length (e.g. 30 days).
3. **Messaging → SMTP (or Settings → SMTP):** add your SMTP provider so verification and recovery
   emails are delivered. Send a test email before you rely on it.
4. Email templates: customise the *Verification* and *Password recovery* templates. The app expects
   the links to land on `https://<domain>/verify-email` and `https://<domain>/reset-password`
   (these URLs are passed by the app automatically).
5. **Google sign-in:** see `docs/INTEGRATIONS.md` → Google OAuth. Then set
   `VITE_GOOGLE_OAUTH_ENABLED=true`.

## 3. Database and collections

Create one database and copy its ID to `VITE_APPWRITE_DATABASE_ID`. Create these collections. The
attribute lists mirror the TypeScript types in `src/types/marketplace.ts` — keep them in sync.

| Collection | Mirrors type | Document permissions (who can read / write) |
|---|---|---|
| `users` | `UserAccount` | read: the user only · write: **Functions only** (roles and onboarding state are server-controlled) |
| `artistProfiles` | `ArtistProfile` | read: `any` **only when `published=true`** (use a Function or a separate public view) · write: owner via Function |
| `clientProfiles` | `ClientProfile` | read/write: the owner only |
| `services` / `servicePackages` | `ServicePackage` | read: `any` · write: owner via Function |
| `portfolioItems` | `PortfolioItem` | read: `any` · write: owner via Function |
| `gigs` | `EventGig` | read: `any` when `status=open`, owner always · write: owner via Function |
| `applications` | `GigApplication` | read: the artist and the gig owner · write: **Functions only** |
| `conversations` | `ConversationThread` | read: the two participants · write: Functions only |
| `messages` | `ChatMessage` | read: the two participants · create: participants via Function (blocks enforced) |
| `proposals` | `ProposalVersion` | read: the two participants · write: **Functions only** (append-only) |
| `bookings` | `BookingRecord` | read: the two participants · write: **Functions only** |
| `paymentRecords` | — | read: the payer · write: payment webhook Function only |
| `payoutRecords` | — | read: the artist · write: payout Function only |
| `availability` | `unavailableDates` | read: `any` · write: owner via Function |
| `savedArtists` | — | read/write: the owner only |
| `notifications` | `MarketplaceNotification` | read/update(`read` flag): the recipient · create: Functions only |
| `reviews` | `Review` | read: `any` when `status=published` · create: Function only (verified booking check) |
| `reports` | `SafetyReport` | create: any signed-in user via Function · read: moderators only |
| `supportTickets` | `SupportTicket` | create: anyone via Function (rate-limited) · read: the creator and support team |
| `auditEvents` | `AuditEvent` | write: Functions only · read: admins only |

Rules:
- **Never** grant guests (`any`) read access to private data (emails, phones, messages, bookings).
- Use document-level permissions (`Permission.read(Role.user(<id>))`) for participant data.
- Add indexes for every field you filter on (e.g. `gigs.status`, `gigs.category`, `applications.gigId`,
  `conversations.clientUserId`, `conversations.artistUserId`, `bookings.eventDate`).
- Copy each collection ID to the matching `VITE_APPWRITE_*_COLLECTION_ID` variable.

## 4. Storage

Create a bucket for portfolio media and copy its ID to `VITE_APPWRITE_STORAGE_BUCKET_ID`:
- Maximum file size: 10 MB. Allowed extensions: `jpg`, `jpeg`, `png`, `webp`.
- Enable antivirus scanning and encryption.
- Permissions: create for signed-in users, read for `any` (portfolio is public), update/delete for
  the file's owner.

## 5. Functions (the trusted backend)

Privileged state changes must run in Appwrite Functions so a modified browser can't bypass the
rules. The rules are already written and unit-tested as pure TypeScript in `src/domain/` — reuse
them inside the Functions.

| Function | Uses | What it must enforce |
|---|---|---|
| `onboarding` | — | set roles/onboarding state on the `users` document |
| `gigs` | `src/domain/gigs.ts` | ownership, `validateGigForPublish`, `assertGigTransition` |
| `applications` | `assertCanApply`, `assertApplicationTransition` | one application per artist per gig, deadlines, gig owner actions |
| `conversations` | `src/domain/proposals.ts` | participants only, blocked users, start inquiry |
| `proposals` | `createProposal`, `respondToProposal`, `withdrawProposal` | append-only versions, one pending at a time, exact-version acceptance, no self-acceptance, expiry — and **create the booking in the same transaction** |
| `bookings` | `src/domain/bookings.ts` | `assertTransition` by participant role; `system` transitions only from webhooks/admin |
| `payments` | see `docs/INTEGRATIONS.md` | server-computed amounts, idempotent orders, signed webhook verification |
| `reviews` | — | reviewer is the client of a *completed* booking, one per booking |
| `notifications` | — | fan-out of in-app + email notifications respecting preferences |

Give Functions an API key with only the scopes they need. Store keys in **Function variables**, never
in `VITE_*`. Add rate limits on support tickets, messages, inquiries and reports.

## 6. Connect the app

1. Implement the `MarketplaceApi` methods in `src/services/backend/appwriteBackend.ts` by calling your
   Functions (`functions.createExecution`) and reading permitted documents (`databases.listDocuments`).
   `snapshot()` should return only what the signed-in user may see — the same shape the demo backend
   returns.
2. Set `VITE_APP_MODE=production` and all Appwrite variables in Vercel → Project → Environment
   Variables.
3. Open `/system/readiness` on the deployment to confirm every item is configured.
4. Test permissions with two real accounts: each must be unable to read the other's conversations,
   bookings and notifications (the demo test suite in `src/services/backend/*.test.ts` lists the cases).
