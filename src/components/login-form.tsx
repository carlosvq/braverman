"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOGO_WIDTH = 164;
const LOGO_HEIGHT = 39;
const LOGO_FILTER =
  "brightness(0) saturate(100%) invert(13%) sepia(18%) saturate(1048%) hue-rotate(152deg) brightness(95%) contrast(95%)";

type LoginVariant = "coach" | "participant";

const COPY: Record<
  LoginVariant,
  {
    title: string;
    description: string;
    secretLabel: string;
    secretPlaceholder: string;
    secretAutoComplete: string;
    submitLabel: string;
    otherHref: string;
  }
> = {
  coach: {
    title: "Coach sign in",
    description: "Sign in with the email and password for your coach account.",
    secretLabel: "Password",
    secretPlaceholder: "Password",
    secretAutoComplete: "current-password",
    submitLabel: "Sign in",
    otherHref: "/new",
  },
  participant: {
    title: "Participant sign in",
    description:
      "Use the email your coach invited and the 6-digit invite code they shared with you.",
    secretLabel: "Invite code",
    secretPlaceholder: "6-digit code",
    secretAutoComplete: "one-time-code",
    submitLabel: "Continue",
    otherHref: "/coach/login",
  },
};

export function LoginForm({ variant }: { variant: LoginVariant }) {
  const router = useRouter();
  const copy = COPY[variant];
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSecret = secret.trim();

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!trimmedSecret) {
      setError(
        variant === "coach"
          ? "Enter your password."
          : "Enter your 6-digit invite code."
      );
      return;
    }
    if (variant === "participant" && !/^\d{6}$/.test(trimmedSecret)) {
      setError("Invite codes are 6 digits.");
      return;
    }

    setPending(true);
    try {
      const supabase = createClient();
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedSecret,
        });

      if (signInError) {
        setError(
          signInError.message.toLowerCase().includes("invalid")
            ? variant === "coach"
              ? "Invalid email or password."
              : "Invalid email or invite code."
            : signInError.message
        );
        return;
      }

      let role = data.user?.app_metadata?.role as string | undefined;
      if (!role && data.user?.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();
        role = profile?.role ?? role;
      }

      if (variant === "coach" && role !== "coach") {
        await supabase.auth.signOut();
        setError("This account is not a coach. Use participant sign in.");
        return;
      }

      if (variant === "participant" && role === "coach") {
        await supabase.auth.signOut();
        setError("Coaches sign in on the coach page.");
        return;
      }

      router.replace(role === "coach" ? "/dashboard" : "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6">
      <div className="mb-8 flex justify-center">
        <Image
          src="/logo.svg"
          alt="PARC"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority
          className="h-6 w-auto"
          style={{
            maxWidth: `${LOGO_WIDTH}px`,
            filter: LOGO_FILTER,
          }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="contents">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secret">{copy.secretLabel}</Label>
              <Input
                id="secret"
                type={variant === "coach" ? "password" : "text"}
                inputMode={variant === "participant" ? "numeric" : undefined}
                autoComplete={copy.secretAutoComplete}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder={copy.secretPlaceholder}
                maxLength={variant === "participant" ? 6 : undefined}
                required
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={pending}
            >
              {pending ? "Signing in…" : copy.submitLabel}
              {!pending ? <ArrowRight data-icon="inline-end" /> : null}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
