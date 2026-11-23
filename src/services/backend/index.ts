import { appConfig } from "../../config/env";
import { createBrowserStore } from "../storage";
import { createAppwriteBackend } from "./appwriteBackend";
import { createDemoBackend } from "./demoBackend";
import type { Backend } from "./types";

export type { Backend, MarketplaceSnapshot } from "./types";

export type BackendInit = { ok: true; backend: Backend } | { ok: false; reason: string };

/**
 * Select the backend for the configured mode. Production never silently falls back to demo mode:
 * if Appwrite is missing or broken, the app shows a configuration error instead.
 */
export function initBackend(): BackendInit {
  if (appConfig.mode === "demo") {
    return { ok: true, backend: createDemoBackend({ store: createBrowserStore() }) };
  }
  try {
    return { ok: true, backend: createAppwriteBackend() };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "Backend configuration is invalid." };
  }
}
