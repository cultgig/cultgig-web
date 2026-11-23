import { Info, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function NoticeBanner({
  tone = "info",
  title,
  children,
  className,
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
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-ink",
        isWarning ? "border-status-warning-border bg-status-warning-soft" : "border-line-subtle bg-brand-light-subtle",
        className,
      )}
    >
      {isWarning ? (
        <WarningCircle size={18} className="mt-0.5 shrink-0 text-status-warning" aria-hidden />
      ) : (
        <Info size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
      )}
      <div className="space-y-1">
        <p className="type-label text-ink">{title}</p>
        {children && <div className="type-body-sm text-ink-secondary">{children}</div>}
      </div>
    </div>
  );
}
