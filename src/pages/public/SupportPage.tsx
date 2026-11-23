import { useState, type FormEvent } from "react";
import { CheckCircle, Envelope, Lifebuoy, Scales, ShieldWarning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { Field, PageHeader, SectionCard } from "@/components/shared/primitives";
import { isDemoMode } from "@/config/env";
import { siteConfig } from "@/config/site";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link, useRouter } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { SupportTicket } from "@/types/marketplace";

const issueLabels: Record<SupportTicket["issueType"], string> = {
  booking_issue: "Problem with a booking",
  cancellation_refund: "Cancellation or refund",
  dispute: "Dispute with the other party",
  artist_safety: "Safety concern",
  account_help: "Account or sign-in help",
  partnership: "Partnerships and press",
};

export function SupportPage() {
  usePageMeta("Contact & support");
  const { viewer, run, supportTickets } = useMarketplace();
  const { query } = useRouter();
  const [form, setForm] = useState({
    issueType: (query.get("booking") ? "booking_issue" : "account_help") as SupportTicket["issueType"],
    bookingReference: query.get("booking") ?? "",
    name: viewer?.displayName ?? "",
    email: viewer?.email ?? "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<SupportTicket | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = "Enter a valid email so we can reply.";
    if (form.message.trim().length < 10) next.message = "Describe the issue in at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const ticket = await run((b) => b.market.createSupportTicket(form));
    if (ticket) setCreated(ticket);
  };

  return (
    <main id="main-content" className="page-container max-w-5xl space-y-8 py-10">
      <PageHeader title="Contact & support" description="Tell us what's going on. Include a booking reference if it's about a booking." />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <SectionCard>
          {created ? (
            <div className="space-y-3 text-center">
              <CheckCircle size={40} weight="fill" className="mx-auto text-status-success" aria-hidden />
              <h2 className="type-h2 text-ink">Request recorded</h2>
              <p className="type-body text-ink-secondary">
                Reference <strong className="text-ink">{created.id}</strong>.{" "}
                {isDemoMode ? "Demo mode: this request is stored in your browser only and isn't sent to a real support team." : "We'll reply by email within 48 hours."}
              </p>
              <Button variant="outline" onClick={() => setCreated(null)}>Send another request</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
              {isDemoMode && <NoticeBanner title="Demo mode" className="sm:col-span-2">Requests are saved in this browser and not delivered to anyone.</NoticeBanner>}
              <Field id="sp-type" label="What do you need help with?" className="sm:col-span-2">
                <Select value={form.issueType} onValueChange={(v) => setForm({ ...form, issueType: v as SupportTicket["issueType"] })}>
                  <SelectTrigger id="sp-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(issueLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field id="sp-name" label="Name" required error={errors.name}>
                <Input id="sp-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
              </Field>
              <Field id="sp-email" label="Email" required error={errors.email}>
                <Input id="sp-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
              </Field>
              <Field id="sp-ref" label="Booking reference" hint="Optional. Found on the booking page." className="sm:col-span-2">
                <Input id="sp-ref" value={form.bookingReference} onChange={(e) => setForm({ ...form, bookingReference: e.target.value })} />
              </Field>
              <Field id="sp-msg" label="Message" required error={errors.message} className="sm:col-span-2">
                <Textarea id="sp-msg" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </Field>
              <Button type="submit" className="sm:col-span-2 sm:w-fit">Send request</Button>
            </form>
          )}
        </SectionCard>
        <aside className="space-y-4">
          <SectionCard title="Urgent safety issue?">
            <p className="flex gap-2 type-body-sm text-ink-secondary"><ShieldWarning size={20} className="shrink-0 text-status-error" aria-hidden /> If anyone is in immediate danger, call 112 first, then tell us.</p>
          </SectionCard>
          <SectionCard title="Other ways to reach us">
            <ul className="space-y-2 type-body-sm text-ink-secondary">
              <li className="flex gap-2"><Envelope size={18} className="shrink-0" aria-hidden /> {siteConfig.supportEmail || "Support email will be published before launch."}</li>
              <li className="flex gap-2"><Scales size={18} className="shrink-0" aria-hidden /> <Link to="/legal/grievance" className="text-brand">Grievance redressal</Link></li>
              <li className="flex gap-2"><Lifebuoy size={18} className="shrink-0" aria-hidden /> <Link to="/faq" className="text-brand">Frequently asked questions</Link></li>
            </ul>
          </SectionCard>
          {supportTickets.length > 0 && (
            <SectionCard title="Your requests">
              <ul className="space-y-2 type-body-sm">
                {supportTickets.slice(0, 5).map((t) => (
                  <li key={t.id} className="flex justify-between gap-2"><span className="truncate text-ink">{issueLabels[t.issueType]}</span><code className="type-caption text-ink-secondary">{t.id}</code></li>
                ))}
              </ul>
            </SectionCard>
          )}
        </aside>
      </div>
    </main>
  );
}
