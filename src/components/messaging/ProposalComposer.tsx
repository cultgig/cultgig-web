import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker, Field } from "@/components/shared/primitives";
import { formatPaise, rupeesToPaise } from "@/domain/money";
import type { ProposalDraft } from "@/domain/proposals";
import type { ConversationThread, ProposalVersion } from "@/types/marketplace";
import { addDays, todayDateOnly } from "@/utils/format";

function initialDraft(thread: ConversationThread, basis: ProposalVersion | null) {
  const today = todayDateOnly();
  return {
    amountRupees: basis ? String(basis.amountPaise / 100) : thread.inquiry?.estimatedBudgetInr ? String(thread.inquiry.estimatedBudgetInr) : "",
    eventDate: basis?.eventDate ?? thread.inquiry?.eventDate ?? "",
    duration: basis?.duration ?? thread.inquiry?.duration ?? "",
    deliverables: basis?.deliverables ?? "",
    inclusions: basis?.inclusions.join("\n") ?? "",
    exclusions: basis?.exclusions.join("\n") ?? "",
    travelNotes: basis?.travelNotes ?? "",
    cancellationTerms: basis?.cancellationTerms ?? "Free reschedule up to 72 hours before the event.",
    validUntil: basis && basis.validUntil >= today ? basis.validUntil : addDays(today, 5),
  };
}

/** Create an offer, or a counter-offer that starts from the version being answered. */
export function ProposalComposer({
  open,
  onOpenChange,
  thread,
  basis,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  thread: ConversationThread;
  basis: ProposalVersion | null;
  onSubmit: (draft: ProposalDraft) => Promise<boolean>;
}) {
  const [form, setForm] = useState(() => initialDraft(thread, basis));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [lastKey, setLastKey] = useState(`${thread.id}:${basis?.id ?? "none"}:${open}`);
  const key = `${thread.id}:${basis?.id ?? "none"}:${open}`;
  if (key !== lastKey) {
    setLastKey(key);
    setForm(initialDraft(thread, basis));
    setErrors({});
  }
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const amount = Number(form.amountRupees);
  const isCounter = Boolean(basis && basis.status === "pending");

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!Number.isFinite(amount) || amount <= 0) e.amount = "Enter an amount in rupees.";
    if (!form.eventDate) e.eventDate = "Choose the event date.";
    if (!form.duration.trim()) e.duration = "Add the duration.";
    if (!form.validUntil) e.validUntil = "Choose how long the offer stays valid.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const ok = await onSubmit({
      amountPaise: rupeesToPaise(amount),
      eventDate: form.eventDate,
      duration: form.duration,
      deliverables: form.deliverables,
      inclusions: form.inclusions.split("\n"),
      exclusions: form.exclusions.split("\n"),
      travelNotes: form.travelNotes,
      cancellationTerms: form.cancellationTerms,
      validUntil: form.validUntil,
    });
    setBusy(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isCounter ? `Counter-offer to Proposal v${basis!.version}` : "Send an offer"}</DialogTitle>
          <DialogDescription>
            {isCounter
              ? `This creates a new version. Proposal v${basis!.version} (${formatPaise(basis!.amountPaise)}) stays in the history as superseded.`
              : "Offers are saved as numbered versions. A booking is created only when the other side accepts this exact version."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pc-amount" label="Total amount (₹)" required error={errors.amount} hint={amount > 0 ? `${formatPaise(rupeesToPaise(amount))} including all fees and travel listed below` : undefined}>
            <Input id="pc-amount" type="number" inputMode="decimal" min={1} step="1" value={form.amountRupees} onChange={(e) => set("amountRupees", e.target.value)} />
          </Field>
          <Field id="pc-date" label="Event date" required error={errors.eventDate}>
            <DatePicker id="pc-date" value={form.eventDate} onChange={(v) => set("eventDate", v)} minDate={todayDateOnly()} invalid={Boolean(errors.eventDate)} />
          </Field>
          <Field id="pc-duration" label="Duration / timing" required error={errors.duration}>
            <Input id="pc-duration" value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 7–9 PM, two 45-min sets" />
          </Field>
          <Field id="pc-valid" label="Offer valid until" required error={errors.validUntil}>
            <DatePicker id="pc-valid" value={form.validUntil} onChange={(v) => set("validUntil", v)} minDate={todayDateOnly()} invalid={Boolean(errors.validUntil)} />
          </Field>
          <Field id="pc-deliverables" label="Deliverables" className="sm:col-span-2">
            <Input id="pc-deliverables" value={form.deliverables} onChange={(e) => set("deliverables", e.target.value)} placeholder="What the client receives" />
          </Field>
          <Field id="pc-inc" label="Included" hint="One per line.">
            <Textarea id="pc-inc" rows={3} value={form.inclusions} onChange={(e) => set("inclusions", e.target.value)} />
          </Field>
          <Field id="pc-exc" label="Not included" hint="One per line.">
            <Textarea id="pc-exc" rows={3} value={form.exclusions} onChange={(e) => set("exclusions", e.target.value)} />
          </Field>
          <Field id="pc-travel" label="Travel conditions" className="sm:col-span-2">
            <Input id="pc-travel" value={form.travelNotes} onChange={(e) => set("travelNotes", e.target.value)} placeholder="e.g. Local travel included; outstation flights booked by client" />
          </Field>
          <Field id="pc-cancel" label="Cancellation terms" className="sm:col-span-2">
            <Textarea id="pc-cancel" rows={2} value={form.cancellationTerms} onChange={(e) => set("cancellationTerms", e.target.value)} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => void submit()} disabled={busy}>
            {busy ? "Sending…" : isCounter ? "Send counter-offer" : "Send offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
