import { useState } from "react";
import { CheckCircle, Clock, LockSimple, WarningCircle, XCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { PaymentStatusBadge } from "@/components/shared/StatusBadge";
import { NotFoundState } from "@/components/shared/states";
import { appConfig } from "@/config/env";
import { toUserMessage } from "@/domain/errors";
import { formatPaise } from "@/domain/money";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link, useRouter } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { formatDate } from "@/utils/format";

interface CheckoutPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: { description?: string; reason?: string };
}

interface RazorpayCheckout {
  open(): void;
  on(event: "payment.failed", callback: (response: RazorpayFailureResponse) => void): void;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  handler(response: CheckoutPaymentResponse): void;
  modal: { ondismiss(): void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckout;
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      razorpayScriptPromise = null;
      reject(new Error("Razorpay Checkout couldn't load. Check your connection and try again."));
    };
    document.head.appendChild(script);
  });
  return razorpayScriptPromise;
}

export function CheckoutPage({ bookingId }: { bookingId: string }) {
  usePageMeta("Checkout");
  const { bookings, viewer } = useMarketplace();
  const { navigate } = useRouter();
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking || booking.clientUserId !== viewer?.id) {
    return <NotFoundState title="Checkout not available" description="This booking doesn't exist or isn't yours to pay for." backTo="/client/bookings" backLabel="Your bookings" />;
  }
  const totalPaise = booking.grossAmountPaise + booking.platformFeePaise;
  const canCheckout = appConfig.paymentsEnabled && Boolean(appConfig.razorpayKeyId);

  const verifyPayment = async (payment: CheckoutPaymentResponse) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      });
      const result = await response.json().catch(() => null) as { verified?: boolean; error?: string } | null;
      if (!response.ok || result?.verified !== true) {
        throw new Error(result?.error || "We couldn't verify the payment. Please contact support before trying again.");
      }
      navigate("/payment/success");
    } catch (e) {
      setError(e instanceof Error ? e.message : toUserMessage(e));
    } finally {
      setIsLoading(false);
    }
  };

  const pay = async () => {
    setError("");
    setStatusMessage("");
    setIsLoading(true);
    try {
      await loadRazorpayCheckout();
      const RazorpayConstructor = window.Razorpay;
      if (!RazorpayConstructor) throw new Error("Razorpay Checkout couldn't initialize. Please try again.");

      const safeBookingId = booking.id.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 20) || "booking";
      const receipt = `cg-${safeBookingId}-${Date.now().toString(36)}`;
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPaise, currency: "INR", receipt }),
      });
      const order = await response.json().catch(() => null) as {
        order_id?: string;
        amount?: number;
        currency?: string;
        error?: string;
      } | null;
      if (!response.ok || !order?.order_id || order.amount !== totalPaise || order.currency !== "INR") {
        throw new Error(order?.error || "We couldn't create a payment order. Please try again.");
      }

      const checkout = new RazorpayConstructor({
        key: appConfig.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "Cultgig",
        description: `Booking: ${booking.title}`,
        order_id: order.order_id,
        prefill: {
          name: viewer?.displayName ?? "",
          email: viewer?.email ?? "",
          contact: viewer?.phone ?? "",
        },
        handler: (payment) => void verifyPayment(payment),
        modal: {
          ondismiss: () => setStatusMessage("Payment cancelled. You can try again when you're ready."),
        },
      });
      checkout.on("payment.failed", (result) => {
        setError(result.error?.description || result.error?.reason || "Payment failed. Please try again.");
      });
      checkout.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : toUserMessage(e));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main id="main-content" className="mx-auto max-w-xl space-y-6 px-4 py-10">
      <div className="space-y-1">
        <Link to={`/bookings/${booking.id}`} className="type-label text-ink-secondary hover:text-ink">← Back to booking</Link>
        <h1 className="type-h1 text-ink-strong">Checkout</h1>
      </div>
      {!canCheckout && (
        <NoticeBanner tone="warning" title="Online payment isn't available yet">
          Checkout remains off until marketplace payment approval and server configuration are complete. Cultgig will never show a booking as paid without verified provider confirmation.
          {appConfig.paymentsEnabled && !appConfig.razorpayKeyId && " Set VITE_RAZORPAY_KEY_ID to enable the Razorpay checkout button."}
        </NoticeBanner>
      )}
      <section className="space-y-3 rounded-xl border border-line bg-surface p-5">
        <h2 className="type-h3 text-ink">{booking.title}</h2>
        <p className="type-body-sm text-ink-secondary">
          {booking.artistName}, {formatDate(booking.eventDate)}, {booking.city}
        </p>
        <div className="space-y-2 border-t border-line pt-3 type-body-sm">
          <div className="flex justify-between"><span className="text-ink-secondary">Proposal v{booking.acceptedProposalVersion}</span><span className="tabular-nums">{formatPaise(booking.grossAmountPaise)}</span></div>
          <div className="flex justify-between"><span className="text-ink-secondary">Platform fee</span><span className="tabular-nums">{formatPaise(booking.platformFeePaise)}</span></div>
          <div className="flex justify-between border-t border-line pt-2 type-h4"><span>Total</span><span className="tabular-nums">{formatPaise(totalPaise)}</span></div>
          <div className="flex items-center justify-between pt-1"><span className="text-ink-secondary">Payment status</span><PaymentStatusBadge status={booking.paymentStatus} /></div>
        </div>
        <Button className="w-full" size="lg" disabled={!canCheckout || isLoading} onClick={() => void pay()}>
          <LockSimple aria-hidden /> {isLoading ? "Preparing secure checkout…" : `Pay ${formatPaise(totalPaise)}`}
        </Button>
        {error && <p role="alert" className="rounded-lg bg-status-warning-soft p-3 type-body-sm text-status-warning">{error}</p>}
        {statusMessage && <p role="status" className="rounded-lg bg-surface-low p-3 type-body-sm text-ink-secondary">{statusMessage}</p>}
        <p className="type-caption text-ink-secondary">The displayed total is based on the accepted proposal. A verified checkout signature alone doesn't mark a booking paid; provider confirmation is required. Read <Link to="/legal/payments-and-fees" className="underline underline-offset-2">Payments & Fees</Link>.</p>
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
