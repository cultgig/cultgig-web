import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface RouterContextValue {
  pathname: string;
  search: string;
  query: URLSearchParams;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [locationState, setLocationState] = useState(() => ({
    pathname: window.location.pathname || "/",
    search: window.location.search || "",
  }));

  useEffect(() => {
    const handlePopState = () => {
      setLocationState({
        pathname: window.location.pathname || "/",
        search: window.location.search || "",
      });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const url = new URL(to, window.location.origin);
    const nextPath = url.pathname || "/";
    const nextSearch = url.search || "";
    const fullTarget = `${nextPath}${nextSearch}${url.hash}`;

    if (options?.replace) {
      window.history.replaceState(null, "", fullTarget);
    } else {
      window.history.pushState(null, "", fullTarget);
    }

    setLocationState({ pathname: nextPath, search: nextSearch });

    if (url.hash) {
      requestAnimationFrame(() => {
        const el = document.querySelector(url.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  const query = new URLSearchParams(locationState.search);

  return (
    <RouterContext.Provider
      value={{
        pathname: locationState.pathname,
        search: locationState.search,
        query,
        navigate,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used inside RouterProvider");
  return ctx;
}

export function Link({
  to,
  onClick,
  children,
  ...props
}: { to: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { navigate } = useRouter();
  const isExternal = /^https?:\/\//i.test(to) || to.startsWith("mailto:") || to.startsWith("tel:");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (
      e.defaultPrevented ||
      isExternal ||
      props.target === "_blank" ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
