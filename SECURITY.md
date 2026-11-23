# Security

Last reviewed: 23 November 2026.

## Reporting a vulnerability

Email the address in `VITE_SUPPORT_EMAIL` with steps to reproduce. Please don't open a public issue.

## How Cultgig is protected

### Authorisation lives in the backend, not the UI
- Every marketplace action goes through the `Backend` interface (`src/services/backend`). The backend
  checks the signed-in user on every call and enforces the rules in `src/domain` (proposal
  versioning, exact-version acceptance, booking state machine, application and gig transitions).
- The backend returns only what the viewer may see (`snapshot()`): their own conversations,
  bookings, applications and notifications, plus public data. Route guards in `src/app/guards.tsx`
  are a convenience only.
- Records that don't exist and records that belong to someone else return the same "not found"
  response, so IDs can't be probed.
- Mutations copy only allow-listed fields (`pick(...)` in `demoBackend.ts`), so a tampered request
  can't overwrite owners, IDs, status or sample flags (mass-assignment protection).

### Transactions
- Proposals are append-only. Acceptance must name the exact proposal ID **and** version; stale,
  superseded, expired, own, or already-accepted offers are rejected. The booking is created in the
  same write as the acceptance.
- Booking transitions are validated per role. Only the trusted backend (`system`) can confirm
  payment. Demo mode can confirm a booking only with payment status `not_collected_demo` — never
  `paid`.
- Money is integer paise, computed by the backend from the accepted proposal.
- There is no fake payment success: `createPaymentOrder` fails clearly until a real provider and
  signed-webhook Function exist.

### Browser
- No `dangerouslySetInnerHTML`, `innerHTML` or `eval`. All user text is rendered as text.
- Linked portfolio media must be `https:` URLs. Uploaded images are re-encoded through a canvas
  (strips metadata, normalises format) and limited to JPG/PNG/WebP up to 10 MB.
- `?next=` redirects accept same-site paths only (`safeNextPath`) — no open redirects.
- External links get `rel="noopener noreferrer"`.
- User input is trimmed, length-limited and stripped of null bytes server-side.
- Security headers in `vercel.json`: strict Content-Security-Policy (`script-src 'self'`,
  `object-src 'none'`, `frame-ancestors 'none'`), HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, `Cross-Origin-Opener-Policy`, and a restrictive `Permissions-Policy`. The full
  app was tested end-to-end under this CSP with zero violations.

### Secrets
- Only public identifiers use `VITE_*` variables. `.env` is git-ignored. No API keys, SMTP passwords,
  OAuth secrets or payment keys exist anywhere in `src/`.
- Production builds without backend configuration show a "temporarily unavailable" page. They never
  fall back to demo data. Developer details appear only in development builds.

### Privacy
- Password reset gives the same response whether or not an account exists (no account enumeration).
- Phone numbers and emails are never shown on public profiles.
- Users can block others (blocked users can't message or send inquiries), report profiles, gigs,
  reviews and users, hide their profile, and request deactivation.

### Dependencies
`bun audit` (23 Nov 2026): no known vulnerabilities in 287 packages. Re-run before every release.

## Demo mode is not secure — by design

Demo mode stores everything, including salted SHA-256 password hashes for demo sign-ups, in the
visitor's own `localStorage`. Anyone with access to that browser can read or change it. That's
acceptable only because demo data is illustrative, never shared between devices, and clearly
labelled. Never use demo mode for real users or real data.

## Before launch (owner checklist)

- [ ] Appwrite collection and bucket permissions set exactly as in `docs/APPWRITE_SETUP.md`, then
      tested with two real accounts.
- [ ] Privileged actions implemented as Appwrite Functions reusing `src/domain`; API keys scoped and
      stored as Function variables.
- [ ] Rate limits on sign-in, sign-up, password reset, messages, inquiries, reports and support tickets.
- [ ] SMTP domain authentication (SPF, DKIM, DMARC) verified.
- [ ] Payment provider approval, idempotent orders and HMAC webhook verification
      (`docs/INTEGRATIONS.md`).
- [ ] If `VITE_APPWRITE_ENDPOINT` is not on `https:`, or you add third-party scripts, update the CSP in
      `vercel.json`.
- [ ] Legal pages reviewed by Indian counsel (DPDP Act 2023, Consumer Protection (E-Commerce) Rules
      2020, IT Rules 2021) and grievance officer details published.
