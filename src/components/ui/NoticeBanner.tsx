import { AlertCircle, Info } from "lucide-react";
import type { ReactNode } from "react";

export function NoticeBanner({
  tone = "info",
  title,
  children,
  className = "",
}: {
  tone?: "info" | "warning";
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  const isWarning = tone === "warning";
  return (
    <div
      role="status"
      className={`rounded-md border p-4 flex items-start gap-3 ${
        isWarning
          ? "bg-semantic-warning-bg border-ochre/30 text-ink-primary"
          : "bg-plum-soft border-plum-border text-ink-primary"
      } ${className}`}
    >
      {isWarning ? (
        <AlertCircle size={18} className="text-semantic-warning shrink-0 mt-0.5" aria-hidden="true" />
      ) : (
        <Info size={18} className="text-plum shrink-0 mt-0.5" aria-hidden="true" />
      )}
      <div className="space-y-1">
        <p className="type-label text-ink-primary">{title}</p>
        {children && <div className="type-body-sm text-ink-secondary">{children}</div>}
      </div>
    </div>
  );
}
