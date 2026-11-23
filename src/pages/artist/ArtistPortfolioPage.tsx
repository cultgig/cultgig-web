import { useState } from "react";
import { ImagesSquare, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PortfolioAddDialog, PortfolioGrid } from "@/components/artist/editors";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Field, PageHeader } from "@/components/shared/primitives";
import { EmptyState } from "@/components/shared/states";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { PortfolioItem } from "@/types/marketplace";

export default function ArtistPortfolioPage() {
  usePageMeta("Portfolio");
  const { myArtistProfile, run } = useMarketplace();
  const items = myArtistProfile?.portfolio ?? [];
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [removing, setRemoving] = useState<PortfolioItem | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");

  const move = (index: number, dir: -1 | 1) => {
    const ids = items.map((i) => i.id);
    const target = index + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    void run((b) => b.market.reorderPortfolio(ids), { success: "Order saved" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio"
        description={`${items.length} of 30 items. The first featured image is your cover on search results. Reorder to control what clients see first.`}
        actions={<Button onClick={() => setAdding(true)} disabled={items.length >= 30}><Plus aria-hidden /> Add work</Button>}
      />
      {items.length ? (
        <PortfolioGrid
          items={items}
          onMove={move}
          onToggleFeatured={(item) => void run((b) => b.market.updatePortfolioItem(item.id, { featured: !item.featured }), { success: item.featured ? "Removed from featured" : "Featured on your profile" })}
          onEdit={(item) => { setEditing(item); setTitle(item.title); setCaption(item.caption); }}
          onRemove={(item) => setRemoving(item)}
        />
      ) : (
        <EmptyState icon={ImagesSquare} title="Your portfolio is empty" description="Clients book artists whose work they can see. Add photos from recent events, or link audio and video samples." action={{ label: "Add your first piece", onClick: () => setAdding(true) }} />
      )}

      <PortfolioAddDialog open={adding} onOpenChange={setAdding} onAdd={(item) => run((b) => b.market.addPortfolioItem({ ...item, featured: items.length === 0 }), { success: "Added to portfolio" })} />

      <Dialog open={Boolean(editing)} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit details</DialogTitle></DialogHeader>
          <Field id="pfe-title" label="Title"><Input id="pfe-title" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field id="pfe-caption" label="Description"><Textarea id="pfe-caption" rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} /></Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              disabled={title.trim().length < 3}
              onClick={async () => {
                if (!editing) return;
                await run((b) => b.market.updatePortfolioItem(editing.id, { title: title.trim(), caption: caption.trim() }), { success: "Saved" });
                setEditing(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {removing && (
        <ConfirmDialog
          open
          onOpenChange={(o) => !o && setRemoving(null)}
          title={`Remove “${removing.title}”?`}
          description="It disappears from your public profile. Applications that referenced it keep their text."
          confirmLabel="Remove"
          destructive
          onConfirm={async () => {
            await run((b) => b.market.removePortfolioItem(removing.id), { success: "Removed" });
            setRemoving(null);
          }}
        />
      )}
    </div>
  );
}
