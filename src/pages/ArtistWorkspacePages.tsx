import { ArrowLeft, Calendar, CheckCircle2, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { GigCard } from "../components/marketplace/GigCard";
import { Button } from "../components/shared/LegacyButton";
import { NoticeBanner } from "../components/shared/NoticeBanner";
import { SafeImage } from "../components/shared/SafeImage";
import { creativeCategories, indianCities } from "../data/categories";
import { usePageMeta } from "../hooks/usePageMeta";
import { uploadFile } from "../lib/appwriteStorage";
import { Link, useRouter } from "../lib/router";
import { useAuth } from "../state/AuthContext";
import { useMarketplace } from "../state/MarketplaceContext";
import type { CategorySlug } from "../types/marketplace";
import { formatPaiseToInr, formatReadableDate } from "../utils/format";

function ArtistShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { pathname } = useRouter();
  const nav = [
    { label: "Overview", path: "/artist/dashboard" },
    { label: "Edit profile", path: "/artist/profile/edit" },
    { label: "Portfolio", path: "/artist/portfolio" },
    { label: "Open gigs", path: "/artist/opportunities" },
    { label: "Applications", path: "/artist/applications" },
    { label: "Proposals", path: "/artist/proposals" },
    { label: "Bookings", path: "/artist/bookings" },
    { label: "Availability", path: "/artist/availability" },
    { label: "Earnings", path: "/artist/earnings" },
    { label: "Settings", path: "/artist/settings" },
  ];

  return (
    <main id="main-content" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-line pb-4">
        <p className="type-caption text-plum font-semibold">Artist workspace (Prototype mode)</p>
        <h1 className="text-[24px] sm:text-[28px] leading-[1.2] font-bold text-ink-primary">
          {title}
        </h1>
      </div>

      <nav aria-label="Artist workspace sections" className="flex flex-wrap gap-2">
        {nav.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`min-h-[38px] px-3.5 py-2 rounded-md text-[13px] font-semibold border whitespace-nowrap ${
                active
                  ? "bg-plum text-white border-plum"
                  : "bg-surface text-ink-secondary border-line hover:border-plum hover:text-plum"
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

export function ArtistDashboardPage() {
  usePageMeta("Artist dashboard", "Manage your portfolio, open gig opportunities, and proposals.");
  const { gigs, applications, bookings, artistProfile } = useMarketplace();
  const openGigs = gigs.filter((g) => g.status === "open");

  return (
    <ArtistShell title={artistProfile.displayName}>
      <NoticeBanner tone="info" title="Prototype artist workspace">
        Profile updates, portfolio previews, and applications are persisted locally in your browser.
        Live Appwrite artist collections and Cloudinary signed uploads are pending backend setup.
      </NoticeBanner>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-line rounded-lg p-5">
          <p className="type-caption text-ink-secondary">Open sample briefs</p>
          <p className="text-[24px] font-bold text-ink-primary tabular-nums mt-1">{openGigs.length}</p>
        </div>
        <div className="bg-surface border border-line rounded-lg p-5">
          <p className="type-caption text-ink-secondary">Submitted applications</p>
          <p className="text-[24px] font-bold text-ink-primary tabular-nums mt-1">
            {applications.length}
          </p>
        </div>
        <div className="bg-surface border border-line rounded-lg p-5">
          <p className="type-caption text-ink-secondary">Portfolio items</p>
          <p className="text-[24px] font-bold text-ink-primary tabular-nums mt-1">
            {artistProfile.portfolio.length}
          </p>
        </div>
        <div className="bg-surface border border-line rounded-lg p-5">
          <p className="type-caption text-ink-secondary">Bookings</p>
          <p className="text-[24px] font-bold text-ink-primary tabular-nums mt-1">{bookings.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/artist/opportunities"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-plum text-white type-button"
        >
          Browse open event briefs
        </Link>
        <Link
          to="/artist/portfolio"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md border border-line-strong text-ink-primary hover:border-plum type-button"
        >
          Manage portfolio work
        </Link>
      </div>
    </ArtistShell>
  );
}

export function ArtistProfileEditPage() {
  usePageMeta("Edit artist profile", "Update your craft bio, city, travel radius, and starting rates.");
  const { artistProfile, updateArtistProfile } = useMarketplace();
  const [form, setForm] = useState(artistProfile);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateArtistProfile(form);
    setSaved(true);
  };

  return (
    <ArtistShell title="Edit artist profile">
      <form onSubmit={handleSave} className="bg-surface border border-line rounded-xl p-6 max-w-[740px] space-y-4">
        <div>
          <label htmlFor="art-name" className="block type-label text-ink-primary mb-1.5">
            Artist or collective name *
          </label>
          <input
            id="art-name"
            required
            type="text"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[15px]"
          />
        </div>

        <div>
          <label htmlFor="art-tagline" className="block type-label text-ink-primary mb-1.5">
            One-line craft summary *
          </label>
          <input
            id="art-tagline"
            required
            type="text"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[15px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="art-cat" className="block type-label text-ink-primary mb-1.5">
              Primary category
            </label>
            <select
              id="art-cat"
              value={form.primaryCategory}
              onChange={(e) => setForm({ ...form, primaryCategory: e.target.value as CategorySlug })}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[14px]"
            >
              {creativeCategories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="art-city" className="block type-label text-ink-primary mb-1.5">
              Base city
            </label>
            <select
              id="art-city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[14px]"
            >
              {indianCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="art-price" className="block type-label text-ink-primary mb-1.5">
              Starting price (₹ INR)
            </label>
            <input
              id="art-price"
              type="number"
              min={0}
              value={form.startingPriceInr ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  startingPriceInr: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="Leave blank for Quote required"
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[15px] tabular-nums"
            />
          </div>
        </div>

        <div>
          <label htmlFor="art-bio" className="block type-label text-ink-primary mb-1.5">
            Bio & performance setup notes
          </label>
          <textarea
            id="art-bio"
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full p-3 rounded-md border border-line bg-canvas text-[14px]"
          />
        </div>

        {saved && (
          <p className="type-body-sm text-semantic-success font-medium inline-flex items-center gap-1.5">
            <CheckCircle2 size={16} aria-hidden="true" />
            Artist profile draft saved locally.
          </p>
        )}

        <Button type="submit">Save artist profile</Button>
      </form>
    </ArtistShell>
  );
}

export function ArtistPortfolioPage() {
  usePageMeta("Artist portfolio", "Upload original portfolio work with ownership confirmation.");
  const { artistProfile, addPortfolioItem, removePortfolioItem } = useMarketplace();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ownershipConfirmed) {
      setError("Please confirm you own or have permission to publish this work before uploading.");
      e.target.value = "";
      return;
    }
    setBusy(true);
    try {
      const url = await uploadFile(file);
      addPortfolioItem({
        type: file.type.startsWith("video/") ? "video" : "image",
        title: title.trim() || file.name,
        caption: caption.trim() || "Uploaded portfolio preview (max 10 MB)",
        mediaUrl: url,
        ownershipConfirmed: true,
      });
      setTitle("");
      setCaption("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <ArtistShell title="Portfolio manager">
      <NoticeBanner tone="info" title="Portfolio upload status">
        Files are validated for MIME type and 10 MB limit client-side. If Appwrite storage is not
        configured, uploads stay as local browser previews. Signed Cloudinary delivery requires
        server-side signature generation.
      </NoticeBanner>

      <div className="bg-surface border border-line rounded-xl p-6 max-w-[680px] space-y-4">
        <h2 className="type-h3 text-ink-primary">Add original work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pf-title" className="block type-label text-ink-primary mb-1.5">
              Work title
            </label>
            <input
              id="pf-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Acoustic set at Jaipur courtyard"
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[14px]"
            />
          </div>
          <div>
            <label htmlFor="pf-caption" className="block type-label text-ink-primary mb-1.5">
              Context caption
            </label>
            <input
              id="pf-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Setting, duration, or your exact role"
              className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[14px]"
            />
          </div>
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={ownershipConfirmed}
            onChange={(e) => setOwnershipConfirmed(e.target.checked)}
            className="mt-1 w-4 h-4 accent-plum"
          />
          <span className="type-body-sm text-ink-secondary">
            I confirm this image or video is my original work (or I hold written client permission)
            and does not copy another artist&apos;s portfolio.
          </span>
        </label>

        <div>
          <label className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-md bg-plum text-white hover:bg-plum-hover type-label cursor-pointer">
            <Upload size={16} aria-hidden="true" />
            <span>{busy ? "Validating..." : "Select image or video (max 10 MB)"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </div>

        {error && (
          <p role="alert" className="type-body-sm text-semantic-error">
            {error}
          </p>
        )}
      </div>

      {artistProfile.portfolio.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {artistProfile.portfolio.map((item) => (
            <article key={item.id} className="bg-surface border border-line rounded-lg overflow-hidden">
              <div className="aspect-[4/3] bg-surface-muted">
                <SafeImage src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="type-h4 text-ink-primary">{item.title}</h3>
                  <p className="type-body-sm text-ink-secondary">{item.caption}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removePortfolioItem(item.id)}
                  aria-label={`Remove ${item.title}`}
                  className="p-2 text-ink-secondary hover:text-semantic-error"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </ArtistShell>
  );
}

export function ArtistOpportunitiesPage() {
  usePageMeta("Open gigs", "Browse open event briefs and submit structured proposals.");
  const { gigs } = useMarketplace();
  const openGigs = gigs.filter((g) => g.status === "open");

  return (
    <ArtistShell title="Open event briefs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {openGigs.map((gig) => (
          <GigCard
            key={gig.id}
            gig={gig}
            href={`/artist/opportunities/${gig.id}`}
            actionLabel="Review & apply"
          />
        ))}
      </div>
    </ArtistShell>
  );
}

export function ArtistOpportunityDetailPage({ gigId }: { gigId: string }) {
  usePageMeta("Gig opportunity", "Review event brief details and submit a structured proposal.");
  const { user } = useAuth();
  const { gigs, submitApplication, artistProfile } = useMarketplace();
  const gig = gigs.find((g) => g.id === gigId);

  const [message, setMessage] = useState("");
  const [quotedAmountInr, setQuotedAmountInr] = useState("18000");
  const [scopeSummary, setScopeSummary] = useState("");
  const [travelNotes, setTravelNotes] = useState("Local travel included");
  const [validUntil, setValidUntil] = useState("2026-12-05");
  const [cancellationNote, setCancellationNote] = useState(
    "Free reschedule with 72 hours notice subject to calendar availability."
  );
  const [availabilityConfirmed, setAvailabilityConfirmed] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!gig) {
    return (
      <ArtistShell title="Brief not found">
        <Link to="/artist/opportunities" className="type-label text-plum">
          Back to open briefs
        </Link>
      </ArtistShell>
    );
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    submitApplication({
      gigId: gig.id,
      artistId: user?.id || "local-artist",
      artistName: artistProfile.displayName,
      artistSlug: "rhea-kapoor-acoustic",
      artistCategory: artistProfile.primaryCategory,
      message: message.trim(),
      portfolioLink: "/artist/portfolio",
      quotedAmountInr: Number(quotedAmountInr) || 0,
      scopeSummary: scopeSummary.trim(),
      availabilityConfirmed,
      travelAndEquipmentNotes: travelNotes.trim(),
      validUntil,
      cancellationNote: cancellationNote.trim(),
    });
    setSubmitted(true);
  };

  return (
    <ArtistShell title={gig.title}>
      <Link
        to="/artist/opportunities"
        className="inline-flex items-center gap-1.5 type-label text-ink-secondary hover:text-plum"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Back to open briefs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-6 bg-surface border border-line rounded-xl p-6 space-y-4">
          <p className="type-caption text-ink-secondary">
            Posted by {gig.clientDisplayName} · {gig.city} · {formatReadableDate(gig.eventDate)}
          </p>
          <h2 className="type-h2 text-ink-primary">Event brief</h2>
          <p className="type-body text-ink-secondary">{gig.deliverables}</p>
          <div className="space-y-2 pt-2 border-t border-line-light type-body-sm text-ink-secondary">
            <p>
              <strong>Timing:</strong> {gig.startTime} – {gig.endTime} ({gig.durationSummary})
            </p>
            <p>
              <strong>Venue / area:</strong> {gig.venueArea}
            </p>
            <p>
              <strong>Equipment & setup:</strong> {gig.equipmentAndSpaceNotes || "Not specified"}
            </p>
            <p>
              <strong>Application deadline:</strong> {formatReadableDate(gig.applicationDeadline)}
            </p>
          </div>
        </section>

        <section className="lg:col-span-6 bg-surface border border-line rounded-xl p-6 space-y-4">
          <h2 className="type-h2 text-ink-primary">Submit structured proposal</h2>
          {submitted ? (
            <div className="space-y-3 bg-semantic-success-bg border border-semantic-success/30 rounded-lg p-5">
              <p className="type-h4 text-semantic-success">Proposal recorded in prototype mode</p>
              <p className="type-body-sm text-ink-secondary">
                Your quote and scope terms have been saved locally in your Applications list.
              </p>
              <Link to="/artist/applications" className="type-label text-plum underline">
                View my applications
              </Link>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label htmlFor="app-quote" className="block type-label text-ink-primary mb-1.5">
                  Quoted amount (₹ INR) *
                </label>
                <input
                  id="app-quote"
                  type="number"
                  required
                  min={500}
                  value={quotedAmountInr}
                  onChange={(e) => setQuotedAmountInr(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[15px] tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="app-scope" className="block type-label text-ink-primary mb-1.5">
                  Scope covered *
                </label>
                <input
                  id="app-scope"
                  type="text"
                  required
                  value={scopeSummary}
                  onChange={(e) => setScopeSummary(e.target.value)}
                  placeholder="e.g., 2 x 45 min acoustic sets + 45-min early soundcheck"
                  className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[14px]"
                />
              </div>
              <div>
                <label htmlFor="app-msg" className="block type-label text-ink-primary mb-1.5">
                  Why your craft fits this event *
                </label>
                <textarea
                  id="app-msg"
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-md border border-line bg-canvas text-[14px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="app-travel" className="block type-caption text-ink-secondary mb-1">
                    Travel & extra expenses
                  </label>
                  <input
                    id="app-travel"
                    type="text"
                    value={travelNotes}
                    onChange={(e) => setTravelNotes(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 rounded-md border border-line bg-canvas text-[13px]"
                  />
                </div>
                <div>
                  <label htmlFor="app-valid" className="block type-caption text-ink-secondary mb-1">
                    Proposal valid until
                  </label>
                  <input
                    id="app-valid"
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 rounded-md border border-line bg-canvas text-[13px]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="app-cancel" className="block type-caption text-ink-secondary mb-1">
                  Cancellation / reschedule note
                </label>
                <input
                  id="app-cancel"
                  type="text"
                  value={cancellationNote}
                  onChange={(e) => setCancellationNote(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-1.5 rounded-md border border-line bg-canvas text-[13px]"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-[13px] text-ink-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={availabilityConfirmed}
                  onChange={(e) => setAvailabilityConfirmed(e.target.checked)}
                  className="w-4 h-4 accent-plum"
                />
                <span>I confirm availability for {formatReadableDate(gig.eventDate)}</span>
              </label>
              <Button type="submit" className="w-full">
                Submit proposal (Prototype)
              </Button>
            </form>
          )}
        </section>
      </div>
    </ArtistShell>
  );
}

export function ArtistApplicationsPage() {
  usePageMeta("Artist applications", "Track submitted applications and status.");
  const { applications } = useMarketplace();
  return (
    <ArtistShell title="Your applications">
      <div className="space-y-3">
        {applications.map((app) => (
          <div key={app.id} className="bg-surface border border-line rounded-lg p-5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="type-h4 text-ink-primary">{app.scopeSummary}</p>
              <span className="type-h4 text-plum tabular-nums">
                ₹{app.quotedAmountInr.toLocaleString("en-IN")} · {app.status}
              </span>
            </div>
            <p className="type-body-sm text-ink-secondary">{app.message}</p>
          </div>
        ))}
      </div>
    </ArtistShell>
  );
}

export function ArtistProposalsPage() {
  usePageMeta("Versioned proposals", "Review active negotiation threads and offer versions.");
  const { conversations } = useMarketplace();
  return (
    <ArtistShell title="Active proposals & negotiations">
      <div className="space-y-4">
        {conversations.map((thread) => {
          const latest = thread.proposals[thread.proposals.length - 1];
          return (
            <article
              key={thread.id}
              className="bg-surface border border-line rounded-lg p-5 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h2 className="type-h3 text-ink-primary">{thread.gigTitle}</h2>
                <p className="type-body-sm text-ink-secondary">
                  Client: {thread.clientName} ·{" "}
                  {latest
                    ? `Proposal v${latest.version} (${latest.status}) · ${formatPaiseToInr(
                        latest.amountPaise
                      )}`
                    : "No formal offer version sent yet"}
                </p>
              </div>
              <Link
                to={`/messages/${thread.id}`}
                className="min-h-[40px] px-4 py-2 rounded-md bg-plum text-white type-label"
              >
                Open negotiation
              </Link>
            </article>
          );
        })}
      </div>
    </ArtistShell>
  );
}

export function ArtistBookingsPage() {
  usePageMeta("Artist bookings", "Manage confirmed and negotiating event bookings.");
  const { bookings } = useMarketplace();
  return (
    <ArtistShell title="Bookings">
      <div className="space-y-3">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-surface border border-line rounded-lg p-5 flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <p className="type-caption text-ink-secondary">
                {b.city} · {formatReadableDate(b.eventDate)} · Status: <strong>{b.status}</strong>
              </p>
              <h2 className="type-h3 text-ink-primary">{b.gigTitle}</h2>
            </div>
            <Link
              to={`/artist/bookings/${b.id}`}
              className="min-h-[40px] px-4 py-2 rounded-md border border-line-strong type-label text-ink-primary hover:border-plum"
            >
              Inspect booking
            </Link>
          </div>
        ))}
      </div>
    </ArtistShell>
  );
}

export function ArtistAvailabilityPage() {
  usePageMeta("Artist availability", "Mark upcoming available event dates.");
  const { artistProfile, toggleAvailabilityDate } = useMarketplace();
  const [customDate, setCustomDate] = useState("2026-12-27");

  return (
    <ArtistShell title="Availability calendar">
      <div className="bg-surface border border-line rounded-xl p-6 max-w-[600px] space-y-4">
        <p className="type-body text-ink-secondary">
          Add or remove dates you are available for event bookings. Stored locally in prototype mode.
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            aria-label="Add available date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="min-h-[44px] px-3 py-2 rounded-md border border-line bg-canvas text-[14px]"
          />
          <Button onClick={() => toggleAvailabilityDate(customDate)}>Toggle date</Button>
        </div>

        <div className="space-y-2 pt-2">
          {artistProfile.availabilitySlots.map((slot) => (
            <div
              key={slot}
              className="flex items-center justify-between p-3 rounded-md border border-line bg-canvas"
            >
              <span className="type-body font-medium inline-flex items-center gap-2">
                <Calendar size={15} className="text-plum" aria-hidden="true" />
                {formatReadableDate(slot)}
              </span>
              <button
                type="button"
                onClick={() => toggleAvailabilityDate(slot)}
                className="type-caption text-semantic-error hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </ArtistShell>
  );
}

export function ArtistEarningsPage() {
  usePageMeta("Earnings & payouts", "Settlement and payout onboarding status.");
  return (
    <ArtistShell title="Earnings & payouts">
      <NoticeBanner tone="warning" title="Settlement onboarding coming soon — zero balances active">
        Cultgig does not fabricate payout balances. Artist payouts and split settlements (via
        Razorpay Route or Cashfree Easy Split) will activate only after entity registration, KYC
        collection flows, and written payment provider approval are completed.
      </NoticeBanner>
    </ArtistShell>
  );
}

export function ArtistSettingsPage() {
  usePageMeta("Artist settings", "Account and privacy visibility settings.");
  const { user } = useAuth();
  return (
    <ArtistShell title="Artist account settings">
      <div className="bg-surface border border-line rounded-xl p-6 max-w-[600px] space-y-3">
        <p className="type-body text-ink-secondary">
          Signed in as <strong>{user?.email}</strong> ({user?.authMode}).
        </p>
        <p className="type-body-sm text-ink-secondary">
          To switch to your Client / Event Host dashboard, use the account switcher in the top
          navigation bar.
        </p>
      </div>
    </ArtistShell>
  );
}
