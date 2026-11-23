import { ArrowRight, Bell, CalendarCheck, Eye, EyeSlash, HandCoins, ImagesSquare, MagnifyingGlass, Storefront } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GigCard } from "@/components/marketplace/GigCard";
import { BookingRow } from "@/pages/shared/BookingsPages";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { PageHeader, SectionCard, StatTile } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { formatPaise } from "@/domain/money";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { gigMatchesArtist, profileCompletion, totalUnreadMessages } from "@/state/selectors";
import { formatRelative, todayDateOnly } from "@/utils/format";

export default function ArtistDashboardPage() {
  usePageMeta("Artist dashboard");
  const { viewer, myArtistProfile, gigs, applications, conversations, bookings, notifications, settings } = useMarketplace();
  if (!viewer) return null;
  const today = todayDateOnly();
  const completion = profileCompletion(myArtistProfile);
  const appliedGigIds = new Set(applications.filter((a) => a.artistUserId === viewer.id).map((a) => a.gigId));
  const opportunities = gigs.filter((g) => g.status === "open" && g.clientId !== viewer.id && g.applicationDeadline >= today && !appliedGigIds.has(g.id) && gigMatchesArtist(g, myArtistProfile));
  const myApps = applications.filter((a) => a.artistUserId === viewer.id && !["declined", "withdrawn"].includes(a.status));
  const needsResponse = conversations.filter((c) => c.artistUserId === viewer.id && c.proposals.some((p) => p.status === "pending" && p.proposedByUserId !== viewer.id));
  const myBookings = bookings.filter((b) => b.artistUserId === viewer.id);
  const upcoming = myBookings.filter((b) => ["awaiting_payment", "confirmed", "in_progress", "completion_pending"].includes(b.status) && b.eventDate >= today);
  const completedValue = myBookings.filter((b) => b.status === "completed").reduce((s, b) => s + b.artistSharePaise, 0);
  const unread = totalUnreadMessages(conversations.filter((c) => c.artistUserId === viewer.id), viewer.id);
  const visible = myArtistProfile?.published && settings?.profileVisibility === "public";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hi, ${viewer.displayName.split(" ")[0]}`}
        description="Here's what needs your attention."
        actions={
          myArtistProfile && (
            <Button asChild variant="outline">
              <Link to={`/artists/${myArtistProfile.slug}`}>View public profile</Link>
            </Button>
          )
        }
      />

      {needsResponse.length > 0 && (
        <NoticeBanner tone="warning" title={`${needsResponse.length} ${needsResponse.length === 1 ? "offer needs" : "offers need"} your response`}>
          <Link to={`/messages/${needsResponse[0].id}`} className="font-semibold text-brand">Review the latest offer →</Link>
        </NoticeBanner>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Profile strength" className="lg:col-span-2">
          <div className="flex items-center gap-4">
            <Progress value={completion.percent} className="h-2 flex-1" aria-label={`Profile ${completion.percent}% complete`} />
            <span className="type-label tabular-nums text-ink">{completion.percent}%</span>
          </div>
          {completion.missing.length ? (
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {completion.missing.slice(0, 4).map((m) => (
                <li key={m} className="type-body-sm text-ink-secondary">• {m}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 type-body-sm text-ink-secondary">Your profile is complete. Keep your availability up to date.</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline"><Link to="/artist/profile">Edit profile</Link></Button>
            <Button asChild size="sm" variant="outline"><Link to="/artist/portfolio"><ImagesSquare aria-hidden /> Portfolio</Link></Button>
            <Button asChild size="sm" variant="outline"><Link to="/artist/services"><Storefront aria-hidden /> Services</Link></Button>
          </div>
        </SectionCard>
        <SectionCard title="Visibility">
          <p className="flex items-center gap-2 type-body text-ink">
            {visible ? <Eye className="text-status-success" aria-hidden /> : <EyeSlash className="text-status-warning" aria-hidden />}
            {visible ? "Visible in search" : "Hidden from search"}
          </p>
          <p className="mt-1 type-body-sm text-ink-secondary">{visible ? "Clients can find and contact you." : "Turn visibility on in Settings → Privacy so clients can find you."}</p>
          <Button asChild size="sm" variant="ghost" className="mt-2 px-0"><Link to="/settings?tab=privacy">Visibility settings</Link></Button>
        </SectionCard>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatTile label="New opportunities" value={opportunities.length} hint="Match your craft" to="/artist/gigs?match=1" />
        <StatTile label="Active applications" value={myApps.length} to="/artist/applications" />
        <StatTile label="Offers to answer" value={needsResponse.length} to="/artist/proposals" />
        <StatTile label="Upcoming bookings" value={upcoming.length} to="/artist/bookings" />
        <StatTile label="Unread messages" value={unread} to="/messages" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Gigs for you" actions={<Link to="/artist/gigs" className="type-label text-brand">See all</Link>}>
          {opportunities.length ? (
            <div className="space-y-3">
              {opportunities.slice(0, 2).map((g) => (
                <GigCard key={g.id} gig={g} to={`/artist/gigs/${g.id}`} />
              ))}
            </div>
          ) : (
            <EmptyState compact icon={MagnifyingGlass} title="No new matching gigs" description="Browse all open gigs, or add secondary categories to see more." action={{ label: "Browse all gigs", to: "/artist/gigs" }} />
          )}
        </SectionCard>
        <div className="space-y-6">
          <SectionCard title="Upcoming bookings" actions={<Link to="/artist/bookings" className="type-label text-brand">All bookings</Link>}>
            {upcoming.length ? (
              <div className="space-y-2">{upcoming.slice(0, 3).map((b) => <BookingRow key={b.id} booking={b} role="artist" />)}</div>
            ) : (
              <EmptyState compact icon={CalendarCheck} title="No upcoming bookings" description="Bookings appear here when a client accepts your offer." />
            )}
          </SectionCard>
          <SectionCard title="Earnings" actions={<Link to="/artist/earnings" className="type-label text-brand">Details</Link>}>
            <p className="text-2xl font-semibold tabular-nums text-ink-strong">{formatPaise(0)}</p>
            <p className="type-body-sm text-ink-secondary">Paid out through Cultgig. Online payments aren't live yet.</p>
            {completedValue > 0 && <p className="mt-1 type-caption text-ink-secondary">{formatPaise(completedValue)} in completed booking value (not paid through Cultgig).</p>}
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Recent notifications" actions={<Link to="/notifications" className="type-label text-brand">All</Link>}>
        {notifications.length ? (
          <ul className="divide-y divide-line">
            {notifications.slice(0, 4).map((n) => (
              <li key={n.id}>
                <Link to={n.path} className="flex items-center gap-3 py-2.5 hover:text-brand">
                  <Bell size={16} className="shrink-0 text-ink-secondary" aria-hidden />
                  <span className={`flex-1 truncate type-body-sm ${n.read ? "text-ink-secondary" : "font-semibold text-ink"}`}>{n.title}</span>
                  <span className="type-caption text-ink-secondary">{formatRelative(n.createdAt)}</span>
                  <ArrowRight size={14} className="text-ink-secondary" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="type-body-sm text-ink-secondary">No notifications yet.</p>
        )}
      </SectionCard>

      {needsResponse.length === 0 && myApps.length === 0 && upcoming.length === 0 && (
        <div className="rounded-xl border border-line-subtle bg-brand-light-subtle p-5">
          <p className="flex items-center gap-2 type-h4 text-ink"><HandCoins aria-hidden /> Get your first booking</p>
          <p className="mt-1 type-body-sm text-ink-secondary">Apply to two or three open gigs that match your craft. A clear quote and relevant portfolio work make the biggest difference.</p>
          <Button asChild size="sm" className="mt-3"><Link to="/artist/gigs">Find gigs</Link></Button>
        </div>
      )}
    </div>
  );
}
