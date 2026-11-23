/**
 * Typed key-value persistence. Components never touch localStorage directly; only services do,
 * through this abstraction, so tests can use the in-memory store and production code can swap
 * persistence without touching the UI.
 */
export interface KeyValueStore {
  read<T>(key: string): T | null;
  write<T>(key: string, value: T): void;
  remove(key: string): void;
  /** Subscribe to changes made by other tabs/windows. Returns an unsubscribe function. */
  subscribeExternal(key: string, listener: () => void): () => void;
}

export function createBrowserStore(storage: Storage = window.localStorage): KeyValueStore {
  return {
    read<T>(key: string): T | null {
      try {
        const raw = storage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
      } catch {
        return null;
      }
    },
    write<T>(key: string, value: T) {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch {
        // Quota exceeded or storage disabled: the demo keeps working in memory for this session.
      }
    },
    remove(key: string) {
      try {
        storage.removeItem(key);
      } catch {
        /* ignore */
      }
    },
    subscribeExternal(key: string, listener: () => void) {
      const handler = (event: StorageEvent) => {
        if (event.key === key || event.key === null) listener();
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
  };
}

export function createMemoryStore(initial: Record<string, unknown> = {}): KeyValueStore {
  const data = new Map<string, string>(Object.entries(initial).map(([k, v]) => [k, JSON.stringify(v)]));
  return {
    read<T>(key: string) {
      const raw = data.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    },
    write<T>(key: string, value: T) {
      data.set(key, JSON.stringify(value));
    },
    remove(key: string) {
      data.delete(key);
    },
    subscribeExternal() {
      return () => undefined;
    },
  };
}
