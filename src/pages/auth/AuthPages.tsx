import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Envelope, Flask, GoogleLogo, PaintBrush, Storefront } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Wordmark } from "@/components/layout/SiteHeader";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { Field } from "@/components/shared/primitives";
import { PageSkeleton } from "@/components/shared/states";
import { appConfig, isDemoMode } from "@/config/env";
import { FEATURED_DEMO_ACCOUNTS } from "@/data/demoSeed";
import { toUserMessage } from "@/domain/errors";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link, Navigate, safeNextPath, useRouter } from "@/lib/router";
import { cn } from "@/lib/utils";
import { useMarketplace } from "@/state/MarketplaceContext";
import { workspaceHome } from "@/state/selectors";
import type { MarketplaceRole, UserAccount } from "@/types/marketplace";

/** Demo mode only: verification code handed from sign-up to the verify screen (never emailed). */
let pendingDemoCode: string | undefined;

function AuthLayout({ title, description, children, footer }: { title: string; description?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <main id="main-content" className="flex min-h-[calc(100vh-64px)] items-start justify-center bg-surface-low px-4 py-10 sm:items-center">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
          <div className="space-y-1.5">
            <Wordmark className="mb-4 inline-block" />
            <h1 className="type-h1 text-ink-strong">{title}</h1>
            {description && <p className="type-body text-ink-secondary">{description}</p>}
          </div>
          {children}
        </div>
        {footer && <div className="text-center type-body-sm text-ink-secondary">{footer}</div>}
      </div>
    </main>
  );
}

function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg border border-status-error-border bg-status-error-soft px-3 py-2 type-body-sm text-status-error">
      {message}
    </p>
  );
}

function GoogleButton({ label }: { label: string }) {
  const { backend } = useMarketplace();
  const [error, setError] = useState("");
  const enabled = appConfig.googleOAuthEnabled && !isDemoMode;
  return (
    <div className="space-y-1.5">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={!enabled}
        onClick={async () => {
          setError("");
          try {
            await backend.auth.signInWithGoogle();
          } catch (e) {
            setError(toUserMessage(e));
          }
        }}
      >
        <GoogleLogo weight="bold" aria-hidden /> {label}
      </Button>
      {!enabled && <p className="text-center type-caption text-ink-secondary">Google sign-in will be available once it's configured.</p>}
      {error && <p role="alert" className="type-caption text-status-error">{error}</p>}
    </div>
  );
}

function useRedirectIfSignedIn() {
  const { viewer, loading } = useMarketplace();
  const { query } = useRouter();
  if (loading || !viewer) return null;
  return safeNextPath(query.get("next"), workspaceHome(viewer));
}

export function SignInPage() {
  usePageMeta("Sign in", "Sign in to your Cultgig account.");
  const { backend, refresh, loading } = useMarketplace();
  const { navigate, query } = useRouter();
  const redirect = useRedirectIfSignedIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(query.get("error") === "oauth" ? "Google sign-in didn't complete. Please try again." : "");
  const [busy, setBusy] = useState(false);

  if (loading) return <PageSkeleton rows={1} />;
  if (redirect && !busy) return <Navigate to={redirect} />;

  const finish = async (user: UserAccount) => {
    await refresh();
    navigate(safeNextPath(query.get("next"), workspaceHome(user)), { replace: true });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await finish(await backend.auth.signIn(email, password));
    } catch (err) {
      setError(toUserMessage(err));
      setBusy(false);
    }
  };

  const demo = async (userId: string) => {
    setBusy(true);
    try {
      await finish(await backend.auth.signInAsDemoUser!(userId));
    } catch (err) {
      setError(toUserMessage(err));
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to manage gigs, messages and bookings."
      footer={
        <>
          New to Cultgig?{" "}
          <Link to={`/sign-up${query.get("next") ? `?next=${encodeURIComponent(query.get("next")!)}` : ""}`} className="font-semibold text-brand hover:text-brand-hover">
            Create an account
          </Link>
        </>
      }
    >
      {isDemoMode && backend.auth.signInAsDemoUser && (
        <div className="space-y-2 rounded-xl border border-line-subtle bg-brand-light-subtle p-4">
          <p className="flex items-center gap-1.5 type-label text-ink">
            <Flask aria-hidden /> Demo mode — try a sample account
          </p>
          <p className="type-caption text-ink-secondary">These are illustrative accounts stored in this browser. No real people or payments.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {FEATURED_DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.userId}
                type="button"
                disabled={busy}
                onClick={() => void demo(a.userId)}
                className="rounded-lg border border-line bg-surface px-3 py-2 text-left hover:bg-surface-low disabled:opacity-60"
              >
                <span className="block type-label text-ink">{a.label}</span>
                <span className="block type-caption text-ink-secondary">{a.detail.split(" · ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <GoogleButton label="Continue with Google" />
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="type-caption text-ink-secondary">or with email</span>
        <Separator className="flex-1" />
      </div>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <FormError message={error} />
        <Field id="si-email" label="Email">
          <Input id="si-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field id="si-password" label="Password">
          <Input id="si-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="type-body-sm text-brand hover:text-brand-hover">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export function SignUpPage() {
  usePageMeta("Create your account", "Join Cultgig as an artist or a client.");
  const { backend, refresh, loading } = useMarketplace();
  const { navigate, query } = useRouter();
  const redirect = useRedirectIfSignedIn();
  const initialRole: MarketplaceRole = query.get("role") === "artist" ? "artist" : "client";
  const [role, setRole] = useState<MarketplaceRole>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <PageSkeleton rows={1} />;
  if (redirect && !busy) return <Navigate to={redirect} />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    if (!agree) next.agree = "Please accept the terms to continue.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    setFormError("");
    try {
      const result = await backend.auth.signUp({ email, password, displayName: name, role });
      pendingDemoCode = result.demoVerificationCode;
      await refresh();
      const after = safeNextPath(query.get("next"), `/onboarding/${role}`);
      navigate(`/verify-email?next=${encodeURIComponent(after)}`, { replace: true });
    } catch (err) {
      setFormError(toUserMessage(err));
      setBusy(false);
    }
  };

  const roleOption = (value: MarketplaceRole, icon: ReactNode, title: string, body: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={role === value}
      onClick={() => setRole(value)}
      className={cn("flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors", role === value ? "border-line-selected bg-brand-subtle" : "border-line hover:bg-surface-low")}
    >
      <span className={role === value ? "text-brand" : "text-ink-secondary"}>{icon}</span>
      <span className="type-label text-ink">{title}</span>
      <span className="type-caption text-ink-secondary">{body}</span>
    </button>
  );

  return (
    <AuthLayout
      title="Create your Cultgig account"
      description="One account works for hiring and for offering your services. You can add the other role any time."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="font-semibold text-brand hover:text-brand-hover">
            Sign in
          </Link>
        </>
      }
    >
      <div role="radiogroup" aria-label="I want to" className="grid grid-cols-2 gap-3">
        {roleOption("client", <Storefront size={22} aria-hidden />, "Hire artists", "For individuals, businesses and planners")}
        {roleOption("artist", <PaintBrush size={22} aria-hidden />, "Offer my services", "For artists, performers and teams")}
      </div>
      <GoogleButton label="Sign up with Google" />
      <form onSubmit={submit} className="space-y-4" noValidate>
        <FormError message={formError} />
        <Field id="su-name" label={role === "artist" ? "Your name" : "Your name"} error={errors.name}>
          <Input id="su-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(errors.name)} />
        </Field>
        <Field id="su-email" label="Email" error={errors.email}>
          <Input id="su-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(errors.email)} />
        </Field>
        <Field id="su-password" label="Password" hint="At least 8 characters." error={errors.password}>
          <Input id="su-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={Boolean(errors.password)} />
        </Field>
        <div className="space-y-1">
          <label className="flex items-start gap-2 type-body-sm text-ink-secondary">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 size-4 accent-[rgb(var(--color-brand-primary))]" />
            <span>
              I agree to the <Link to="/legal/terms" className="text-brand underline-offset-2 hover:underline">terms</Link> and{" "}
              <Link to="/legal/privacy" className="text-brand underline-offset-2 hover:underline">privacy policy</Link>
              {role === "artist" ? (
                <>
                  , and the <Link to="/legal/artist-agreement" className="text-brand underline-offset-2 hover:underline">artist agreement</Link>
                </>
              ) : null}
              .
            </span>
          </label>
          {errors.agree && <p role="alert" className="type-caption text-status-error">{errors.agree}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </Button>
        {isDemoMode && <p className="text-center type-caption text-ink-secondary">Demo mode: your account is stored only in this browser.</p>}
      </form>
    </AuthLayout>
  );
}

export function VerifyEmailPage() {
  usePageMeta("Verify your email");
  const { backend, viewer, loading, refresh } = useMarketplace();
  const { navigate, query } = useRouter();
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState<string | undefined>(pendingDemoCode);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "sent">("idle");
  const linkAttempted = useRef(false);
  const next = safeNextPath(query.get("next"), viewer ? workspaceHome(viewer) : "/");
  const userId = query.get("userId");
  const secret = query.get("secret");

  // Appwrite email links arrive with ?userId=&secret=.
  useEffect(() => {
    if (!userId || !secret || linkAttempted.current) return;
    linkAttempted.current = true;
    setStatus("verifying");
    backend.auth
      .confirmEmailVerification({ userId, secret })
      .then(async () => {
        await refresh();
        navigate(next, { replace: true });
      })
      .catch((e) => {
        setError(toUserMessage(e));
        setStatus("idle");
      });
  }, [backend, userId, secret, refresh, navigate, next]);

  if (loading) return <PageSkeleton rows={1} />;
  if (!viewer && !userId) return <Navigate to={`/sign-in?next=${encodeURIComponent("/verify-email")}`} />;
  if (viewer?.emailVerified) {
    return (
      <AuthLayout title="Your email is verified" description="You're all set.">
        <Button className="w-full" onClick={() => navigate(next)}>
          Continue
        </Button>
      </AuthLayout>
    );
  }

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code.");
      return;
    }
    setStatus("verifying");
    setError("");
    try {
      await backend.auth.confirmEmailVerification({ code });
      pendingDemoCode = undefined;
      await refresh();
      navigate(next, { replace: true });
    } catch (err) {
      setError(toUserMessage(err));
      setStatus("idle");
    }
  };

  const resend = async () => {
    setError("");
    try {
      const r = await backend.auth.requestEmailVerification();
      setDemoCode(r.demoCode);
      setStatus("sent");
    } catch (err) {
      setError(toUserMessage(err));
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      description={
        isDemoMode ? (
          "In demo mode no email is sent. Use the code shown below."
        ) : (
          <>
            We sent a verification link to <strong className="text-ink">{viewer?.email}</strong>. Open it on this device to finish.
          </>
        )
      }
    >
      {status === "verifying" && userId ? (
        <p className="type-body text-ink-secondary">Verifying your email…</p>
      ) : (
        <>
          <FormError message={error} />
          {isDemoMode ? (
            <form onSubmit={verify} className="space-y-4" noValidate>
              {demoCode ? (
                <NoticeBanner title={`Demo verification code: ${demoCode}`}>Shown here because demo mode never sends email.</NoticeBanner>
              ) : (
                <NoticeBanner title="Need a code?">Select “Get a new code” to generate one.</NoticeBanner>
              )}
              <Field id="ve-code" label="6-digit code">
                <Input id="ve-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
              </Field>
              <Button type="submit" size="lg" className="w-full" disabled={status === "verifying"}>
                Verify email
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-3 rounded-lg bg-surface-low p-4">
              <Envelope size={24} className="text-brand" aria-hidden />
              <p className="type-body-sm text-ink-secondary">Didn't get it? Check spam, or request a new link.</p>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button variant="link" className="px-0" onClick={() => void resend()}>
              {isDemoMode ? "Get a new code" : "Resend link"}
            </Button>
            {status === "sent" && <span className="type-caption text-status-success">{isDemoMode ? "New code generated." : "Link sent."}</span>}
            <Button variant="ghost" onClick={() => navigate(next)}>
              Do this later
            </Button>
          </div>
        </>
      )}
    </AuthLayout>
  );
}

export function ForgotPasswordPage() {
  usePageMeta("Reset your password");
  const { backend } = useMarketplace();
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    try {
      const r = await backend.auth.requestPasswordReset(email);
      setSent(true);
      if (isDemoMode && r.demoCode) navigate(`/reset-password?email=${encodeURIComponent(email.trim())}&demoCode=${r.demoCode}`);
    } catch (err) {
      setError(toUserMessage(err));
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter the email you signed up with. If it matches an account, we'll send reset instructions."
      footer={
        <Link to="/sign-in" className="inline-flex items-center gap-1 text-brand hover:text-brand-hover">
          <ArrowLeft aria-hidden /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <NoticeBanner title="Check your email">If an account exists for {email}, a reset link is on its way. It expires soon, so use it shortly.</NoticeBanner>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <FormError message={error} />
          <Field id="fp-email" label="Email">
            <Input id="fp-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          {isDemoMode && <p className="type-caption text-ink-secondary">Demo mode: works for accounts you created in this browser. Sample accounts don't have passwords.</p>}
          <Button type="submit" size="lg" className="w-full">
            Send reset instructions
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  usePageMeta("Choose a new password");
  const { backend } = useMarketplace();
  const { navigate, query } = useRouter();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const email = query.get("email") ?? "";
  const userId = query.get("userId") ?? undefined;
  const secret = query.get("secret") ?? undefined;
  const demoCode = query.get("demoCode");
  const linkMode = Boolean(userId && secret);

  if (!linkMode && !isDemoMode) {
    return (
      <AuthLayout title="This reset link is incomplete" description="Request a new password reset email and open the latest link.">
        <Button asChild className="w-full">
          <Link to="/forgot-password">Request a new link</Link>
        </Button>
      </AuthLayout>
    );
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The passwords don't match.");
    if (!linkMode && !/^\d{6}$/.test(code)) return setError("Enter the 6-digit code.");
    setBusy(true);
    setError("");
    try {
      await backend.auth.resetPassword({ email, code, userId, secret, password });
      navigate("/sign-in?reset=1", { replace: true });
    } catch (err) {
      setError(toUserMessage(err));
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Choose a new password">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <FormError message={error} />
        {!linkMode && (
          <>
            {demoCode && <NoticeBanner title={`Demo reset code: ${demoCode}`}>Demo mode never sends email.</NoticeBanner>}
            <Field id="rp-code" label="6-digit code">
              <Input id="rp-code" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
            </Field>
          </>
        )}
        <Field id="rp-pass" label="New password" hint="At least 8 characters.">
          <Input id="rp-pass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Field id="rp-confirm" label="Confirm new password">
          <Input id="rp-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}

export function AuthCallbackPage() {
  const { backend, refresh } = useMarketplace();
  const { navigate } = useRouter();
  const [error, setError] = useState("");
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    backend.auth
      .completeOAuth()
      .then(async (user) => {
        await refresh();
        navigate(workspaceHome(user), { replace: true });
      })
      .catch((e) => setError(toUserMessage(e)));
  }, [backend, refresh, navigate]);
  return (
    <AuthLayout title={error ? "Sign-in didn't complete" : "Signing you in…"} description={error || "One moment."}>
      {error && (
        <Button asChild className="w-full">
          <Link to="/sign-in">Back to sign in</Link>
        </Button>
      )}
    </AuthLayout>
  );
}
