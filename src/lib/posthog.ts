import posthog from "posthog-js";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY?.trim();

export function initPostHog() {
  if (
    !posthogKey ||
    posthog.__loaded ||
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ) return;

  posthog.init(posthogKey, {
    api_host: import.meta.env.VITE_POSTHOG_HOST?.trim() || "https://us.i.posthog.com",
    defaults: "2026-08-30",
    capture_pageview: false,
    capture_pageleave: true,
    capture_exceptions: true,
  });
}

export function capturePostHogPageView(pathname: string, search: string) {
  if (!posthogKey || !posthog.__loaded) return;
  posthog.capture("$pageview", {
    $current_url: `${window.location.origin}${pathname}${search}`,
  });
}

export function identifyPostHogUser(
  userId: string,
  properties: { email?: string; displayName?: string; roles?: string[]; activeRole?: string },
) {
  if (!posthogKey || !posthog.__loaded) return;
  posthog.identify(userId, properties);
}

export function resetPostHogUser() {
  if (!posthogKey || !posthog.__loaded) return;
  posthog.reset();
}

export function capturePostHogException(error: unknown, additionalProperties?: Record<string, unknown>) {
  if (!posthogKey || !posthog.__loaded) return;
  posthog.captureException(error, additionalProperties);
}
