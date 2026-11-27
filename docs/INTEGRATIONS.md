# Integrations: Google sign-in, email (SMTP) and payments

Each integration is **off** until it is configured and tested. The app never pretends an
integration works: Google sign-in shows as unavailable, demo mode never sends email, and checkout
never marks anything as paid.

---

## Google OAuth (via Appwrite)

1. In **Google Cloud Console → APIs & Services → Credentials**, create an *OAuth client ID* of type
   *Web application*.
2. In the **Appwrite Console → Auth → Settings → OAuth2 Providers → Google**, enable Google and paste
   the client ID and secret. Appwrite shows a **redirect URI** — add it to the Google client's
   *Authorised redirect URIs*.
3. Make sure your domains are added as Web platforms in Appwrite (see `APPWRITE_SETUP.md`).
4. Set `VITE_GOOGLE_OAUTH_ENABLED=true` and redeploy.
5. Test: *Continue with Google* → Google consent → back to `/auth/callback` → your workspace.
   A failed or cancelled sign-in returns to `/sign-in?error=oauth` with a clear message.

The Google client secret lives only in the Appwrite console. It must never appear in `.env`.

## Email (SMTP)

Appwrite sends verification and password-recovery emails through your SMTP provider.

1. Choose a transactional provider (e.g. Amazon SES, Postmark, SendGrid, Zoho ZeptoMail).
2. Verify your sending domain (SPF, DKIM and DMARC records).
3. In **Appwrite → Settings → SMTP**, enter the host, port, username, password and sender address.
4. Send a test verification email to yourself. Only then treat email as live.

Marketplace emails (new inquiry, application, proposal received, counter-offer, offer accepted,
booking confirmed, reminders, cancellation, review request) should be sent by the `notifications`
Function, respecting each user's settings (`UserSettings.notifications`). The in-app notification
centre already shows all of these events.

## Payments

### Status: not active — and intentionally so

Cultgig sells human creative services from many independent artists. That is a **multi-vendor
marketplace**, which most payment gateways treat as a separate, higher-scrutiny category. See
`PAYMENTS_AND_COMPLIANCE.md` for the provider assessment (including why Dodo Payments is excluded).

### Blockers before going live

1. A registered legal entity, bank account, PAN/GSTIN and published policies.
2. **Written approval** from a marketplace provider such as **Razorpay Route** or **Cashfree Easy
   Split** for Cultgig's categories and fund flow.
3. Artist KYC and bank verification through the provider's linked-account onboarding.
4. Server-side Functions (below) deployed and tested in the provider's test mode.

### How it plugs in

The UI already has: checkout (`/checkout/:bookingId`), payment pending/success/failure pages,
transaction history (`/client/payments`), booking payment summaries and artist earnings. They read
`BookingRecord.paymentStatus` and never decide payment success themselves.

The Vercel API routes provide Razorpay Standard Checkout order creation and signature
verification (`api/create-order.js`, `api/verify-payment.js`). They are an integration
foundation only; they do not authorize a marketplace fund flow, persist payment records, or mark
bookings as paid. Keep both `VITE_PAYMENTS_ENABLED` and `PAYMENTS_ENABLED` false until the blockers
above are resolved and the full Appwrite payment/webhook Functions are deployed.

Configure these variables in the server environment (and locally in ignored `.env`):

- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (server only)
- `VITE_RAZORPAY_KEY_ID` (public key ID only)
- `PAYMENTS_ENABLED=true` and `VITE_PAYMENTS_ENABLED=true` only after approval

Use `vercel dev` for local testing of `/api/*`; Vite's `npm run dev` serves only the frontend.
The order endpoint validates integer paise and INR, but this interim route accepts the amount from
the browser. Do not deploy it for real booking collection until it is changed to load the
accepted-proposal amount from trusted server-side data, authenticate the booking owner, and add
idempotency and webhook reconciliation.

Implement a provider behind this interface in an Appwrite Function (never in the browser):

```ts
interface PaymentProvider {
  createOrder(input: { bookingId: string; amountPaise: number; idempotencyKey: string }): Promise<{ orderId: string }>;
  fetchPaymentStatus(orderId: string): Promise<"pending" | "paid" | "failed">;
  verifyWebhook(rawBody: string, signature: string): boolean; // HMAC with the webhook secret
  initiateRefund(paymentId: string, amountPaise: number, idempotencyKey: string): Promise<{ refundId: string }>;
  createTransfer(paymentId: string, linkedAccountId: string, amountPaise: number): Promise<{ transferId: string }>;
  fetchSettlement(settlementId: string): Promise<{ status: string; amountPaise: number }>;
}
```

Rules the Functions must follow:
- Read the amount from the **accepted proposal version** in the database. Never accept an amount from
  the browser. All amounts are integer **paise**.
- Use an idempotency key per booking so double-clicks can't create two orders.
- Confirm a booking (`awaiting_payment → confirmed`, actor `system`) **only** from a webhook whose
  signature you have verified. A browser redirect to `/payment/success` proves nothing — that page
  says so.
- Record every payment, refund and transfer in `paymentRecords` / `payoutRecords` and `auditEvents`.
- Keep the provider key and webhook secret in Function variables only.

When all of that is live, set `VITE_PAYMENTS_ENABLED=true` and replace `createPaymentOrder` in the
Appwrite backend with a call to your payments Function.
