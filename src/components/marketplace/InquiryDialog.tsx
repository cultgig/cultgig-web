import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker, Field } from "@/components/shared/primitives";
import { eventTypes } from "@/data/categories";
import { Link, useRouter } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { ArtistProfile, InquiryDetails } from "@/types/marketplace";
import { todayDateOnly } from "@/utils/format";

type Errors = Partial<Record<keyof InquiryDetails | "message", string>>;

/**
 * Direct hiring: a client contacts an artist without posting a gig.
 * Opens a conversation with structured event details; the artist replies with an offer.
 */
export function InquiryDialog({ artist, trigger, mode = "contact" }: { artist: ArtistProfile; trigger: ReactNode; mode?: "contact" | "quote" }) {
  const { viewer, run } = useMarketplace();
  const { navigate, pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<InquiryDetails & { message: string }>({
    eventTitle: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    city: artist.city,
    venue: "",
    duration: "",
    requirements: "",
    estimatedBudgetInr: null,
    message: "",
  });
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));
  const isOwn = viewer?.id === artist.ownerUserId;

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.eventTitle.trim()) e.eventTitle = "Give your event a short title.";
    if (!form.eventType) e.eventType = "Choose the event type.";
    if (!form.eventDate) e.eventDate = "Choose the event date.";
    if (!form.city.trim()) e.city = "Add the city.";
    if (form.message.trim().length < 10) e.message = "Write a short message (at least 10 characters).";
    if (form.estimatedBudgetInr !== null && form.estimatedBudgetInr < 0) e.estimatedBudgetInr = "Budget can't be negative.";
    return e;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;
    setSubmitting(true);
    const { message, ...inquiry } = form;
    const conversationId = await run((b) => b.market.startInquiry({ artistProfileId: artist.id, inquiry, message }), { success: `Inquiry sent to ${artist.displayName}` });
    setSubmitting(false);
    if (conversationId) {
      setOpen(false);
      navigate(`/messages/${conversationId}`);
    }
  };

  const handleOpen = (next: boolean) => {
    if (next && !viewer) {
      navigate(`/sign-in?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{mode === "quote" ? `Request a quote from ${artist.displayName}` : `Contact ${artist.displayName}`}</DialogTitle>
          <DialogDescription>
            Share your event details. {artist.displayName} will reply in Messages and can send you a formal offer. Nothing is booked until you accept an offer.
          </DialogDescription>
        </DialogHeader>
        {isOwn ? (
          <p className="rounded-lg bg-surface-low p-4 type-body-sm text-ink-secondary">This is your own profile. Share its link with clients so they can contact you.</p>
        ) : (
          <form id="inquiry-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
            <Field id="inq-title" label="Event title" required error={errors.eventTitle} className="sm:col-span-2">
              <Input id="inq-title" value={form.eventTitle} onChange={(e) => set("eventTitle", e.target.value)} placeholder="e.g. Sunset dinner set for 60 guests" aria-invalid={Boolean(errors.eventTitle)} />
            </Field>
            <Field id="inq-type" label="Event type" required error={errors.eventType}>
              <Select value={form.eventType} onValueChange={(v) => set("eventType", v)}>
                <SelectTrigger id="inq-type" aria-invalid={Boolean(errors.eventType)}>
                  <SelectValue placeholder="Choose type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field id="inq-date" label="Date" required error={errors.eventDate} hint={form.eventDate && artist.unavailableDates.includes(form.eventDate) ? "The artist has marked this date unavailable — ask about alternatives." : undefined}>
              <DatePicker id="inq-date" value={form.eventDate} onChange={(v) => set("eventDate", v)} minDate={todayDateOnly()} invalid={Boolean(errors.eventDate)} />
            </Field>
            <Field id="inq-time" label="Start time">
              <Input id="inq-time" type="time" value={form.eventTime} onChange={(e) => set("eventTime", e.target.value)} />
            </Field>
            <Field id="inq-duration" label="Duration">
              <Input id="inq-duration" value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 2 hours" />
            </Field>
            <Field id="inq-city" label="City" required error={errors.city}>
              <Input id="inq-city" value={form.city} onChange={(e) => set("city", e.target.value)} aria-invalid={Boolean(errors.city)} />
            </Field>
            <Field id="inq-venue" label="Venue or area">
              <Input id="inq-venue" value={form.venue} onChange={(e) => set("venue", e.target.value)} placeholder="Exact address can come later" />
            </Field>
            <Field id="inq-budget" label="Estimated budget (₹)" hint="Optional — helps the artist quote." error={errors.estimatedBudgetInr} className="sm:col-span-2">
              <Input
                id="inq-budget"
                type="number"
                inputMode="numeric"
                min={0}
                value={form.estimatedBudgetInr ?? ""}
                onChange={(e) => set("estimatedBudgetInr", e.target.value === "" ? null : Number(e.target.value))}
                placeholder="e.g. 20000"
              />
            </Field>
            <Field id="inq-req" label="Requirements" className="sm:col-span-2">
              <Textarea id="inq-req" rows={3} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} placeholder="Guest count, style, languages, equipment available at the venue…" />
            </Field>
            <Field id="inq-msg" label="Message" required error={errors.message} className="sm:col-span-2">
              <Textarea id="inq-msg" rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder={`Hi ${artist.displayName.split(" ")[0]}, …`} aria-invalid={Boolean(errors.message)} />
            </Field>
          </form>
        )}
        <DialogFooter className="gap-2">
          <p className="mr-auto self-center type-caption text-ink-secondary">
            Keep contact details in Cultgig until you've agreed terms. <Link to="/safety" className="underline underline-offset-2">Why?</Link>
          </p>
          {!isOwn && (
            <Button type="submit" form="inquiry-form" disabled={submitting}>
              {submitting ? "Sending…" : mode === "quote" ? "Request quote" : "Send inquiry"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
