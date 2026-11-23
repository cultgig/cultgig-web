import { useState } from "react";
import { CalendarBlank, CheckCircle, Clock, MapPin, UsersThree } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { budgetLabel, deadlineLabel } from "@/components/marketplace/GigCard";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { ReportDialog } from "@/components/shared/ReportDialog";
import { ApplicationStatusBadge, DemoBadge, GigStatusBadge } from "@/components/shared/StatusBadge";
import { DatePicker, DefinitionList, Field, PageHeader, SectionCard } from "@/components/shared/primitives";
import { NotFoundState } from "@/components/shared/states";
import { categoryLabel } from "@/data/categories";
import { formatPaise, rupeesToPaise } from "@/domain/money";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import { addDays, formatDate, formatTime24, todayDateOnly } from "@/utils/format";

const clientTypeLabel = { individual: "Individual", business: "Business", planner: "Event planner" } as const;

export default function ArtistGigDetailPage({ gigId }: { gigId: string }) {
  const { gigs, applications, viewer, myArtistProfile, run } = useMarketplace();
  const gig = gigs.find((g) => g.id === gigId);
  usePageMeta(gig ? gig.title : "Gig not found");
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const today = todayDateOnly();
  const [form, setForm] = useState({ message: "", quote: "", scope: "", portfolio: [] as string[], available: false, travel: "", equipment: "", validUntil: addDays(today, 7) });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!gig) return <NotFoundState title="This gig isn't available" description="It may have been closed, filled or removed by the client." backTo="/artist/gigs" backLabel="Discover gigs" />;
  const existing = applications.find((a) => a.gigId === gig.id && a.artistUserId === viewer?.id && a.status !== "withdrawn");
  const deadline = deadlineLabel(gig.applicationDeadline);
  const closed = gig.status !== "open" || gig.applicationDeadline < today;
  const own = gig.clientId === viewer?.id;
  const unavailable = myArtistProfile?.unavailableDates.includes(gig.eventDate);

  const submit = async () => {
    const e: Record<string, string> = {};
    if (form.message.trim().length < 20) e.message = "Write at least 20 characters about why you're a fit.";
    if (!(Number(form.quote) > 0)) e.quote = "Enter your quote in rupees.";
    if (form.travel && Number(form.travel) < 0) e.travel = "Travel cost can't be negative.";
    if (!form.available) e.available = "Confirm you're available on the event date.";
    setErrors(e);
    if (Object.keys(e).length) return;
    const app = await run((b) =>
      b.market.applyToGig({
        gigId: gig.id,
        message: form.message,
        quotedAmountPaise: rupeesToPaise(Number(form.quote)),
        scopeSummary: form.scope,
        portfolioItemIds: form.portfolio,
        availabilityConfirmed: form.available,
        travelCostPaise: form.travel ? rupeesToPaise(Number(form.travel)) : 0,
        equipmentNotes: form.equipment,
        validUntil: form.validUntil,
      }),
    );
    if (app) {
      setOpen(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<Link to="/artist/gigs" className="hover:text-ink">← Discover gigs</Link>}
        title={gig.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <GigStatusBadge status={gig.status} /> <span>{categoryLabel(gig.category)} · {gig.eventType}</span> {gig.isSample && <DemoBadge />}
          </span>
        }
        actions={<ReportDialog targetType="gig" targetId={gig.id} targetLabel="this gig" trigger={<Button variant="ghost" size="sm">Report</Button>} />}
      />

      {submitted && (
        <div role="status" className="flex flex-col gap-3 rounded-xl border border-status-success-border bg-status-success-soft p-5 sm:flex-row sm:items-center">
          <CheckCircle size={32} weight="fill" className="shrink-0 text-status-success" aria-hidden />
          <div className="flex-1">
            <p className="type-h4 text-ink">Application sent to {gig.clientDisplayName}</p>
            <p className="type-body-sm text-ink-secondary">You'll be notified when they shortlist you or open a conversation. Your quote becomes Proposal v1 if they start negotiating.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm"><Link to="/artist/applications">Track applications</Link></Button>
            <Button asChild size="sm" variant="outline"><Link to="/artist/gigs">More gigs</Link></Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <SectionCard title="About the gig">
            <p className="whitespace-pre-line type-body text-ink-secondary">{gig.description}</p>
          </SectionCard>
          <SectionCard title="Details">
            <DefinitionList
              items={[
                { label: "Date", value: <span className="inline-flex items-center gap-1"><CalendarBlank size={14} aria-hidden /> {formatDate(gig.eventDate)}</span> },
                { label: "Time", value: <span className="inline-flex items-center gap-1"><Clock size={14} aria-hidden /> {formatTime24(gig.startTime)}–{formatTime24(gig.endTime)}</span> },
                { label: "Location", value: <span className="inline-flex items-center gap-1"><MapPin size={14} aria-hidden /> {gig.workingMode === "remote" ? "Remote" : `${gig.venueArea ? `${gig.venueArea}, ` : ""}${gig.city}`}</span> },
                { label: "Duration", value: gig.durationSummary },
                { label: "Artists needed", value: <span className="inline-flex items-center gap-1"><UsersThree size={14} aria-hidden /> {gig.artistsNeeded}</span> },
                { label: "Travel", value: gig.travelCovered ? "Covered by client" : "Not covered — include in your quote" },
                { label: "Requirements", value: gig.requirements },
                { label: "Deliverables", value: gig.deliverables },
                { label: "Equipment & space", value: gig.equipmentAndSpaceNotes },
                { label: "Experience preferred", value: gig.experiencePreference },
                { label: "Special instructions", value: gig.specialInstructions },
                { label: "References", value: gig.references },
              ].filter((i) => i.value)}
            />
          </SectionCard>
        </div>
        <aside className="space-y-4">
          <SectionCard>
            <p className="type-caption text-ink-secondary">Budget</p>
            <p className="type-h2 text-ink-strong">{budgetLabel(gig)}</p>
            <p className={`mt-1 type-body-sm ${deadline.urgent ? "font-semibold text-status-warning" : "text-ink-secondary"}`}>{deadline.text} · {formatDate(gig.applicationDeadline)}</p>
            <div className="mt-4">
              {existing ? (
                <div className="space-y-2">
                  <p className="flex items-center gap-2 type-body-sm text-ink">You applied <ApplicationStatusBadge status={existing.status} /></p>
                  <p className="type-caption text-ink-secondary">Quote: {formatPaise(existing.quotedAmountPaise)}</p>
                  <Button asChild variant="outline" className="w-full"><Link to={existing.conversationId ? `/messages/${existing.conversationId}` : "/artist/applications"}>{existing.conversationId ? "Open conversation" : "View application"}</Link></Button>
                </div>
              ) : own ? (
                <p className="type-body-sm text-ink-secondary">This is your own gig.</p>
              ) : closed ? (
                <p className="type-body-sm text-ink-secondary">This gig is no longer accepting applications.</p>
              ) : !myArtistProfile?.published ? (
                <Button asChild className="w-full"><Link to="/onboarding/artist">Finish your profile to apply</Link></Button>
              ) : (
                <Button className="w-full" size="lg" onClick={() => setOpen(true)}>Apply to this gig</Button>
              )}
            </div>
          </SectionCard>
          <SectionCard title="Posted by">
            <p className="type-label text-ink">{gig.clientDisplayName}</p>
            <p className="type-caption text-ink-secondary">{clientTypeLabel[gig.clientType]} · posted {formatDate(gig.createdAt)}</p>
            <p className="mt-2 type-caption text-ink-secondary">Contact details are shared in Messages once the client opens a conversation.</p>
          </SectionCard>
        </aside>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Apply: {gig.title}</DialogTitle>
            <DialogDescription>Your quote and scope are shared with the client. If they negotiate, your quote becomes Proposal v1.</DialogDescription>
          </DialogHeader>
          {unavailable && <NoticeBanner tone="warning" title="You've blocked this date">The event date is marked unavailable on your calendar. Only apply if you can make it, and update your availability.</NoticeBanner>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="ap-msg" label="Message to the client" required error={errors.message} className="sm:col-span-2">
              <Textarea id="ap-msg" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Why you're a good fit, similar events you've done…" />
            </Field>
            <Field id="ap-quote" label="Your quote (₹)" required error={errors.quote}>
              <Input id="ap-quote" type="number" min={1} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
            </Field>
            <Field id="ap-travel" label="Travel cost (₹)" hint={gig.travelCovered ? "Client covers travel." : "Added to your quote."} error={errors.travel}>
              <Input id="ap-travel" type="number" min={0} value={form.travel} onChange={(e) => setForm({ ...form, travel: e.target.value })} disabled={gig.travelCovered} />
            </Field>
            <Field id="ap-scope" label="Scope" hint="What exactly you'll deliver." className="sm:col-span-2">
              <Textarea id="ap-scope" rows={2} value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} />
            </Field>
            <Field id="ap-equip" label="Equipment notes" className="sm:col-span-2">
              <Input id="ap-equip" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} placeholder="What you bring, what you need from the venue" />
            </Field>
            <Field id="ap-valid" label="Quote valid until">
              <DatePicker id="ap-valid" value={form.validUntil} onChange={(v) => setForm({ ...form, validUntil: v })} minDate={today} />
            </Field>
            {myArtistProfile && myArtistProfile.portfolio.length > 0 && (
              <fieldset className="space-y-2 sm:col-span-2">
                <legend className="type-label text-ink">Attach portfolio work</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {myArtistProfile.portfolio.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 rounded-lg border border-line p-2 type-body-sm">
                      <Checkbox checked={form.portfolio.includes(p.id)} onCheckedChange={(v) => setForm({ ...form, portfolio: v === true ? [...form.portfolio, p.id] : form.portfolio.filter((x) => x !== p.id) })} />
                      <span className="truncate">{p.title}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <div className="sm:col-span-2">
              <label className="flex items-start gap-2 type-body-sm text-ink">
                <Checkbox checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v === true })} className="mt-0.5" />
                I'm available on {formatDate(gig.eventDate)}, {formatTime24(gig.startTime)}–{formatTime24(gig.endTime)}.
              </label>
              {errors.available && <p role="alert" className="mt-1 type-caption text-status-error">{errors.available}</p>}
            </div>
            {Number(form.quote) > 0 && (
              <p className="type-body-sm text-ink sm:col-span-2">Total to client: <strong>{formatPaise(rupeesToPaise(Number(form.quote) + (Number(form.travel) || 0)))}</strong></p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => void submit()}>Submit application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
