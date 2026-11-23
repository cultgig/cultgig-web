import { Bell, CalendarCheck, ChatCircleText, Checks, CurrencyInr, FileText, HandCoins, Star, UserCheck, type Icon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useRouter } from "@/lib/router";
import { cn } from "@/lib/utils";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { NotificationKind } from "@/types/marketplace";
import { formatRelative } from "@/utils/format";

const kindIcon: Record<NotificationKind, Icon> = {
  message: ChatCircleText,
  application: FileText,
  shortlist: UserCheck,
  proposal: HandCoins,
  counter_offer: HandCoins,
  offer_accepted: Checks,
  offer_rejected: HandCoins,
  booking: CalendarCheck,
  payment: CurrencyInr,
  reminder: Bell,
  review: Star,
  system: Bell,
};

export default function NotificationsPage() {
  usePageMeta("Notifications");
  const { notifications, run } = useMarketplace();
  const { navigate } = useRouter();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={unread ? `${unread} unread` : "You're all caught up."}
        actions={
          unread > 0 && (
            <Button variant="outline" onClick={() => void run((b) => b.market.markAllNotificationsRead(), { success: "All notifications marked as read" })}>
              <Checks aria-hidden /> Mark all read
            </Button>
          )
        }
      />
      {notifications.length ? (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {notifications.map((n) => {
            const IconCmp = kindIcon[n.kind] ?? Bell;
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={async () => {
                    if (!n.read) await run((b) => b.market.markNotificationRead(n.id), { silent: true });
                    navigate(n.path);
                  }}
                  className={cn("flex w-full items-start gap-3 px-4 py-3.5 text-left hover:bg-surface-low", !n.read && "bg-brand-light-subtle")}
                >
                  <span className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full", n.read ? "bg-surface-container text-ink-secondary" : "bg-brand-subtle text-brand")}>
                    <IconCmp size={18} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block type-body", n.read ? "text-ink" : "font-semibold text-ink")}>
                      {n.title}
                      {!n.read && <span className="sr-only"> (unread)</span>}
                    </span>
                    <span className="block truncate type-body-sm text-ink-secondary">{n.detail}</span>
                  </span>
                  <span className="shrink-0 type-caption text-ink-secondary">{formatRelative(n.createdAt)}</span>
                  {!n.read && <span className="mt-2 size-2 shrink-0 rounded-full bg-brand" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState icon={Bell} title="No notifications yet" description="You'll see new messages, applications, offers and booking updates here." />
      )}
    </div>
  );
}
