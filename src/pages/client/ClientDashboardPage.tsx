import { Briefcase, CalendarCheck, ChatCircleText, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ArtistCard } from "@/components/marketplace/ArtistCard";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { GigStatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader, SectionCard, StatTile } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { BookingRow } from "@/pages/shared/BookingsPages";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { totalUnreadMessages } from "@/state/selectors";
import { formatDate, todayDateOnly } from "@/utils/format";

export default function ClientDashboardPage() {
  usePageMeta("Client dashboard");
  const { viewer, gigs, applications, conversations, bookings, artists, savedArtistIds } = useMarketplace();
  if (!viewer) return null;
  const today = todayDateOnly();
  const myGigs = gigs.filter((g) => g.clientId === viewer.id);
  const activeGigs = myGigs.filter((g) => ["open", "paused", "draft"].includes(g.status));
  const openGigs = myGigs.filter((g) => g.status === "open");
  const myGigIds = new Set(myGigs.map((g) => g.id));
  const received = applications.filter((a) => myGigIds.has(a.gigId));
  const newApps = received.filter((a) => a.status === "submitted");
  const pendingOffers = conversations.filter((c) => c.clientUserId === viewer.id && c.proposals.some((p) => p.status === "pending" && p.proposedByUserId !== viewer.id));
  const myBookings = bookings.filter((b) => b.clientUserId === viewer.id);
  const activeBookings = myBookings.filter((b) => ["awaiting_payment", "confirmed", "in_progress", "completion_pending", "disputed"].includes(b.status));
  const upcoming = activeBookings.filter((b) => b.eventDate >= today).slice(0, 3);
  const saved = artists.filter((a) => savedArtistIds.includes(a.id)).slice(0, 3);
  const unread = totalUnreadMessages(conversations.filter((c) => c.clientUserId === viewer.id), viewer.id);
  const needsCompletion = myBookings.filter((b) => b.status === "completion_pending");

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hi, ${viewer.displayName.split(" ")[0]}`}
        description="Your gigs, offers and bookings at a glance."
        actions={
          <>
            <Button asChild variant="outline"><Link to="/explore"><MagnifyingGlass aria-hidden /> Find artists</Link></Button>
            <Button asChild><Link to="/client/gigs/new"><Plus aria-hidden /> Post a gig</Link></Button>
          </>
        }
      />

      {pendingOffers.length > 0 && (
        <NoticeBanner tone="warning" title={`${pendingOffers.length} ${pendingOffers.length === 1 ? "artist has" : "artists have"} sent you an offer`}>
          <Link to={`/messages/${pendingOffers[0].id}`} className="font-semibold text-brand">Review offer from {pendingOffers[0].artistName} →</Link>
        </NoticeBanner>
      )}
      {needsCompletion.length > 0 && (
        <NoticeBanner title="Confirm completed work">
          {needsCompletion[0].artistName} marked “{needsCompletion[0].title}” as delivered. <Link to={`/bookings/${needsCompletion[0].id}`} className="font-semibold text-brand">Confirm completion →</Link>
        </NoticeBanner>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <StatTile label="Active gigs" value={activeGigs.length} to="/client/gigs" />
        <StatTile label="Open gigs" value={openGigs.length} to="/client/gigs" />
        <StatTile label="New applications" value={newApps.length} to="/client/applications" />
        <StatTile label="Offers to review" value={pendingOffers.length} to="/messages" />
        <StatTile label="Active bookings" value={activeBookings.length} to="/client/bookings" />
        <StatTile label="Unread messages" value={unread} to="/messages" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Upcoming events" actions={<Link to="/client/bookings" className="type-label text-brand">All bookings</Link>}>
          {upcoming.length ? (
            <div className="space-y-2">{upcoming.map((b) => <BookingRow key={b.id} booking={b} role="client" />)}</div>
          ) : (
            <EmptyState compact icon={CalendarCheck} title="No upcoming bookings" description="Accept an artist's offer in Messages to create a booking." action={{ label: "Find artists", to: "/explore" }} />
          )}
        </SectionCard>
        <SectionCard title="Your gigs" actions={<Link to="/client/gigs" className="type-label text-brand">Manage</Link>}>
          {activeGigs.length ? (
            <ul className="divide-y divide-line">
              {activeGigs.slice(0, 4).map((g) => {
                const count = received.filter((a) => a.gigId === g.id && a.status !== "withdrawn").length;
                return (
                  <li key={g.id}>
                    <Link to={`/client/gigs/${g.id}`} className="flex items-center gap-3 py-2.5 hover:text-brand">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate type-body font-medium text-ink">{g.title}</span>
                        <span className="type-caption text-ink-secondary">{formatDate(g.eventDate)} · {count} {count === 1 ? "applicant" : "applicants"}</span>
                      </span>
                      <GigStatusBadge status={g.status} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState compact icon={Briefcase} title="No active gigs" description="Post a gig with your date, city and budget, and artists will apply." action={{ label: "Post a gig", to: "/client/gigs/new" }} />
          )}
        </SectionCard>
      </div>

      <SectionCard title="Saved artists" actions={<Link to="/client/saved" className="type-label text-brand">All saved</Link>}>
        {saved.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{saved.map((a) => <ArtistCard key={a.id} artist={a} />)}</div>
        ) : (
          <EmptyState compact title="No saved artists" description="Tap the bookmark on any artist to build a shortlist." action={{ label: "Explore artists", to: "/explore" }} />
        )}
      </SectionCard>

      {unread > 0 && (
        <Button asChild variant="outline"><Link to="/messages"><ChatCircleText aria-hidden /> {unread} unread {unread === 1 ? "message" : "messages"}</Link></Button>
      )}
    </div>
  );
}
