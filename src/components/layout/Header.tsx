import { Bell, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { headerNavigation } from "../../config/navigation";
import { creativeCategories } from "../../data/categories";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Link, useRouter } from "../../lib/router";
import { useAuth } from "../../state/AuthContext";
import { useMarketplace } from "../../state/MarketplaceContext";

export function Header() {
  const { pathname, navigate } = useRouter();
  const { user, switchWorkspaceMode, logout } = useAuth();
  const { notifications } = useMarketplace();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setCategoriesOpen(false), categoriesOpen);
  useClickOutside(accountRef, () => setAccountMenuOpen(false), accountMenuOpen);
  useFocusTrap(mobileDrawerRef, mobileMenuOpen, () => setMobileMenuOpen(false));

  useEffect(() => {
    setCategoriesOpen(false);
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-sm border-b border-line">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Cultgig wordmark */}
        <Link
          to="/"
          aria-label="Cultgig home"
          className="text-[22px] leading-[28px] font-bold tracking-[-0.03em] text-brand whitespace-nowrap shrink-0"
        >
          cultgig<span className="text-brand-ink">.</span>
        </Link>

        {/* Zone 2: Concise single-line desktop navigation */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-6">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setCategoriesOpen((prev) => !prev)}
              aria-expanded={categoriesOpen}
              aria-haspopup="true"
              className="inline-flex items-center gap-1.5 py-2 text-[14px] leading-[20px] font-medium text-ink-secondary hover:text-brand whitespace-nowrap shrink-0"
            >
              <span>Categories</span>
              <ChevronDown
                size={15}
                className={`transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {categoriesOpen && (
              <div
                role="region"
                aria-label="Creative categories menu"
                className="absolute left-0 top-full mt-2 w-[620px] bg-surface border border-line rounded-lg shadow-lg p-5 grid grid-cols-3 gap-x-5 gap-y-2.5 z-50"
              >
                {creativeCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/categories/${cat.slug}`}
                    className="text-[13px] leading-[18px] font-medium text-ink-secondary hover:text-brand py-1 truncate"
                  >
                    {cat.label}
                  </Link>
                ))}
                <div className="col-span-3 pt-3 mt-1 border-t border-line flex items-center justify-between">
                  <Link
                    to="/categories"
                    className="type-label text-brand hover:text-brand-hover"
                  >
                    Browse all 15 creative categories
                  </Link>
                  <Link
                    to="/explore"
                    className="type-body-sm text-ink-secondary hover:text-brand"
                  >
                    Open artist search
                  </Link>
                </div>
              </div>
            )}
          </div>

          {headerNavigation.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? "page" : undefined}
                className={`py-2 text-[14px] leading-[20px] font-medium whitespace-nowrap shrink-0 hover:text-brand ${
                  isActive ? "text-brand underline underline-offset-8 decoration-2" : "text-ink-secondary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Primary action / Account menu */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="hidden lg:flex items-center gap-3" ref={accountRef}>
              <Link
                to="/notifications"
                aria-label={`Notifications (${unreadCount} unread)`}
                className="relative w-10 h-10 rounded-md border border-line flex items-center justify-center text-ink-secondary hover:text-brand hover:border-brand"
              >
                <Bell size={17} aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10.5px] leading-[18px] font-semibold text-center tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  aria-expanded={accountMenuOpen}
                  className="inline-flex items-center gap-2 min-h-[40px] px-3.5 py-2 rounded-md border border-line bg-surface hover:border-brand text-[13px] font-semibold text-ink whitespace-nowrap shrink-0"
                >
                  <span className="max-w-[130px] truncate">{user.displayName}</span>
                  <span className="text-ink-secondary font-normal">
                    ({user.activeMode === "artist" ? "Artist" : "Client"})
                  </span>
                  <ChevronDown size={14} aria-hidden="true" />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-surface border border-line rounded-lg shadow-lg p-2 z-50 flex flex-col gap-1">
                    <Link
                      to={user.activeMode === "artist" ? "/artist/dashboard" : "/client/dashboard"}
                      className="px-3 py-2 rounded-sm type-label text-ink hover:bg-brand-subtle hover:text-brand"
                    >
                      {user.activeMode === "artist" ? "Artist dashboard" : "Client dashboard"}
                    </Link>
                    <Link
                      to="/client/gigs/new"
                      className="px-3 py-2 rounded-sm type-body-sm text-ink-secondary hover:bg-brand-subtle hover:text-brand"
                    >
                      Post a gig
                    </Link>
                    <Link
                      to="/artist/opportunities"
                      className="px-3 py-2 rounded-sm type-body-sm text-ink-secondary hover:bg-brand-subtle hover:text-brand"
                    >
                      Browse open gigs
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        const next = user.activeMode === "artist" ? "client" : "artist";
                        switchWorkspaceMode(next);
                        setAccountMenuOpen(false);
                        navigate(next === "artist" ? "/artist/dashboard" : "/client/dashboard");
                      }}
                      className="text-left px-3 py-2 rounded-sm type-body-sm text-brand hover:bg-brand-subtle font-medium"
                    >
                      Switch to {user.activeMode === "artist" ? "Client view" : "Artist view"}
                    </button>
                    <div className="my-1 border-t border-line" />
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setAccountMenuOpen(false);
                        navigate("/");
                      }}
                      className="text-left px-3 py-2 rounded-sm type-body-sm text-status-error hover:bg-status-error-soft"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/sign-in"
                className="text-[14px] leading-[20px] font-medium text-ink-secondary hover:text-brand whitespace-nowrap shrink-0"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-hover text-[14px] leading-[20px] font-semibold whitespace-nowrap shrink-0"
              >
                Join Cultgig
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden w-11 h-11 inline-flex items-center justify-center rounded-md border border-line text-ink hover:text-brand"
          >
            {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          ref={mobileDrawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-line bg-surface px-4 py-5 space-y-4 max-h-[82vh] overflow-y-auto"
        >
          <div className="flex flex-col gap-1">
            {headerNavigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-2.5 rounded-md type-body-lg font-medium text-ink hover:bg-brand-subtle hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/categories"
              className="px-3 py-2.5 rounded-md type-body-lg font-medium text-ink hover:bg-brand-subtle hover:text-brand"
            >
              All 15 creative categories
            </Link>
            <Link
              to="/pricing"
              className="px-3 py-2.5 rounded-md type-body-lg font-medium text-ink hover:bg-brand-subtle hover:text-brand"
            >
              Pricing
            </Link>
            <Link
              to="/guides"
              className="px-3 py-2.5 rounded-md type-body-lg font-medium text-ink hover:bg-brand-subtle hover:text-brand"
            >
              Planning guides
            </Link>
          </div>

          <div className="pt-4 border-t border-line flex flex-col gap-2.5">
            {user ? (
              <>
                <Link
                  to={user.activeMode === "artist" ? "/artist/dashboard" : "/client/dashboard"}
                  className="w-full min-h-[44px] inline-flex items-center justify-center rounded-md bg-brand text-white type-button"
                >
                  Open {user.activeMode === "artist" ? "Artist" : "Client"} dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full min-h-[44px] rounded-md border border-line text-status-error type-label"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-up"
                  className="w-full min-h-[44px] inline-flex items-center justify-center rounded-md bg-brand text-white type-button"
                >
                  Join Cultgig
                </Link>
                <Link
                  to="/sign-in"
                  className="w-full min-h-[44px] inline-flex items-center justify-center rounded-md border border-line-strong text-ink type-button"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
