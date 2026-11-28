import { Component, type ErrorInfo, type ReactNode } from "react";
import { capturePostHogException } from "@/lib/posthog";
import { ArrowClockwise, MagnifyingGlass, WarningCircle, type Icon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

/* Empty state: every list in the product uses this when it has nothing to show. */
export function EmptyState({
  icon: IconCmp = MagnifyingGlass,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact = false,
}: {
  icon?: Icon;
  title: string;
  description?: ReactNode;
  action?: { label: string; to?: string; onClick?: () => void };
  secondaryAction?: { label: string; to?: string; onClick?: () => void };
  className?: string;
  compact?: boolean;
}) {
  const renderAction = (a: NonNullable<typeof action>, variant: "default" | "outline") =>
    a.to ? (
      <Button asChild variant={variant}>
        <Link to={a.to}>{a.label}</Link>
      </Button>
    ) : (
      <Button variant={variant} onClick={a.onClick}>
        {a.label}
      </Button>
    );
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-line bg-surface-low text-center",
        compact ? "gap-3 px-4 py-8" : "gap-4 px-6 py-16",
        className,
      )}
    >
      <IconCmp size={28} className="text-ink-secondary" aria-hidden />
      <div className="max-w-md space-y-1">
        <p className="type-h3 text-ink-strong">{title}</p>
        {description && <p className="type-body-sm text-ink-secondary">{description}</p>}
      </div>
      {(action || secondaryAction) && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {action && renderAction(action, "default")}
          {secondaryAction && renderAction(secondaryAction, "outline")}
        </div>
      )}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-status-error-border bg-status-error-soft px-6 py-10 text-center">
      <WarningCircle size={28} className="text-status-error" aria-hidden />
      <div className="space-y-1">
        <p className="type-h3 text-ink-strong">{title}</p>
        {description && <p className="type-body-sm text-ink-secondary">{description}</p>}
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <ArrowClockwise aria-hidden /> Try again
        </Button>
      )}
    </div>
  );
}

/* Loading skeletons — never a blank page. */
export function PageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="page-container space-y-6 py-10" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: rows * 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  );
}

/* 404 / not-found / not-yours. Same message for missing and forbidden so IDs can't be probed. */
export function NotFoundState({
  title = "We couldn't find that page",
  description = "The link may be broken, or the page may have moved. If you followed a link to a booking or conversation, make sure you're signed in to the right account.",
  backTo = "/",
  backLabel = "Go to the homepage",
}: {
  title?: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
}) {
  return (
    <div className="page-container flex min-h-[55vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="type-title text-ink-strong">{title}</h1>
      <p className="max-w-lg type-body-lg text-ink-secondary">{description}</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button asChild>
          <Link to={backTo}>{backLabel}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/explore">Explore artists</Link>
        </Button>
      </div>
    </div>
  );
}

/* App-wide error boundary: a crash in one screen never leaves the user on a blank page. */
export class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: string }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    capturePostHogException(error, {
      component_stack: info.componentStack,
    });
    if (import.meta.env.DEV) console.error("Cultgig screen error", error, info.componentStack);
  }

  componentDidUpdate(prev: { resetKey?: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page-container py-16">
          <ErrorState
            title="This screen ran into a problem"
            description="Your data is safe. Reload the page, or go back and try again. If it keeps happening, contact support."
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
