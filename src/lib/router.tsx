import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Minimal History-API router (kept from the original codebase, extended with pattern matching,
 * redirects and a stable `query`). Vercel rewrites every path to index.html (vercel.json).
 */

interface RouterContextValue {
  pathname: string;
  search: string;
  query: URLSearchParams;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function currentLocation() {
  return { pathname: window.location.pathname || "/", search: window.location.search || "" };
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState(currentLocation);

  useEffect(() => {
    const onPop = () => setLocation(currentLocation());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const url = new URL(to, window.location.origin);
    if (url.origin !== window.location.origin) {
      window.location.assign(url.toString());
      return;
    }
    const target = `${url.pathname}${url.search}${url.hash}`;
    if (options?.replace) window.history.replaceState(null, "", target);
    else window.history.pushState(null, "", target);
    setLocation({ pathname: url.pathname, search: url.search });
    if (url.hash) {
      requestAnimationFrame(() => document.querySelector(url.hash)?.scrollIntoView({ behavior: "smooth" }));
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const value = useMemo(() => ({ ...location, query, navigate }), [location, query, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used inside RouterProvider");
  return ctx;
}

/** Match `/messages/:id` style patterns. Returns params or null. */
export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const clean = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const p = pattern.split("/");
  const s = clean.split("/");
  if (p.length !== s.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(":")) {
      if (!s[i]) return null;
      try {
        params[p[i].slice(1)] = decodeURIComponent(s[i]);
      } catch {
        return null;
      }
    } else if (p[i] !== s[i]) {
      return null;
    }
  }
  return params;
}

export function Navigate({ to, replace = true }: { to: string; replace?: boolean }) {
  const { navigate } = useRouter();
  useEffect(() => navigate(to, { replace }), [navigate, to, replace]);
  return null;
}

/** Only allow same-origin relative redirects (prevents open-redirect via ?next=). */
export function safeNextPath(value: string | null, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}

export const Link = React.forwardRef<
  HTMLAnchorElement,
  { to: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>
>(function Link({ to, onClick, children, ...props }, ref) {
  const { navigate } = useRouter();
  const isExternal = /^https?:\/\//i.test(to) || to.startsWith("mailto:") || to.startsWith("tel:");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || isExternal || props.target === "_blank" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };

  return (
    <a ref={ref} href={to} onClick={handleClick} {...(isExternal ? { rel: "noopener noreferrer" } : {})} {...props}>
      {children}
    </a>
  );
});
