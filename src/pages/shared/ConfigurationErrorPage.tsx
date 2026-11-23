/**
 * Shown when production mode is selected but the backend isn't configured. Deliberately dependency-light
 * (no router/context) because it renders before the app providers exist. Production never falls back
 * to demo data.
 */
export function ConfigurationErrorPage({ reason }: { reason: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-low p-6">
      <div className="max-w-lg space-y-3 rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <p className="text-[22px] font-semibold tracking-[-0.03em] text-ink-strong">
          cultgig<span className="text-brand">.</span>
        </p>
        <h1 className="type-h2 text-ink-strong">Cultgig is temporarily unavailable</h1>
        <p className="type-body text-ink-secondary">We're finishing setting up this site. Please check back shortly.</p>
        {import.meta.env.DEV && (
          <p className="rounded-lg bg-status-error-soft p-3 type-body-sm text-status-error">
            Developer details: {reason} Set VITE_APP_MODE=demo to run locally without a backend.
          </p>
        )}
      </div>
    </main>
  );
}
