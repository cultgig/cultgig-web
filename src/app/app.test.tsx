import { render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { RouterProvider, useRouter } from "@/lib/router";
import { createMemoryStore } from "@/services/storage";
import { createDemoBackend } from "@/services/backend/demoBackend";
import { MarketplaceProvider } from "@/state/MarketplaceContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { resolveRoute } from "./routes";

function Routes() {
  const { pathname } = useRouter();
  return <Suspense fallback={<p>loading</p>}>{resolveRoute(pathname).element}</Suspense>;
}

async function renderAt(path: string, signInAs?: string) {
  window.history.pushState(null, "", path);
  const backend = createDemoBackend({ store: createMemoryStore(), clock: () => new Date("2026-11-23T10:00:00Z") });
  if (signInAs) await backend.auth.signInAsDemoUser!(signInAs);
  render(
    <RouterProvider>
      <MarketplaceProvider backend={backend}>
        <TooltipProvider>
          <Routes />
        </TooltipProvider>
      </MarketplaceProvider>
    </RouterProvider>,
  );
}

beforeEach(() => {
  window.scrollTo = () => undefined;
  // jsdom lacks these browser APIs used by Radix primitives.
  globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} } as unknown as typeof ResizeObserver;
});

describe("app routes", () => {
  it("renders the homepage with featured demo artists", async () => {
    await renderAt("/");
    expect(await screen.findByRole("heading", { level: 1, name: /Find the talent behind unforgettable moments/ })).toBeInTheDocument();
    expect(await screen.findByText("Rhea Kapoor")).toBeInTheDocument();
  });

  it("shows a helpful empty state when no artist matches", async () => {
    await renderAt("/explore?q=zzzz-no-match");
    expect(await screen.findByText("No artists match these filters")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear all filters" })).toBeInTheDocument();
  });

  it("returns a 404 for unknown routes and unknown artists", async () => {
    await renderAt("/definitely-not-a-page");
    expect(await screen.findByText("We couldn't find that page")).toBeInTheDocument();
  });

  it("shows not-found for an unknown artist profile", async () => {
    await renderAt("/artists/nobody-here");
    expect(await screen.findByText("This artist profile isn't available")).toBeInTheDocument();
  });

  it("redirects signed-out visitors away from workspaces", async () => {
    await renderAt("/client/dashboard");
    await waitFor(() => expect(window.location.pathname).toBe("/sign-in"));
    expect(window.location.search).toContain("next=%2Fclient%2Fdashboard");
  });

  it("sends a client without an artist profile to artist onboarding", async () => {
    await renderAt("/artist/dashboard", "demo-client-zoe");
    await waitFor(() => expect(window.location.pathname).toBe("/onboarding/artist"));
  });

  it("does not show another user's conversation", async () => {
    await renderAt("/messages/conv-zoe-rhea", "demo-client-aarav");
    expect(await screen.findByText("Conversation not found")).toBeInTheDocument();
  });

  it("renders every legal and compliance page", async () => {
    for (const kind of ["terms", "privacy", "grievance", "payments-and-fees", "disputes", "cookies"]) {
      document.body.innerHTML = "";
      await renderAt(`/legal/${kind}`);
      expect(await screen.findByText("Draft — requires legal review")).toBeInTheDocument();
    }
  });
});
