# Security Policy

## Verified Controls in Current Codebase

- **npm dependencies**: Audited via `npm install` with no custom untrusted forks.
- **No secrets in frontend bundle**: `.env` is `.gitignore`'d; `.env.example` contains only placeholder variable names (`VITE_*` for public client config only). No payment gateway secret keys, Appwrite API server keys, or Cloudinary API secrets exist in `src/`.
- **XSS protection**: Zero use of `dangerouslySetInnerHTML`, `innerHTML`, or `eval()`.
- **Production source maps**: Disabled by Vite default.
- **Public URL & Email validation**: `src/config/site.ts` validates `https:` protocol for social URLs and email format before rendering `mailto:` or external links.
- **Dev auth & OTP gating**: `import.meta.env.DEV` strictly gates local development preview helpers in `src/lib/appwriteAuth.ts` and `src/components/dev/DevRoleSwitcher.tsx`. Production builds disable local OTP bypasses.
- **Client-side upload validation**: `src/lib/appwriteStorage.ts` enforces max 10 MB and explicit image/video MIME checks before upload. Server-side Appwrite bucket rules and Cloudinary signed-upload rules are required in production.
- **Security headers**: Configured in `vercel.json` (`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Frame-Options: DENY`).

---

## Mandatory Pre-Launch Infrastructure Checklist

### 1. Appwrite Console Permissions (Manual Verification Required)
Before launching with live user data:
- **Onboarding / Submissions collection**: `any/guest` may have `create` only; **remove `read`/`update`/`delete` for guests**. Only authenticated team/admin roles may read all submissions.
- **Private user profiles, messages, proposals, bookings, paymentRecords**: Restrict read/write to explicit document owner/participant user IDs (`user:<id>`) and server Functions. Never trust client-submitted verification badges, booking paid statuses, or fee calculations.
- **Media Storage Bucket**: Enforce maximum file size, allowed MIME extensions, and anti-abuse rate limits inside the Appwrite console.

### 2. Cloudinary Signed Uploads (Backend Required)
When activating live Cloudinary portfolio uploads:
- Generate upload signatures inside a server-side Appwrite Function or serverless endpoint using `CLOUDINARY_API_SECRET` (server env only).
- Whitelist target folders, strip EXIF/GPS metadata where appropriate, and validate file magic bytes server-side.

### 3. Payment Security (Backend Required)
- Do not activate checkout until Razorpay Route or Cashfree Easy Split approves Cultgig's legal entity and marketplace model.
- Compute `grossAmount`, `platformFee`, `taxes`, and `artistShare` in integer paise strictly on the server from the mutually accepted proposal record.
- Verify cryptographic webhook signatures and enforce idempotency keys and event deduplication before confirming bookings.

---

**Last Updated**: 2026-11-17  
**Next Review**: Prior to Appwrite production database provisioning & payment gateway onboarding
