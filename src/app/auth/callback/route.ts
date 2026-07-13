import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server-ssr";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  const supabase = await createSupabaseServerClient();

  // OAuth PKCE flow (Google sign-in) — exchange auth code for session
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Magic link flow — verify the token hash directly
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as "magiclink" | "email",
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If no valid params or verification failed, redirect with error
  return NextResponse.redirect(`${origin}/?auth_error=true`);
}
