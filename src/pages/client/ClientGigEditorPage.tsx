import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, FloppyDisk } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { budgetLabel } from "@/components/marketplace/GigCard";
import { DatePicker, DefinitionList, Field, PageHeader, StepProgress } from "@/components/shared/primitives";
import { NotFoundState } from "@/components/shared/states";
import { categoryLabel, creativeCategories, eventTypes, indianCities } from "@/data/categories";
import { validateGigForPublish, type GigDraftInput } from "@/domain/gigs";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useRouter } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { CategorySlug, EventGig, GigBudgetMode } from "@/types/marketplace";
import { addDays, formatDate, formatTime24, todayDateOnly } from "@/utils/format";

const STEPS = ["Basics", "Event details", "Requirements", "Budget", "Application preferences", "Review & publish"];

function toDraft(g?: EventGig, category?: string | null): GigDraftInput {
  const today = todayDateOnly();
  return {
    title: g?.title ?? "",
    category: (g?.category ?? (creativeCategories.some((c) => c.slug === category) ? category : "music-and-bands")) as CategorySlug,
    eventType: g?.eventType ?? "",
    description: g?.description ?? "",
    eventDate: g?.eventDate ?? "",
    startTime: g?.startTime ?? "19:00",
    endTime: g?.endTime ?? "21:00",
    city: g?.city ?? "",
    venueArea: g?.venueArea ?? "",
    workingMode: g?.workingMode ?? "on_site",
    artistsNeeded: g?.artistsNeeded ?? 1,
    durationSummary: g?.durationSummary ?? "",
    requirements: g?.requirements ?? "",
    deliverables: g?.deliverables ?? "",
    specialInstructions: g?.specialInstructions ?? "",
    references: g?.references ?? "",
    equipmentAndSpaceNotes: g?.equipmentAndSpaceNotes ?? "",
    budgetMode: g?.budgetMode ?? "range",
    budgetMinInr: g?.budgetMinInr ?? null,
    budgetMaxInr: g?.budgetMaxInr ?? null,
    travelCovered: g?.travelCovered ?? false,
    applicationDeadline: g?.applicationDeadline ?? addDays(today, 7),
    experiencePreference: g?.experiencePreference ?? "",
    locationPreference: g?.locationPreference ?? "",
    status: g?.status ?? "draft",
  };
}

export default function ClientGigEditorPage({ gigId }: { gigId?: string }) {
  const { gigs, viewer, run } = useMarketplace();
  const { navigate, query } = useRouter();
  const existing = gigId ? gigs.find((g) => g.id === gigId && g.clientId === viewer?.id) : undefined;
  usePageMeta(gigId ? "Edit gig" : "Post a gig");
  const initial = useMemo(() => toDraft(existing, query.get("category")), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [d, setD] = useState<GigDraftInput>(initial);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const today = todayDateOnly();

  if (gigId && !existing) return <NotFoundState title="Gig not found" description="It may have been deleted, or it belongs to another account." backTo="/client/gigs" backLabel="My gigs" />;
  const set = <K extends keyof GigDraftInput>(k: K, v: GigDraftInput[K]) => setD((x) => ({ ...x, [k]: v }));
  const isLive = existing && existing.status !== "draft";

  const validate = (i: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (i === 0) {
      if (d.title.trim().length < 6) e.title = "Use a descriptive title (at least 6 characters).";
      if (!d.eventType) e.eventType = "Choose the event type.";
      if (d.description.trim().length < 20) e.description = "Describe the gig in at least 20 characters.";
    }
    if (i === 1) {
      if (!d.eventDate) e.eventDate = "Choose the event date.";
      else if (d.eventDate < today) e.eventDate = "The date can't be in the past.";
      if (d.workingMode === "on_site" && !d.city.trim()) e.city = "Add the city.";
      if (d.startTime && d.endTime && d.endTime <= d.startTime) e.endTime = "End time should be after the start time (use the duration field for overnight events).";
      if (d.artistsNeeded < 1) e.artistsNeeded = "At least one.";
    }
    if (i === 3) {
      if (d.budgetMode === "fixed" && !(d.budgetMaxInr && d.budgetMaxInr > 0)) e.budget = "Add the fixed budget.";
      if (d.budgetMode === "range") {
        if (!(d.budgetMinInr && d.budgetMaxInr)) e.budget = "Add both ends of the range.";
        else if (d.budgetMinInr > d.budgetMaxInr) e.budget = "The minimum can't be above the maximum.";
      }
    }
    if (i === 4) {
      if (!d.applicationDeadline) e.deadline = "Choose a deadline.";
      else if (d.eventDate && d.applicationDeadline > d.eventDate) e.deadline = "The deadline must be on or before the event date.";
      else if (d.applicationDeadline < today) e.deadline = "The deadline can't be in the past.";
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error(Object.values(e)[0]);
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
    window.scrollTo({ top: 0 });
  };

  const save = async (publish: boolean) => {
    if (publish) {
      const problems = validateGigForPublish(d, today);
      if (problems.length) {
        toast.error(problems[0]);
        return;
      }
    } else if (!d.title.trim()) {
      toast.error("Add a title before saving a draft.");
      setStep(0);
      return;
    }
    setBusy(true);
    const payload = d.budgetMode === "fixed" ? { ...d, budgetMinInr: d.budgetMaxInr } : d.budgetMode === "open_to_quotes" ? { ...d, budgetMinInr: null, budgetMaxInr: null } : d;
    const saved = await run((b) => b.market.saveGig(payload, { gigId, publish }), { success: publish ? (isLive ? "Gig updated" : "Gig published — artists can now apply") : "Draft saved" });
    setBusy(false);
    if (saved) navigate(`/client/gigs/${saved.id}`, { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title={gigId ? `Edit: ${existing?.title}` : "Post a gig"} description="Clear briefs get better, faster quotes. You can save a draft at any step." />
      <StepProgress steps={STEPS} current={step} />
      <div className="space-y-5 rounded-2xl border border-line bg-surface p-5 shadow-xs sm:p-7">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="gg-title" label="Gig title" required error={errors.title} hint="e.g. “Live acoustic duo for a 120-guest sangeet”" className="sm:col-span-2">
              <Input id="gg-title" maxLength={140} value={d.title} onChange={(e) => set("title", e.target.value)} />
            </Field>
            <Field id="gg-cat" label="Category" required>
              <Select value={d.category} onValueChange={(v) => set("category", v as CategorySlug)}>
                <SelectTrigger id="gg-cat"><SelectValue /></SelectTrigger>
                <SelectContent>{creativeCategories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field id="gg-type" label="Event type" required error={errors.eventType}>
              <Select value={d.eventType} onValueChange={(v) => set("eventType", v)}>
                <SelectTrigger id="gg-type"><SelectValue placeholder="Choose type" /></SelectTrigger>
                <SelectContent>{eventTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field id="gg-desc" label="Description" required error={errors.description} hint="The occasion, audience, mood and anything that makes it special." className="sm:col-span-2">
              <Textarea id="gg-desc" rows={5} value={d.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="gg-date" label="Event date" required error={errors.eventDate}>
              <DatePicker id="gg-date" value={d.eventDate} onChange={(v) => set("eventDate", v)} minDate={today} invalid={Boolean(errors.eventDate)} />
            </Field>
            <Field id="gg-mode" label="On-site or remote">
              <Select value={d.workingMode} onValueChange={(v) => set("workingMode", v as "on_site" | "remote")}>
                <SelectTrigger id="gg-mode"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="on_site">On-site</SelectItem><SelectItem value="remote">Remote</SelectItem></SelectContent>
              </Select>
            </Field>
            <Field id="gg-start" label="Start time"><Input id="gg-start" type="time" value={d.startTime} onChange={(e) => set("startTime", e.target.value)} /></Field>
            <Field id="gg-end" label="End time" error={errors.endTime}><Input id="gg-end" type="time" value={d.endTime} onChange={(e) => set("endTime", e.target.value)} /></Field>
            <Field id="gg-city" label="City" required={d.workingMode === "on_site"} error={errors.city}>
              <Input id="gg-city" list="gg-cities" value={d.city} onChange={(e) => set("city", e.target.value)} />
              <datalist id="gg-cities">{indianCities.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
            <Field id="gg-venue" label="Venue or area" hint="Share the exact address in Messages later.">
              <Input id="gg-venue" value={d.venueArea} onChange={(e) => set("venueArea", e.target.value)} />
            </Field>
            <Field id="gg-duration" label="Duration"><Input id="gg-duration" value={d.durationSummary} onChange={(e) => set("durationSummary", e.target.value)} placeholder="e.g. 2 hours, two sets" /></Field>
            <Field id="gg-count" label="Artists needed" error={errors.artistsNeeded}><Input id="gg-count" type="number" min={1} max={50} value={d.artistsNeeded} onChange={(e) => set("artistsNeeded", Number(e.target.value) || 1)} /></Field>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4">
            <Field id="gg-req" label="Brief and requirements" hint="Style, repertoire, languages, dress code…"><Textarea id="gg-req" rows={4} value={d.requirements} onChange={(e) => set("requirements", e.target.value)} /></Field>
            <Field id="gg-deliv" label="Deliverables" hint="What exactly should the artist deliver?"><Textarea id="gg-deliv" rows={3} value={d.deliverables} onChange={(e) => set("deliverables", e.target.value)} /></Field>
            <Field id="gg-equip" label="Equipment and space"><Textarea id="gg-equip" rows={2} value={d.equipmentAndSpaceNotes} onChange={(e) => set("equipmentAndSpaceNotes", e.target.value)} placeholder="e.g. PA system and two mics provided; 3×4 m stage" /></Field>
            <Field id="gg-special" label="Special instructions"><Textarea id="gg-special" rows={2} value={d.specialInstructions} onChange={(e) => set("specialInstructions", e.target.value)} /></Field>
            <Field id="gg-refs" label="References" hint="Links or descriptions of the vibe you want."><Textarea id="gg-refs" rows={2} value={d.references} onChange={(e) => set("references", e.target.value)} /></Field>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <RadioGroup value={d.budgetMode} onValueChange={(v) => set("budgetMode", v as GigBudgetMode)} className="grid gap-2 sm:grid-cols-3" aria-label="Budget type">
              {([["fixed", "Fixed budget"], ["range", "Budget range"], ["open_to_quotes", "Open to quotes"]] as const).map(([value, label]) => (
                <Label key={value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line p-3 font-normal has-[:checked]:border-line-selected has-[:checked]:bg-brand-subtle">
                  <RadioGroupItem value={value} /> {label}
                </Label>
              ))}
            </RadioGroup>
            {d.budgetMode === "fixed" && (
              <Field id="gg-fixed" label="Budget (₹)" error={errors.budget}><Input id="gg-fixed" type="number" min={1} value={d.budgetMaxInr ?? ""} onChange={(e) => set("budgetMaxInr", e.target.value === "" ? null : Number(e.target.value))} /></Field>
            )}
            {d.budgetMode === "range" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="gg-min" label="From (₹)" error={errors.budget}><Input id="gg-min" type="number" min={1} value={d.budgetMinInr ?? ""} onChange={(e) => set("budgetMinInr", e.target.value === "" ? null : Number(e.target.value))} /></Field>
                <Field id="gg-max" label="To (₹)"><Input id="gg-max" type="number" min={1} value={d.budgetMaxInr ?? ""} onChange={(e) => set("budgetMaxInr", e.target.value === "" ? null : Number(e.target.value))} /></Field>
              </div>
            )}
            {d.budgetMode === "open_to_quotes" && <p className="type-body-sm text-ink-secondary">Artists will quote based on your brief. You can compare quotes side by side.</p>}
            <label className="flex items-center gap-3 type-body-sm text-ink"><Switch checked={d.travelCovered} onCheckedChange={(v) => set("travelCovered", v)} /> I'll cover the artist's travel costs</label>
          </div>
        )}
        {step === 4 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="gg-deadline" label="Application deadline" required error={errors.deadline}>
              <DatePicker id="gg-deadline" value={d.applicationDeadline} onChange={(v) => set("applicationDeadline", v)} minDate={today} invalid={Boolean(errors.deadline)} />
            </Field>
            <Field id="gg-exp" label="Experience preferred"><Input id="gg-exp" value={d.experiencePreference} onChange={(e) => set("experiencePreference", e.target.value)} placeholder="e.g. 3+ years at weddings" /></Field>
            <Field id="gg-loc" label="Location preference" className="sm:col-span-2"><Input id="gg-loc" value={d.locationPreference} onChange={(e) => set("locationPreference", e.target.value)} placeholder="e.g. Artists based in Mumbai or Pune preferred" /></Field>
          </div>
        )}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="type-h3 text-ink">{d.title || "Untitled gig"}</h2>
            <p className="whitespace-pre-line type-body text-ink-secondary">{d.description}</p>
            <DefinitionList
              items={[
                { label: "Category", value: categoryLabel(d.category) },
                { label: "Event type", value: d.eventType },
                { label: "Date and time", value: d.eventDate ? `${formatDate(d.eventDate)}, ${formatTime24(d.startTime)}–${formatTime24(d.endTime)}` : "" },
                { label: "Location", value: d.workingMode === "remote" ? "Remote" : [d.venueArea, d.city].filter(Boolean).join(", ") },
                { label: "Artists needed", value: String(d.artistsNeeded) },
                { label: "Budget", value: `${budgetLabel(d)}${d.travelCovered ? " · travel covered" : ""}` },
                { label: "Apply by", value: formatDate(d.applicationDeadline) },
                { label: "Deliverables", value: d.deliverables },
              ]}
            />
            {validateGigForPublish(d, today).length > 0 && (
              <ul className="rounded-lg bg-status-warning-soft p-3 type-body-sm text-status-warning">
                {validateGigForPublish(d, today).map((p) => <li key={p}>• {p}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || busy}><ArrowLeft aria-hidden /> Back</Button>
        {!isLive && <Button variant="outline" className="ml-auto" disabled={busy} onClick={() => void save(false)}><FloppyDisk aria-hidden /> Save draft</Button>}
        {step < STEPS.length - 1 ? (
          <Button className={isLive ? "ml-auto" : undefined} onClick={next}>Next <ArrowRight aria-hidden /></Button>
        ) : (
          <Button className={isLive ? "ml-auto" : undefined} disabled={busy} onClick={() => void save(true)}>{isLive ? "Save changes" : "Publish gig"}</Button>
        )}
      </div>
    </div>
  );
}
