import { Receipt } from "@phosphor-icons/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { formatPaise } from "@/domain/money";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { formatDate } from "@/utils/format";

export default function ClientPaymentsPage() {
  usePageMeta("Payments");
  const { bookings, viewer } = useMarketplace();
  const mine = bookings.filter((b) => b.clientUserId === viewer?.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div className="space-y-6">
      <PageHeader title="Payments & transactions" description="Payment status for every booking." />
      <NoticeBanner tone="warning" title="No payments have been processed through Cultgig">
        Online checkout opens after a marketplace payment provider approves the platform. Until then this page lists agreed amounts only. <Link to="/legal/payments-and-fees" className="font-semibold text-brand">How payments will work</Link>
      </NoticeBanner>
      {mine.length ? (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking</TableHead>
                <TableHead>Event date</TableHead>
                <TableHead>Booking status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Agreed amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mine.map((b) => (
                <TableRow key={b.id}>
                  <TableCell><Link to={`/bookings/${b.id}`} className="text-brand hover:underline">{b.title}</Link><span className="block type-caption text-ink-secondary">{b.artistName}, v{b.acceptedProposalVersion}</span></TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(b.eventDate)}</TableCell>
                  <TableCell><BookingStatusBadge status={b.status} /></TableCell>
                  <TableCell><PaymentStatusBadge status={b.paymentStatus} /></TableCell>
                  <TableCell className="text-right tabular-nums">{formatPaise(b.grossAmountPaise)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState icon={Receipt} title="No transactions yet" description="Bookings appear here once you accept an artist's offer." action={{ label: "Find artists", to: "/explore" }} />
      )}
    </div>
  );
}
