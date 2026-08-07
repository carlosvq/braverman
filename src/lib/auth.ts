import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/supabase/proxy";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
  created_at: string;
  invited_at: string;
};

function roleFromAppMetadata(appMetadata: unknown): AppRole | null {
  if (!appMetadata || typeof appMetadata !== "object") return null;
  const role = (appMetadata as { role?: unknown }).role;
  if (role === "coach" || role === "participant") return role;
  return null;
}

export async function getSessionUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;

  const claims = data.claims as Record<string, unknown>;
  const id = claims.sub as string;
  const email = typeof claims.email === "string" ? claims.email : "";

  // Prefer JWT app_metadata; fall back to profiles.role (covers bootstrap lag).
  let role = roleFromAppMetadata(claims.app_metadata);
  if (!role) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", id)
      .maybeSingle();
    role = profile?.role === "coach" ? "coach" : "participant";
  }

  return { id, email, role };
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const session = await getSessionUser();
  if (!session) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, invited_at")
    .eq("id", session.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Profile;
}

export async function requireUser() {
  const session = await getSessionUser();
  if (!session) redirect("/new");
  return session;
}

export async function requireCoach() {
  const session = await getSessionUser();
  if (!session) redirect("/coach/login");
  if (session.role !== "coach") redirect("/");
  return session;
}
