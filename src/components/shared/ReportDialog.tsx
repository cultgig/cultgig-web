import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/lib/router";
import { useMarketplace } from "@/state/MarketplaceContext";
import type { ReportTargetType } from "@/types/marketplace";

const reasons: Record<ReportTargetType, string[]> = {
  user: ["Harassment or abuse", "Asking to pay outside Cultgig", "Spam or scam", "Impersonation", "Something else"],
  artist_profile: ["Stolen or misleading portfolio", "Fake profile or impersonation", "Inappropriate content", "Asking to pay outside Cultgig", "Something else"],
  gig: ["Scam or suspicious payment terms", "Unsafe or illegal request", "Discriminatory requirements", "Spam", "Something else"],
  review: ["Not a genuine booking", "Abusive or hateful language", "Contains personal information", "Something else"],
  booking: ["Safety concern", "No-show", "Payment issue", "Something else"],
};

export function ReportDialog({ targetType, targetId, targetLabel, trigger }: { targetType: ReportTargetType; targetId: string; targetLabel: string; trigger: ReactNode }) {
  const { viewer, run } = useMarketplace();
  const { navigate, pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    if (!reason) {
      setError("Choose a reason.");
      return;
    }
    const ok = await run((b) => b.market.report({ targetType, targetId, reason, details }).then(() => true), { success: "Thanks. Our trust & safety team will review this report." });
    if (ok) {
      setOpen(false);
      setReason("");
      setDetails("");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next && !viewer) {
          navigate(`/sign-in?next=${encodeURIComponent(pathname)}`);
          return;
        }
        setOpen(next);
        setError("");
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report {targetLabel}</DialogTitle>
          <DialogDescription>Reports are confidential. The person you report isn't told who reported them. If someone is in immediate danger, call 112.</DialogDescription>
        </DialogHeader>
        <RadioGroup value={reason} onValueChange={(v) => { setReason(v); setError(""); }} aria-label="Reason" className="gap-2">
          {reasons[targetType].map((r) => (
            <Label key={r} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line p-3 font-normal has-[:checked]:border-line-selected has-[:checked]:bg-brand-subtle">
              <RadioGroupItem value={r} /> {r}
            </Label>
          ))}
        </RadioGroup>
        {error && <p role="alert" className="type-caption text-status-error">{error}</p>}
        <div className="space-y-1.5">
          <Label htmlFor="report-details">Details (optional)</Label>
          <Textarea id="report-details" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="What happened? Include dates and links if you can." />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => void submit()}>
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
