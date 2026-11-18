import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { NoticeBanner } from "../components/ui/NoticeBanner";
import { creativeCategories, indianCities } from "../data/categories";
import { usePageMeta } from "../hooks/usePageMeta";
import { saveLead } from "../lib/appwriteSubmissions";
import { Link, useRouter } from "../lib/router";
import { useAuth, type ActiveWorkspaceMode } from "../state/AuthContext";

function safeReturnPath(raw: string | null, fallback: string): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}

export function SignInPage() {
  usePageMeta("Sign in", "Sign in to your Cultgig client or artist workspace.");
  const { query, navigate } = useRouter();
  const {
    isAppwriteConfigured,
    sendEmailVerificationOtp,
    completeEmailOtpSignIn,
    signInPrototype,
  } = useAuth();

  const nextPath = query.get("next");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [mode, setMode] = useState<ActiveWorkspaceMode>("client");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otpUserId, setOtpUserId] = useState("");
  const [otpLocal, setOtpLocal] = useState(true);
  const [otpCode, setOtpCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      const res = await sendEmailVerificationOtp(email.trim());
      setOtpUserId(res.userId);
      setOtpLocal(res.local);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send verification code.");
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await completeEmailOtpSignIn({
        userId: otpUserId,
        secret: otpCode.trim(),
        local: otpLocal,
        email,
        displayName: displayName || email.split("@")[0],
        activeMode: mode,
      });
      const defaultDest = mode === "artist" ? "/artist/dashboard" : "/client/dashboard";
      navigate(safeReturnPath(nextPath, defaultDest), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification code did not match.");
    } finally {
      setBusy(false);
    }
  };

  const handlePrototypeAccess = () => {
    const chosenEmail = email.trim() || "preview@cultgig.local";
    const chosenName = displayName.trim() || (mode === "artist" ? "Preview Artist" : "Preview Host");
    signInPrototype({
      email: chosenEmail,
      displayName: chosenName,
      activeMode: mode,
      emailVerified: false,
    });
    const defaultDest = mode === "artist" ? "/artist/dashboard" : "/client/dashboard";
    navigate(safeReturnPath(nextPath, defaultDest), { replace: true });
  };

  return (
    <main id="main-content" className="max-w-[540px] mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-[28px] leading-[1.2] font-bold text-ink-primary">Sign in to Cultgig</h1>
        <p className="type-body text-ink-secondary">
          One account supports both event host (client) and artist workspaces—switch anytime.
        </p>
      </div>

      <NoticeBanner tone="info" title={isAppwriteConfigured ? "Appwrite email verification active" : "Prototype authentication mode"}>
        {isAppwriteConfigured
          ? "Enter your email to receive a one-time verification code via Appwrite."
          : "Appwrite environment variables are not set in this preview. Use local prototype access (or DEV OTP code 123456) to test all client and artist workflows."}
      </NoticeBanner>

      <div className="bg-surface border border-line rounded-xl p-6 space-y-5">
        <div>
          <span className="block type-label text-ink-primary mb-2">Open workspace as</span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setMode("client")}
              className={`min-h-[44px] rounded-md border text-[14px] font-semibold ${
                mode === "client"
                  ? "bg-plum text-white border-plum"
                  : "bg-surface text-ink-secondary border-line hover:border-plum"
              }`}
            >
              Client / Event Host
            </button>
            <button
              type="button"
              onClick={() => setMode("artist")}
              className={`min-h-[44px] rounded-md border text-[14px] font-semibold ${
                mode === "artist"
                  ? "bg-plum text-white border-plum"
                  : "bg-surface text-ink-secondary border-line hover:border-plum"
              }`}
            >
              Artist / Creative Pro
            </button>
          </div>
        </div>

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label htmlFor="signin-name" className="block type-label text-ink-primary mb-1.5">
                Display name
              </label>
              <input
                id="signin-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name or venue name"
                className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[15px]"
              />
            </div>

            <div>
              <label htmlFor="signin-email" className="block type-label text-ink-primary mb-1.5">
                Email address *
              </label>
              <input
                id="signin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[15px]"
              />
            </div>

            {error && (
              <p role="alert" className="type-body-sm text-semantic-error">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2.5">
              <Button type="submit" disabled={busy}>
                <Mail size={16} aria-hidden="true" />
                {busy ? "Sending code..." : "Send email verification code"}
              </Button>
              {!isAppwriteConfigured && (
                <Button variant="outline" onClick={handlePrototypeAccess}>
                  Continue in local prototype mode
                </Button>
              )}
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="type-body-sm text-ink-secondary">
              Enter the 6-digit verification code sent to <strong>{email}</strong>.
              {otpLocal && " (In DEV prototype mode, enter 123456.)"}
            </p>
            <div>
              <label htmlFor="signin-otp" className="block type-label text-ink-primary mb-1.5">
                Verification code *
              </label>
              <input
                id="signin-otp"
                type="text"
                required
                inputMode="numeric"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[15px] tracking-widest tabular-nums"
              />
            </div>
            {error && (
              <p role="alert" className="type-body-sm text-semantic-error">
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={busy}>
                {busy ? "Verifying..." : "Verify & continue"}
              </Button>
              <Button variant="ghost" onClick={() => setStep("email")}>
                Change email
              </Button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-line-light flex flex-wrap items-center justify-between gap-2 type-body-sm">
          <Link to="/forgot-password" className="text-ink-secondary hover:text-plum">
            Trouble signing in?
          </Link>
          <Link to="/sign-up" className="font-semibold text-plum hover:text-plum-hover">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}

export function SignUpPage() {
  usePageMeta("Create account", "Join Cultgig as an artist, event host, or both.");
  const { query, navigate } = useRouter();
  const { signInPrototype } = useAuth();

  const defaultRole = query.get("role") === "artist" ? "artist" : "client";
  const [roleChoice, setRoleChoice] = useState<"client" | "artist" | "both">(defaultRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [category, setCategory] = useState(creativeCategories[0].slug);
  const [consentChecked, setConsentChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please provide your full name and a valid email address.");
      return;
    }
    if (!consentChecked) {
      setError("Please confirm you have reviewed the draft Terms and Privacy Policy.");
      return;
    }

    setBusy(true);
    try {
      await saveLead({
        role: roleChoice === "artist" ? "artist" : "business",
        fullName: fullName.trim(),
        email: email.trim(),
        city,
        category,
        createdAt: new Date().toISOString(),
      });

      const activeMode: ActiveWorkspaceMode = roleChoice === "artist" ? "artist" : "client";
      signInPrototype({
        email: email.trim(),
        displayName: fullName.trim(),
        city,
        activeMode,
        emailVerified: false,
      });
      navigate("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your profile.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main id="main-content" className="max-w-[600px] mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-[28px] leading-[1.2] font-bold text-ink-primary">Join Cultgig</h1>
        <p className="type-body text-ink-secondary">
          Create your account to browse, post structured gig briefs, or set up your artist portfolio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-xl p-6 space-y-4">
        <div>
          <span className="block type-label text-ink-primary mb-2">How will you use Cultgig?</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: "client", label: "Hire artists / Host" },
              { id: "artist", label: "Showcase as artist" },
              { id: "both", label: "Both capabilities" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRoleChoice(opt.id as "client" | "artist" | "both")}
                className={`min-h-[44px] px-3 py-2 rounded-md border text-[13px] font-semibold ${
                  roleChoice === opt.id
                    ? "bg-plum text-white border-plum"
                    : "bg-surface text-ink-secondary border-line hover:border-plum"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="signup-name" className="block type-label text-ink-primary mb-1.5">
            Full name or studio/venue name *
          </label>
          <input
            id="signup-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[15px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="signup-email" className="block type-label text-ink-primary mb-1.5">
              Email address *
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[15px]"
            />
          </div>
          <div>
            <label htmlFor="signup-city" className="block type-label text-ink-primary mb-1.5">
              Primary city
            </label>
            <select
              id="signup-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[14px]"
            >
              {indianCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {roleChoice !== "client" && (
          <div>
            <label htmlFor="signup-category" className="block type-label text-ink-primary mb-1.5">
              Primary creative discipline
            </label>
            <select
              id="signup-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[14px]"
            >
              {creativeCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-1 w-4 h-4 accent-plum"
          />
          <span className="type-body-sm text-ink-secondary">
            I acknowledge the{" "}
            <Link to="/legal/terms" className="text-plum underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/legal/privacy" className="text-plum underline">
              Privacy Policy
            </Link>{" "}
            (pre-launch draft).
          </span>
        </label>

        {error && (
          <p role="alert" className="type-body-sm text-semantic-error">
            {error}
          </p>
        )}

        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Creating profile..." : "Continue to onboarding"}
        </Button>

        <p className="type-body-sm text-ink-secondary text-center">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-plum font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}

export function VerifyEmailPage() {
  usePageMeta("Verify email", "Complete email verification for your Cultgig account.");
  const { user } = useAuth();
  return (
    <main id="main-content" className="max-w-[540px] mx-auto px-4 sm:px-6 py-14 space-y-5">
      <h1 className="type-h1 text-ink-primary">Email verification</h1>
      <div className="bg-surface border border-line rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={22} className="text-plum" aria-hidden="true" />
          <p className="type-h4 text-ink-primary">
            {user?.emailVerified ? "Email verified via session" : "Verification pending or prototype session"}
          </p>
        </div>
        <p className="type-body text-ink-secondary">
          Cultgig uses passwordless Appwrite email OTP verification when backend environment
          variables are connected. Never share one-time codes with anyone.
        </p>
        <Link
          to="/sign-in"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-plum text-white type-button"
        >
          Go to Sign in
        </Link>
      </div>
    </main>
  );
}

export function PasswordRecoveryPage({ mode }: { mode: "forgot" | "reset" }) {
  usePageMeta(
    mode === "forgot" ? "Account recovery" : "Reset access",
    "Cultgig uses passwordless email OTP sign-in."
  );
  return (
    <main id="main-content" className="max-w-[540px] mx-auto px-4 sm:px-6 py-14 space-y-5">
      <h1 className="type-h1 text-ink-primary">
        {mode === "forgot" ? "Passwordless sign-in recovery" : "Reset account access"}
      </h1>
      <div className="bg-surface border border-line rounded-xl p-6 space-y-4">
        <p className="type-body text-ink-secondary">
          Cultgig uses email one-time verification codes (OTP) instead of traditional static
          passwords. Use your registered email address on the Sign in page to request a fresh code.
        </p>
        <Link
          to="/sign-in"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-plum text-white type-button"
        >
          Return to Sign in
        </Link>
      </div>
    </main>
  );
}

export function OnboardingPage() {
  usePageMeta("Onboarding", "Set up your Cultgig artist or client profile preferences.");
  const { user, switchWorkspaceMode } = useAuth();
  const { navigate } = useRouter();
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <main id="main-content" className="max-w-[540px] mx-auto px-4 sm:px-6 py-14 space-y-4">
        <h1 className="type-h1 text-ink-primary">Complete sign-in first</h1>
        <p className="type-body text-ink-secondary">
          Please sign in or create an account to save your workspace onboarding preferences.
        </p>
        <Link
          to="/sign-in?next=/onboarding"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-plum text-white type-button"
        >
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="max-w-[680px] mx-auto px-4 sm:px-6 py-12 space-y-6">
      <h1 className="type-h1 text-ink-primary">Welcome to Cultgig, {user.displayName}</h1>
      <p className="type-body text-ink-secondary">
        Your account supports both client and artist workflows. Choose where you want to start right now:
      </p>

      {saved && (
        <div className="bg-semantic-success-bg border border-semantic-success/30 rounded-md p-4 flex items-center gap-2 text-semantic-success type-label">
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>Workspace preference updated.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface border border-line rounded-lg p-6 space-y-4">
          <h2 className="type-h3 text-ink-primary">Client / Event Host</h2>
          <p className="type-body-sm text-ink-secondary">
            Post a structured gig brief, save shortlisted artists, review proposals, and negotiate terms.
          </p>
          <Button
            onClick={() => {
              switchWorkspaceMode("client");
              setSaved(true);
              navigate("/client/gigs/new");
            }}
          >
            Post your first gig
          </Button>
        </div>

        <div className="bg-surface border border-line rounded-lg p-6 space-y-4">
          <h2 className="type-h3 text-ink-primary">Artist / Creative Pro</h2>
          <p className="type-body-sm text-ink-secondary">
            Edit your bio, upload portfolio proof with ownership consent, set availability, and apply to briefs.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              switchWorkspaceMode("artist");
              setSaved(true);
              navigate("/artist/profile/edit");
            }}
          >
            Edit artist profile
          </Button>
        </div>
      </div>
    </main>
  );
}
