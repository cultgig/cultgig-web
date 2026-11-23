import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { toUserMessage } from "../domain/errors";
import type { Backend, MarketplaceSnapshot } from "../services/backend";

const EMPTY_SNAPSHOT: MarketplaceSnapshot = {
  viewer: null,
  settings: null,
  artists: [],
  myArtistProfile: null,
  myClientProfile: null,
  gigs: [],
  applications: [],
  conversations: [],
  bookings: [],
  notifications: [],
  savedArtistIds: [],
  reviews: [],
  supportTickets: [],
};

interface MarketplaceContextValue extends MarketplaceSnapshot {
  backend: Backend;
  /** True until the first snapshot (including session restore) has loaded. */
  loading: boolean;
  /** Set when the snapshot could not be loaded (network/backend failure). */
  loadError: string | null;
  refresh: () => Promise<void>;
  /**
   * Run a backend action: shows a success toast (optional), turns failures into a user-safe toast,
   * and refreshes the snapshot. Resolves to the action result, or `undefined` if it failed.
   */
  run: <T>(action: (backend: Backend) => Promise<T>, options?: { success?: string; silent?: boolean }) => Promise<T | undefined>;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({ backend, children }: { backend: Backend; children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<MarketplaceSnapshot>(EMPTY_SNAPSHOT);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const requestId = useRef(0);

  const refresh = useCallback(async () => {
    const current = ++requestId.current;
    try {
      const next = await backend.market.snapshot();
      if (current === requestId.current) {
        setSnapshot(next);
        setLoadError(null);
      }
    } catch (error) {
      if (current === requestId.current) setLoadError(toUserMessage(error, "We couldn't load Cultgig. Check your connection and try again."));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    void refresh();
    return backend.market.subscribe(() => void refresh());
  }, [backend, refresh]);

  const run = useCallback<MarketplaceContextValue["run"]>(
    async (action, options) => {
      try {
        const result = await action(backend);
        if (options?.success) toast.success(options.success);
        return result;
      } catch (error) {
        if (!options?.silent) toast.error(toUserMessage(error));
        return undefined;
      } finally {
        await refresh();
      }
    },
    [backend, refresh],
  );

  const value = useMemo<MarketplaceContextValue>(
    () => ({ ...snapshot, backend, loading, loadError, refresh, run }),
    [snapshot, backend, loading, loadError, refresh, run],
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace(): MarketplaceContextValue {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace() must be used inside <MarketplaceProvider>");
  return ctx;
}
