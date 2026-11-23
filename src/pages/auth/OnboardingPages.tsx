import { useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Buildings, CalendarHeart, CheckCircle, FloppyDisk, PaintBrush, Storefront, User, UserCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AvailabilityCalendar, LabeledCheckboxGroup, newServiceDraft, PortfolioAddDialog, PortfolioGrid, ServiceFormDialog, ServiceList } from "@/components/artist/editors";
import { priceLabel } from "@/components/marketplace/ArtistCard";
import { Field, StepProgress, UserAvatar } from "@/components/shared/primitives";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { categoryLabel, commonLanguages, creativeCategories, eventTypes, indianCities } from "@/data/categories";
import { toUserMessage } from "@/domain/errors";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link, Navigate, safeNextPath, useRouter } from "@/lib/router";
import { cn } from "@/lib/utils";
import { prepareImage } from "@/services/media";
import type { ArtistOnboardingInput, ClientOnboardingInput } from "@/services/backend/types";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { ArtistFormat, CategorySlug, ClientAccountType, MarketplaceRole, ServicePackage, WorkingMode } from "@/types/marketplace";
import { toast } from "sonner";

function OnboardingFrame({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <main id="main-content" className="min-h-[calc(100vh-64px)] bg-surface-low px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="space-y-1">
          <h1 className="type-h1 text-ink-strong">{title}</h1>
          {description && <p className="type-body text-ink-secondary">{description}</p>}
        </div>
        {children}
      </div>
    </main>
  );
}

function StepCard({ children }: { children: ReactNode }) {
  return <div className="space-y-5 rounded-2xl border border-line bg-surface p-5 shadow-xs sm:p-7">{children}</div>;
}

function WizardNav({ step, total, onBack, onNext, onSaveDraft, nextLabel, busy }: { step: number; total: number; onBack: () => void; onNext: () => void; onSaveDraft: () => void; nextLabel?: string; busy?: boolean }) {
  return (
    <div className="pb-safe sticky bottom-0 -mx-4 flex items-center gap-2 border-t border-line bg-surface-low/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
      <Button variant="ghost" onClick={onBack} disabled={step === 0 || busy}>
        <ArrowLeft aria-hidden /> Back
      </Button>
      <Button variant="outline" onClick={onSaveDraft} disabled={busy} className="ml-auto">
        <FloppyDisk aria-hidden /> <span className="hidden sm:inline">Save draft</span>
      </Button>
      <Button onClick={onNext} disabled={busy}>
        {nextLabel ?? (step === total - 1 ? "Finish" : "Next")} {step < total - 1 && <ArrowRight aria-hidden />}
      </Button>
    </div>
  );
}

export function OnboardingChooserPage() {
  usePageMeta("Set up your account");
  const { viewer } = useMarketplace();
  if (!viewer) return null;
  const option = (role: MarketplaceRole, icon: ReactNode, title: string, body: string) => {
    const done = viewer.onboarding[role] === "complete";
    return (
      <Link to={done ? `/${role}/dashboard` : `/onboarding/${role}`} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-6 hover:border-line-selected hover:bg-brand-subtle">
        <span className="text-brand">{icon}</span>
        <span className="type-h3 text-ink">{title}</span>
        <span className="type-body-sm text-ink-secondary">{body}</span>
        <span className="mt-2 type-label text-brand">{done ? "Go to workspace →" : viewer.onboarding[role] === "draft" ? "Continue setup →" : "Set up →"}</span>
      </Link>
    );
  };
  return (
    <OnboardingFrame title={`Welcome, ${viewer.displayName.split(" ")[0]}`} description="How would you like to use Cultgig? You can set up the other side later from the account menu.">
      <div className="grid gap-4 sm:grid-cols-2">
        {option("client", <Storefront size={28} aria-hidden />, "Hire creative talent", "Find artists, post gigs, compare quotes and manage bookings.")}
        {option("artist", <PaintBrush size={28} aria-hidden />, "Offer my services", "Create your profile, show your work and apply to gigs.")}
      </div>
      <p className="text-center type-body-sm text-ink-secondary">
        Just browsing? <Link to="/explore" className="text-brand hover:text-brand-hover">Explore artists</Link> without setting anything up.
      </p>
    </OnboardingFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Artist onboarding                                                   */
/* ------------------------------------------------------------------ */

const ARTIST_STEPS = ["Personal details", "Artist identity", "Services", "Portfolio", "Availability & travel", "Preview"];

export function ArtistOnboardingPage() {
  usePageMeta("Set up your artist profile");
  const { viewer, myArtistProfile, run } = useMarketplace();
  const { navigate, query } = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serviceDialog, setServiceDialog] = useState<ServicePackage | null>(null);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const avatarInput = useRef<HTMLInputElement>(null);

  const initial = useMemo<ArtistOnboardingInput>(() => {
    const p = myArtistProfile;
    return {
      personal: { displayName: viewer?.displayName ?? "", phone: viewer?.phone ?? "", city: viewer?.city || p?.city || "", avatarUrl: viewer?.avatarUrl || p?.avatarUrl || "" },
      identity: {
        displayName: p?.displayName ?? viewer?.displayName ?? "",
        tagline: p?.tagline ?? "",
        primaryCategory: p?.primaryCategory ?? "singers-and-vocalists",
        secondaryCategories: p?.secondaryCategories ?? [],
        artistFormat: p?.artistFormat ?? "solo",
        experienceYears: p?.experienceYears ?? 1,
        languages: p?.languages ?? ["English", "Hindi"],
        bio: p?.bio ?? "",
      },
      services: p?.packages ?? [],
      portfolio: p?.portfolio ?? [],
      availability: { unavailableDates: p?.unavailableDates ?? [], travelRadiusKm: p?.travelRadiusKm ?? 50, travelCities: p?.travelCities ?? [], workingMode: p?.workingMode ?? "on_site", equipmentNotes: p?.equipmentNotes ?? "" },
    };
    // Initialise once from the stored draft; later snapshot refreshes must not reset the form.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [data, setData] = useState(initial);
  const [travelCities, setTravelCities] = useState(initial.availability.travelCities.join(", "));

  if (!viewer) return null;
  if (viewer.onboarding.artist === "complete" && !query.get("edit")) return <Navigate to={safeNextPath(query.get("next"), "/artist/dashboard")} />;

  const setPersonal = (patch: Partial<ArtistOnboardingInput["personal"]>) => setData((d) => ({ ...d, personal: { ...d.personal, ...patch } }));
  const setIdentity = (patch: Partial<ArtistOnboardingInput["identity"]>) => setData((d) => ({ ...d, identity: { ...d.identity, ...patch } }));
  const setAvailability = (patch: Partial<ArtistOnboardingInput["availability"]>) => setData((d) => ({ ...d, availability: { ...d.availability, ...patch } }));

  const payload = (): ArtistOnboardingInput => ({ ...data, availability: { ...data.availability, travelCities: travelCities.split(",").map((s) => s.trim()).filter(Boolean) } });

  const validateStep = (i: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (i === 0) {
      if (!data.personal.displayName.trim()) e.displayName = "Enter your name.";
      if (!data.personal.city.trim()) e.city = "Add the city you're based in.";
      if (data.personal.phone && !/^[+\d\s-]{8,16}$/.test(data.personal.phone)) e.phone = "Enter a valid phone number.";
    }
    if (i === 1) {
      if (!data.identity.displayName.trim()) e.artistName = "Add your artist or team name.";
      if (data.identity.tagline.trim().length < 10) e.tagline = "Write a one-line tagline (at least 10 characters).";
      if (data.identity.bio.trim().length < 40) e.bio = `Write a bio of at least 40 characters (${data.identity.bio.trim().length}/40).`;
      if (!data.identity.languages.length) e.languages = "Choose at least one language.";
    }
    if (i === 2 && !data.services.length) e.services = "Add at least one service.";
    return e;
  };

  const saveDraft = async () => {
    setBusy(true);
    await run((b) => b.market.saveArtistOnboarding(payload(), false), { success: "Draft saved. You can finish later." });
    setBusy(false);
  };

  const next = async () => {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error(Object.values(e)[0]);
      return;
    }
    if (step < ARTIST_STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    setBusy(true);
    const ok = await run((b) => b.market.saveArtistOnboarding(payload(), true).then(() => true), { success: "Your artist profile is live!" });
    setBusy(false);
    if (ok) navigate(safeNextPath(query.get("next"), "/artist/dashboard"), { replace: true });
  };

  const onAvatar = async (file: File | undefined) => {
    if (!file) return;
    try {
      setPersonal({ avatarUrl: await prepareImage(file, 600) });
    } catch (e) {
      toast.error(toUserMessage(e));
    }
  };

  const previewPrice = (() => {
    const priced = data.services.map((s) => s.priceInr).filter((p): p is number => typeof p === "number" && p > 0);
    return priceLabel({ pricingMode: priced.length ? data.services[0].pricingMode : "quote_required", startingPriceInr: priced.length ? Math.min(...priced) : null, priceMaxInr: priced.length > 1 ? Math.max(...priced) : null });
  })();

  return (
    <OnboardingFrame title="Set up your artist profile" description="Six short steps. Save a draft any time — nothing is public until you finish.">
      <StepProgress steps={ARTIST_STEPS} current={step} />
      <StepCard>
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 sm:col-span-2">
              <UserAvatar name={data.personal.displayName || "?"} src={data.personal.avatarUrl} className="size-16" />
              <div className="space-y-1">
                <input ref={avatarInput} id="ob-avatar" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => void onAvatar(e.target.files?.[0])} />
                <Button variant="outline" size="sm" onClick={() => avatarInput.current?.click()}>
                  <UserCircle aria-hidden /> {data.personal.avatarUrl ? "Change photo" : "Add profile photo"}
                </Button>
                <p className="type-caption text-ink-secondary">A clear, recent photo of you or your group.</p>
              </div>
            </div>
            <Field id="ob-name" label="Your name" required error={errors.displayName}>
              <Input id="ob-name" value={data.personal.displayName} onChange={(e) => setPersonal({ displayName: e.target.value })} autoComplete="name" />
            </Field>
            <Field id="ob-email" label="Email" hint="From your account.">
              <Input id="ob-email" value={viewer.email} disabled />
            </Field>
            <Field id="ob-phone" label="Phone" hint="Never shown publicly." error={errors.phone}>
              <Input id="ob-phone" type="tel" inputMode="tel" value={data.personal.phone} onChange={(e) => setPersonal({ phone: e.target.value })} placeholder="+91" autoComplete="tel" />
            </Field>
            <Field id="ob-city" label="City" required error={errors.city}>
              <Input id="ob-city" list="ob-cities" value={data.personal.city} onChange={(e) => setPersonal({ city: e.target.value })} autoComplete="address-level2" />
              <datalist id="ob-cities">
                {indianCities.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="ob-artist-name" label="Artist or team name" required error={errors.artistName} hint="How clients will see you." className="sm:col-span-2">
              <Input id="ob-artist-name" value={data.identity.displayName} onChange={(e) => setIdentity({ displayName: e.target.value })} placeholder="e.g. Rhea Kapoor or The Monsoon Quartet" />
            </Field>
            <Field id="ob-tagline" label="One-line tagline" required error={errors.tagline} className="sm:col-span-2">
              <Input id="ob-tagline" maxLength={140} value={data.identity.tagline} onChange={(e) => setIdentity({ tagline: e.target.value })} placeholder="e.g. Acoustic vocalist for intimate dinners and receptions" />
            </Field>
            <Field id="ob-cat" label="Primary category" required>
              <Select value={data.identity.primaryCategory} onValueChange={(v) => setIdentity({ primaryCategory: v as CategorySlug, secondaryCategories: data.identity.secondaryCategories.filter((c) => c !== v) })}>
                <SelectTrigger id="ob-cat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {creativeCategories.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field id="ob-format" label="Solo or group">
              <Select value={data.identity.artistFormat} onValueChange={(v) => setIdentity({ artistFormat: v as ArtistFormat })}>
                <SelectTrigger id="ob-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo artist</SelectItem>
                  <SelectItem value="group">Group or team</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field id="ob-exp" label="Years of experience">
              <Input id="ob-exp" type="number" min={0} max={60} value={data.identity.experienceYears} onChange={(e) => setIdentity({ experienceYears: Number(e.target.value) || 0 })} />
            </Field>
            <div className="sm:col-span-2">
              <LabeledCheckboxGroup
                legend="Secondary categories (up to 3)"
                max={3}
                options={creativeCategories.filter((c) => c.slug !== data.identity.primaryCategory).map((c) => ({ value: c.slug, label: c.shortLabel }))}
                value={data.identity.secondaryCategories}
                onChange={(v) => setIdentity({ secondaryCategories: v })}
              />
            </div>
            <div className="sm:col-span-2">
              <LabeledCheckboxGroup legend="Languages you perform or work in" options={commonLanguages.map((l) => ({ value: l, label: l }))} value={data.identity.languages} onChange={(v) => setIdentity({ languages: v })} />
              {errors.languages && <p role="alert" className="mt-1 type-caption text-status-error">{errors.languages}</p>}
            </div>
            <Field id="ob-bio" label="Bio" required error={errors.bio} hint="Your training, style, the events you do best and what clients can expect." className="sm:col-span-2">
              <Textarea id="ob-bio" rows={5} value={data.identity.bio} onChange={(e) => setIdentity({ bio: e.target.value })} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="type-body-sm text-ink-secondary">List what you offer. You can show a price, a range, a fixed package, or mark it quotation-based.</p>
            <ServiceList
              services={data.services}
              onAdd={() => setServiceDialog(newServiceDraft(data.identity.primaryCategory))}
              onEdit={(s) => setServiceDialog(s)}
              onDelete={(s) => setData((d) => ({ ...d, services: d.services.filter((x) => x.id !== s.id) }))}
            />
            {errors.services && <p role="alert" className="type-caption text-status-error">{errors.services}</p>}
            {serviceDialog && (
              <ServiceFormDialog
                open
                initial={serviceDialog}
                onOpenChange={(o) => !o && setServiceDialog(null)}
                onSave={(pkg) => {
                  setData((d) => ({ ...d, services: d.services.some((s) => s.id === pkg.id) ? d.services.map((s) => (s.id === pkg.id ? pkg : s)) : [...d.services, pkg] }));
                  setServiceDialog(null);
                }}
              />
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="type-body-sm text-ink-secondary">Show at least three pieces of recent work. Profiles with audio or video get more inquiries.</p>
              <Button variant="outline" onClick={() => setPortfolioOpen(true)}>
                Add work
              </Button>
            </div>
            {data.portfolio.length ? (
              <PortfolioGrid
                items={data.portfolio}
                onRemove={(item) => setData((d) => ({ ...d, portfolio: d.portfolio.filter((p) => p.id !== item.id) }))}
                onToggleFeatured={(item) => setData((d) => ({ ...d, portfolio: d.portfolio.map((p) => (p.id === item.id ? { ...p, featured: !p.featured } : p)) }))}
              />
            ) : (
              <NoticeBanner title="You can skip this for now">Your profile will be published without portfolio items, but clients are much more likely to contact artists who show their work.</NoticeBanner>
            )}
            <PortfolioAddDialog
              open={portfolioOpen}
              onOpenChange={setPortfolioOpen}
              onAdd={(item) => setData((d) => ({ ...d, portfolio: [...d.portfolio, { ...item, id: `pf-new-${Date.now()}`, featured: d.portfolio.length === 0 }] }))}
            />
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="ob-mode" label="Where you work">
              <Select value={data.availability.workingMode} onValueChange={(v) => setAvailability({ workingMode: v as WorkingMode })}>
                <SelectTrigger id="ob-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_site">On-site at events</SelectItem>
                  <SelectItem value="remote">Remote only</SelectItem>
                  <SelectItem value="both">On-site and remote</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field id="ob-radius" label="Travel radius (km)">
              <Input id="ob-radius" type="number" min={0} max={5000} value={data.availability.travelRadiusKm} onChange={(e) => setAvailability({ travelRadiusKm: Number(e.target.value) || 0 })} />
            </Field>
            <Field id="ob-cities-travel" label="Other cities you serve" hint="Separate with commas." className="sm:col-span-2">
              <Input id="ob-cities-travel" value={travelCities} onChange={(e) => setTravelCities(e.target.value)} placeholder="e.g. Pune, Goa, Alibaug" />
            </Field>
            <Field id="ob-equipment" label="Equipment you bring or need" className="sm:col-span-2">
              <Textarea id="ob-equipment" rows={2} value={data.availability.equipmentNotes} onChange={(e) => setAvailability({ equipmentNotes: e.target.value })} placeholder="e.g. Bring guitar and mic; venue provides PA" />
            </Field>
            <div className="space-y-2 sm:col-span-2">
              <p className="type-label text-ink">Dates you're not available</p>
              <p className="type-caption text-ink-secondary">Tap dates to block them. Everything else shows as open. You can change this any time.</p>
              <AvailabilityCalendar unavailable={data.availability.unavailableDates} onChange={(dates) => setAvailability({ unavailableDates: dates })} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <UserAvatar name={data.identity.displayName} src={data.personal.avatarUrl} className="size-16" />
              <div>
                <p className="type-h3 text-ink">{data.identity.displayName}</p>
                <p className="type-body-sm text-ink-secondary">{data.identity.tagline}</p>
                <p className="type-caption text-ink-secondary">
                  {categoryLabel(data.identity.primaryCategory)} · {data.personal.city} · {data.identity.experienceYears} years
                </p>
              </div>
            </div>
            <ul className="space-y-2 type-body-sm">
              {[
                [Boolean(data.personal.avatarUrl), "Profile photo"],
                [data.identity.bio.length >= 40, "Bio"],
                [data.services.length > 0, `${data.services.length} service${data.services.length === 1 ? "" : "s"} · ${previewPrice}`],
                [data.portfolio.length >= 3, `${data.portfolio.length} portfolio item${data.portfolio.length === 1 ? "" : "s"}${data.portfolio.length < 3 ? " (3+ recommended)" : ""}`],
                [true, `${data.availability.unavailableDates.length} blocked date${data.availability.unavailableDates.length === 1 ? "" : "s"}`],
              ].map(([ok, label]) => (
                <li key={String(label)} className={cn("flex items-center gap-2", ok ? "text-ink" : "text-ink-secondary")}>
                  <CheckCircle size={18} weight={ok ? "fill" : "regular"} className={ok ? "text-status-success" : "text-ink-muted"} aria-hidden /> {label}
                  {!ok && <span className="sr-only">(incomplete)</span>}
                </li>
              ))}
            </ul>
            <NoticeBanner title="Ready to publish">
              Finishing makes your profile visible in search. You can edit everything, or hide your profile, from your artist workspace.
            </NoticeBanner>
          </div>
        )}
      </StepCard>
      <WizardNav step={step} total={ARTIST_STEPS.length} busy={busy} onBack={() => setStep(Math.max(0, step - 1))} onNext={() => void next()} onSaveDraft={() => void saveDraft()} nextLabel={step === ARTIST_STEPS.length - 1 ? "Publish profile" : undefined} />
    </OnboardingFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Client onboarding                                                   */
/* ------------------------------------------------------------------ */

const CLIENT_STEPS = ["Personal details", "Account type", "Organisation", "Hiring interests", "Done"];

export function ClientOnboardingPage() {
  usePageMeta("Set up your client account");
  const { viewer, myClientProfile, run } = useMarketplace();
  const { navigate, query } = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<ClientOnboardingInput>(() => ({
    personal: { displayName: viewer?.displayName ?? "", phone: viewer?.phone ?? "", city: viewer?.city ?? "" },
    profile: {
      accountType: myClientProfile?.accountType ?? "individual",
      organisationName: myClientProfile?.organisationName ?? "",
      organisationRole: myClientProfile?.organisationRole ?? "",
      website: myClientProfile?.website ?? "",
      hiringInterests: myClientProfile?.hiringInterests ?? [],
      typicalEventTypes: myClientProfile?.typicalEventTypes ?? [],
      typicalBudgetInr: myClientProfile?.typicalBudgetInr ?? null,
    },
  }));

  if (!viewer) return null;
  if (viewer.onboarding.client === "complete" && step !== 4 && !query.get("edit")) return <Navigate to={safeNextPath(query.get("next"), "/client/dashboard")} />;

  const isOrg = data.profile.accountType !== "individual";
  const setPersonal = (patch: Partial<ClientOnboardingInput["personal"]>) => setData((d) => ({ ...d, personal: { ...d.personal, ...patch } }));
  const setProfile = (patch: Partial<ClientOnboardingInput["profile"]>) => setData((d) => ({ ...d, profile: { ...d.profile, ...patch } }));

  const validate = (i: number) => {
    const e: Record<string, string> = {};
    if (i === 0) {
      if (!data.personal.displayName.trim()) e.displayName = "Enter your name.";
      if (!data.personal.city.trim()) e.city = "Add your city.";
      if (data.personal.phone && !/^[+\d\s-]{8,16}$/.test(data.personal.phone)) e.phone = "Enter a valid phone number.";
    }
    if (i === 2 && isOrg && !data.profile.organisationName.trim()) e.organisationName = "Add your organisation's name.";
    if (i === 2 && data.profile.website && !/^https:\/\//.test(data.profile.website)) e.website = "Use a full https:// address.";
    return e;
  };

  const go = async (direction: 1 | -1) => {
    if (direction === -1) {
      setStep((s) => (s === 3 && !isOrg ? 1 : Math.max(0, s - 1)));
      return;
    }
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step === 3) {
      setBusy(true);
      const ok = await run((b) => b.market.saveClientOnboarding(data, true).then(() => true));
      setBusy(false);
      if (ok) setStep(4);
      return;
    }
    if (step === 4) {
      navigate(safeNextPath(query.get("next"), "/client/dashboard"), { replace: true });
      return;
    }
    setStep((s) => (s === 1 && !isOrg ? 3 : s + 1));
  };

  const typeOption = (value: ClientAccountType, icon: ReactNode, title: string, body: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={data.profile.accountType === value}
      onClick={() => setProfile({ accountType: value })}
      className={cn("flex items-start gap-3 rounded-xl border p-4 text-left", data.profile.accountType === value ? "border-line-selected bg-brand-subtle" : "border-line hover:bg-surface-low")}
    >
      <span className="text-brand">{icon}</span>
      <span>
        <span className="block type-label text-ink">{title}</span>
        <span className="block type-caption text-ink-secondary">{body}</span>
      </span>
    </button>
  );

  return (
    <OnboardingFrame title="Set up your client account" description="A few details help artists respond with relevant quotes. You can skip anything optional.">
      <StepProgress steps={CLIENT_STEPS} current={step} />
      <StepCard>
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="cl-name" label="Your name" required error={errors.displayName}>
              <Input id="cl-name" value={data.personal.displayName} onChange={(e) => setPersonal({ displayName: e.target.value })} autoComplete="name" />
            </Field>
            <Field id="cl-email" label="Email" hint="From your account.">
              <Input id="cl-email" value={viewer.email} disabled />
            </Field>
            <Field id="cl-phone" label="Phone" hint="Optional. Never shown publicly." error={errors.phone}>
              <Input id="cl-phone" type="tel" value={data.personal.phone} onChange={(e) => setPersonal({ phone: e.target.value })} placeholder="+91" autoComplete="tel" />
            </Field>
            <Field id="cl-city" label="City" required error={errors.city}>
              <Input id="cl-city" list="cl-cities" value={data.personal.city} onChange={(e) => setPersonal({ city: e.target.value })} />
              <datalist id="cl-cities">
                {indianCities.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
          </div>
        )}
        {step === 1 && (
          <div role="radiogroup" aria-label="Account type" className="grid gap-3">
            {typeOption("individual", <User size={24} aria-hidden />, "Individual", "Planning a wedding, party or personal event.")}
            {typeOption("business", <Buildings size={24} aria-hidden />, "Business", "Restaurant, hotel, studio, brand or company.")}
            {typeOption("planner", <CalendarHeart size={24} aria-hidden />, "Event planner or organisation", "Planning events for clients or running a programme.")}
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="cl-org" label="Organisation name" required error={errors.organisationName} className="sm:col-span-2">
              <Input id="cl-org" value={data.profile.organisationName} onChange={(e) => setProfile({ organisationName: e.target.value })} autoComplete="organization" />
            </Field>
            <Field id="cl-role" label="Your role">
              <Input id="cl-role" value={data.profile.organisationRole} onChange={(e) => setProfile({ organisationRole: e.target.value })} placeholder="e.g. Owner, Events manager" />
            </Field>
            <Field id="cl-web" label="Website or Instagram" error={errors.website}>
              <Input id="cl-web" type="url" value={data.profile.website} onChange={(e) => setProfile({ website: e.target.value })} placeholder="https://" />
            </Field>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-5">
            <LabeledCheckboxGroup legend="What do you usually hire for?" options={creativeCategories.map((c) => ({ value: c.slug, label: c.shortLabel }))} value={data.profile.hiringInterests} onChange={(v) => setProfile({ hiringInterests: v })} />
            <LabeledCheckboxGroup legend="Typical events" options={eventTypes.map((t) => ({ value: t, label: t }))} value={data.profile.typicalEventTypes} onChange={(v) => setProfile({ typicalEventTypes: v })} />
            <Field id="cl-budget" label="Typical budget per booking (₹)" hint="Optional — never shown to artists.">
              <Input id="cl-budget" type="number" min={0} value={data.profile.typicalBudgetInr ?? ""} onChange={(e) => setProfile({ typicalBudgetInr: e.target.value === "" ? null : Number(e.target.value) })} />
            </Field>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4 text-center">
            <CheckCircle size={48} weight="fill" className="mx-auto text-status-success" aria-hidden />
            <p className="type-h2 text-ink">You're ready to hire</p>
            <p className="type-body text-ink-secondary">Find an artist directly, or post a gig and let artists apply with quotes.</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link to="/explore">Find artists</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/client/gigs/new">Post a gig</Link>
              </Button>
            </div>
          </div>
        )}
      </StepCard>
      {step < 4 ? (
        <WizardNav
          step={step}
          total={CLIENT_STEPS.length}
          busy={busy}
          onBack={() => void go(-1)}
          onNext={() => void go(1)}
          onSaveDraft={() => void run((b) => b.market.saveClientOnboarding(data, false), { success: "Draft saved." })}
          nextLabel={step === 3 ? "Finish" : undefined}
        />
      ) : (
        <div className="text-center">
          <Button variant="ghost" onClick={() => void go(1)}>
            Go to my dashboard <ArrowRight aria-hidden />
          </Button>
        </div>
      )}
    </OnboardingFrame>
  );
}
