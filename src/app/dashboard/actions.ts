"use server";

import { randomInt } from "crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireCoach } from "@/lib/auth";

export type InviteResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateInviteCode(): string {
  return String(randomInt(100000, 1000000));
}

export async function inviteParticipant(
  formData: FormData
): Promise<InviteResult> {
  await requireCoach();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const fullName = String(formData.get("fullName") ?? "").trim();

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const code = generateInviteCode();

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: code,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
      app_metadata: {
        role: "participant",
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!data.user) {
      return { ok: false, error: "Invite failed — no user returned." };
    }

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: data.user.id,
        email,
        full_name: fullName,
        role: "participant",
        invited_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (profileError) {
      return { ok: false, error: profileError.message };
    }

    revalidatePath("/dashboard");
    return { ok: true, code };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Invite failed.",
    };
  }
}
