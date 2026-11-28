import posthog from "posthog-js";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY?.trim();

export function initPostHog() {
  if (!posthogKey || posthog.__loaded) return;

  posthog.init(posthogKey, {
    api_host: import.meta.env.VITE_POSTHOG_HOST?.trim() || "https://us.i.posthog.com",
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export function capturePostHogPageView(pathname: string, search: string) {
  if (!posthogKey) return;
  posthog.capture("$pageview", {
    $current_url: `${window.location.origin}${pathname}${search}`,
  });
}
