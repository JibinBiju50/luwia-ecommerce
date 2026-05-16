"use client";

import { useState } from "react";
import { X, Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase-client";

export default function AuthModal() {
  const { showAuthModal, closeAuthModal } = useAuth();

  const [view, setView] = useState<"main" | "magic-link">("main");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = () => {
    closeAuthModal();
    // Reset state for next open
    setTimeout(() => {
      setView("main");
      setEmail("");
      setStatus("idle");
      setErrorMsg("");
    }, 300);
  };

  const handleGoogleSignIn = async () => {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(
          window.location.pathname
        )}`,
      },
    });
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          next: window.location.pathname,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (!showAuthModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to Luwia"
        className="fixed z-[90] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 relative">
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Close sign-in modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo mark */}
          <div className="text-center mb-6">
            <div
              className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3"
              style={{ background: "linear-gradient(135deg, #8B8FBF 0%, #6B6FA8 100%)" }}
            >
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Welcome to Luwia
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to track orders &amp; get exclusive offers
            </p>
          </div>

          {view === "main" && status !== "sent" && (
            <div className="space-y-3">
              {/* Google OAuth */}
              <button
                id="auth-google-btn"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                {/* Google SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Magic link option */}
              <button
                id="auth-magic-link-btn"
                onClick={() => setView("magic-link")}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #8B8FBF 0%, #6B6FA8 100%)" }}
              >
                <Mail className="w-4 h-4" />
                Sign in with Email Link
              </button>

              <p className="text-center text-[11px] text-gray-400 pt-1">
                By signing in you agree to our{" "}
                <a href="/terms" className="underline hover:text-gray-600">
                  Terms
                </a>
              </p>
            </div>
          )}

          {view === "magic-link" && status !== "sent" && (
            <div>
              <button
                onClick={() => setView("main")}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-4"
              >
                ← Back
              </button>
              <h3 className="font-semibold text-gray-800 mb-1">
                Sign in with email
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                We&apos;ll send a one-click link to your inbox. No password needed.
              </p>
              <form onSubmit={handleMagicLinkSubmit} className="space-y-3">
                <input
                  id="auth-modal-email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all bg-gray-50 focus:bg-white"
                  autoComplete="email"
                  autoFocus
                />
                {status === "error" && (
                  <p className="text-xs text-red-500">{errorMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading" || !email}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #8B8FBF 0%, #6B6FA8 100%)" }}
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Send Sign-In Link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {status === "sent" && (
            <div className="text-center py-2">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Check your inbox!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Sign-in link sent to{" "}
                <span className="font-medium text-gray-700">{email}</span>.
                Click it to sign in.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
