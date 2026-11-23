import { useState } from "react";
import { ArrowsLeftRight, Lifebuoy, ShieldCheck, SignOut } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { NoticeBanner } from "@/components/shared/NoticeBanner";
import { Field, PageHeader, SectionCard } from "@/components/shared/primitives";
import { isDemoMode } from "@/config/env";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link, useRouter } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { MarketplaceRole, NotificationPreferences } from "@/types/marketplace";
import { formatDate } from "@/utils/format";

function ToggleRow({ id, label, description, checked, onChange }: { id: string; label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <Label htmlFor={id} className="type-label text-ink">
          {label}
        </Label>
        <p className="type-body-sm text-ink-secondary">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  usePageMeta("Settings");
  const { viewer, settings, run, myArtistProfile } = useMarketplace();
  const { navigate, query } = useRouter();
  const [name, setName] = useState(viewer?.displayName ?? "");
  const [phone, setPhone] = useState(viewer?.phone ?? "");
  const [city, setCity] = useState(viewer?.city ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  if (!viewer || !settings) return null;

  const saveAccount = async () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Your name can't be empty.";
    if (phone && !/^[+\d\s-]{8,16}$/.test(phone)) e.phone = "Enter a valid phone number.";
    setErrors(e);
    if (Object.keys(e).length) return;
    await run((b) => b.market.updateAccount({ displayName: name, phone, city }), { success: "Account details saved" });
  };

  const setNotif = (key: keyof NotificationPreferences, value: boolean) => void run((b) => b.market.updateSettings({ notifications: { ...settings.notifications, [key]: value } }), { success: "Preferences saved" });

  const switchTo = async (role: MarketplaceRole) => {
    await run((b) => b.market.setActiveRole(role));
    navigate(viewer.onboarding[role] === "complete" ? `/${role}/dashboard` : `/onboarding/${role}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account, notifications, privacy and roles." />
      <Tabs defaultValue={query.get("tab") ?? "account"}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & safety</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4 pt-4">
          <SectionCard title="Account details" description="Your phone number and email are never shown publicly.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="st-name" label="Name" error={errors.name}>
                <Input id="st-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </Field>
              <Field id="st-email" label="Email" hint={viewer.emailVerified ? "Verified" : undefined}>
                <Input id="st-email" value={viewer.email} disabled />
              </Field>
              <Field id="st-phone" label="Phone" error={errors.phone}>
                <Input id="st-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
              </Field>
              <Field id="st-city" label="City">
                <Input id="st-city" value={city} onChange={(e) => setCity(e.target.value)} />
              </Field>
            </div>
            {!viewer.emailVerified && (
              <NoticeBanner tone="warning" title="Your email isn't verified" className="mt-4">
                <Link to="/verify-email" className="font-semibold text-brand">Verify your email</Link> so you don't miss booking updates.
              </NoticeBanner>
            )}
            <Button className="mt-4" onClick={() => void saveAccount()}>
              Save changes
            </Button>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notifications" className="pt-4">
          <SectionCard title="Email notifications" description={isDemoMode ? "Demo mode never sends email; these preferences are saved for when email is configured." : "In-app notifications are always on."}>
            <div className="divide-y divide-line">
              <ToggleRow id="n-email" label="Email me updates" description="Master switch for all transactional email." checked={settings.notifications.email} onChange={(v) => setNotif("email", v)} />
              <ToggleRow id="n-messages" label="New messages" description="When someone messages you." checked={settings.notifications.messages} onChange={(v) => setNotif("messages", v)} />
              <ToggleRow id="n-proposals" label="Offers and counter-offers" description="When you receive or someone responds to an offer." checked={settings.notifications.proposals} onChange={(v) => setNotif("proposals", v)} />
              <ToggleRow id="n-bookings" label="Booking updates and reminders" description="Confirmations, status changes and event reminders." checked={settings.notifications.bookings} onChange={(v) => setNotif("bookings", v)} />
              <ToggleRow id="n-marketing" label="Product news" description="Occasional updates about new Cultgig features." checked={settings.notifications.marketing} onChange={(v) => setNotif("marketing", v)} />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4 pt-4">
          <SectionCard title="Profile visibility">
            <div className="divide-y divide-line">
              {myArtistProfile && (
                <ToggleRow
                  id="p-visible"
                  label="Show my artist profile in search"
                  description="When off, your profile is hidden from Explore and category pages. Existing conversations continue."
                  checked={settings.profileVisibility === "public"}
                  onChange={(v) => void run((b) => b.market.updateSettings({ profileVisibility: v ? "public" : "hidden" }), { success: v ? "Profile visible" : "Profile hidden" })}
                />
              )}
              <ToggleRow id="p-city" label="Show my city on my profile" description="Clients see your base city to judge travel." checked={settings.showCityOnProfile} onChange={(v) => void run((b) => b.market.updateSettings({ showCityOnProfile: v }), { success: "Saved" })} />
            </div>
          </SectionCard>
          <SectionCard title="Blocked people">
            {settings.blockedUserIds.length ? (
              <p className="type-body-sm text-ink-secondary">You've blocked {settings.blockedUserIds.length} {settings.blockedUserIds.length === 1 ? "person" : "people"}. Blocked people can't message you or send inquiries.</p>
            ) : (
              <p className="type-body-sm text-ink-secondary">You haven't blocked anyone. Block someone from the menu in a conversation.</p>
            )}
          </SectionCard>
          <SectionCard title="Your data">
            <p className="type-body-sm text-ink-secondary">
              Read how we handle personal data in the <Link to="/legal/privacy" className="text-brand">privacy policy</Link>. To request a copy or correction of your data, <Link to="/support" className="text-brand">contact support</Link>.
            </p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="roles" className="pt-4">
          <SectionCard title="How you use Cultgig" description="One account can hire and offer services. Switch any time.">
            <div className="grid gap-3 sm:grid-cols-2">
              {(["client", "artist"] as const).map((role) => {
                const active = viewer.activeRole === role;
                const state = viewer.onboarding[role];
                return (
                  <div key={role} className={`rounded-xl border p-4 ${active ? "border-line-selected bg-brand-subtle" : "border-line"}`}>
                    <p className="type-h4 text-ink">{role === "client" ? "Client workspace" : "Artist workspace"}</p>
                    <p className="type-body-sm text-ink-secondary">{state === "complete" ? "Set up" : state === "draft" ? "Setup in progress" : "Not set up"}</p>
                    <Button className="mt-3" size="sm" variant={active ? "outline" : "default"} disabled={active} onClick={() => void switchTo(role)}>
                      <ArrowsLeftRight aria-hidden /> {active ? "Currently active" : state === "complete" ? `Switch to ${role}` : `Set up ${role} workspace`}
                    </Button>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 pt-4">
          <SectionCard title="Sign-in and sessions">
            <div className="space-y-2 type-body-sm text-ink-secondary">
              <p className="flex items-center gap-2">
                <ShieldCheck className="text-brand" aria-hidden /> Signed in as {viewer.email} ({viewer.authProvider === "demo" ? "demo account on this browser" : "Cultgig account"}).
              </p>
              <p>Account created {formatDate(viewer.createdAt)}.</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/forgot-password">Change password</Link>
              </Button>
              <Button variant="outline" onClick={async () => { await run((b) => b.auth.signOut(), { success: "Signed out" }); navigate("/"); }}>
                <SignOut aria-hidden /> Sign out of this device
              </Button>
            </div>
          </SectionCard>
          <SectionCard title="Deactivate account" description="Your profile is hidden immediately. Bookings in progress stay visible to the other participant, and support completes the request after checking for open bookings.">
            {settings.deactivationRequestedAt ? (
              <NoticeBanner title="Deactivation requested">Requested on {formatDate(settings.deactivationRequestedAt)}. Contact support to cancel the request.</NoticeBanner>
            ) : (
              <ConfirmDialog
                trigger={<Button variant="outline" className="text-status-error">Request deactivation</Button>}
                title="Request account deactivation?"
                description={<p>Your public profile will be hidden. Open bookings must be completed or cancelled before the account is closed.</p>}
                confirmLabel="Request deactivation"
                destructive
                onConfirm={() => run((b) => b.market.requestDeactivation(), { success: "Deactivation requested" })}
              />
            )}
          </SectionCard>
          <Button asChild variant="ghost">
            <Link to="/support">
              <Lifebuoy aria-hidden /> Help and support
            </Link>
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
