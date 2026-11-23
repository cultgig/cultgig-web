import { useRef, useState } from "react";
import { UserCircle } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LabeledCheckboxGroup } from "@/components/artist/editors";
import { Field, PageHeader, SectionCard, UserAvatar } from "@/components/shared/primitives";
import { commonLanguages, creativeCategories } from "@/data/categories";
import { toUserMessage } from "@/domain/errors";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "@/lib/router";
import { prepareImage } from "@/services/media";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { ArtistFormat, ArtistProfile, CategorySlug, WorkingMode } from "@/types/marketplace";

type Editable = Pick<ArtistProfile, "displayName" | "tagline" | "primaryCategory" | "secondaryCategories" | "artistFormat" | "experienceYears" | "languages" | "bio" | "city" | "workingMode" | "travelRadiusKm" | "equipmentNotes" | "avatarUrl">;

export default function ArtistProfileEditPage() {
  usePageMeta("Edit artist profile");
  const { myArtistProfile, run } = useMarketplace();
  const p = myArtistProfile!;
  const [form, setForm] = useState<Editable>({
    displayName: p.displayName,
    tagline: p.tagline,
    primaryCategory: p.primaryCategory,
    secondaryCategories: p.secondaryCategories,
    artistFormat: p.artistFormat,
    experienceYears: p.experienceYears,
    languages: p.languages,
    bio: p.bio,
    city: p.city,
    workingMode: p.workingMode,
    travelRadiusKm: p.travelRadiusKm,
    equipmentNotes: p.equipmentNotes,
    avatarUrl: p.avatarUrl,
  });
  const [travelCities, setTravelCities] = useState(p.travelCities.join(", "));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Editable>(k: K, v: Editable[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
  };

  const save = async () => {
    const e: Record<string, string> = {};
    if (!form.displayName.trim()) e.displayName = "Your artist name can't be empty.";
    if (form.bio.trim().length < 40) e.bio = "Write at least 40 characters.";
    if (!form.city.trim()) e.city = "Add your city.";
    if (!form.languages.length) e.languages = "Choose at least one language.";
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error(Object.values(e)[0]);
      return;
    }
    const ok = await run(
      (b) =>
        b.market
          .updateArtistProfile({
            ...form,
            displayName: form.displayName.trim(),
            travelCities: travelCities.split(",").map((s) => s.trim()).filter(Boolean),
            avatarAlt: `${form.displayName.trim()}, profile photo`,
          })
          .then(() => true),
      { success: "Profile saved" },
    );
    if (ok) setDirty(false);
  };

  const onAvatar = async (file: File | undefined) => {
    if (!file) return;
    try {
      set("avatarUrl", await prepareImage(file, 600));
    } catch (err) {
      toast.error(toUserMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My profile"
        description="This is what clients see on your public profile."
        actions={
          <>
            <Button asChild variant="outline"><Link to={`/artists/${p.slug}`}>Preview</Link></Button>
            <Button onClick={() => void save()} disabled={!dirty}>{dirty ? "Save changes" : "Saved"}</Button>
          </>
        }
      />
      <SectionCard title="Identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 sm:col-span-2">
            <UserAvatar name={form.displayName} src={form.avatarUrl} className="size-16" />
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" id="pe-avatar" onChange={(e) => void onAvatar(e.target.files?.[0])} />
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}><UserCircle aria-hidden /> Change photo</Button>
          </div>
          <Field id="pe-name" label="Artist or team name" required error={errors.displayName}>
            <Input id="pe-name" value={form.displayName} onChange={(e) => set("displayName", e.target.value)} />
          </Field>
          <Field id="pe-city" label="Base city" required error={errors.city}>
            <Input id="pe-city" value={form.city} onChange={(e) => set("city", e.target.value)} />
          </Field>
          <Field id="pe-tagline" label="Tagline" className="sm:col-span-2">
            <Input id="pe-tagline" maxLength={140} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field id="pe-cat" label="Primary category">
            <Select value={form.primaryCategory} onValueChange={(v) => set("primaryCategory", v as CategorySlug)}>
              <SelectTrigger id="pe-cat"><SelectValue /></SelectTrigger>
              <SelectContent>{creativeCategories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field id="pe-format" label="Solo or group">
            <Select value={form.artistFormat} onValueChange={(v) => set("artistFormat", v as ArtistFormat)}>
              <SelectTrigger id="pe-format"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="solo">Solo</SelectItem><SelectItem value="group">Group or team</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field id="pe-exp" label="Years of experience">
            <Input id="pe-exp" type="number" min={0} max={60} value={form.experienceYears} onChange={(e) => set("experienceYears", Number(e.target.value) || 0)} />
          </Field>
          <div className="sm:col-span-2">
            <LabeledCheckboxGroup legend="Secondary categories (up to 3)" max={3} options={creativeCategories.filter((c) => c.slug !== form.primaryCategory).map((c) => ({ value: c.slug, label: c.shortLabel }))} value={form.secondaryCategories} onChange={(v) => set("secondaryCategories", v)} />
          </div>
          <div className="sm:col-span-2">
            <LabeledCheckboxGroup legend="Languages" options={commonLanguages.map((l) => ({ value: l, label: l }))} value={form.languages} onChange={(v) => set("languages", v)} />
            {errors.languages && <p role="alert" className="mt-1 type-caption text-status-error">{errors.languages}</p>}
          </div>
          <Field id="pe-bio" label="Bio" required error={errors.bio} className="sm:col-span-2">
            <Textarea id="pe-bio" rows={6} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
          </Field>
        </div>
      </SectionCard>
      <SectionCard title="Locations and logistics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pe-mode" label="Where you work">
            <Select value={form.workingMode} onValueChange={(v) => set("workingMode", v as WorkingMode)}>
              <SelectTrigger id="pe-mode"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="on_site">On-site</SelectItem><SelectItem value="remote">Remote</SelectItem><SelectItem value="both">On-site and remote</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field id="pe-radius" label="Travel radius (km)">
            <Input id="pe-radius" type="number" min={0} value={form.travelRadiusKm} onChange={(e) => set("travelRadiusKm", Number(e.target.value) || 0)} />
          </Field>
          <Field id="pe-cities" label="Other cities you serve" hint="Separate with commas." className="sm:col-span-2">
            <Input id="pe-cities" value={travelCities} onChange={(e) => { setTravelCities(e.target.value); setDirty(true); }} />
          </Field>
          <Field id="pe-equip" label="Equipment notes" className="sm:col-span-2">
            <Textarea id="pe-equip" rows={2} value={form.equipmentNotes} onChange={(e) => set("equipmentNotes", e.target.value)} />
          </Field>
        </div>
      </SectionCard>
      <div className="flex justify-end">
        <Button onClick={() => void save()} disabled={!dirty}>{dirty ? "Save changes" : "All changes saved"}</Button>
      </div>
    </div>
  );
}
