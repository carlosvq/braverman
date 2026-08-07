import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export type AppRole = "coach" | "participant";

function roleFromClaims(claims: Record<string, unknown> | undefined): AppRole | null {
  const appMetadata = claims?.app_metadata;
  if (!appMetadata || typeof appMetadata !== "object") return null;
  const role = (appMetadata as { role?: unknown }).role;
  if (role === "coach" || role === "participant") return role;
  return null;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and getClaims().
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims as Record<string, unknown> | undefined;
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  let role = roleFromClaims(claims);

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname === "/new" || pathname === "/coach/login";
  const isDashboard = pathname.startsWith("/dashboard");

  if (!userId && !isAuthPage) {
    const url = request.nextUrl.clone();
    // Send people toward the login that matches where they were going.
    url.pathname = isDashboard ? "/coach/login" : "/new";
    return NextResponse.redirect(url);
  }

  // Fall back to profiles.role when JWT app_metadata is missing/stale.
  if (userId && !role && (isAuthPage || isDashboard)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    if (profile?.role === "coach" || profile?.role === "participant") {
      role = profile.role;
    }
  }

  if (userId && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = role === "coach" ? "/dashboard" : "/";
    return NextResponse.redirect(url);
  }

  if (userId && isDashboard && role !== "coach") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
