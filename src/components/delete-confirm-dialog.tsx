"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteAssessment,
  deleteParticipant,
  type DeleteResult,
} from "@/app/dashboard/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type DeleteConfirmDialogProps = {
  title: string;
  description: string;
  triggerLabel: string;
  triggerVariant?: "destructive" | "ghost" | "outline";
  triggerSize?: "default" | "xs" | "sm" | "icon-xs" | "icon-sm";
  triggerClassName?: string;
  onConfirm: () => Promise<DeleteResult>;
  redirectTo?: string;
};

export function DeleteConfirmDialog({
  title,
  description,
  triggerLabel,
  triggerVariant = "destructive",
  triggerSize = "xs",
  triggerClassName,
  onConfirm,
  redirectTo,
}: DeleteConfirmDialogProps) {
  const router = useRouter();
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const canConfirm = confirmation.trim().toLowerCase() === "delete";

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setConfirmation("");
      setError(null);
    }
  }

  function handleConfirm() {
    if (!canConfirm || pending) return;
    setError(null);
    startTransition(async () => {
      const result = await onConfirm();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      handleOpenChange(false);
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        type="button"
        className={cn(
          buttonVariants({ variant: triggerVariant, size: triggerSize }),
          "relative z-10",
          triggerClassName
        )}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {triggerLabel}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onClick={(event) => event.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor={inputId}>
            Type{" "}
            <span className="font-semibold text-[var(--parc-heading)]">
              delete
            </span>{" "}
            to confirm
          </Label>
          <Input
            id={inputId}
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="delete"
            disabled={pending}
          />
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <DialogFooter>
          <DialogClose
            type="button"
            disabled={pending}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Cancel
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={!canConfirm || pending}
            onClick={handleConfirm}
          >
            {pending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteParticipantButton({
  userId,
  participantLabel,
  triggerLabel = "Delete",
  redirectTo,
}: {
  userId: string;
  participantLabel: string;
  triggerLabel?: string;
  redirectTo?: string;
}) {
  return (
    <DeleteConfirmDialog
      title="Remove participant"
      description={`This permanently deletes ${participantLabel}, their invite access, and all assessment submissions. This cannot be undone.`}
      triggerLabel={triggerLabel}
      redirectTo={redirectTo}
      onConfirm={() => deleteParticipant(userId)}
    />
  );
}

export function DeleteAssessmentButton({
  assessmentId,
  completedLabel,
}: {
  assessmentId: string;
  completedLabel: string;
}) {
  return (
    <DeleteConfirmDialog
      title="Delete assessment"
      description={`This permanently deletes the assessment from ${completedLabel}. The participant account stays. This cannot be undone.`}
      triggerLabel="Delete"
      onConfirm={() => deleteAssessment(assessmentId)}
    />
  );
}
