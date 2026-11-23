import { ArrowLeft, CheckCircle2, FileCheck2, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/shared/LegacyButton";
import { NoticeBanner } from "../components/shared/NoticeBanner";
import { usePageMeta } from "../hooks/usePageMeta";
import { Link, useRouter } from "../lib/router";
import { useAuth } from "../state/AuthContext";
import { useMarketplace } from "../state/MarketplaceContext";
import { formatPaiseToInr, formatReadableDate } from "../utils/format";

export function MessagesInboxPage() {
  usePageMeta("Messages & negotiations", "View active conversations and versioned offers.");
  const { conversations } = useMarketplace();

  return (
    <main id="main-content" className="max-w-[960px] mx-auto px-4 sm:px-6 py-10 space-y-6">
      <h1 className="text-[26px] font-bold text-ink">Messages & offer threads</h1>
      <div className="space-y-3">
        {conversations.map((thread) => {
          const latestProposal = thread.proposals[thread.proposals.length - 1];
          const lastMsg = thread.messages[thread.messages.length - 1];
          return (
            <Link
              key={thread.id}
              to={`/messages/${thread.id}`}
              className="block bg-surface border border-line rounded-lg p-5 hover:border-brand space-y-1.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="type-h3 text-ink">{thread.gigTitle}</h2>
                {latestProposal && (
                  <span className="type-label text-brand tabular-nums">
                    Proposal v{latestProposal.version} · {formatPaiseToInr(latestProposal.amountPaise)} (
                    {latestProposal.status})
                  </span>
                )}
              </div>
              <p className="type-body-sm text-ink-secondary">
                {thread.clientName} ↔ {thread.artistName}
              </p>
              {lastMsg && <p className="type-caption text-ink-secondary truncate">{lastMsg.body}</p>}
            </Link>
          );
        })}
      </div>
    </main>
  );
}

export function ConversationThreadPage({ conversationId }: { conversationId: string }) {
  usePageMeta(
    "Negotiation thread",
    "Discuss brief details and review immutable versioned offers."
  );
  const { navigate } = useRouter();
  const { user } = useAuth();
  const {
    conversations,
    sendMessage,
    sendCounterProposal,
    acceptProposalVersion,
  } = useMarketplace();

  const thread = conversations.find((c) => c.id === conversationId);
  const [messageText, setMessageText] = useState("");
  const [counterOpen, setCounterOpen] = useState(false);
  const [amountInr, setAmountInr] = useState("20500");
  const [eventDate, setEventDate] = useState("2026-12-05");
  const [duration, setDuration] = useState("6:45 PM – 9:00 PM");
  const [inclusionsText, setInclusionsText] = useState(
    "Arrival acoustic ambience, two 45-min vocal sets, early soundcheck"
  );
  const [exclusionsText, setExclusionsText] = useState("Venue PA & mixer provided by host");
  const [travelNotes, setTravelNotes] = useState("Local city travel included");
  const [cancellationTerms, setCancellationTerms] = useState(
    "Free reschedule up to 72 hours prior with mutual date availability."
  );
  const [acceptConfirmId, setAcceptConfirmId] = useState<string | null>(null);

  if (!thread) {
    return (
      <main id="main-content" className="max-w-[820px] mx-auto px-4 py-14 space-y-3">
        <h1 className="type-h1">Conversation not found</h1>
        <Link to="/client/messages" className="type-label text-brand">
          Back to messages
        </Link>
      </main>
    );
  }

  const activeRole = user?.activeMode === "artist" ? "artist" : "client";
  const senderName = user?.displayName || (activeRole === "artist" ? thread.artistName : thread.clientName);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessage(thread.id, activeRole, senderName, messageText.trim());
    setMessageText("");
  };

  const handleCounter = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(amountInr);
    if (!numeric || numeric <= 0) return;
    sendCounterProposal(thread.id, {
      proposedBy: activeRole,
      proposedByName: senderName,
      amountPaise: Math.round(numeric * 100),
      currency: "INR",
      eventDate,
      duration,
      inclusions: inclusionsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      exclusions: exclusionsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      travelNotes,
      cancellationTerms,
      validUntil: "2026-12-04",
    });
    setCounterOpen(false);
  };

  const handleAccept = (proposalId: string) => {
    const booking = acceptProposalVersion(thread.id, proposalId);
    setAcceptConfirmId(null);
    if (booking) {
      navigate(`/checkout/${booking.id}`);
    }
  };

  return (
    <main id="main-content" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to={activeRole === "artist" ? "/artist/proposals" : "/client/messages"}
        className="inline-flex items-center gap-1.5 type-label text-ink-secondary hover:text-brand"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Back to threads
      </Link>

      <div className="space-y-1">
        <p className="type-caption text-brand font-semibold">
          Versioned negotiation thread · Acting as {activeRole === "artist" ? "Artist" : "Client"}
        </p>
        <h1 className="text-[24px] sm:text-[28px] leading-[1.2] font-bold text-ink">
          {thread.gigTitle}
        </h1>
        <p className="type-body-sm text-ink-secondary">
          {thread.clientName} ↔{" "}
          <Link to={`/artists/${thread.artistSlug}`} className="text-brand hover:underline">
            {thread.artistName}
          </Link>{" "}
          · {thread.city}
        </p>
      </div>

      <NoticeBanner tone="info" title="Immutable proposal version history">
        Price or scope changes never overwrite earlier messages—each update creates a new numbered
        proposal version. Both sides must agree on the exact version before a booking advances to
        payment readiness.
      </NoticeBanner>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Chat Log */}
        <section className="lg:col-span-7 bg-surface border border-line rounded-xl p-5 space-y-4">
          <h2 className="type-h3 text-ink border-b border-line pb-3">
            Conversation log
          </h2>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {thread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3.5 rounded-lg border ${
                  msg.senderRole === "system"
                    ? "bg-brand-subtle border-line-strong text-ink"
                    : "bg-surface-low border-line text-ink"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="type-label text-ink">{msg.senderName}</span>
                  <span className="type-caption text-ink-secondary">
                    {formatReadableDate(msg.createdAt)}
                  </span>
                </div>
                <p className="type-body-sm text-ink-secondary">{msg.body}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="pt-2 border-t border-line flex gap-2">
            <label htmlFor="thread-msg" className="sr-only">
              Write a message
            </label>
            <input
              id="thread-msg"
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Ask about setlist, soundcheck, travel, or timing..."
              className="flex-1 min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[14px]"
            />
            <Button type="submit">
              <Send size={15} aria-hidden="true" />
              Send
            </Button>
          </form>
        </section>

        {/* Right: Versioned Offer History */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="type-h3 text-ink">Offer versions ({thread.proposals.length})</h2>
            <Button size="sm" variant="secondary" onClick={() => setCounterOpen((v) => !v)}>
              {counterOpen ? "Close counter-offer" : "Send counter-offer"}
            </Button>
          </div>

          {counterOpen && (
            <form
              onSubmit={handleCounter}
              className="bg-surface border border-line-strong rounded-xl p-5 space-y-3"
            >
              <h3 className="type-h4 text-ink">
                Create Proposal v{thread.proposals.length + 1}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="prop-amt" className="block type-caption text-ink-secondary mb-1">
                    Total amount (₹ INR)
                  </label>
                  <input
                    id="prop-amt"
                    type="number"
                    required
                    min={500}
                    value={amountInr}
                    onChange={(e) => setAmountInr(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 rounded-md border border-line bg-surface-low text-[14px] tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="prop-date" className="block type-caption text-ink-secondary mb-1">
                    Event date
                  </label>
                  <input
                    id="prop-date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 rounded-md border border-line bg-surface-low text-[13px]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="prop-dur" className="block type-caption text-ink-secondary mb-1">
                  Timing & duration
                </label>
                <input
                  id="prop-dur"
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-md border border-line bg-surface-low text-[13px]"
                />
              </div>
              <div>
                <label htmlFor="prop-inc" className="block type-caption text-ink-secondary mb-1">
                  Inclusions (comma separated)
                </label>
                <input
                  id="prop-inc"
                  type="text"
                  value={inclusionsText}
                  onChange={(e) => setInclusionsText(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-md border border-line bg-surface-low text-[13px]"
                />
              </div>
              <div>
                <label htmlFor="prop-exc" className="block type-caption text-ink-secondary mb-1">
                  Exclusions
                </label>
                <input
                  id="prop-exc"
                  type="text"
                  value={exclusionsText}
                  onChange={(e) => setExclusionsText(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-md border border-line bg-surface-low text-[13px]"
                />
              </div>
              <div>
                <label htmlFor="prop-cancel" className="block type-caption text-ink-secondary mb-1">
                  Cancellation terms
                </label>
                <input
                  id="prop-cancel"
                  type="text"
                  value={cancellationTerms}
                  onChange={(e) => setCancellationTerms(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-md border border-line bg-surface-low text-[13px]"
                />
              </div>
              <Button type="submit" size="sm" className="w-full">
                Submit Proposal v{thread.proposals.length + 1}
              </Button>
            </form>
          )}

          <div className="space-y-3">
            {[...thread.proposals].reverse().map((prop) => (
              <article
                key={prop.id}
                className={`bg-surface border rounded-xl p-5 space-y-3 ${
                  prop.status === "pending" ? "border-brand" : "border-line"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 type-label text-ink">
                    <FileCheck2 size={15} className="text-brand" aria-hidden="true" />
                    Proposal v{prop.version} · {prop.proposedByName}
                  </span>
                  <span className="type-caption font-semibold capitalize text-ink-secondary">
                    {prop.status}
                  </span>
                </div>

                <p className="text-[20px] font-bold text-ink tabular-nums">
                  {formatPaiseToInr(prop.amountPaise)}
                </p>

                <div className="type-body-sm text-ink-secondary space-y-1">
                  <p>
                    <strong>Date & timing:</strong> {formatReadableDate(prop.eventDate)} ·{" "}
                    {prop.duration}
                  </p>
                  <p>
                    <strong>Inclusions:</strong> {prop.inclusions.join("; ")}
                  </p>
                  <p>
                    <strong>Exclusions:</strong> {prop.exclusions.join("; ") || "None"}
                  </p>
                  <p>
                    <strong>Travel:</strong> {prop.travelNotes}
                  </p>
                  <p>
                    <strong>Cancellation:</strong> {prop.cancellationTerms}
                  </p>
                </div>

                {prop.status === "pending" && (
                  <div className="pt-2 border-t border-line">
                    {acceptConfirmId === prop.id ? (
                      <div className="space-y-2">
                        <p className="type-caption text-ink">
                          Confirm accepting Proposal v{prop.version} for{" "}
                          {formatPaiseToInr(prop.amountPaise)}?
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAccept(prop.id)}>
                            Confirm & proceed to booking
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setAcceptConfirmId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => setAcceptConfirmId(prop.id)}>
                        <CheckCircle2 size={15} aria-hidden="true" />
                        Accept Proposal v{prop.version}
                      </Button>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export function NotificationsPage() {
  usePageMeta("Notifications", "Recent updates on briefs, proposals, and bookings.");
  const { notifications, markNotificationRead } = useMarketplace();

  return (
    <main id="main-content" className="max-w-[780px] mx-auto px-4 sm:px-6 py-10 space-y-5">
      <h1 className="type-h1 text-ink">Notifications</h1>
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`bg-surface border rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 ${
              n.read ? "border-line" : "border-line-strong bg-brand-subtle/40"
            }`}
          >
            <div>
              <p className="type-h4 text-ink">{n.title}</p>
              <p className="type-body-sm text-ink-secondary">{n.detail}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={n.path}
                onClick={() => markNotificationRead(n.id)}
                className="type-label text-brand hover:underline"
              >
                Open
              </Link>
              {!n.read && (
                <button
                  type="button"
                  onClick={() => markNotificationRead(n.id)}
                  className="type-caption text-ink-secondary hover:text-ink"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
