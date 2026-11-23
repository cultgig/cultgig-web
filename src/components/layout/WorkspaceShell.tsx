import { useState, type ReactNode } from "react";
import { ArrowsLeftRight, DotsThreeOutline } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { workspaceNav, type WorkspaceNavItem } from "@/config/workspaceNav";
import { Link, useRouter } from "@/lib/router";
import { cn } from "@/lib/utils";
import { useMarketplace } from "@/state/MarketplaceContext";
import { totalUnreadMessages } from "@/state/selectors";
import type { MarketplaceRole } from "@/types/marketplace";

function useBadges() {
  const { viewer, conversations, notifications } = useMarketplace();
  if (!viewer) return { messages: 0, notifications: 0, proposals: 0 };
  const proposals = conversations.filter((c) => c.proposals.some((p) => p.status === "pending" && p.proposedByUserId !== viewer.id)).length;
  return {
    messages: totalUnreadMessages(conversations, viewer.id),
    notifications: notifications.filter((n) => !n.read).length,
    proposals,
  };
}

function isActive(pathname: string, item: WorkspaceNavItem) {
  if (item.path.endsWith("/dashboard")) return pathname === item.path;
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

function NavLink({ item, pathname, count, onNavigate }: { item: WorkspaceNavItem; pathname: string; count: number; onNavigate?: () => void }) {
  const active = isActive(pathname, item);
  const IconCmp = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 type-body font-medium transition-colors",
        active ? "bg-brand-subtle text-brand" : "text-ink-secondary hover:bg-surface-low hover:text-ink",
      )}
    >
      <IconCmp size={19} weight={active ? "fill" : "regular"} aria-hidden />
      <span className="flex-1">{item.label}</span>
      {count > 0 && (
        <span className="rounded-full bg-brand px-1.5 text-[11px] font-semibold leading-5 text-ink-inverse">
          {count > 9 ? "9+" : count}
          <span className="sr-only"> new</span>
        </span>
      )}
    </Link>
  );
}

/** Role workspace layout: sidebar on desktop, bottom navigation + "More" sheet on mobile. */
export function WorkspaceShell({ role, children }: { role: MarketplaceRole; children: ReactNode }) {
  const { pathname, navigate } = useRouter();
  const { viewer, run } = useMarketplace();
  const badges = useBadges();
  const [moreOpen, setMoreOpen] = useState(false);
  const items = workspaceNav[role];
  const mobileItems = items.filter((i) => i.mobile);
  const other: MarketplaceRole = role === "artist" ? "client" : "artist";

  const switchRole = async () => {
    if (!viewer) return;
    await run((b) => b.market.setActiveRole(other));
    navigate(viewer.onboarding[other] === "complete" ? `/${other}/dashboard` : `/onboarding/${other}`);
  };

  return (
    <div className="page-container flex gap-8 pb-24 pt-6 lg:pb-12">
      <aside className="sticky top-[calc(var(--header-height)+24px)] hidden h-fit w-60 shrink-0 lg:block" aria-label={`${role === "artist" ? "Artist" : "Client"} workspace`}>
        <p className="mb-2 px-3 type-label-sm uppercase tracking-wide text-ink-secondary">{role === "artist" ? "Artist workspace" : "Client workspace"}</p>
        <nav className="space-y-0.5">
          {items.map((item) => (
            <NavLink key={item.path} item={item} pathname={pathname} count={item.badge ? badges[item.badge] : 0} />
          ))}
        </nav>
        <Button variant="outline" className="mt-4 w-full justify-start" onClick={() => void switchRole()}>
          <ArrowsLeftRight aria-hidden /> Switch to {other === "artist" ? "artist" : "client"}
        </Button>
      </aside>

      <main id="main-content" className="min-w-0 flex-1">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav aria-label="Workspace" className="pb-safe fixed inset-x-0 bottom-0 z-header border-t border-line bg-surface lg:hidden">
        <ul className="grid grid-cols-5">
          {mobileItems.map((item) => {
            const active = isActive(pathname, item);
            const IconCmp = item.icon;
            const count = item.badge ? badges[item.badge] : 0;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  aria-current={active ? "page" : undefined}
                  className={cn("relative flex flex-col items-center gap-0.5 py-2 type-metadata", active ? "text-brand" : "text-ink-secondary")}
                >
                  <IconCmp size={22} weight={active ? "fill" : "regular"} aria-hidden />
                  {item.label.replace("Discover gigs", "Gigs").replace("Find artists", "Explore")}
                  {count > 0 && <span className="absolute right-[22%] top-1.5 size-2 rounded-full bg-brand" aria-label={`${count} new`} />}
                </Link>
              </li>
            );
          })}
          <li>
            <button type="button" onClick={() => setMoreOpen(true)} className="flex w-full flex-col items-center gap-0.5 py-2 type-metadata text-ink-secondary">
              <DotsThreeOutline size={22} aria-hidden />
              More
            </button>
          </li>
        </ul>
      </nav>
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="text-left">{role === "artist" ? "Artist workspace" : "Client workspace"}</SheetTitle>
          </SheetHeader>
          <nav className="mt-3 grid grid-cols-1 gap-0.5 sm:grid-cols-2">
            {items.map((item) => (
              <NavLink key={item.path} item={item} pathname={pathname} count={item.badge ? badges[item.badge] : 0} onNavigate={() => setMoreOpen(false)} />
            ))}
          </nav>
          <Button variant="outline" className="mt-4 w-full" onClick={() => { setMoreOpen(false); void switchRole(); }}>
            <ArrowsLeftRight aria-hidden /> Switch to {other === "artist" ? "artist" : "client"} workspace
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
