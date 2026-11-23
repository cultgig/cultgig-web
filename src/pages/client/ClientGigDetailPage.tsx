import { useState } from "react";
import { ChatCircleText, Columns, PencilSimple, Star, UsersThree, XCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { budgetLabel, deadlineLabel } from "@/components/marketplace/GigCard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ApplicationStatusBadge, GigStatusBadge } from "@/components/shared/StatusBadge";
import { DefinitionList, PageHeader, RatingStars, SectionCard, UserAvatar } from "@/components/shared/primitives";
import { EmptyState, NotFoundState } from "@/components/shared/states";
import { categoryLabel } from "@/data/categories";
import { canTransitionGig, GIG_STATUS_LABELS } from "@/domain/gigs";
import { formatPaise } from "@/domain/money";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link, useRouter } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { artistRating } from "@/state/selectors";
import type { ArtistProfile, GigApplication, GigStatus } from "@/types/marketplace";
import { formatDate, formatRelative, formatTime24 } from "@/utils/format";

const statusActions: { to: GigStatus; label: string; confirm: string }[] = [
  { to: "open", label: "Publish / reopen", confirm: "The gig becomes visible to artists and accepts applications." },
  { to: "paused", label: "Pause", confirm: "The gig is hidden from artists. Existing applications and conversations continue." },
  { to: "filled", label: "Mark filled", confirm: "The gig stops accepting applications. Open conversations continue." },
  { to: "closed", label: "Close", confirm: "The gig stops accepting applications and is archived. You can reopen it later." },
];

export default function ClientGigDetailPage({ gigId }: { gigId: string }) {
  const { gigs, applications, artists, reviews, viewer, run } = useMarketplace();
  const { navigate } = useRouter();
  const gig = gigs.find((g) => g.id === gigId && g.clientId === viewer?.id);
  usePageMeta(gig ? gig.title : "Gig not found");
  const [filter, setFilter] = useState<"active" | "shortlisted" | "declined" | "all">("active");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  if (!gig) return <NotFoundState title="Gig not found" description="It may have been deleted, or it belongs to another account." backTo="/client/gigs" backLabel="My gigs" />;

  const apps = applications.filter((a) => a.gigId === gig.id);
  const artistFor = (a: GigApplication): ArtistProfile | undefined => artists.find((p) => p.id === a.artistProfileId);
  const shown = apps.filter((a) => {
    if (filter === "active") return ["submitted", "shortlisted", "in_negotiation", "accepted"].includes(a.status);
    if (filter === "shortlisted") return a.status === "shortlisted" || a.status === "in_negotiation";
    if (filter === "declined") return a.status === "declined" || a.status === "withdrawn";
    return true;
  });
  const compareApps = apps.filter((a) => compareIds.includes(a.id));
  const deadline = deadlineLabel(gig.applicationDeadline);

  const openConversation = async (a: GigApplication) => {
    const id = await run((b) => b.market.openApplicationConversation(a.id));
    if (id) navigate(`/messages/${id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<Link to="/client/gigs" className="hover:text-ink">← My gigs</Link>}
        title={gig.title}
        description={<span className="flex flex-wrap items-center gap-2"><GigStatusBadge status={gig.status} /> {categoryLabel(gig.category)} · {formatDate(gig.eventDate)} · {gig.workingMode === "remote" ? "Remote" : gig.city}</span>}
        actions={
          <>
            <Button asChild variant="outline"><Link to={`/client/gigs/${gig.id}/edit`}><PencilSimple aria-hidden /> Edit</Link></Button>
            {statusActions
              .filter((s) => canTransitionGig(gig.status, s.to))
              .map((s) => (
                <ConfirmDialog
                  key={s.to}
                  trigger={<Button variant={s.to === "open" ? "default" : "outline"}>{s.label}</Button>}
                  title={`${s.label}?`}
                  description={s.confirm}
                  confirmLabel={s.label}
                  onConfirm={() => run((b) => b.market.setGigStatus(gig.id, s.to), { success: `Gig marked ${GIG_STATUS_LABELS[s.to].toLowerCase()}` })}
                />
              ))}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <section className="min-w-0 space-y-4" aria-label="Applicants">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="type-h2 text-ink">Applicants ({apps.filter((a) => a.status !== "withdrawn").length})</h2>
            <Button variant="outline" size="sm" disabled={compareIds.length < 2} onClick={() => setComparing(true)}>
              <Columns aria-hidden /> Compare {compareIds.length ? `(${compareIds.length})` : ""}
            </Button>
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
              <TabsTrigger value="declined">Declined</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
          {compareIds.length === 1 && <p className="type-caption text-ink-secondary">Select at least one more applicant to compare.</p>}
          {shown.length ? (
            <ul className="space-y-3">
              {shown.map((a) => {
                const artist = artistFor(a);
                const rating = artist ? artistRating(reviews, artist.id) : null;
                const closed = a.status === "declined" || a.status === "withdrawn";
                return (
                  <li key={a.id} className="rounded-xl border border-line bg-surface p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={compareIds.includes(a.id)}
                        onCheckedChange={(v) => setCompareIds((ids) => (v === true ? [...ids, a.id].slice(-4) : ids.filter((x) => x !== a.id)))}
                        aria-label={`Compare ${artist?.displayName ?? "applicant"}`}
                        className="mt-3"
                        disabled={closed}
                      />
                      <UserAvatar name={artist?.displayName ?? "Artist"} src={artist?.avatarUrl} className="size-11" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {artist ? <Link to={`/artists/${artist.slug}`} className="type-h4 text-ink hover:text-brand">{artist.displayName}</Link> : <span className="type-h4 text-ink">Artist profile hidden</span>}
                          <ApplicationStatusBadge status={a.status} />
                        </div>
                        <p className="type-caption text-ink-secondary">
                          {artist ? `${categoryLabel(artist.primaryCategory)} · ${artist.experienceYears} yrs · ${artist.city}` : ""} · applied {formatRelative(a.createdAt)}
                        </p>
                        {rating && <RatingStars value={rating.average} count={rating.count} />}
                        <p className="mt-2 type-body-sm text-ink-secondary">{a.message}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 type-body-sm">
                          <span className="font-semibold tabular-nums text-ink">{formatPaise(a.quotedAmountPaise + a.travelCostPaise)}</span>
                          {a.travelCostPaise > 0 && <span className="text-ink-secondary">incl. travel {formatPaise(a.travelCostPaise)}</span>}
                          <span className="text-ink-secondary">{a.availabilityConfirmed ? "Available on the date" : "Availability not confirmed"}</span>
                          <span className="text-ink-secondary">Quote valid to {formatDate(a.validUntil)}</span>
                        </div>
                        {!closed && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => void openConversation(a)}>
                              <ChatCircleText aria-hidden /> {a.conversationId ? "Open conversation" : "Message & negotiate"}
                            </Button>
                            {a.status === "submitted" && (
                              <Button size="sm" variant="outline" onClick={() => void run((b) => b.market.setApplicationStatus(a.id, "shortlisted"), { success: "Shortlisted" })}>
                                <Star aria-hidden /> Shortlist
                              </Button>
                            )}
                            {a.status !== "accepted" && (
                              <ConfirmDialog
                                trigger={<Button size="sm" variant="ghost"><XCircle aria-hidden /> Decline</Button>}
                                title={`Decline ${artist?.displayName ?? "this applicant"}?`}
                                description="They'll be told their application wasn't selected. This can't be undone."
                                confirmLabel="Decline"
                                destructive
                                onConfirm={() => run((b) => b.market.setApplicationStatus(a.id, "declined"), { success: "Applicant declined" })}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : apps.length ? (
            <EmptyState compact icon={UsersThree} title="No applicants in this view" action={{ label: "Show all", onClick: () => setFilter("all") }} />
          ) : gig.status === "draft" ? (
            <EmptyState compact icon={UsersThree} title="This gig is a draft" description="Publish it so artists can apply." />
          ) : (
            <EmptyState compact icon={UsersThree} title="No applications yet" description="Artists in this category are notified as they browse. Meanwhile you can contact artists directly." action={{ label: `Browse ${categoryLabel(gig.category).toLowerCase()}`, to: `/explore?category=${gig.category}` }} />
          )}
        </section>

        <aside className="space-y-4">
          <SectionCard title="Gig summary">
            <DefinitionList
              className="sm:grid-cols-1"
              items={[
                { label: "Budget", value: budgetLabel(gig) },
                { label: "Time", value: `${formatTime24(gig.startTime)}–${formatTime24(gig.endTime)}` },
                { label: "Artists needed", value: String(gig.artistsNeeded) },
                { label: "Applications close", value: `${formatDate(gig.applicationDeadline)} (${deadline.text.toLowerCase()})` },
                { label: "Travel", value: gig.travelCovered ? "Covered" : "Not covered" },
              ]}
            />
          </SectionCard>
          <SectionCard title="Description">
            <p className="line-clamp-[10] whitespace-pre-line type-body-sm text-ink-secondary">{gig.description}</p>
          </SectionCard>
        </aside>
      </div>

      <Dialog open={comparing} onOpenChange={setComparing}>
        <DialogContent className="max-h-[92vh] overflow-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Compare applicants</DialogTitle>
            <DialogDescription>Side-by-side view of quotes and scope for “{gig.title}”.</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40"> </TableHead>
                  {compareApps.map((a) => <TableHead key={a.id} className="min-w-[180px] text-ink">{artistFor(a)?.displayName ?? "Artist"}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {(
                  [
                    ["Total quote", (a: GigApplication) => <span className="font-semibold tabular-nums">{formatPaise(a.quotedAmountPaise + a.travelCostPaise)}</span>],
                    ["Travel", (a: GigApplication) => (a.travelCostPaise ? formatPaise(a.travelCostPaise) : "Included / none")],
                    ["Experience", (a: GigApplication) => `${artistFor(a)?.experienceYears ?? "—"} years`],
                    ["Rating", (a: GigApplication) => { const r = artistFor(a) ? artistRating(reviews, artistFor(a)!.id) : null; return r ? `${r.average} (${r.count})` : "No reviews yet"; }],
                    ["Available", (a: GigApplication) => (a.availabilityConfirmed ? "Confirmed" : "Not confirmed")],
                    ["Scope", (a: GigApplication) => a.scopeSummary || "—"],
                    ["Equipment", (a: GigApplication) => a.equipmentNotes || "—"],
                    ["Portfolio shared", (a: GigApplication) => `${a.portfolioItemIds.length} item${a.portfolioItemIds.length === 1 ? "" : "s"}`],
                    ["Services listed", (a: GigApplication) => artistFor(a)?.packages.map((p) => p.title).join(", ") || "—"],
                    ["Quote valid until", (a: GigApplication) => formatDate(a.validUntil)],
                  ] as const
                ).map(([label, render]) => (
                  <TableRow key={label}>
                    <TableCell className="type-label text-ink-secondary">{label}</TableCell>
                    {compareApps.map((a) => <TableCell key={a.id} className="align-top type-body-sm">{render(a)}</TableCell>)}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell />
                  {compareApps.map((a) => (
                    <TableCell key={a.id}>
                      <Button size="sm" onClick={() => { setComparing(false); void openConversation(a); }}>Negotiate</Button>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
