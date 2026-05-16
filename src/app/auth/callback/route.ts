import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Supabase sends error params directly when OAuth fails on its end
  const supabaseError = searchParams.get("error");
  const supabaseErrorDesc = searchParams.get("error_description");

  const redirectTo = next.startsWith("/") ? `${origin}${next}` : origin;

  if (supabaseError) {
    console.error("Supabase OAuth error:", supabaseError, supabaseErrorDesc);
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(supabaseError)}`);
  }

  if (!code) {
    return NextResponse.redirect(redirectTo);
  }

  // Exchange the auth code for a session
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback exchange error:", error.message);
    return NextResponse.redirect(`${origin}/?auth_error=exchange_failed`);
  }

  // Redirect back; the client-side AuthContext listener picks up the session
  return NextResponse.redirect(redirectTo);
}
