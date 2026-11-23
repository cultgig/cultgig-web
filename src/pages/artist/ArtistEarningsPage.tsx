import { CurrencyInr } from "@phosphor-icons/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader, StatTile } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { formatPaise } from "@/domain/money";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { formatDate } from "@/utils/format";

/**
 * Earnings only count money that was actually paid and settled through Cultgig. Demo or unpaid
 * bookings are listed for reference but never counted as earnings or payouts.
 */
export default function ArtistEarningsPage() {
  usePageMeta("Earnings");
  const { bookings, viewer } = useMarketplace();
  const mine = bookings.filter((b) => b.artistUserId === viewer?.id && b.status !== "cancelled").sort((a, b) => b.eventDate.localeCompare(a.eventDate));
  const paid = mine.filter((b) => b.paymentStatus === "paid");
  const paidTotal = paid.filter((b) => b.status === "completed").reduce((s, b) => s + b.artistSharePaise, 0);
  const pending = paid.filter((b) => b.status !== "completed").reduce((s, b) => s + b.artistSharePaise, 0);
  const agreedValue = mine.reduce((s, b) => s + b.artistSharePaise, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Earnings" description="Payouts and settlements for bookings paid through Cultgig." />
      <NoticeBanner tone="warning" title="Online payments and payouts aren't live yet">
        Until a marketplace payment provider is approved, Cultgig doesn't collect money or settle payouts, so paid earnings stay at ₹0. Booking values below are agreed amounts, not payments.
      </NoticeBanner>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Total paid earnings" value={formatPaise(paidTotal)} hint="Settled to your bank" />
        <StatTile label="Pending settlements" value={formatPaise(pending)} hint="Paid, awaiting completion" />
        <StatTile label="Completed settlements" value={paid.filter((b) => b.status === "completed").length} />
        <StatTile label="Agreed booking value" value={formatPaise(agreedValue)} hint="Not a payment" />
      </div>
      {mine.length ? (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event date</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Your share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mine.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="whitespace-nowrap">{formatDate(b.eventDate)}</TableCell>
                  <TableCell><Link to={`/bookings/${b.id}`} className="text-brand hover:underline">{b.title}</Link><span className="block type-caption text-ink-secondary">{b.clientName}</span></TableCell>
                  <TableCell><BookingStatusBadge status={b.status} /></TableCell>
                  <TableCell><PaymentStatusBadge status={b.paymentStatus} /></TableCell>
                  <TableCell className="text-right tabular-nums">{formatPaise(b.artistSharePaise)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState icon={CurrencyInr} title="No bookings yet" description="Booking-wise earnings appear here once clients accept your offers." action={{ label: "Discover gigs", to: "/artist/gigs" }} />
      )}
    </div>
  );
}
