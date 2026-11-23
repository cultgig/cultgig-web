import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { newServiceDraft, ServiceFormDialog, ServiceList } from "@/components/artist/editors";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/primitives";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { ServicePackage } from "@/types/marketplace";

export default function ArtistServicesPage() {
  usePageMeta("My services");
  const { myArtistProfile, run } = useMarketplace();
  const services = myArtistProfile?.packages ?? [];
  const [editing, setEditing] = useState<ServicePackage | null>(null);
  const [deleting, setDeleting] = useState<ServicePackage | null>(null);
  const add = () => setEditing(newServiceDraft(myArtistProfile?.primaryCategory ?? "other-creative-professionals"));

  return (
    <div className="space-y-6">
      <PageHeader title="My services" description="Services and packages shown on your profile. Your lowest price becomes your “from” price in search." actions={<Button onClick={add}><Plus aria-hidden /> Add service</Button>} />
      <ServiceList services={services} onAdd={add} onEdit={setEditing} onDelete={setDeleting} />
      {editing && (
        <ServiceFormDialog
          open
          initial={editing}
          onOpenChange={(o) => !o && setEditing(null)}
          onSave={async (pkg) => {
            const ok = await run((b) => b.market.upsertServicePackage(pkg).then(() => true), { success: "Service saved" });
            if (ok) setEditing(null);
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && setDeleting(null)}
          title={`Delete “${deleting.title}”?`}
          description={services.length === 1 ? "This is your only service. Clients will only be able to request custom quotes until you add another." : "It will no longer appear on your profile. Existing bookings are not affected."}
          confirmLabel="Delete service"
          destructive
          onConfirm={async () => {
            await run((b) => b.market.deleteServicePackage(deleting.id), { success: "Service deleted" });
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}
