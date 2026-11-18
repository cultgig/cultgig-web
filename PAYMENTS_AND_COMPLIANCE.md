# Cultgig — Payments, Marketplace Structure & Regulatory Compliance

Last Updated: 2026-11-17  
Status: **Pre-Launch Architecture & Compliance Blueprint (Not Legal Advice)**

---

## 1. Provider Compatibility Assessment

### 1.1 Dodo Payments — Excluded for Marketplace Booking Checkout
Per Dodo Payments' published Merchant Acceptance Policy (`https://docs.dodopayments.com/miscellaneous/merchant-acceptance`), Dodo Payments does **not** support:
- manual human digital/custom services (freelancing, coaching, consulting, custom work);
- multi-vendor marketplaces / resale models where a platform collects and distributes funds to third-party sellers;
- event ticketing or event booking models.

**Architectural Decision**: Cultgig will **not** route artist booking payments or marketplace split transactions through Dodo Payments unless Dodo's compliance team issues explicit written approval covering Cultgig's exact marketplace structure. Cultgig must never misclassify human artist services as SaaS or digital downloads.

### 1.2 Candidate Indian Marketplace Payment Providers
Cultgig is evaluating the following India-compliant split-payment architectures:

1. **Razorpay Route** (`https://razorpay.com/route/`, `https://razorpay.com/terms/`)
   - Linked account onboarding for independent artists/vendors, split transfers (`transfers` API), settlement holds, and refund reversals.
   - Requires master-merchant onboarding, marketplace contract approval, seller KYC/bank verification, and category-level review.
2. **Cashfree Easy Split** (`https://www.cashfree.com/easy-split/split-payment-gateway/`)
   - Built for multi-vendor order splitting, vendor KYC/bank verification APIs, and split settlement reconciliation.
   - Requires platform onboarding and written approval of Cultgig's artist service categories and fund-flow model.

**No Approval Guarantee**: Website copy, legal pages, or UI design cannot guarantee gateway approval. Providers evaluate the legal applicant, beneficial owners, bank account, policies, and operational fund flow.

---

## 2. Target Fund-Flow Architecture (Server-Side Only)

```
[Client Browser]
   │ 1. Accepts versioned proposal (Proposal vN)
   │ 2. Requests checkout order (POST /api/payments/create-order { bookingId })
   ▼
[Trusted Backend / Appwrite Function]
   │ 3. Verifies auth session, buyer == booking.clientId, booking.status == 'awaiting_payment'
   │ 4. Computes grossAmount (paise), disclosed platformFee (paise), taxes, artistShare (paise)
   │    from immutable server-side accepted proposal record (NEVER trusts client amounts)
   │ 5. Calls Provider Adapter (createMarketplaceOrder with idempotencyKey)
   ▼
[Approved Payment Provider Checkout (Razorpay Route / Cashfree Easy Split)]
   │ 6. Buyer completes UPI / Card / NetBanking payment
   │ 7. Asynchronous signed webhook sent to Backend (/api/payments/webhook)
   ▼
[Trusted Backend Webhook Handler]
   │ 8. Verifies cryptographic HMAC signature & checks event deduplication table
   │ 9. Updates paymentRecords + transitions booking to 'confirmed'
   │ 10. Records split transfer / settlement schedule + audit event
```

### Server-Side Provider Adapter Contract
All payment operations reside exclusively in server-side functions (`functions/payments/providerAdapter.ts` when deployed):
- `createCustomerPayment(...)`
- `createMarketplaceOrder(...)`
- `createLinkedAccount(...)`
- `createTransfer(...)`
- `refundPayment(...)`
- `getPaymentStatus(...)`
- `verifyWebhook(...)`
- `reconcileSettlement(...)`

### Security & Reconciliation Controls
- Amounts stored as integer **paise** (`INR * 100`) to avoid floating-point errors.
- Idempotency keys required on order creation, transfers, and refunds.
- Never mark a booking `confirmed` from a browser redirect URL; rely strictly on verified server-side webhooks or server-side status polling.
- Never log or store card numbers, CVV, UPI PINs, or raw banking credentials.

---

## 3. India Regulatory & Compliance Checklist

1. **DPDP Act, 2023 & DPDP Rules, 2025**:
   - Clear notice of personal data collected, purpose, and retention.
   - Granular consent (no pre-ticked consent boxes).
   - Data Principal rights: access, correction, erasure, consent withdrawal, and grievance redressal.
   - **No Gmail Integration**: Cultgig does not connect to Gmail or request Google inbox scopes.
2. **Consumer Protection (E-Commerce) Rules, 2020**:
   - Clear legal identity, principal address, and grievance officer contact details.
   - Transparent separation between Cultgig (intermediary platform) and independent artists (service providers).
   - Clear total price and fee/tax breakdown before payment.
   - Explicit cancellation, rescheduling, no-show, force majeure, and refund request workflows.
   - No dark patterns, fake urgency counters, fake crossed-out discounts, or fabricated reviews.

---

## 4. Exact Owner Questions / Blockers Before Launch

Before applying for Razorpay Route / Cashfree Easy Split or enabling live checkout, the owner must provide:
1. Legal entity name & entity type (Proprietorship, Partnership, LLP, Private Limited).
2. Registered/principal business address and state of jurisdiction.
3. PAN, CIN/LLPIN (if applicable), and GSTIN status (with CA confirmation on TCS/TDS/GST applicability for marketplace splits).
4. Official support email, working support phone number (if any), and Grievance Officer name + email.
5. Final commercial model (whether Cultgig charges a client fee, artist commission, or subscription, and exact refund/cancellation windows).
6. Legal counsel sign-off on Terms, Privacy Policy, Refund & Cancellation Policy, Artist Agreement, and Client Agreement.
