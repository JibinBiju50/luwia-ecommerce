import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { createSupabaseServerClient } from "@/lib/supabase-server-ssr";

export async function GET(request: NextRequest) {
  try {
    // Verify the user's session via cookies (set by @supabase/ssr)
    const supabaseClient = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch orders for this email using the admin client (bypasses RLS)
    const { data: orders, error: dbError } = await supabaseAdmin
      .from("orders")
      .select(
        "id, created_at, amount_paid, payment_method, payment_status, quantity, items, customer_name"
      )
      .eq("email", user.email)
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error("Supabase query error:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders: orders ?? [] });
  } catch (error) {
    console.error("my-orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
