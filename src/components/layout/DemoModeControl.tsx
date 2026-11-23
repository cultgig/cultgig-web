import { useState } from "react";
import { ArrowCounterClockwise, Flask, ListChecks, UserSwitch } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FEATURED_DEMO_ACCOUNTS } from "@/data/demoSeed";
import { isDemoMode } from "@/config/env";
import { Link, useRouter } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { workspaceHome } from "@/state/selectors";

/**
 * Unobtrusive, always-visible demo-mode indicator with quick account switching and data reset.
 * Rendered only when VITE_APP_MODE=demo.
 */
export function DemoModeControl() {
  const { viewer, run, backend } = useMarketplace();
  const { navigate } = useRouter();
  const [open, setOpen] = useState(false);
  if (!isDemoMode) return null;

  const switchTo = async (userId: string) => {
    const user = await run((b) => b.auth.signInAsDemoUser!(userId));
    setOpen(false);
    if (user) navigate(workspaceHome(user));
  };

  const reset = async () => {
    if (!window.confirm("Reset all demo data in this browser? Accounts you created and changes you made will be removed.")) return;
    await run((b) => b.market.resetDemoData!(), { success: "Demo data reset." });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="fixed bottom-20 left-3 z-overlay inline-flex items-center gap-1.5 rounded-full border border-line-subtle bg-brand-light p-2 type-label-sm text-ink shadow-md hover:bg-brand-light-hover lg:bottom-4 lg:px-3 lg:py-1.5"
          aria-label="Demo mode options"
        >
          <Flask size={16} weight="bold" aria-hidden /> <span className="hidden lg:inline">Demo mode</span>
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-80 space-y-3">
        <div className="space-y-1">
          <p className="type-h4 text-ink">You're using demo mode</p>
          <p className="type-body-sm text-ink-secondary">
            Data lives only in this browser. Accounts are not real, no email is sent and no payment is ever collected.
          </p>
        </div>
        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 type-label text-ink">
            <UserSwitch aria-hidden /> Switch demo account
          </p>
          {FEATURED_DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.userId}
              type="button"
              onClick={() => void switchTo(a.userId)}
              disabled={viewer?.id === a.userId}
              className="flex w-full flex-col rounded-lg border border-line px-3 py-2 text-left hover:bg-surface-low disabled:border-line-selected disabled:bg-brand-subtle"
            >
              <span className="type-label text-ink">
                {a.label} {viewer?.id === a.userId && <span className="type-caption text-brand">· signed in</span>}
              </span>
              <span className="type-caption text-ink-secondary">{a.detail}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => void reset()} disabled={!backend.market.resetDemoData}>
            <ArrowCounterClockwise aria-hidden /> Reset data
          </Button>
          <Button asChild variant="ghost" size="sm" className="flex-1">
            <Link to="/system/readiness" onClick={() => setOpen(false)}>
              <ListChecks aria-hidden /> Setup checklist
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
