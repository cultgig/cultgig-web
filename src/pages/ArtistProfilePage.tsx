import {
  ArrowLeft,
  Bookmark,
  Calendar,
  CheckCircle2,
  Flag,
  MapPin,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/shared/LegacyButton";
import { NoticeBanner } from "../components/shared/NoticeBanner";
import { SafeImage } from "../components/shared/SafeImage";
import { getCategoryBySlug } from "../data/categories";
import { usePageMeta } from "../hooks/usePageMeta";
import { Link, useRouter } from "../lib/router";
import { useAuth } from "../state/AuthContext";
import { useMarketplace } from "../state/MarketplaceContext";
import { formatArtistPrice, formatInr } from "../utils/format";

export function ArtistProfilePage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const {
    artists,
    savedArtistIds,
    toggleSaveArtist,
    gigs,
    startInquiryConversation,
    createSupportTicket,
  } = useMarketplace();

  const artist = artists.find((a) => a.slug === slug);
  const category = artist ? getCategoryBySlug(artist.primaryCategory) : undefined;

  usePageMeta(
    artist ? `${artist.displayName}` : "Artist profile not found",
    artist?.tagline || "Creative artist profile on Cultgig."
  );

  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedGigId, setSelectedGigId] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);

  if (!artist) {
    return (
      <main id="main-content" className="max-w-[960px] mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h1 className="type-h1 text-ink">Artist profile not found</h1>
        <p className="type-body text-ink-secondary">
          Return to Explore to browse illustrative sample profiles across 15 creative disciplines.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-brand text-white type-button"
        >
          Browse artists
        </Link>
      </main>
    );
  }

  const isSaved = savedArtistIds.includes(artist.id);
  const myOpenGigs = gigs.filter((g) => g.status === "open");

  const handleStartInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate(`/sign-in?next=/artists/${artist.slug}`);
      return;
    }
    if (!inquiryMessage.trim()) return;
    const chosenGig = myOpenGigs.find((g) => g.id === selectedGigId);
    const thread = startInquiryConversation({
      artist,
      clientId: user.id,
      clientName: user.displayName,
      gigId: chosenGig?.id,
      gigTitle: chosenGig?.title || `Direct inquiry for ${artist.displayName}`,
      initialMessage: inquiryMessage.trim(),
    });
    setInquiryOpen(false);
    navigate(`/messages/${thread.id}`);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    createSupportTicket({
      issueType: "artist_safety",
      name: user?.displayName || "Guest visitor",
      email: user?.email || "unauthenticated@local.preview",
      message: `Profile report for ${artist.slug}: ${reportReason.trim()}`,
    });
    setReportSent(true);
  };

  return (
    <main id="main-content" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      <Link
        to="/explore"
        className="inline-flex items-center gap-1.5 type-label text-ink-secondary hover:text-brand"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Back to Explore
      </Link>

      <NoticeBanner tone="info" title="Sample profile — illustrative preview">
        This profile is an illustrative sample showing how portfolios, starting packages,
        availability, and inquiry workflows appear on Cultgig. Reviews remain disabled until real
        verifiable bookings are completed.
      </NoticeBanner>

      {/* Profile Header */}
      <section className="bg-surface border border-line rounded-xl overflow-hidden">
        <div className="aspect-[16/5] min-h-[180px] bg-surface-container overflow-hidden">
          <SafeImage
            src={artist.coverUrl}
            alt={artist.coverAlt}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <SafeImage
              src={artist.avatarUrl}
              alt={artist.avatarAlt}
              className="w-20 h-20 rounded-full object-cover border-2 border-surface shadow-sm shrink-0"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-ink-secondary type-caption">
                <span className="text-brand font-semibold">{category?.label}</span>
                <span aria-hidden="true">·</span>
                <span>{artist.verificationLabel}</span>
              </div>
              <h1 className="text-[24px] sm:text-[28px] leading-[1.2] font-bold text-ink">
                {artist.displayName}
              </h1>
              <p className="type-body-lg text-ink-secondary max-w-[660px]">{artist.tagline}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 type-body-sm text-ink-secondary pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-brand" aria-hidden="true" />
                  Based in {artist.city} · Travels up to {artist.travelRadiusKm} km (
                  {artist.travelCities.join(", ")})
                </span>
                <span>Languages: {artist.languages.join(", ")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 shrink-0 lg:min-w-[230px]">
            <div className="bg-brand-subtle border border-line-strong rounded-md p-3.5 text-left">
              <p className="type-caption text-brand font-medium">Pricing guide</p>
              <p className="text-[20px] leading-[26px] font-bold text-ink tabular-nums">
                {formatArtistPrice(
                  artist.pricingMode,
                  artist.startingPriceInr,
                  artist.priceMaxInr
                )}
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                if (!user) {
                  navigate(`/sign-in?next=/artists/${artist.slug}`);
                  return;
                }
                setInquiryOpen((prev) => !prev);
              }}
            >
              <MessageSquare size={16} aria-hidden="true" />
              Send inquiry / Invite to gig
            </Button>
            <Button variant="outline" onClick={() => toggleSaveArtist(artist.id)}>
              <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
              {isSaved ? "Saved to shortlist" : "Save artist"}
            </Button>
          </div>
        </div>
      </section>

      {/* Inline Inquiry / Invite Panel */}
      {inquiryOpen && (
        <section
          aria-label="Send inquiry to artist"
          className="bg-surface border border-line-strong rounded-lg p-6 space-y-4"
        >
          <h2 className="type-h2 text-ink">Start a conversation with {artist.displayName}</h2>
          <form onSubmit={handleStartInquiry} className="space-y-4">
            <div>
              <label htmlFor="invite-gig" className="block type-label text-ink mb-1.5">
                Link an open gig brief (optional)
              </label>
              <select
                id="invite-gig"
                value={selectedGigId}
                onChange={(e) => setSelectedGigId(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-md border border-line bg-surface-low text-[14px]"
              >
                <option value="">General inquiry (no specific gig selected)</option>
                {myOpenGigs.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({g.city})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="inquiry-msg" className="block type-label text-ink mb-1.5">
                Event details, date, venue tone & question *
              </label>
              <textarea
                id="inquiry-msg"
                required
                rows={4}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Share your event date, city, audience size, and technical setup so the artist can reply with an accurate proposal."
                className="w-full px-3 py-2.5 rounded-md border border-line bg-surface-low text-[14px] leading-[21px]"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit">Start conversation thread</Button>
              <Button variant="ghost" onClick={() => setInquiryOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* Two-Column Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* About */}
          <section className="bg-surface border border-line rounded-lg p-6 space-y-3">
            <h2 className="type-h2 text-ink">About the craft</h2>
            <p className="type-body text-ink-secondary">{artist.bio}</p>
            <p className="type-body-sm text-ink-secondary inline-flex items-center gap-1.5 pt-1">
              <Calendar size={14} className="text-brand" aria-hidden="true" />
              {artist.availabilitySummary}
            </p>
          </section>

          {/* Portfolio */}
          <section className="space-y-4">
            <h2 className="type-h2 text-ink">Portfolio work</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {artist.portfolio.map((item) => (
                <article
                  key={item.id}
                  className="bg-surface border border-line rounded-lg overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-surface-container">
                    <SafeImage
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="type-h4 text-ink">{item.title}</h3>
                    <p className="type-body-sm text-ink-secondary">{item.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Packages */}
          <section className="space-y-4">
            <h2 className="type-h2 text-ink">Service packages & starting scope</h2>
            <div className="space-y-4">
              {artist.packages.map((pkg) => (
                <article
                  key={pkg.id}
                  className="bg-surface border border-line rounded-lg p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="type-h3 text-ink">{pkg.title}</h3>
                      <p className="type-body-sm text-ink-secondary">Duration: {pkg.duration}</p>
                    </div>
                    <p className="type-h3 text-brand tabular-nums">
                      {pkg.priceInr ? formatInr(pkg.priceInr) : "Custom quote"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-line">
                    <div>
                      <p className="type-label text-ink mb-1.5">Included</p>
                      <ul className="space-y-1">
                        {pkg.inclusions.map((inc) => (
                          <li key={inc} className="type-body-sm text-ink-secondary flex items-start gap-1.5">
                            <CheckCircle2 size={14} className="text-status-success shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="type-label text-ink mb-1.5">Not included / host arranges</p>
                      <ul className="space-y-1">
                        {pkg.exclusions.map((exc) => (
                          <li key={exc} className="type-body-sm text-ink-secondary">
                            · {exc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Reviews Policy & Report */}
        <aside className="lg:col-span-4 space-y-5">
          <section className="bg-surface border border-line rounded-lg p-5 space-y-3">
            <h2 className="type-h3 text-ink">Verified booking reviews</h2>
            <p className="type-body-sm text-ink-secondary">
              No reviews displayed yet. Cultgig only publishes reviews linked to completed,
              verifiable bookings—never unverified star counts.
            </p>
          </section>

          <section className="bg-surface border border-line rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-ink">
              <ShieldAlert size={17} className="text-brand" aria-hidden="true" />
              <h2 className="type-h4">Safety & profile reporting</h2>
            </div>
            <p className="type-body-sm text-ink-secondary">
              Artists confirm ownership of uploaded portfolio work. Report inaccurate or unlawful listings.
            </p>
            {!reportOpen ? (
              <button
                type="button"
                onClick={() => setReportOpen(true)}
                className="inline-flex items-center gap-1.5 type-label text-ink-secondary hover:text-status-error"
              >
                <Flag size={14} aria-hidden="true" />
                Report this profile
              </button>
            ) : reportSent ? (
              <p className="type-body-sm text-status-success font-medium">
                Report logged locally for review. Thank you for helping keep Cultgig safe.
              </p>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-2.5">
                <textarea
                  required
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Describe the concern (e.g., copyright, misleading claims, safety)"
                  className="w-full p-2.5 rounded-md border border-line text-[13px]"
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    Submit report
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setReportOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
