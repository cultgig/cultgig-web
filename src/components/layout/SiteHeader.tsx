import { useState } from "react";
import { Bell, CaretDown, ChatCircleText, List, SignOut, SquaresFour, ArrowsLeftRight, UserCircle, Gear } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserAvatar } from "@/components/shared/primitives";
import { headerNavigation } from "@/config/navigation";
import { creativeCategories } from "@/data/categories";
import { Link, useRouter } from "@/lib/router";
import { cn } from "@/lib/utils";
import { useMarketplace } from "@/state/MarketplaceContext";
import { totalUnreadMessages, workspaceHome } from "@/state/selectors";
import type { MarketplaceRole } from "@/types/marketplace";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link to="/" aria-label="Cultgig home" className={cn("font-display text-[24px] font-semibold leading-7 tracking-[-0.04em] text-ink-strong", className)}>
      cultgig<span className="text-brand">.</span>
    </Link>
  );
}

function CountBadge({ count, label }: { count: number; label: string }) {
  if (!count) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-[18px] text-ink-inverse">
      {count > 9 ? "9+" : count}
      <span className="sr-only"> {label}</span>
    </span>
  );
}

export function SiteHeader() {
  const { pathname, navigate } = useRouter();
  const { viewer, notifications, conversations, run } = useMarketplace();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = viewer ? totalUnreadMessages(conversations, viewer.id) : 0;

  const switchRole = async (role: MarketplaceRole) => {
    if (!viewer) return;
    await run((b) => b.market.setActiveRole(role));
    navigate(viewer.onboarding[role] === "complete" ? `/${role}/dashboard` : `/onboarding/${role}`);
  };

  const signOut = async () => {
    await run((b) => b.auth.signOut(), { success: "You're signed out." });
    navigate("/");
  };

  const otherRole: MarketplaceRole | null = viewer ? (viewer.activeRole === "artist" ? "client" : "artist") : null;

  return (
    <header className="sticky top-0 z-header w-full border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <div className="page-container flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Wordmark />
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-2 type-body font-medium text-ink-secondary hover:bg-surface-low hover:text-ink">
                Categories <CaretDown size={14} aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="grid w-[560px] grid-cols-2 gap-x-2 p-2">
                {creativeCategories.map((c) => (
                  <DropdownMenuItem key={c.slug} asChild>
                    <Link to={`/categories/${c.slug}`}>{c.label}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="col-span-2" />
                <DropdownMenuItem asChild className="col-span-2 font-semibold text-brand">
                  <Link to="/categories">All categories</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {headerNavigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={pathname === item.path ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 type-body font-medium text-ink-secondary hover:bg-surface-low hover:text-ink",
                  pathname === item.path && "text-brand",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          {viewer ? (
            <>
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link to={workspaceHome(viewer)}>
                  <SquaresFour aria-hidden /> {viewer.activeRole === "artist" ? "Artist workspace" : "Client workspace"}
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link to="/messages" aria-label="Messages">
                  <ChatCircleText size={20} aria-hidden />
                  <CountBadge count={unreadMessages} label="unread messages" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link to="/notifications" aria-label="Notifications">
                  <Bell size={20} aria-hidden />
                  <CountBadge count={unreadNotifications} label="unread notifications" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-1 flex items-center gap-1 rounded-full p-0.5 hover:bg-surface-low" aria-label="Account menu">
                  <UserAvatar name={viewer.displayName} src={viewer.avatarUrl} className="size-8" />
                  <CaretDown size={14} className="hidden text-ink-secondary sm:block" aria-hidden />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="space-y-0.5">
                    <p className="truncate type-label text-ink">{viewer.displayName}</p>
                    <p className="truncate type-caption text-ink-secondary">{viewer.email}</p>
                    <p className="type-caption text-ink-secondary">Using Cultgig as {viewer.activeRole === "artist" ? "an artist" : "a client"}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={workspaceHome(viewer)}>
                      <SquaresFour aria-hidden /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {otherRole && (
                    <DropdownMenuItem onSelect={() => void switchRole(otherRole)}>
                      <ArrowsLeftRight aria-hidden /> Switch to {otherRole === "artist" ? "artist" : "client"} workspace
                    </DropdownMenuItem>
                  )}
                  {viewer.activeRole === "artist" && (
                    <DropdownMenuItem asChild>
                      <Link to="/artist/profile">
                        <UserCircle aria-hidden /> Edit profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Gear aria-hidden /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => void signOut()}>
                    <SignOut aria-hidden /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/sign-in">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/sign-up">Join Cultgig</Link>
              </Button>
            </>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <List size={22} aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-4 flex flex-col gap-1" onClick={(e) => (e.target as HTMLElement).closest("a") && setMobileOpen(false)}>
                {headerNavigation.map((item) => (
                  <Link key={item.path} to={item.path} className="rounded-md px-3 py-2.5 type-body font-medium text-ink hover:bg-surface-low">
                    {item.label}
                  </Link>
                ))}
                <Link to="/categories" className="rounded-md px-3 py-2.5 type-body font-medium text-ink hover:bg-surface-low">
                  All categories
                </Link>
                <div className="my-2 border-t border-line" />
                {viewer ? (
                  <Link to={workspaceHome(viewer)} className="rounded-md px-3 py-2.5 type-body font-medium text-brand hover:bg-surface-low">
                    Go to my dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/sign-in" className="rounded-md px-3 py-2.5 type-body font-medium text-ink hover:bg-surface-low">
                      Sign in
                    </Link>
                    <Link to="/sign-up?role=artist" className="rounded-md px-3 py-2.5 type-body font-medium text-ink hover:bg-surface-low">
                      Join as an artist
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
