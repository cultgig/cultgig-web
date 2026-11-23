import { useState } from "react";
import { CheckCircle, Clock, LockSimple, WarningCircle, XCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { PaymentStatusBadge } from "@/components/shared/StatusBadge";
import { NotFoundState } from "@/components/shared/states";
import { toUserMessage } from "@/domain/errors";
import { formatPaise } from "@/domain/money";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { formatDate } from "@/utils/format";

/**
 * Checkout preview. Payment is never simulated: the "Pay" action asks the backend to create an
 * order, which fails clearly until an approved provider and server-side order/webhook Functions exist.
 */
export function CheckoutPage({ bookingId }: { bookingId: string }) {
  usePageMeta("Checkout");
  const { bookings, viewer, backend } = useMarketplace();
  const [error, setError] = useState("");
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking || booking.clientUserId !== viewer?.id) {
    return <NotFoundState title="Checkout not available" description="This booking doesn't exist or isn't yours to pay for." backTo="/client/bookings" backLabel="Your bookings" />;
  }
  const pay = async () => {
    setError("");
    try {
      await backend.market.createPaymentOrder(booking.id);
    } catch (e) {
      setError(toUserMessage(e));
    }
  };
  return (
    <main id="main-content" className="mx-auto max-w-xl space-y-6 px-4 py-10">
      <div className="space-y-1">
        <Link to={`/bookings/${booking.id}`} className="type-label text-ink-secondary hover:text-ink">← Back to booking</Link>
        <h1 className="type-h1 text-ink-strong">Checkout</h1>
      </div>
      <NoticeBanner tone="warning" title="Online payment isn't available yet">
        Cultgig will enable checkout once a marketplace payment provider approves the platform. No payment can be made here today, and Cultgig will never show a booking as paid without a verified payment.
      </NoticeBanner>
      <section className="space-y-3 rounded-xl border border-line bg-surface p-5">
        <h2 className="type-h3 text-ink">{booking.title}</h2>
        <p className="type-body-sm text-ink-secondary">
          {booking.artistName} · {formatDate(booking.eventDate)} · {booking.city}
        </p>
        <div className="space-y-2 border-t border-line pt-3 type-body-sm">
          <div className="flex justify-between"><span className="text-ink-secondary">Proposal v{booking.acceptedProposalVersion}</span><span className="tabular-nums">{formatPaise(booking.grossAmountPaise)}</span></div>
          <div className="flex justify-between"><span className="text-ink-secondary">Platform fee</span><span className="tabular-nums">{formatPaise(booking.platformFeePaise)}</span></div>
          <div className="flex justify-between border-t border-line pt-2 type-h4"><span>Total</span><span className="tabular-nums">{formatPaise(booking.grossAmountPaise + booking.platformFeePaise)}</span></div>
          <div className="flex items-center justify-between pt-1"><span className="text-ink-secondary">Payment status</span><PaymentStatusBadge status={booking.paymentStatus} /></div>
        </div>
        <Button className="w-full" size="lg" onClick={() => void pay()}>
          <LockSimple aria-hidden /> Pay {formatPaise(booking.grossAmountPaise + booking.platformFeePaise)}
        </Button>
        {error && <p role="alert" className="rounded-lg bg-status-warning-soft p-3 type-body-sm text-status-warning">{error}</p>}
        <p className="type-caption text-ink-secondary">The amount is taken from the accepted proposal and recalculated by Cultgig's servers. Read <Link to="/legal/payments-and-fees" className="underline underline-offset-2">Payments & Fees</Link>.</p>
      </section>
    </main>
  );
}

const statusContent = {
  success: {
    icon: CheckCircle,
    tone: "text-status-success",
    title: "We're confirming your payment",
    body: "Returning from the payment page doesn't confirm a payment by itself. Your booking updates to Paid only after Cultgig receives a verified confirmation from the payment provider. This usually takes a minute.",
  },
  pending: { icon: Clock, tone: "text-status-warning", title: "Payment pending", body: "Your payment is being processed. We'll notify you when the provider confirms it. Don't pay again in the meantime." },
  failed: { icon: XCircle, tone: "text-status-error", title: "Payment didn't go through", body: "No money was taken, or any amount held will be released by your bank. You can try again from the booking." },
} as const;

export function PaymentStatusPage({ status }: { status: string }) {
  usePageMeta("Payment status");
  const content = statusContent[status as keyof typeof statusContent];
  if (!content) return <NotFoundState />;
  const IconCmp = content.icon ?? WarningCircle;
  return (
    <main id="main-content" className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-16 text-center">
      <IconCmp size={48} weight="fill" className={content.tone} aria-hidden />
      <h1 className="type-h1 text-ink-strong">{content.title}</h1>
      <p className="type-body text-ink-secondary">{content.body}</p>
      <Button asChild>
        <Link to="/client/bookings">Go to my bookings</Link>
      </Button>
    </main>
  );
}
