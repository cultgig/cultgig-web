import { Suspense, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DemoModeControl } from "@/components/layout/DemoModeControl";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ErrorBoundary, PageSkeleton } from "@/components/shared/states";
import { RouterProvider, useRouter } from "@/lib/router";
import { initBackend, type BackendInit } from "@/services/backend";
import { MarketplaceProvider } from "@/state/MarketplaceContext";
import { ConfigurationErrorPage } from "@/pages/shared/ConfigurationErrorPage";
import { capturePostHogPageView } from "@/lib/posthog";
import { resolveRoute } from "./routes";

function Shell() {
  const { pathname, search } = useRouter();
  const route = resolveRoute(pathname);
  const bare = route.layout === "bare";
  useEffect(() => {
    capturePostHogPageView(pathname, search);
  }, [pathname, search]);
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-toast focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-ink-inverse"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <div className="flex-1">
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<PageSkeleton />}>{route.element}</Suspense>
        </ErrorBoundary>
      </div>
      {!bare && route.layout !== "workspace" && <SiteFooter />}
      <DemoModeControl />
      <Toaster richColors closeButton />
    </div>
  );
}

export default function App() {
  const [init, setInit] = useState<BackendInit | null>(null);
  useEffect(() => {
    let active = true;
    void initBackend().then((result) => active && setInit(result));
    return () => {
      active = false;
    };
  }, []);
  if (!init) return <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading Cultgig" />;
  if (!init.ok) return <ConfigurationErrorPage reason={init.reason} />;
  return (
    <RouterProvider>
      <MarketplaceProvider backend={init.backend}>
        <TooltipProvider delayDuration={300}>
          <Shell />
        </TooltipProvider>
      </MarketplaceProvider>
    </RouterProvider>
  );
}
