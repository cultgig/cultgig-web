import { useState, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Accessible confirmation for consequential actions. With `requireReason`, a reason must be typed
 * before confirming (cancellations, disputes).
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  destructive = false,
  requireReason,
  onConfirm,
  open: controlledOpen,
  onOpenChange,
}: {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  requireReason?: { label: string; placeholder?: string };
  onConfirm: (reason: string) => void | Promise<unknown>;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (o: boolean) => {
    setInternalOpen(o);
    onOpenChange?.(o);
  };
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const blocked = Boolean(requireReason) && reason.trim().length < 5;
  return (
    <AlertDialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setReason(""); }}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 type-body text-ink-secondary">{description}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {requireReason && (
          <div className="space-y-1.5">
            <Label htmlFor="confirm-reason">{requireReason.label}</Label>
            <Textarea id="confirm-reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={requireReason.placeholder} />
            <p className="type-caption text-ink-secondary">At least 5 characters. Shared with the other participant and support.</p>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Go back</AlertDialogCancel>
          <AlertDialogAction
            disabled={blocked || busy}
            className={cn(destructive && buttonVariants({ variant: "destructive" }))}
            onClick={async (e) => {
              e.preventDefault();
              // Close first: the action usually changes the parent (e.g. a status button disappears),
              // and unmounting a dialog that is still open can leave Radix's focus/pointer locks behind.
              const value = reason.trim();
              setBusy(true);
              setOpen(false);
              setReason("");
              try {
                await onConfirm(value);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Working…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
