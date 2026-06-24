import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server-ssr";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful auth — redirect to the intended page
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If no code or exchange failed, redirect to home with an error indicator
  return NextResponse.redirect(`${origin}/?auth_error=true`);
}
