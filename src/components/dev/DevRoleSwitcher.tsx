import { useAuth } from "../../state/AuthContext";

export function DevRoleSwitcher() {
  if (!import.meta.env.DEV) return null;
  const { user, signInPrototype, switchWorkspaceMode, logout } = useAuth();

  return (
    <aside
      className="fixed bottom-3 right-3 z-50 bg-surface border border-line rounded-lg shadow-card p-2.5 flex items-center gap-2 text-[12px]"
      aria-label="Development mode workspace switcher"
    >
      <span className="text-ink-muted font-semibold">DEV</span>
      {!user ? (
        <>
          <button
            type="button"
            onClick={() =>
              signInPrototype({
                email: "host.dev@cultgig.local",
                displayName: "Dev Host",
                activeMode: "client",
              })
            }
            className="px-2.5 py-1 rounded border border-line hover:border-plum"
          >
            Client
          </button>
          <button
            type="button"
            onClick={() =>
              signInPrototype({
                email: "artist.dev@cultgig.local",
                displayName: "Dev Artist",
                activeMode: "artist",
              })
            }
            className="px-2.5 py-1 rounded border border-line hover:border-plum"
          >
            Artist
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() =>
              switchWorkspaceMode(user.activeMode === "artist" ? "client" : "artist")
            }
            className="px-2.5 py-1 rounded bg-plum-soft text-plum font-medium"
          >
            Mode: {user.activeMode}
          </button>
          <button
            type="button"
            onClick={() => logout()}
            className="px-2 py-1 rounded text-ink-secondary hover:text-semantic-error"
          >
            Out
          </button>
        </>
      )}
    </aside>
  );
}
