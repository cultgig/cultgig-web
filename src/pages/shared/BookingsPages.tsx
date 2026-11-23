import { useState } from "react";
import { CalendarBlank, CalendarCheck, ChatCircleText, CheckCircle, Circle, Lifebuoy, MapPin, MinusCircle, Star, XCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { BookingStatusBadge, DemoBadge, PaymentStatusBadge } from "@/components/shared/StatusBadge";
import { DefinitionList, PageHeader, RatingInput, RatingStars, SectionCard, UserAvatar } from "@/components/shared/primitives";
import { EmptyState, NotFoundState } from "@/components/shared/states";
import { isDemoMode } from "@/config/env";
import { allowedTransitions, BOOKING_HAPPY_PATH, BOOKING_STATUS_LABELS, bookingRoleFor } from "@/domain/bookings";
import { formatPaise } from "@/domain/money";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { BookingLifecycleStatus, BookingRecord, MarketplaceRole, ReviewRatings } from "@/types/marketplace";
import { daysUntil, formatDate, formatRelative, todayDateOnly } from "@/utils/format";

type Tab = "upcoming" | "awaiting_payment" | "active" | "completed" | "cancelled" | "all";

function matchesTab(b: BookingRecord, tab: Tab, today: string): boolean {
  switch (tab) {
    case "upcoming":
      return ["awaiting_payment", "confirmed", "in_progress", "completion_pending"].includes(b.status) && b.eventDate >= today;
    case "awaiting_payment":
      return b.status === "awaiting_payment";
    case "active":
      return ["confirmed", "in_progress", "completion_pending", "disputed"].includes(b.status);
    case "completed":
      return b.status === "completed";
    case "cancelled":
      return b.status === "cancelled";
    default:
      return true;
  }
}

export function BookingRow({ booking, role }: { booking: BookingRecord; role: MarketplaceRole }) {
  const other = role === "client" ? booking.artistName : booking.clientName;
  const days = daysUntil(booking.eventDate);
  return (
    <Link to={`/bookings/${booking.id}`} className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:bg-surface-low sm:flex-row sm:items-center">
      <div className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-surface-low py-2">
        <span className="type-label-sm uppercase text-ink-secondary">{new Date(`${booking.eventDate}T00:00`).toLocaleString("en-IN", { month: "short" })}</span>
        <span className="text-xl font-semibold text-ink-strong">{booking.eventDate.slice(8)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate type-h4 text-ink">{booking.title}</p>
          {booking.isSample && <DemoBadge />}
        </div>
        <p className="type-body-sm text-ink-secondary">
          with {other} · {booking.city}
          {days >= 0 && booking.status !== "completed" && booking.status !== "cancelled" ? ` · ${days === 0 ? "today" : `in ${days} day${days === 1 ? "" : "s"}`}` : ""}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
        <BookingStatusBadge status={booking.status} />
        <span className="type-label tabular-nums text-ink">{formatPaise(booking.grossAmountPaise)}</span>
      </div>
    </Link>
  );
}

export function BookingsListPage({ role }: { role: MarketplaceRole }) {
  usePageMeta("Bookings");
  const { bookings, viewer } = useMarketplace();
  const [tab, setTab] = useState<Tab>("upcoming");
  const today = todayDateOnly();
  const mine = bookings.filter((b) => (role === "client" ? b.clientUserId : b.artistUserId) === viewer?.id);
  const shown = mine.filter((b) => matchesTab(b, tab, today));
  const counts = (t: Tab) => mine.filter((b) => matchesTab(b, t, today)).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Bookings" description={role === "client" ? "Every artist you've agreed terms with, from confirmation to review." : "Your confirmed work and its status."} />
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {(
            [
              ["upcoming", "Upcoming"],
              ["awaiting_payment", "Awaiting payment"],
              ["active", "Confirmed & in progress"],
              ["completed", "Completed"],
              ["cancelled", "Cancelled"],
              ["all", "All"],
            ] as const
          ).map(([value, label]) => (
            <TabsTrigger key={value} value={value}>
              {label} ({counts(value)})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {shown.length ? (
        <div className="space-y-3">
          {shown.map((b) => (
            <BookingRow key={b.id} booking={b} role={role} />
          ))}
        </div>
      ) : mine.length ? (
        <EmptyState compact icon={CalendarBlank} title="Nothing in this view" description="Try another tab." action={{ label: "Show all bookings", onClick: () => setTab("all") }} />
      ) : (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description={role === "client" ? "A booking is created when you and an artist accept an offer in Messages." : "A booking is created when a client accepts your offer, or you accept theirs."}
          action={role === "client" ? { label: "Find artists", to: "/explore" } : { label: "Discover gigs", to: "/artist/gigs" }}
        />
      )}
    </div>
  );
}

function Timeline({ booking }: { booking: BookingRecord }) {
  const reached = new Set(booking.timeline.map((t) => t.status));
  const terminal = booking.status === "cancelled" || booking.status === "disputed";
  const steps: BookingLifecycleStatus[] = BOOKING_HAPPY_PATH.filter((s) => !["inquiry", "proposal_received", "negotiating"].includes(s));
  return (
    <ol className="space-y-0">
      {steps.map((s, i) => {
        const event = booking.timeline.find((t) => t.status === s);
        const done = reached.has(s);
        const current = booking.status === s;
        return (
          <li key={s} className="relative flex gap-3 pb-5 last:pb-0">
            {i < steps.length - 1 && <span className={cn("absolute left-[9px] top-5 h-full w-px", done ? "bg-brand" : "bg-line-strong")} aria-hidden />}
            {done ? <CheckCircle size={20} weight="fill" className="relative shrink-0 text-brand" aria-hidden /> : <Circle size={20} className={cn("relative shrink-0", current ? "text-brand" : "text-ink-muted")} aria-hidden />}
            <div className="-mt-0.5">
              <p className={cn("type-label", done || current ? "text-ink" : "text-ink-secondary")}>
                {BOOKING_STATUS_LABELS[s]}
                <span className="sr-only">{done ? " (done)" : " (not yet)"}</span>
              </p>
              {event && (
                <p className="type-caption text-ink-secondary">
                  {event.actorName} · {formatRelative(event.createdAt)}
                  {event.note && ` · ${event.note}`}
                </p>
              )}
            </div>
          </li>
        );
      })}
      {terminal && (
        <li className="flex gap-3 pt-2">
          <XCircle size={20} weight="fill" className="shrink-0 text-status-error" aria-hidden />
          <div>
            <p className="type-label text-status-error">{BOOKING_STATUS_LABELS[booking.status]}</p>
            <p className="type-caption text-ink-secondary">{booking.timeline.filter((t) => t.status === booking.status).at(-1)?.note}</p>
          </div>
        </li>
      )}
    </ol>
  );
}

function ReviewForm({ booking }: { booking: BookingRecord }) {
  const { run } = useMarketplace();
  const [ratings, setRatings] = useState<ReviewRatings>({ overall: 0, professionalism: 0, communication: 0, quality: 0, punctuality: 0 });
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const submit = async () => {
    if (Object.values(ratings).some((v) => v === 0)) return setError("Rate every category.");
    if (text.trim().length < 20) return setError("Write at least 20 characters.");
    setError("");
    await run((b) => b.market.submitReview(booking.id, ratings, text), { success: "Thanks — your review is published." });
  };
  return (
    <SectionCard title={`Review ${booking.artistName}`} description="Only clients with a completed booking can leave a review. It appears on the artist's profile as a verified booking.">
      <div className="space-y-3">
        {(["overall", "professionalism", "communication", "quality", "punctuality"] as const).map((k) => (
          <RatingInput key={k} id={`rate-${k}`} label={k[0].toUpperCase() + k.slice(1)} value={ratings[k]} onChange={(v) => setRatings((r) => ({ ...r, [k]: v }))} />
        ))}
        <Textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} aria-label="Written feedback" placeholder="What went well? What should other clients know?" />
        {error && <p role="alert" className="type-caption text-status-error">{error}</p>}
        <Button onClick={() => void submit()}>
          <Star aria-hidden /> Publish review
        </Button>
      </div>
    </SectionCard>
  );
}

export function BookingDetailPage({ bookingId }: { bookingId: string }) {
  const { bookings, viewer, run, reviews } = useMarketplace();
  const booking = bookings.find((b) => b.id === bookingId);
  usePageMeta(booking ? `Booking: ${booking.title}` : "Booking not found");
  if (!viewer) return null;
  if (!booking) return <NotFoundState title="Booking not found" description="It may belong to a different account, or the link may be wrong." backTo={viewer.activeRole === "artist" ? "/artist/bookings" : "/client/bookings"} backLabel="All bookings" />;

  const role = bookingRoleFor(booking, viewer.id)!;
  const other = role === "client" ? booking.artistName : booking.clientName;
  const transitions = allowedTransitions(booking, role);
  const existingReview = reviews.find((r) => r.bookingId === booking.id);
  const canReview = role === "client" && booking.status === "completed" && !existingReview;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<Link to={role === "client" ? "/client/bookings" : "/artist/bookings"} className="hover:text-ink">← All bookings</Link>}
        title={booking.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <BookingStatusBadge status={booking.status} /> <PaymentStatusBadge status={booking.paymentStatus} /> {booking.isSample && <DemoBadge />}
          </span>
        }
        actions={
          <Button asChild variant="outline">
            <Link to={`/messages/${booking.conversationId}`}>
              <ChatCircleText aria-hidden /> Open conversation
            </Link>
          </Button>
        }
      />

      {booking.status === "awaiting_payment" && (
        <NoticeBanner tone="warning" title="Online payment isn't available yet">
          Cultgig will collect payments only after a marketplace payment provider approves the platform. {role === "client" ? "Until then, agree payment arrangements with the artist in Messages." : "The client can't pay through Cultgig yet."}{" "}
          {isDemoMode && role === "client" && "In demo mode you can confirm the booking without any payment to test the rest of the lifecycle."}
        </NoticeBanner>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <SectionCard title="Agreed terms" description={`From Proposal v${booking.acceptedProposalVersion}, accepted ${formatDate(booking.createdAt)}.`}>
            <DefinitionList
              items={[
                { label: "Event date", value: formatDate(booking.eventDate) },
                { label: "City", value: <span className="inline-flex items-center gap-1"><MapPin size={14} aria-hidden /> {booking.city}</span> },
                { label: "Duration", value: booking.duration },
                { label: "Deliverables", value: booking.deliverables },
                { label: "Cancellation terms", value: booking.cancellationTerms },
                { label: "Booking reference", value: <code className="type-caption">{booking.id}</code> },
              ]}
            />
            {(booking.inclusions.length > 0 || booking.exclusions.length > 0) && (
              <div className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
                <ul className="space-y-1">
                  {booking.inclusions.map((i) => (
                    <li key={i} className="flex gap-1.5 type-body-sm text-ink"><CheckCircle size={16} className="mt-0.5 shrink-0 text-status-success" aria-hidden /> {i}</li>
                  ))}
                </ul>
                <ul className="space-y-1">
                  {booking.exclusions.map((i) => (
                    <li key={i} className="flex gap-1.5 type-body-sm text-ink-secondary"><MinusCircle size={16} className="mt-0.5 shrink-0" aria-hidden /><span><span className="sr-only">Not included: </span>{i}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Timeline">
            <Timeline booking={booking} />
          </SectionCard>

          {canReview && <ReviewForm booking={booking} />}
          {existingReview && (
            <SectionCard title="Your review">
              <RatingStars value={existingReview.ratings.overall} />
              <p className="mt-2 type-body text-ink-secondary">{existingReview.text}</p>
            </SectionCard>
          )}
        </div>

        <aside className="space-y-4">
          <SectionCard title="Payment">
            <div className="space-y-2 type-body-sm">
              <div className="flex justify-between"><span className="text-ink-secondary">Agreed amount</span><span className="font-semibold tabular-nums text-ink">{formatPaise(booking.grossAmountPaise)}</span></div>
              <div className="flex justify-between"><span className="text-ink-secondary">Platform fee</span><span className="tabular-nums text-ink">{formatPaise(booking.platformFeePaise)}</span></div>
              {role === "artist" && <div className="flex justify-between"><span className="text-ink-secondary">Your share</span><span className="tabular-nums text-ink">{formatPaise(booking.artistSharePaise)}</span></div>}
              <div className="flex justify-between border-t border-line pt-2"><span className="text-ink-secondary">Status</span><PaymentStatusBadge status={booking.paymentStatus} /></div>
            </div>
            {role === "client" && booking.status === "awaiting_payment" && (
              <Button asChild variant="outline" className="mt-3 w-full">
                <Link to={`/checkout/${booking.id}`}>Checkout details</Link>
              </Button>
            )}
          </SectionCard>

          <SectionCard title="People">
            <div className="flex items-center gap-3">
              <UserAvatar name={other} />
              <div>
                <p className="type-label text-ink">{other}</p>
                <p className="type-caption text-ink-secondary">{role === "client" ? "Artist" : "Client"}</p>
              </div>
            </div>
            {role === "client" && (
              <Button asChild variant="link" className="mt-1 px-0">
                <Link to={`/artists/${booking.artistSlug}`}>View artist profile</Link>
              </Button>
            )}
          </SectionCard>

          <SectionCard title="Actions">
            <div className="flex flex-col gap-2">
              {isDemoMode && role === "client" && booking.status === "awaiting_payment" && (
                <ConfirmDialog
                  trigger={<Button>Confirm without payment (demo)</Button>}
                  title="Confirm this booking without payment?"
                  description={<p>Demo mode only. The booking moves to “Confirmed” and the payment status records that <strong>no payment was collected</strong>. Nothing is charged.</p>}
                  confirmLabel="Confirm (demo)"
                  onConfirm={() => run((b) => b.market.confirmBookingWithoutPayment(booking.id), { success: "Booking confirmed (demo, unpaid)" })}
                />
              )}
              {transitions.map((t) =>
                t.requiresReason ? (
                  <ConfirmDialog
                    key={t.to}
                    trigger={<Button variant={t.to === "cancelled" || t.to === "disputed" ? "outline" : "default"} className={t.to === "cancelled" ? "text-status-error" : undefined}>{t.label}</Button>}
                    title={`${t.label}?`}
                    description={t.to === "cancelled" ? <p>The cancellation terms in the accepted proposal apply: “{booking.cancellationTerms}”. {other} will be notified.</p> : <p>Support will review the conversation and the accepted proposal. Status changes are paused while the dispute is open.</p>}
                    confirmLabel={t.label}
                    destructive={t.to === "cancelled"}
                    requireReason={{ label: "Reason", placeholder: t.to === "cancelled" ? "e.g. Venue closed for renovation" : "What went wrong?" }}
                    onConfirm={(reason) => run((b) => b.market.transitionBooking(booking.id, t.to, reason), { success: `Booking ${BOOKING_STATUS_LABELS[t.to].toLowerCase()}` })}
                  />
                ) : (
                  <ConfirmDialog
                    key={t.to}
                    trigger={<Button>{t.label}</Button>}
                    title={`${t.label}?`}
                    description={<p>The booking moves to “{BOOKING_STATUS_LABELS[t.to]}” and {other} is notified.</p>}
                    confirmLabel={t.label}
                    onConfirm={() => run((b) => b.market.transitionBooking(booking.id, t.to), { success: `Booking moved to ${BOOKING_STATUS_LABELS[t.to].toLowerCase()}` })}
                  />
                ),
              )}
              {transitions.length === 0 && !(isDemoMode && role === "client" && booking.status === "awaiting_payment") && (
                <p className="type-body-sm text-ink-secondary">
                  {booking.status === "completed" ? "This booking is complete." : booking.status === "cancelled" ? "This booking was cancelled." : booking.status === "disputed" ? "Support is reviewing this dispute." : `Waiting for ${other}.`}
                </p>
              )}
              <Button asChild variant="ghost" className="justify-start">
                <Link to={`/support?booking=${booking.id}`}>
                  <Lifebuoy aria-hidden /> Get help with this booking
                </Link>
              </Button>
            </div>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}
