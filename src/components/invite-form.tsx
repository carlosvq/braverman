"use client";

import { useState, useTransition } from "react";
import { Check, Copy } from "lucide-react";
import { inviteParticipant } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InviteForm() {
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    setInviteCode(null);
    setCopied(false);
    startTransition(async () => {
      const result = await inviteParticipant(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setInviteCode(result.code);
      const form = document.getElementById(
        "invite-form"
      ) as HTMLFormElement | null;
      form?.reset();
    });
  }

  async function copyCode() {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy code. Copy it manually.");
    }
  }

  return (
    <div className="space-y-6">
      <form id="invite-form" action={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Name (optional)</Label>
            <Input
              id="fullName"
              name="fullName"
              autoComplete="name"
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="participant@example.com"
              required
            />
          </div>
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Inviting…" : "Invite participant"}
        </Button>
      </form>

      {inviteCode ? (
        <div
          className="rounded-lg border border-[var(--parc-border-strong)] bg-muted/50 p-4"
          role="status"
        >
          <p className="text-sm font-medium text-[var(--parc-heading)]">
            Invite code created
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Share this code and the participant sign-in page (
            <span className="font-medium text-[var(--parc-heading)]">/new</span>
            ). It will not be shown again.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="font-mono text-3xl font-semibold tracking-[0.2em] text-[var(--parc-heading)]">
              {inviteCode}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void copyCode()}
            >
              {copied ? (
                <>
                  <Check data-icon="inline-start" />
                  Copied
                </>
              ) : (
                <>
                  <Copy data-icon="inline-start" />
                  Copy code
                </>
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
