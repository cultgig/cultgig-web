import { CheckCircle, Flask, Prohibit, XCircle } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/primitives";
import { configurationReadiness, type ReadinessItem } from "@/config/env";
import { usePageMeta } from "@/hooks/usePageMeta";

const statusMeta: Record<ReadinessItem["status"], { label: string; icon: typeof CheckCircle; cls: string }> = {
  ready: { label: "Configured", icon: CheckCircle, cls: "text-status-success" },
  demo: { label: "Demo stand-in", icon: Flask, cls: "text-status-info" },
  missing: { label: "Not configured", icon: XCircle, cls: "text-status-error" },
  blocked: { label: "Blocked", icon: Prohibit, cls: "text-status-warning" },
};

/** Developer checklist: what is real, what is demo, what is missing. Contains no secrets. */
export default function ReadinessPage() {
  usePageMeta("Configuration readiness");
  const items = configurationReadiness();
  return (
    <main id="main-content" className="page-container max-w-3xl space-y-6 py-10">
      <PageHeader title="Configuration readiness" description="What this deployment has connected. Provider features are only marked configured when their settings are present; they still need end-to-end testing before launch." />
      <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
        {items.map((item) => {
          const meta = statusMeta[item.status];
          return (
            <li key={item.id} className="flex gap-3 p-4">
              <meta.icon size={22} weight="fill" className={`mt-0.5 shrink-0 ${meta.cls}`} aria-hidden />
              <div className="min-w-0">
                <p className="type-label text-ink">
                  {item.label} <span className={`ml-1 type-caption ${meta.cls}`}>· {meta.label}</span>
                </p>
                <p className="type-body-sm text-ink-secondary">{item.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="type-body-sm text-ink-secondary">Setup guides: docs/APPWRITE_SETUP.md, docs/INTEGRATIONS.md in the repository.</p>
    </main>
  );
}
