import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  ChatCircleText,
  ClockCounterClockwise,
  DotsThreeVertical,
  Flag,
  HandCoins,
  Info,
  MagnifyingGlass,
  PaperPlaneRight,
  Prohibit,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProposalCard } from "@/components/messaging/ProposalCard";
import { ProposalComposer } from "@/components/messaging/ProposalComposer";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ReportDialog } from "@/components/shared/ReportDialog";
import { DemoBadge, ToneBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/primitives";
import { EmptyState, NotFoundState } from "@/components/shared/states";
import { categoryLabel } from "@/data/categories";
import { formatPaise } from "@/domain/money";
import { currentPendingProposal, isProposalExpired, latestProposal, negotiationStage, participantRole } from "@/domain/proposals";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link, useRouter } from "@/lib/router";
import { cn } from "@/lib/utils";
import { useMarketplace } from "@/state/MarketplaceContext";
import { unreadCount } from "@/state/selectors";
import type { ConversationThread, ProposalVersion } from "@/types/marketplace";
import { formatDate, formatRelative, formatTime24, todayDateOnly } from "@/utils/format";

const stageLabel = { inquiry: "Inquiry", proposal_received: "Proposal received", negotiating: "Negotiating", offer_accepted: "Offer accepted" } as const;
const stageTone = { inquiry: "neutral", proposal_received: "info", negotiating: "info", offer_accepted: "success" } as const;

function ConversationList({ threads, activeId, viewerId }: { threads: ConversationThread[]; activeId?: string; viewerId: string }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "action">("all");
  const filtered = threads.filter((t) => {
    const other = t.clientUserId === viewerId ? t.artistName : t.clientName;
    const matches = !q || `${other} ${t.subject}`.toLowerCase().includes(q.toLowerCase());
    if (!matches) return false;
    if (filter === "unread") return unreadCount(t, viewerId) > 0;
    if (filter === "action") return t.proposals.some((p) => p.status === "pending" && p.proposedByUserId !== viewerId);
    return true;
  });
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b border-line p-3">
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations" aria-label="Search conversations" className="h-9 pl-9" />
        </div>
        <div className="flex gap-1" role="group" aria-label="Filter conversations">
          {(["all", "unread", "action"] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn("rounded-full px-3 py-1 type-label-sm", filter === f ? "bg-brand-subtle text-brand" : "text-ink-secondary hover:bg-surface-low")}
            >
              {f === "all" ? "All" : f === "unread" ? "Unread" : "Needs response"}
            </button>
          ))}
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto" aria-label="Conversations">
        {filtered.length === 0 && <li className="p-6 text-center type-body-sm text-ink-secondary">{q || filter !== "all" ? "No conversations match." : "No conversations yet."}</li>}
        {filtered.map((t) => {
          const isClient = t.clientUserId === viewerId;
          const other = isClient ? t.artistName : t.clientName;
          const last = t.messages[t.messages.length - 1];
          const unread = unreadCount(t, viewerId);
          const needsResponse = t.proposals.some((p) => p.status === "pending" && p.proposedByUserId !== viewerId);
          return (
            <li key={t.id}>
              <Link
                to={`/messages/${t.id}`}
                aria-current={t.id === activeId ? "true" : undefined}
                className={cn("flex gap-3 border-b border-line px-3 py-3 hover:bg-surface-low", t.id === activeId && "bg-brand-subtle hover:bg-brand-subtle")}
              >
                <UserAvatar name={other} className="size-10" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={cn("truncate type-body", unread ? "font-semibold text-ink" : "font-medium text-ink")}>{other}</p>
                    {last && <span className="shrink-0 type-metadata text-ink-secondary">{formatRelative(last.createdAt)}</span>}
                  </div>
                  <p className="truncate type-caption text-ink-secondary">{t.subject}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <p className={cn("min-w-0 flex-1 truncate type-body-sm", unread ? "text-ink" : "text-ink-secondary")}>
                      {last ? `${last.senderUserId === viewerId ? "You: " : ""}${last.body}` : "No messages yet"}
                    </p>
                    {needsResponse && <span className="shrink-0 rounded-full bg-status-warning-soft px-1.5 type-metadata text-status-warning">Offer</span>}
                    {unread > 0 && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-ink-inverse">
                        {unread}
                        <span className="sr-only"> unread</span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ThreadView({ thread }: { thread: ConversationThread }) {
  const { viewer, run, bookings } = useMarketplace();
  const { navigate } = useRouter();
  const [body, setBody] = useState("");
  const [composer, setComposer] = useState<{ open: boolean; basis: ProposalVersion | null }>({ open: false, basis: null });
  const [showHistory, setShowHistory] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const viewerId = viewer!.id;
  const role = participantRole(thread, viewerId)!;
  const otherName = role === "client" ? thread.artistName : thread.clientName;
  const otherUserId = role === "client" ? thread.artistUserId : thread.clientUserId;
  const pending = currentPendingProposal(thread);
  const latest = latestProposal(thread);
  const stage = negotiationStage(thread);
  const booking = thread.bookingId ? bookings.find((b) => b.id === thread.bookingId) : undefined;
  const sorted = [...thread.proposals].sort((a, b) => b.version - a.version);
  const history = sorted.filter((p) => p.id !== pending?.id);
  const today = todayDateOnly();

  useEffect(() => {
    void run((b) => b.market.markConversationRead(thread.id), { silent: true });
  }, [thread.id, thread.messages.length, run]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [thread.id, thread.messages.length]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    setBody("");
    const ok = await run((b) => b.market.sendMessage(thread.id, text).then(() => true));
    if (!ok) setBody(text);
  };

  const respond = async (p: ProposalVersion, response: "accept" | "reject") => {
    const result = await run((b) => b.market.respondToProposal(thread.id, p.id, p.version, response), {
      success: response === "accept" ? `Proposal v${p.version} accepted — booking created` : `Proposal v${p.version} declined`,
    });
    if (response === "accept" && result) navigate(`/bookings/${result}`);
  };

  const pendingIsMine = pending?.proposedByUserId === viewerId;
  const pendingExpired = pending ? isProposalExpired(pending, today) : false;
  const previousOf = (p: ProposalVersion) => thread.proposals.find((x) => x.version === p.version - 1) ?? null;

  return (
    <div className="flex h-full min-w-0 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-line px-3 py-3 sm:px-4">
        <Button asChild variant="ghost" size="icon" className="lg:hidden">
          <Link to="/messages" aria-label="Back to conversations">
            <ArrowLeft aria-hidden />
          </Link>
        </Button>
        <UserAvatar name={otherName} className="size-10" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate type-h4 text-ink">{otherName}</h2>
            <ToneBadge tone={stageTone[stage]} label={stageLabel[stage]} />
            {thread.isSample && <DemoBadge />}
          </div>
          <p className="truncate type-caption text-ink-secondary">
            {thread.subject} · {categoryLabel(thread.category)} · {thread.city}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {booking && (
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to={`/bookings/${booking.id}`}>
                <CalendarCheck aria-hidden /> View booking
              </Link>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Conversation options">
                <DotsThreeVertical size={20} aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {role === "client" && (
                <DropdownMenuItem asChild>
                  <Link to={`/artists/${thread.artistSlug}`}>View artist profile</Link>
                </DropdownMenuItem>
              )}
              {thread.gigId && (
                <DropdownMenuItem asChild>
                  <Link to={role === "client" ? `/client/gigs/${thread.gigId}` : `/artist/gigs/${thread.gigId}`}>View gig</Link>
                </DropdownMenuItem>
              )}
              {booking && (
                <DropdownMenuItem asChild>
                  <Link to={`/bookings/${booking.id}`}>View booking</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => void run((b) => b.market.blockUser(otherUserId), { success: `${otherName} is blocked. They can't message you.` })}>
                <Prohibit aria-hidden /> Block {otherName}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ReportDialog targetType="user" targetId={otherUserId} targetLabel={otherName} trigger={<Button variant="ghost" size="icon" aria-label={`Report ${otherName}`}><Flag aria-hidden /></Button>} />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-5">
        {/* Inquiry summary */}
        {thread.inquiry && (
          <details className="rounded-xl border border-line bg-surface-low p-3" open={thread.proposals.length === 0}>
            <summary className="flex cursor-pointer items-center gap-2 type-label text-ink">
              <Info aria-hidden /> Inquiry details
            </summary>
            <dl className="mt-3 grid gap-2 type-body-sm sm:grid-cols-3">
              <div><dt className="type-caption text-ink-secondary">Event</dt><dd>{thread.inquiry.eventType || "—"}</dd></div>
              <div><dt className="type-caption text-ink-secondary">Date</dt><dd>{formatDate(thread.inquiry.eventDate)}{thread.inquiry.eventTime && `, ${formatTime24(thread.inquiry.eventTime)}`}</dd></div>
              <div><dt className="type-caption text-ink-secondary">Duration</dt><dd>{thread.inquiry.duration || "—"}</dd></div>
              <div><dt className="type-caption text-ink-secondary">Where</dt><dd>{[thread.inquiry.venue, thread.inquiry.city].filter(Boolean).join(", ") || "—"}</dd></div>
              <div><dt className="type-caption text-ink-secondary">Estimated budget</dt><dd>{thread.inquiry.estimatedBudgetInr ? formatPaise(thread.inquiry.estimatedBudgetInr * 100) : "Not shared"}</dd></div>
              <div className="sm:col-span-3"><dt className="type-caption text-ink-secondary">Requirements</dt><dd className="whitespace-pre-line">{thread.inquiry.requirements || "—"}</dd></div>
            </dl>
          </details>
        )}

        {/* Current offer */}
        {pending && (
          <section aria-label="Current offer" className="space-y-2">
            <p className="type-label-sm uppercase tracking-wide text-ink-secondary">Current offer</p>
            <ProposalCard
              proposal={pending}
              viewerId={viewerId}
              previous={previousOf(pending)}
              actions={
                pendingIsMine ? (
                  <>
                    <p className="mr-auto self-center type-body-sm text-ink-secondary">Waiting for {otherName} to respond.</p>
                    <ConfirmDialog
                      trigger={<Button variant="outline" size="sm">Withdraw</Button>}
                      title={`Withdraw Proposal v${pending.version}?`}
                      description="It stays in the history as withdrawn. You can send a new version afterwards."
                      confirmLabel="Withdraw offer"
                      onConfirm={() => run((b) => b.market.withdrawProposal(thread.id, pending.id), { success: "Offer withdrawn" })}
                    />
                  </>
                ) : pendingExpired ? (
                  <>
                    <p className="mr-auto self-center type-body-sm text-status-warning">This offer expired on {formatDate(pending.validUntil)}. Send a counter-offer or ask for a renewed one.</p>
                    <Button size="sm" onClick={() => setComposer({ open: true, basis: pending })}>Counter-offer</Button>
                  </>
                ) : (
                  <>
                    <ConfirmDialog
                      trigger={<Button size="sm">Accept v{pending.version}</Button>}
                      title={`Accept Proposal v${pending.version} for ${formatPaise(pending.amountPaise)}?`}
                      description={
                        <>
                          <p>You're agreeing to exactly this version: {pending.duration} on {formatDate(pending.eventDate)}, with the inclusions, exclusions and cancellation terms shown.</p>
                          <p>A booking will be created for both of you. Online payment isn't available yet, so no money changes hands through Cultgig.</p>
                        </>
                      }
                      confirmLabel={`Accept v${pending.version}`}
                      onConfirm={() => respond(pending, "accept")}
                    />
                    <Button size="sm" variant="outline" onClick={() => setComposer({ open: true, basis: pending })}>
                      Counter-offer
                    </Button>
                    <ConfirmDialog
                      trigger={<Button size="sm" variant="ghost">Decline</Button>}
                      title={`Decline Proposal v${pending.version}?`}
                      description="It stays in the history as declined. Either of you can send a new offer afterwards."
                      confirmLabel="Decline offer"
                      destructive
                      onConfirm={() => respond(pending, "reject")}
                    />
                  </>
                )
              }
            />
          </section>
        )}

        {/* Accepted / booking */}
        {booking && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-status-success-border bg-status-success-soft p-4">
            <p className="type-body-sm text-ink">
              Proposal v{booking.acceptedProposalVersion} ({formatPaise(booking.grossAmountPaise)}) was accepted. Negotiation is closed.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to={`/bookings/${booking.id}`}>Open booking</Link>
            </Button>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <section aria-label="Offer history">
            <button type="button" onClick={() => setShowHistory((s) => !s)} aria-expanded={showHistory} className="inline-flex items-center gap-1.5 type-label text-ink-secondary hover:text-ink">
              <ClockCounterClockwise aria-hidden /> {showHistory ? "Hide" : "Show"} offer history ({history.length} {history.length === 1 ? "version" : "versions"})
            </button>
            {showHistory && (
              <ol className="mt-2 space-y-2">
                {history.map((p) => (
                  <li key={p.id}>
                    <ProposalCard proposal={p} viewerId={viewerId} previous={previousOf(p)} compact={p.status !== "accepted"} />
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}

        {/* Messages */}
        <ol className="space-y-3" aria-label="Messages" aria-live="polite">
          {thread.messages.map((m) => {
            if (m.senderRole === "system") {
              return (
                <li key={m.id} className="flex justify-center">
                  <p className="max-w-md rounded-full bg-surface-low px-3 py-1 text-center type-caption text-ink-secondary">
                    <HandCoins size={12} className="mr-1 inline" aria-hidden />
                    {m.body} · {formatRelative(m.createdAt)}
                  </p>
                </li>
              );
            }
            const mine = m.senderUserId === viewerId;
            return (
              <li key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[85%] rounded-2xl px-3.5 py-2.5 sm:max-w-[70%]", mine ? "rounded-br-sm bg-brand text-ink-inverse" : "rounded-bl-sm border border-line bg-surface text-ink")}>
                  {!mine && <p className="type-label-sm text-ink-secondary">{m.senderName}</p>}
                  <p className="whitespace-pre-wrap break-words type-body">{m.body}</p>
                  <p className={cn("mt-1 type-metadata", mine ? "text-ink-inverse/75" : "text-ink-secondary")}>{formatRelative(m.createdAt)}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-line bg-surface p-3">
        {!booking && !pending && (
          <div className="mb-2 flex flex-wrap items-center gap-2 rounded-lg bg-surface-low p-2.5">
            <p className="flex-1 type-body-sm text-ink-secondary">
              {latest ? "No offer is open. Either of you can send a new one." : role === "artist" ? "Ready to quote? Send a formal offer with your price and terms." : "You can also propose terms yourself."}
            </p>
            <Button size="sm" onClick={() => setComposer({ open: true, basis: latest })}>
              <HandCoins aria-hidden /> {role === "artist" ? "Send offer" : "Propose terms"}
            </Button>
          </div>
        )}
        <form onSubmit={send} className="flex items-end gap-2">
          <label htmlFor="msg-body" className="sr-only">
            Message {otherName}
          </label>
          <Textarea
            id="msg-body"
            rows={1}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(e as unknown as FormEvent);
              }
            }}
            placeholder={`Message ${otherName}`}
            className="max-h-40 min-h-10 resize-none"
          />
          <Button type="submit" size="icon" disabled={!body.trim()} aria-label="Send message">
            <PaperPlaneRight weight="fill" aria-hidden />
          </Button>
        </form>
        <p className="mt-1.5 hidden type-metadata text-ink-secondary sm:block">Enter to send · Shift + Enter for a new line · Keep payments on Cultgig.</p>
      </div>

      <ProposalComposer
        open={composer.open}
        onOpenChange={(o) => setComposer((c) => ({ ...c, open: o }))}
        thread={thread}
        basis={composer.basis}
        onSubmit={async (draft) => Boolean(await run((b) => b.market.sendProposal(thread.id, draft).then(() => true), { success: "Offer sent" }))}
      />
    </div>
  );
}

export default function MessagesPage({ conversationId }: { conversationId?: string }) {
  usePageMeta("Messages");
  const { viewer, conversations } = useMarketplace();
  const active = useMemo(() => conversations.find((c) => c.id === conversationId), [conversations, conversationId]);
  if (!viewer) return null;

  if (conversationId && !active) {
    return <NotFoundState title="Conversation not found" description="It may belong to a different account, or the link may be wrong." backTo="/messages" backLabel="All messages" />;
  }

  if (!conversations.length) {
    return (
      <div className="space-y-6">
        <h1 className="type-h1 text-ink-strong">Messages</h1>
        <EmptyState
          icon={ChatCircleText}
          title="No conversations yet"
          description={viewer.activeRole === "client" ? "Contact an artist from their profile, or open a conversation with an applicant on one of your gigs." : "Conversations start when a client contacts you or opens your gig application."}
          action={viewer.activeRole === "client" ? { label: "Find artists", to: "/explore" } : { label: "Discover gigs", to: "/artist/gigs" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className={cn("type-h1 text-ink-strong", active && "hidden lg:block")}>Messages</h1>
      <div className="grid h-[calc(100dvh-var(--header-height)-150px)] min-h-[520px] overflow-hidden rounded-xl border border-line bg-surface lg:h-[calc(100dvh-var(--header-height)-120px)] lg:grid-cols-[320px_1fr]">
        <div className={cn("min-h-0 min-w-0 border-r border-line", active && "hidden lg:block")}>
          <ConversationList threads={conversations} activeId={active?.id} viewerId={viewer.id} />
        </div>
        <div className={cn("min-h-0 min-w-0", !active && "hidden lg:flex lg:items-center lg:justify-center")}>
          {active ? (
            <ThreadView key={active.id} thread={active} />
          ) : (
            <div className="p-8 text-center">
              <ChatCircleText size={36} className="mx-auto text-ink-muted" aria-hidden />
              <p className="mt-2 type-body text-ink-secondary">Select a conversation to read messages and offers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
