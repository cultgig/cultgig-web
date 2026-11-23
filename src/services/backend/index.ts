import { appConfig } from "../../config/env";
import type { Backend } from "./types";

export type { Backend, MarketplaceSnapshot } from "./types";

export type BackendInit = { ok: true; backend: Backend } | { ok: false; reason: string };

/**
 * Select the backend for the configured mode. Only the selected implementation is downloaded
 * (dynamic import), so demo builds don't ship the Appwrite SDK and vice versa.
 * Production never silently falls back to demo mode: if Appwrite is missing or broken, the app
 * shows a configuration error instead.
 */
export async function initBackend(): Promise<BackendInit> {
  try {
    if (appConfig.mode === "demo") {
      const [{ createDemoBackend }, { createBrowserStore }] = await Promise.all([import("./demoBackend"), import("../storage")]);
      return { ok: true, backend: createDemoBackend({ store: createBrowserStore() }) };
    }
    const { createAppwriteBackend } = await import("./appwriteBackend");
    return { ok: true, backend: createAppwriteBackend() };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "Backend configuration is invalid." };
  }
}
