"use server";

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const session = await getSessionUser();
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(session?.role === "coach" ? "/coach/login" : "/new");
}
