import { Bookmark, Calendar, FilePlus2, MessageSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ArtistCard } from "../components/marketplace/ArtistCard";
import { GigCard } from "../components/marketplace/GigCard";
import { Button } from "../components/shared/LegacyButton";
import { NoticeBanner } from "../components/shared/NoticeBanner";
import { creativeCategories, indianCities } from "../data/categories";
import { usePageMeta } from "../hooks/usePageMeta";
import { Link, useRouter } from "../lib/router";
import { useAuth } from "../state/AuthContext";
import { useMarketplace } from "../state/MarketplaceContext";
import type { CategorySlug, GigBudgetMode } from "../types/marketplace";
import { formatPaiseToInr, formatReadableDate } from "../utils/format";

function ClientShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { pathname } = useRouter();
  const nav = [
    { label: "Overview", path: "/client/dashboard" },
    { label: "My gigs", path: "/client/gigs" },
    { label: "Post a gig", path: "/client/gigs/new" },
    { label: "Saved artists", path: "/client/artists/saved" },
    { label: "Applications", path: "/client/applications" },
    { label: "Messages", path: "/client/messages" },
    { label: "Bookings", path: "/client/bookings" },
    { label: "Settings", path: "/client/settings/profile" },
  ];

  return (
    <main id="main-content" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="type-caption text-brand font-semibold">Client workspace (Prototype mode)</p>
          <h1 className="text-[24px] sm:text-[28px] leading-[1.2] font-bold text-ink">
            {title}
          </h1>
        </div>
        <Link
          to="/client/gigs/new"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-hover type-label"
        >
          <Plus size={16} aria-hidden="true" />
          Post a gig
        </Link>
      </div>

      <nav aria-label="Client workspace sections" className="flex flex-wrap gap-2">
        {nav.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`min-h-[38px] px-3.5 py-2 rounded-md text-[13px] font-semibold border whitespace-nowrap ${
                active
                  ? "bg-brand text-white border-brand"
                  : "bg-surface text-ink-secondary border-line hover:border-brand hover:text-brand"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </main>
  );
}

export function ClientDashboardPage() {
  usePageMeta("Client dashboard", "Manage event briefs, shortlisted artists, and proposals.");
  const { user } = useAuth();
  const { gigs, savedArtistIds, conversations, bookings } = useMarketplace();

  return (
    <ClientShell title={`Welcome, ${user?.displayName ?? "Host"}`}>
      <NoticeBanner tone="info" title="Local prototype state">
        Gigs, saved artists, and negotiation threads below are stored locally in your browser
        until live Appwrite marketplace collections are provisioned.
      </NoticeBanner>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-line rounded-lg p-5">
          <p className="type-caption text-ink-secondary">Active / draft briefs</p>
          <p className="text-[24px] font-bold text-ink tabular-nums mt-1">{gigs.length}</p>
        </div>
        <div className="bg-surface border border-line rounded-lg p-5">
          <p className="type-caption text-ink-secondary">Saved artists</p>
          <p className="text-[24px] font-bold text-ink tabular-nums mt-1">
            {savedArtistIds.length}
          </p>
        </div>
        <div className="bg-surface border border-line rounded-lg p-5">
          <p className="type-caption text-ink-secondary">Active threads</p>
          <p className="text-[24px] font-bold text-ink tabular-nums mt-1">
            {conversations.length}
          </p>
        </div>
        <div className="bg-surface border border-line rounded-lg p-5">
          <p className="type-caption text-ink-secondary">Bookings</p>
          <p className="text-[24px] font-bold text-ink tabular-nums mt-1">
            {bookings.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-surface border border-line rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="type-h3 text-ink">Quick actions</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/client/gigs/new"
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-md bg-brand text-white type-label"
            >
              <FilePlus2 size={16} aria-hidden="true" />
              Create structured gig brief
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-md border border-line-strong text-ink hover:border-brand type-label"
            >
              Browse artists
            </Link>
          </div>
        </section>

        <section className="bg-surface border border-line rounded-lg p-6 space-y-3">
          <h2 className="type-h3 text-ink">Latest negotiation thread</h2>
          {conversations[0] ? (
            <div className="space-y-2">
              <p className="type-h4 text-ink">{conversations[0].gigTitle}</p>
              <p className="type-body-sm text-ink-secondary">
                With {conversations[0].artistName} · {conversations[0].proposals.length} offer
                version(s)
              </p>
              <Link
                to={`/messages/${conversations[0].id}`}
                className="inline-flex items-center gap-1.5 type-label text-brand hover:underline"
              >
                <MessageSquare size={15} aria-hidden="true" />
                Open proposal & chat thread
              </Link>
            </div>
          ) : (
            <p className="type-body-sm text-ink-secondary">No active threads yet.</p>
          )}
        </section>
      </div>
    </ClientShell>
  );
}

export function ClientGigsListPage() {
  usePageMeta("My gigs", "Review and manage your event briefs.");
  const { gigs } = useMarketplace();
  return (
    <ClientShell title="Your event briefs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {gigs.map((gig) => (
          <GigCard key={gig.id} gig={gig} href={`/client/gigs/${gig.id}`} actionLabel="Manage brief" />
        ))}
      </div>
    </ClientShell>
  );
}

export function ClientNewGigPage() {
  usePageMeta("Post a gig brief", "Create a structured brief for independent artists.");
  const { query, navigate } = useRouter();
  const { user } = useAuth();
  const { createOrUpdateGig } = useMarketplace();

  const initialCat = (query.get("category") as CategorySlug) || "singers-and-vocalists";
  const [category, setCategory] = useState<CategorySlug>(initialCat);
  const [eventType, setEventType] = useState("Private celebration / Hospitality evening");
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("2026-12-19");
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("21:30");
  const [city, setCity] = useState(user?.city || "Mumbai");
  const [venueArea, setVenueArea] = useState("");
  const [workingMode, setWorkingMode] = useState<"on_site" | "remote">("on_site");
  const [artistsNeeded, setArtistsNeeded] = useState(1);
  const [durationSummary, setDurationSummary] = useState("2 hours live performance");
  const [deliverables, setDeliverables] = useState("");
  const [equipmentAndSpaceNotes, setEquipmentAndSpaceNotes] = useState("");
  const [budgetMode, setBudgetMode] = useState<GigBudgetMode>("range");
  const [budgetMinInr, setBudgetMinInr] = useState("15000");
  const [budgetMaxInr, setBudgetMaxInr] = useState("25000");
  const [travelCovered, setTravelCovered] = useState(false);
  const [applicationDeadline, setApplicationDeadline] = useState("2026-12-08");
  const [contactVisibility, setContactVisibility] = useState<
    "after_proposal" | "platform_messages_only"
  >("after_proposal");
  const [termsAck, setTermsAck] = useState(false);
  const [error, setError] = useState("");

  const submitGig = (targetStatus: "draft" | "open") => {
    setError("");
    if (!title.trim() || !deliverables.trim() || !venueArea.trim()) {
      setError("Please fill in the gig title, area/venue summary, and scope deliverables.");
      return;
    }
    if (budgetMode !== "open_to_quotes") {
      const min = Number(budgetMinInr);
      const max = Number(budgetMaxInr);
      if (Number.isNaN(min) || min <= 0) {
        setError("Enter a valid positive INR budget amount.");
        return;
      }
      if (budgetMode === "range" && (!max || max < min)) {
        setError("Maximum budget must be greater than or equal to minimum budget.");
        return;
      }
    }
    if (targetStatus === "open" && !termsAck) {
      setError("Please confirm the brief & privacy acknowledgement before publishing.");
      return;
    }

    const created = createOrUpdateGig({
      clientId: user?.id || "local-client",
      clientDisplayName: user?.displayName || "Event Host",
      clientType: "business",
      title: title.trim(),
      category,
      eventType: eventType.trim(),
      eventDate,
      startTime,
      endTime,
      city,
      venueArea: venueArea.trim(),
      workingMode,
      artistsNeeded: Number(artistsNeeded) || 1,
      durationSummary: durationSummary.trim(),
      deliverables: deliverables.trim(),
      equipmentAndSpaceNotes: equipmentAndSpaceNotes.trim(),
      budgetMode,
      budgetMinInr: budgetMode === "open_to_quotes" ? null : Number(budgetMinInr),
      budgetMaxInr:
        budgetMode === "open_to_quotes"
          ? null
          : budgetMode === "fixed"
          ? Number(budgetMinInr)
          : Number(budgetMaxInr),
      travelCovered,
      applicationDeadline,
      contactVisibility,
      status: targetStatus,
    });

    navigate(`/client/gigs/${created.id}`);
  };

  return (
    <ClientShell title="Post a structured event brief">
      <div className="bg-surface border border-line rounded-xl p-6 sm:p-8 max-w-[820px] space-y-6">
        <p className="type-body text-ink-secondary">
          Clear briefs cut out wasted messages. Exact venue door addresses and personal contact
          details stay hidden from public gig listings.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="gig-cat" className="block type-label text-ink mb-1.5">
              Creative category *
            </label>
            <select
              id="gig-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategorySlug)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[14px]"
            >
              {creativeCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="gig-event-type" className="block type-label text-ink mb-1.5">
              Event type *
            </label>
            <input
              id="gig-event-type"
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="e.g., Sangeet evening, Café sundowner, Brand launch"
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[15px]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="gig-title" className="block type-label text-ink mb-1.5">
            Brief title *
          </label>
          <input
            id="gig-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Acoustic duo for Saturday terrace dinner (60 guests)"
            className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[15px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="gig-date" className="block type-label text-ink mb-1.5">
              Event date
            </label>
            <input
              id="gig-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[14px]"
            />
          </div>
          <div>
            <label htmlFor="gig-start" className="block type-label text-ink mb-1.5">
              Start time
            </label>
            <input
              id="gig-start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[14px]"
            />
          </div>
          <div>
            <label htmlFor="gig-end" className="block type-label text-ink mb-1.5">
              End time
            </label>
            <input
              id="gig-end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[14px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="gig-city" className="block type-label text-ink mb-1.5">
              City
            </label>
            <select
              id="gig-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[14px]"
            >
              {indianCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="gig-area" className="block type-label text-ink mb-1.5">
              Neighbourhood / venue type *
            </label>
            <input
              id="gig-area"
              type="text"
              value={venueArea}
              onChange={(e) => setVenueArea(e.target.value)}
              placeholder="e.g., Indiranagar courtyard"
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[15px]"
            />
          </div>
          <div>
            <label htmlFor="gig-mode" className="block type-label text-ink mb-1.5">
              Format
            </label>
            <select
              id="gig-mode"
              value={workingMode}
              onChange={(e) => setWorkingMode(e.target.value as "on_site" | "remote")}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[14px]"
            >
              <option value="on_site">On-site</option>
              <option value="remote">Remote / online</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="gig-duration" className="block type-label text-ink mb-1.5">
              Performance / session duration
            </label>
            <input
              id="gig-duration"
              type="text"
              value={durationSummary}
              onChange={(e) => setDurationSummary(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[15px]"
            />
          </div>
          <div>
            <label htmlFor="gig-count" className="block type-label text-ink mb-1.5">
              Number of artists needed
            </label>
            <input
              id="gig-count"
              type="number"
              min={1}
              max={20}
              value={artistsNeeded}
              onChange={(e) => setArtistsNeeded(Number(e.target.value))}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[15px] tabular-nums"
            />
          </div>
        </div>

        <div>
          <label htmlFor="gig-deliverables" className="block type-label text-ink mb-1.5">
            Deliverables & creative style *
          </label>
          <textarea
            id="gig-deliverables"
            rows={3}
            value={deliverables}
            onChange={(e) => setDeliverables(e.target.value)}
            placeholder="Describe style, repertoire, language preferences, or exact outputs expected."
            className="w-full p-3 rounded-md border border-line bg-surface-low text-[14px]"
          />
        </div>

        <div>
          <label htmlFor="gig-equip" className="block type-label text-ink mb-1.5">
            Equipment, space & access notes
          </label>
          <textarea
            id="gig-equip"
            rows={2}
            value={equipmentAndSpaceNotes}
            onChange={(e) => setEquipmentAndSpaceNotes(e.target.value)}
            placeholder="Mention sound/PA availability, green room, daylight window, or wall condition."
            className="w-full p-3 rounded-md border border-line bg-surface-low text-[14px]"
          />
        </div>

        <div className="space-y-3 pt-2 border-t border-line">
          <span className="block type-label text-ink">
            Budget approach (INR — negotiation supported via proposals)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: "fixed", label: "Fixed budget" },
              { id: "range", label: "Budget range" },
              { id: "open_to_quotes", label: "Open to quotes" },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudgetMode(b.id as GigBudgetMode)}
                className={`min-h-[42px] px-3 py-2 rounded-md border text-[13px] font-semibold ${
                  budgetMode === b.id
                    ? "bg-brand text-white border-brand"
                    : "bg-surface text-ink-secondary border-line"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {budgetMode !== "open_to_quotes" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="budget-min" className="block type-caption text-ink-secondary mb-1">
                  {budgetMode === "fixed" ? "Amount (₹ INR)" : "Minimum (₹ INR)"}
                </label>
                <input
                  id="budget-min"
                  type="number"
                  min={500}
                  value={budgetMinInr}
                  onChange={(e) => setBudgetMinInr(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[15px] tabular-nums"
                />
              </div>
              {budgetMode === "range" && (
                <div>
                  <label htmlFor="budget-max" className="block type-caption text-ink-secondary mb-1">
                    Maximum (₹ INR)
                  </label>
                  <input
                    id="budget-max"
                    type="number"
                    min={500}
                    value={budgetMaxInr}
                    onChange={(e) => setBudgetMaxInr(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[15px] tabular-nums"
                  />
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="inline-flex items-center gap-2 text-[13px] text-ink-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={travelCovered}
                onChange={(e) => setTravelCovered(e.target.checked)}
                className="w-4 h-4 accent-brand"
              />
              <span>Outstation travel / accommodation covered separately</span>
            </label>
            <div>
              <label htmlFor="gig-deadline" className="block type-caption text-ink-secondary mb-1">
                Application deadline
              </label>
              <input
                id="gig-deadline"
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="w-full min-h-[40px] px-3 py-1.5 rounded-md border border-line bg-surface-low text-[13px]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-vis" className="block type-label text-ink mb-1.5">
              Contact & venue privacy
            </label>
            <select
              id="contact-vis"
              value={contactVisibility}
              onChange={(e) =>
                setContactVisibility(
                  e.target.value as "after_proposal" | "platform_messages_only"
                )
              }
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[14px]"
            >
              <option value="after_proposal">Share venue specifics only after proposal shortlist</option>
              <option value="platform_messages_only">Keep communication inside Cultgig messages</option>
            </select>
          </div>
        </div>

        <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAck}
            onChange={(e) => setTermsAck(e.target.checked)}
            className="mt-1 w-4 h-4 accent-brand"
          />
          <span className="type-body-sm text-ink-secondary">
            I confirm this is a lawful creative brief and agree to Cultgig&apos;s draft{" "}
            <Link to="/legal/client-agreement" className="text-brand underline">
              Client Agreement
            </Link>
            .
          </span>
        </label>

        {error && (
          <p role="alert" className="type-body-sm text-status-error">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => submitGig("open")}>Publish gig brief (Prototype)</Button>
          <Button variant="outline" onClick={() => submitGig("draft")}>
            Save as draft
          </Button>
        </div>
      </div>
    </ClientShell>
  );
}

export function ClientGigDetailPage({ gigId }: { gigId: string }) {
  usePageMeta("Gig details", "Manage your gig brief and review applications.");
  const { navigate } = useRouter();
  const { gigs, applications, updateGigStatus, deleteGig } = useMarketplace();
  const gig = gigs.find((g) => g.id === gigId);

  if (!gig) {
    return (
      <ClientShell title="Gig not found">
        <p className="type-body text-ink-secondary">This brief could not be found.</p>
        <Link to="/client/gigs" className="type-label text-brand">
          Back to your briefs
        </Link>
      </ClientShell>
    );
  }

  const gigApps = applications.filter((a) => a.gigId === gig.id);

  return (
    <ClientShell title={gig.title}>
      <div className="bg-surface border border-line rounded-lg p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="type-body-sm text-ink-secondary">
            {gig.city} · {formatReadableDate(gig.eventDate)} · Status:{" "}
            <strong className="capitalize text-ink">{gig.status}</strong>
          </span>
          <div className="flex flex-wrap gap-2">
            {(["open", "paused", "filled", "closed"] as const).map((status) => (
              <Button
                key={status}
                size="sm"
                variant={gig.status === status ? "primary" : "outline"}
                onClick={() => updateGigStatus(gig.id, status)}
              >
                Mark {status}
              </Button>
            ))}
            {!gig.isSample && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  deleteGig(gig.id);
                  navigate("/client/gigs");
                }}
              >
                <Trash2 size={14} aria-hidden="true" />
                Delete
              </Button>
            )}
          </div>
        </div>
        <p className="type-body text-ink">{gig.deliverables}</p>
        {gig.equipmentAndSpaceNotes && (
          <p className="type-body-sm text-ink-secondary">
            <strong>Equipment & space:</strong> {gig.equipmentAndSpaceNotes}
          </p>
        )}
      </div>

      <section className="space-y-4">
        <h2 className="type-h2 text-ink">Applications ({gigApps.length})</h2>
        {gigApps.length === 0 ? (
          <div className="bg-surface border border-line rounded-lg p-6">
            <p className="type-body text-ink-secondary">
              No artist proposals submitted yet. You can also{" "}
              <Link to="/explore" className="text-brand font-semibold underline">
                invite artists from Explore
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {gigApps.map((app) => (
              <article key={app.id} className="bg-surface border border-line rounded-lg p-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link to={`/artists/${app.artistSlug}`} className="type-h3 text-brand hover:underline">
                    {app.artistName}
                  </Link>
                  <span className="type-h3 text-ink tabular-nums">
                    ₹{app.quotedAmountInr.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="type-body text-ink-secondary">{app.message}</p>
                <p className="type-body-sm text-ink-secondary">
                  Scope: {app.scopeSummary} · Valid until {formatReadableDate(app.validUntil)}
                </p>
                <div className="pt-2">
                  <Link
                    to="/messages/sample-thread-1"
                    className="type-label text-brand hover:underline"
                  >
                    Open negotiation thread →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </ClientShell>
  );
}

export function ClientSavedArtistsPage() {
  usePageMeta("Saved artists", "Your shortlisted artists on Cultgig.");
  const { artists, savedArtistIds } = useMarketplace();
  const saved = artists.filter((a) => savedArtistIds.includes(a.id));

  return (
    <ClientShell title="Saved artists">
      {saved.length === 0 ? (
        <div className="bg-surface border border-line rounded-lg p-8 text-center space-y-3">
          <Bookmark size={24} className="mx-auto text-brand" aria-hidden="true" />
          <p className="type-body text-ink-secondary">You have not saved any sample artists yet.</p>
          <Link to="/explore" className="type-label text-brand underline">
            Explore artists
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {saved.map((a) => (
            <ArtistCard key={a.id} artist={a} />
          ))}
        </div>
      )}
    </ClientShell>
  );
}

export function ClientApplicationsPage() {
  usePageMeta("Client applications", "Review artist proposals received across your briefs.");
  const { applications } = useMarketplace();
  return (
    <ClientShell title="Received applications">
      <div className="space-y-3">
        {applications.map((app) => (
          <div key={app.id} className="bg-surface border border-line rounded-lg p-5 space-y-2">
            <div className="flex items-center justify-between">
              <Link to={`/artists/${app.artistSlug}`} className="type-h3 text-brand hover:underline">
                {app.artistName}
              </Link>
              <span className="type-h4 tabular-nums">₹{app.quotedAmountInr.toLocaleString("en-IN")}</span>
            </div>
            <p className="type-body-sm text-ink-secondary">{app.message}</p>
            <Link to={`/client/gigs/${app.gigId}`} className="type-label text-brand">
              View brief →
            </Link>
          </div>
        ))}
      </div>
    </ClientShell>
  );
}

export function ClientBookingsPage() {
  usePageMeta("Client bookings", "Track booking status and accepted proposal versions.");
  const { bookings } = useMarketplace();
  return (
    <ClientShell title="Bookings">
      <div className="space-y-4">
        {bookings.map((b) => (
          <article key={b.id} className="bg-surface border border-line rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="type-caption text-ink-secondary">
                {b.city} · {formatReadableDate(b.eventDate)} · Status:{" "}
                <strong className="text-brand">{b.status}</strong>
              </p>
              <h2 className="type-h3 text-ink">{b.gigTitle}</h2>
              <p className="type-body-sm text-ink-secondary">
                Artist: {b.artistName} · Proposal v{b.acceptedProposalVersion}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="type-h3 text-ink tabular-nums">
                {formatPaiseToInr(b.grossAmountPaise)}
              </span>
              <Link
                to={`/client/bookings/${b.id}`}
                className="min-h-[40px] px-4 py-2 rounded-md border border-line-strong type-label text-ink hover:border-brand"
              >
                Manage booking
              </Link>
            </div>
          </article>
        ))}
      </div>
    </ClientShell>
  );
}

export function BookingDetailPage({ bookingId }: { bookingId: string }) {
  usePageMeta("Booking detail", "Inspect accepted offer terms and booking lifecycle status.");
  const { bookings, updateBookingStatus } = useMarketplace();
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <main id="main-content" className="max-w-[820px] mx-auto px-4 py-14 space-y-3">
        <h1 className="type-h1">Booking not found</h1>
        <Link to="/client/bookings" className="type-label text-brand">
          Back to bookings
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="space-y-1">
        <p className="type-label text-brand">Booking reference: {booking.id}</p>
        <h1 className="text-[26px] font-bold text-ink">{booking.gigTitle}</h1>
        <p className="type-body-sm text-ink-secondary">
          Current lifecycle stage: <strong className="text-ink">{booking.status}</strong>
        </p>
      </div>

      <NoticeBanner tone="warning" title="Payment provider approval required for live checkout">
        Online split-payment settlement (Razorpay Route / Cashfree Easy Split) is pending legal
        entity verification and written provider approval. No live money movement occurs here.
      </NoticeBanner>

      <div className="bg-surface border border-line rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-line">
          <div>
            <p className="type-caption text-ink-secondary">Event date & city</p>
            <p className="type-h4 text-ink inline-flex items-center gap-1.5 mt-0.5">
              <Calendar size={14} className="text-brand" aria-hidden="true" />
              {formatReadableDate(booking.eventDate)} · {booking.city}
            </p>
          </div>
          <div>
            <p className="type-caption text-ink-secondary">Artist</p>
            <Link to={`/artists/${booking.artistSlug}`} className="type-h4 text-brand hover:underline">
              {booking.artistName}
            </Link>
          </div>
          <div>
            <p className="type-caption text-ink-secondary">Agreed offer (Proposal v{booking.acceptedProposalVersion})</p>
            <p className="text-[20px] font-bold text-ink tabular-nums">
              {formatPaiseToInr(booking.grossAmountPaise)}
            </p>
          </div>
        </div>

        <p className="type-body text-ink-secondary">{booking.serviceSummary}</p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to={`/messages/${booking.conversationId}`}
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-md border border-line-strong text-ink hover:border-brand type-label"
          >
            View negotiation & offer log
          </Link>
          <Link
            to={`/checkout/${booking.id}`}
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-hover type-label"
          >
            Checkout & payment status
          </Link>
          <Button
            variant="ghost"
            onClick={() => updateBookingStatus(booking.id, "cancelled")}
          >
            Request cancellation (Prototype)
          </Button>
        </div>
      </div>
    </main>
  );
}

export function ClientSettingsPage({ section }: { section: "profile" | "billing" }) {
  usePageMeta("Client settings", "Manage client display preferences and billing notice.");
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [city, setCity] = useState(user?.city || "Mumbai");
  const [saved, setSaved] = useState(false);

  return (
    <ClientShell title={section === "billing" ? "Billing & invoices" : "Client profile settings"}>
      {section === "billing" ? (
        <NoticeBanner tone="info" title="No active billing or subscriptions">
          Cultgig has not activated paid subscriptions or gateway checkout yet. Approved receipts and
          tax invoices will appear here once payment onboarding is completed.
        </NoticeBanner>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUserProfile({ displayName: name, city });
            setSaved(true);
          }}
          className="bg-surface border border-line rounded-lg p-6 max-w-[560px] space-y-4"
        >
          <div>
            <label htmlFor="client-name" className="block type-label text-ink mb-1.5">
              Host or organisation display name
            </label>
            <input
              id="client-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[15px]"
            />
          </div>
          <div>
            <label htmlFor="client-city" className="block type-label text-ink mb-1.5">
              Default city
            </label>
            <select
              id="client-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[14px]"
            >
              {indianCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {saved && (
            <p className="type-body-sm text-status-success font-medium">
              Settings updated locally.
            </p>
          )}
          <Button type="submit">Save profile settings</Button>
        </form>
      )}
    </ClientShell>
  );
}
