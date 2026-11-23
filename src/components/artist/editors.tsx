import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImageSquare, LinkSimple, MusicNotes, PencilSimple, Plus, Star, Trash, VideoCamera } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/shared/primitives";
import { SafeImage } from "@/components/shared/SafeImage";
import { EmptyState } from "@/components/shared/states";
import { creativeCategories } from "@/data/categories";
import { toUserMessage } from "@/domain/errors";
import { formatInr } from "@/domain/money";
import { prepareImage, validateMediaLink } from "@/services/media";
import type { CategorySlug, PortfolioItem, PortfolioMediaType, PricingMode, ServicePackage, WorkingMode } from "@/types/marketplace";
import { parseDateOnly, toDateOnly } from "@/utils/format";

const pricingLabels: Record<PricingMode, string> = {
  starting_at: "Starting price",
  range: "Price range (from)",
  fixed_package: "Fixed package price",
  quote_required: "Quotation-based",
};

export function newServiceDraft(category: CategorySlug): ServicePackage {
  return {
    id: `pkg-new-${Date.now()}`,
    title: "",
    description: "",
    category,
    format: "on_site",
    pricingMode: "starting_at",
    duration: "",
    inclusions: [],
    exclusions: [],
    priceInr: null,
  };
}

/* ------------------------------------------------------------------ */
/* Service editor                                                      */
/* ------------------------------------------------------------------ */

export function ServiceFormDialog({
  open,
  initial,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  initial: ServicePackage;
  onOpenChange: (open: boolean) => void;
  onSave: (pkg: ServicePackage) => void | Promise<void>;
}) {
  const [draft, setDraft] = useState(initial);
  const [inclusions, setInclusions] = useState(initial.inclusions.join("\n"));
  const [exclusions, setExclusions] = useState(initial.exclusions.join("\n"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastInitial, setLastInitial] = useState(initial);
  if (initial !== lastInitial) {
    setLastInitial(initial);
    setDraft(initial);
    setInclusions(initial.inclusions.join("\n"));
    setExclusions(initial.exclusions.join("\n"));
    setErrors({});
  }

  const save = async () => {
    const e: Record<string, string> = {};
    if (draft.title.trim().length < 4) e.title = "Name the service (at least 4 characters).";
    if (!draft.duration.trim()) e.duration = "Add a duration, e.g. 2 hours or 3 days.";
    if (draft.pricingMode !== "quote_required" && !(draft.priceInr && draft.priceInr > 0)) e.price = "Add a price, or choose quotation-based.";
    setErrors(e);
    if (Object.keys(e).length) return;
    await onSave({
      ...draft,
      title: draft.title.trim(),
      priceInr: draft.pricingMode === "quote_required" ? null : draft.priceInr,
      inclusions: inclusions.split("\n").map((s) => s.trim()).filter(Boolean),
      exclusions: exclusions.split("\n").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial.title ? "Edit service" : "Add a service"}</DialogTitle>
          <DialogDescription>Clients see this on your profile. Be specific about what's included.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="svc-title" label="Service name" required error={errors.title} className="sm:col-span-2">
            <Input id="svc-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. 90-minute acoustic set" />
          </Field>
          <Field id="svc-cat" label="Category">
            <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v as CategorySlug })}>
              <SelectTrigger id="svc-cat">
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
          <Field id="svc-format" label="Format">
            <Select value={draft.format} onValueChange={(v) => setDraft({ ...draft, format: v as WorkingMode })}>
              <SelectTrigger id="svc-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on_site">On-site</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="both">On-site or remote</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field id="svc-pricing" label="Pricing">
            <Select value={draft.pricingMode} onValueChange={(v) => setDraft({ ...draft, pricingMode: v as PricingMode })}>
              <SelectTrigger id="svc-pricing">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(pricingLabels) as PricingMode[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {pricingLabels[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field id="svc-price" label="Price (₹)" error={errors.price} hint={draft.pricingMode === "quote_required" ? "You'll quote after reading each brief." : undefined}>
            <Input
              id="svc-price"
              type="number"
              inputMode="numeric"
              min={0}
              disabled={draft.pricingMode === "quote_required"}
              value={draft.priceInr ?? ""}
              onChange={(e) => setDraft({ ...draft, priceInr: e.target.value === "" ? null : Number(e.target.value) })}
            />
          </Field>
          <Field id="svc-duration" label="Duration" required error={errors.duration} className="sm:col-span-2">
            <Input id="svc-duration" value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} placeholder="e.g. 2 hours, 3–4 days" />
          </Field>
          <Field id="svc-desc" label="Description" className="sm:col-span-2">
            <Textarea id="svc-desc" rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </Field>
          <Field id="svc-inc" label="Included" hint="One item per line." className="sm:col-span-1">
            <Textarea id="svc-inc" rows={4} value={inclusions} onChange={(e) => setInclusions(e.target.value)} placeholder={"Sound check\nTwo sets"} />
          </Field>
          <Field id="svc-exc" label="Not included" hint="One item per line." className="sm:col-span-1">
            <Textarea id="svc-exc" rows={4} value={exclusions} onChange={(e) => setExclusions(e.target.value)} placeholder={"PA system\nTravel outside city"} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => void save()}>Save service</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ServiceList({
  services,
  onEdit,
  onDelete,
  onAdd,
}: {
  services: ServicePackage[];
  onEdit: (pkg: ServicePackage) => void;
  onDelete: (pkg: ServicePackage) => void;
  onAdd: () => void;
}) {
  if (!services.length) {
    return <EmptyState compact title="No services yet" description="Add at least one service so clients know what you offer. Quotation-based pricing is fine." action={{ label: "Add a service", onClick: onAdd }} />;
  }
  return (
    <div className="space-y-3">
      {services.map((s) => (
        <div key={s.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-line bg-surface p-4">
          <div className="min-w-0">
            <p className="type-h4 text-ink">{s.title}</p>
            <p className="type-caption text-ink-secondary">
              {s.duration} · {s.priceInr === null ? "Quotation-based" : `${pricingLabels[s.pricingMode]}: ${formatInr(s.priceInr)}`}
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(s)}>
              <PencilSimple aria-hidden /> Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(s)} aria-label={`Delete ${s.title}`}>
              <Trash aria-hidden />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={onAdd}>
        <Plus aria-hidden /> Add another service
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Portfolio manager                                                   */
/* ------------------------------------------------------------------ */

export function PortfolioAddDialog({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (item: Omit<PortfolioItem, "id">) => void | Promise<void> }) {
  const [type, setType] = useState<PortfolioMediaType>("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [owned, setOwned] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setType("image");
    setMediaUrl("");
    setLink("");
    setTitle("");
    setCaption("");
    setOwned(false);
    setError("");
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      setMediaUrl(await prepareImage(file));
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").slice(0, 80));
    } catch (e) {
      setError(toUserMessage(e));
    } finally {
      setProcessing(false);
    }
  };

  const submit = async () => {
    try {
      const url = type === "image" ? mediaUrl : validateMediaLink(link);
      if (!url) throw new Error("Choose an image to upload.");
      if (title.trim().length < 3) throw new Error("Give this work a title.");
      if (!owned) throw new Error("Confirm you own this work or have permission to share it.");
      await onAdd({ type, mediaUrl: url, title: title.trim(), caption: caption.trim(), featured: false, ownershipConfirmed: true });
      reset();
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error && !(e as { code?: string }).code ? e.message : toUserMessage(e));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add portfolio work</DialogTitle>
          <DialogDescription>Images up to 10 MB (JPG, PNG, WebP). For audio and video, paste a link to where it's hosted.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Media type">
          {([
            ["image", "Image", ImageSquare],
            ["audio", "Audio link", MusicNotes],
            ["video", "Video link", VideoCamera],
          ] as const).map(([value, label, IconCmp]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={type === value}
              onClick={() => { setType(value); setError(""); }}
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 type-label-sm ${type === value ? "border-line-selected bg-brand-subtle text-brand" : "border-line text-ink-secondary hover:bg-surface-low"}`}
            >
              <IconCmp size={20} aria-hidden /> {label}
            </button>
          ))}
        </div>
        {type === "image" ? (
          <div className="space-y-2">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" id="pf-file" onChange={(e) => void onFile(e.target.files?.[0])} />
            {mediaUrl ? (
              <div className="relative">
                <img src={mediaUrl} alt="Selected upload preview" className="max-h-56 w-full rounded-lg object-cover" />
                <Button variant="outline" size="sm" className="absolute right-2 top-2" onClick={() => fileRef.current?.click()}>
                  Replace
                </Button>
              </div>
            ) : (
              <label htmlFor="pf-file" className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-line-strong bg-surface-low p-8 text-center hover:bg-surface-container">
                <ImageSquare size={28} className="text-ink-secondary" aria-hidden />
                <span className="type-label text-ink">{processing ? "Processing…" : "Choose an image"}</span>
                <span className="type-caption text-ink-secondary">JPG, PNG or WebP · up to 10 MB</span>
              </label>
            )}
          </div>
        ) : (
          <Field id="pf-link" label={type === "audio" ? "Audio link" : "Video link"} hint="https:// link to SoundCloud, YouTube, Vimeo, Google Drive (public) or similar.">
            <div className="relative">
              <LinkSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" aria-hidden />
              <Input id="pf-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" className="pl-9" />
            </div>
          </Field>
        )}
        <Field id="pf-title" label="Title" required>
          <Input id="pf-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Sangeet performance, Udaipur" />
        </Field>
        <Field id="pf-caption" label="Description">
          <Textarea id="pf-caption" rows={2} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Event, audience size, your role…" />
        </Field>
        <label className="flex items-start gap-2 type-body-sm text-ink">
          <Checkbox checked={owned} onCheckedChange={(v) => setOwned(v === true)} className="mt-0.5" />
          I created this work or have permission to share it, and anyone identifiable has agreed to appear.
        </label>
        {error && <p role="alert" className="type-caption text-status-error">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => void submit()} disabled={processing}>
            Add to portfolio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PortfolioGrid({
  items,
  onRemove,
  onMove,
  onToggleFeatured,
  onEdit,
}: {
  items: PortfolioItem[];
  onRemove: (item: PortfolioItem) => void;
  onMove?: (index: number, direction: -1 | 1) => void;
  onToggleFeatured?: (item: PortfolioItem) => void;
  onEdit?: (item: PortfolioItem) => void;
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <li key={item.id} className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="relative">
            {item.type === "image" ? (
              <SafeImage src={item.mediaUrl} alt={item.title} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center gap-1 bg-surface-container text-ink-secondary">
                {item.type === "audio" ? <MusicNotes size={28} aria-hidden /> : <VideoCamera size={28} aria-hidden />}
                <span className="type-caption">{item.type === "audio" ? "Audio link" : "Video link"}</span>
              </div>
            )}
            {item.featured && (
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-brand-light px-2 py-0.5 type-label-sm text-ink">
                <Star size={12} weight="fill" aria-hidden /> Featured
              </span>
            )}
          </div>
          <div className="space-y-2 p-3">
            <p className="truncate type-label text-ink">{item.title}</p>
            {item.caption && <p className="line-clamp-2 type-caption text-ink-secondary">{item.caption}</p>}
            <div className="flex flex-wrap gap-1">
              {onMove && (
                <>
                  <Button variant="ghost" size="icon-sm" disabled={index === 0} onClick={() => onMove(index, -1)} aria-label={`Move ${item.title} earlier`}>
                    <ArrowUp aria-hidden />
                  </Button>
                  <Button variant="ghost" size="icon-sm" disabled={index === items.length - 1} onClick={() => onMove(index, 1)} aria-label={`Move ${item.title} later`}>
                    <ArrowDown aria-hidden />
                  </Button>
                </>
              )}
              {onToggleFeatured && (
                <Button variant="ghost" size="sm" onClick={() => onToggleFeatured(item)} aria-pressed={item.featured}>
                  <Star weight={item.featured ? "fill" : "regular"} aria-hidden /> {item.featured ? "Unfeature" : "Feature"}
                </Button>
              )}
              {onEdit && (
                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(item)} aria-label={`Edit ${item.title}`}>
                  <PencilSimple aria-hidden />
                </Button>
              )}
              <Button variant="ghost" size="icon-sm" onClick={() => onRemove(item)} aria-label={`Remove ${item.title}`} className="ml-auto text-status-error">
                <Trash aria-hidden />
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Availability editor                                                 */
/* ------------------------------------------------------------------ */

export function AvailabilityCalendar({ unavailable, bookedDates = [], onChange }: { unavailable: string[]; bookedDates?: string[]; onChange: (dates: string[]) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = unavailable.map(parseDateOnly);
  const booked = bookedDates.map(parseDateOnly);
  return (
    <div className="space-y-3">
      <Calendar
        mode="multiple"
        selected={selected}
        numberOfMonths={2}
        onSelect={(dates) => {
          const next = (dates ?? []).map(toDateOnly).filter((d) => !bookedDates.includes(d));
          onChange(next);
        }}
        disabled={(d) => d < today}
        modifiers={{ booked }}
        modifiersClassNames={{ booked: "!bg-status-info-soft !text-status-info font-semibold" }}
        className="rounded-xl border border-line bg-surface p-3"
      />
      <ul className="flex flex-wrap gap-4 type-caption text-ink-secondary">
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-primary" aria-hidden /> Unavailable (selected)
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-status-info-soft ring-1 ring-status-info-border" aria-hidden /> Booked
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm border border-line" aria-hidden /> Available
        </li>
      </ul>
    </div>
  );
}

export function useConfirmDelete() {
  return (label: string) => {
    toast.message(`${label} removed`);
  };
}

export function LabeledCheckboxGroup<T extends string>({ legend, options, value, onChange, max }: { legend: string; options: { value: T; label: string }[]; value: T[]; onChange: (v: T[]) => void; max?: number }) {
  return (
    <fieldset className="space-y-2">
      <legend className="type-label text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = value.includes(o.value);
          const disabled = !checked && max !== undefined && value.length >= max;
          return (
            <Label
              key={o.value}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 type-body-sm font-normal ${checked ? "border-line-selected bg-brand-subtle text-ink" : "border-line text-ink-secondary"} ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-surface-low"}`}
            >
              <Checkbox checked={checked} disabled={disabled} onCheckedChange={(v) => onChange(v === true ? [...value, o.value] : value.filter((x) => x !== o.value))} className="sr-only" />
              {o.label}
            </Label>
          );
        })}
      </div>
    </fieldset>
  );
}
