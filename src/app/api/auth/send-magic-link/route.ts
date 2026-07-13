import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const resend = new Resend(process.env.RESEND_API_KEY);

// Sliding window rate limiter — persists in Redis across all serverless instances
// 3 magic link requests per email per 10 minutes
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "10 m"),
  analytics: true,
  prefix: "luwia:magic-link",
});

export async function POST(request: NextRequest) {
  try {
    const { email, next = "/" } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check rate limit — keyed per email address
    const { success, limit, remaining, reset } = await ratelimit.limit(normalizedEmail);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes before trying again." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": new Date(reset).toISOString(),
          },
        }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: normalizedEmail,
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error || !data?.properties?.hashed_token) {
      console.error("Magic link generation error:", error);
      return NextResponse.json({ error: "Failed to generate magic link" }, { status: 500 });
    }

    // Build a direct link to OUR callback with token_hash as a query param.
    // We do NOT use Supabase's action_link because it redirects through
    // Supabase's server, which puts tokens in a hash fragment (#access_token=...)
    // that is invisible to our server-side route handler.
    const magicLink = `${siteUrl}/auth/callback?token_hash=${encodeURIComponent(data.properties.hashed_token)}&type=magiclink&next=${encodeURIComponent(next)}`;

    const { error: emailError } = await resend.emails.send({
      from: "Luwia Skin Science <noreply@luwia.in>",
      to: email,
      subject: "Your sign-in link for Luwia ✨",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #F8F7FC;">
          <div style="background: white; border-radius: 16px; padding: 40px 32px; box-shadow: 0 2px 8px rgba(139,143,191,0.12);">
            <h1 style="color: #1A1A2E; font-size: 22px; font-weight: 700; margin: 0 0 8px;">Sign in to Luwia ✨</h1>
            <p style="color: #6B7280; font-size: 14px; margin: 0 0 32px; line-height: 1.6;">
              Click the button below to securely sign in. This link expires in 1 hour and can only be used once.
            </p>
            <a href="${magicLink}"
               style="display: inline-block; background: linear-gradient(135deg, #1E3A8A 0%, #172554 100%); color: white; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 50px;">
              Sign In to Luwia →
            </a>
            <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px; line-height: 1.6;">
              If you didn't request this, you can safely ignore this email.<br/>
              This link will expire in 1 hour.
            </p>
            <hr style="border: none; border-top: 1px solid #F3F4F6; margin: 28px 0;" />
            <p style="color: #1E3A8A; font-size: 13px; font-weight: 600; margin: 0;">
              Luwia Skin Science — Glow confidently. ✨
            </p>
          </div>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend email error:", emailError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("send-magic-link error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
