import { useState } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { AvailabilityCalendar } from "@/components/artist/editors";
import { PageHeader, SectionCard } from "@/components/shared/primitives";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { formatWeekdayDate, todayDateOnly } from "@/utils/format";

export default function ArtistAvailabilityPage() {
  usePageMeta("Availability");
  const { myArtistProfile, bookings, viewer, run } = useMarketplace();
  const saved = myArtistProfile?.unavailableDates ?? [];
  const [dates, setDates] = useState<string[]>(saved);
  const today = todayDateOnly();
  const active = bookings.filter((b) => b.artistUserId === viewer?.id && ["awaiting_payment", "confirmed", "in_progress", "completion_pending"].includes(b.status) && b.eventDate >= today);
  const bookedDates = [...new Set(active.map((b) => b.eventDate))];
  const dirty = JSON.stringify([...dates].sort()) !== JSON.stringify([...saved].sort());
  const upcomingBlocked = dates.filter((d) => d >= today).sort();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Availability"
        description="Select the dates you can't work. Clients see these as unavailable on your profile and search results respect them."
        actions={
          <>
            <Button variant="outline" disabled={!dirty} onClick={() => setDates(saved)}>Discard</Button>
            <Button disabled={!dirty} onClick={() => void run((b) => b.market.setUnavailableDates(dates), { success: "Availability updated" })}>Save availability</Button>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <AvailabilityCalendar unavailable={dates} bookedDates={bookedDates} onChange={setDates} />
        <div className="space-y-4">
          <SectionCard title="Booked dates">
            {active.length ? (
              <ul className="space-y-2">
                {active.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-2 type-body-sm">
                    <span className="text-ink">{formatWeekdayDate(b.eventDate)}</span>
                    <Link to={`/bookings/${b.id}`} className="truncate text-brand">{b.title}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="type-body-sm text-ink-secondary">No upcoming bookings.</p>
            )}
            {active.some((b) => dates.includes(b.eventDate)) && (
              <p className="mt-3 flex gap-2 type-body-sm text-status-warning"><WarningCircle size={18} className="shrink-0" aria-hidden /> Some blocked dates overlap a booking. Booked dates can't be blocked.</p>
            )}
          </SectionCard>
          <SectionCard title={`Blocked dates (${upcomingBlocked.length})`}>
            {upcomingBlocked.length ? (
              <ul className="flex flex-wrap gap-2">
                {upcomingBlocked.map((d) => (
                  <li key={d}>
                    <button type="button" onClick={() => setDates(dates.filter((x) => x !== d))} className="rounded-full bg-surface-low px-3 py-1 type-label-sm text-ink hover:bg-surface-container" aria-label={`Unblock ${formatWeekdayDate(d)}`}>
                      {formatWeekdayDate(d)} ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="type-body-sm text-ink-secondary">You're showing as available on every upcoming date.</p>
            )}
          </SectionCard>
          {dirty && <p className="type-body-sm text-status-warning" role="status">You have unsaved changes.</p>}
        </div>
      </div>
    </div>
  );
}
