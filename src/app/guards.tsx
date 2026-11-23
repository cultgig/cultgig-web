import type { ReactNode } from "react";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { ErrorState, PageSkeleton } from "@/components/shared/states";
import { Navigate, useRouter } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { MarketplaceRole } from "@/types/marketplace";

/**
 * Route guards are a UX convenience only. Authorisation is enforced by the backend on every
 * request (see services/backend), so a user who bypasses these guards still can't read or change
 * anything that isn't theirs.
 */
export function RequireAuth({ children, bare = false }: { children: ReactNode; bare?: boolean }) {
  const { viewer, loading, loadError, refresh } = useMarketplace();
  const { pathname, search } = useRouter();
  if (loading) return <PageSkeleton />;
  if (loadError)
    return (
      <div className="page-container py-12">
        <ErrorState title="We couldn't load your account" description={loadError} onRetry={() => void refresh()} />
      </div>
    );
  if (!viewer) return <Navigate to={`/sign-in?next=${encodeURIComponent(pathname + search)}`} />;
  // Shared signed-in pages (messages, bookings, settings) render inside the active role's workspace.
  const isWorkspacePage = !pathname.startsWith("/onboarding") && !pathname.startsWith("/checkout");
  if (bare || !isWorkspacePage) return <>{children}</>;
  return <WorkspaceShell role={viewer.activeRole}>{children}</WorkspaceShell>;
}

export function RequireRole({ role, children }: { role: MarketplaceRole; children: ReactNode }) {
  const { viewer, loading, loadError, refresh } = useMarketplace();
  const { pathname, search } = useRouter();
  if (loading) return <PageSkeleton />;
  if (loadError)
    return (
      <div className="page-container py-12">
        <ErrorState title="We couldn't load your workspace" description={loadError} onRetry={() => void refresh()} />
      </div>
    );
  if (!viewer) return <Navigate to={`/sign-in?next=${encodeURIComponent(pathname + search)}`} />;
  // Users without this role (or who haven't finished onboarding for it) are sent to set it up.
  if (!viewer.roles.includes(role) || viewer.onboarding[role] !== "complete") {
    return <Navigate to={`/onboarding/${role}?next=${encodeURIComponent(pathname)}`} />;
  }
  return <WorkspaceShell role={role}>{children}</WorkspaceShell>;
}
