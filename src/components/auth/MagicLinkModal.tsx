"use client";

import { useEffect, useRef, useState } from "react";
import { X, Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DISMISSED_KEY = "luwia-auth-modal-dismissed";

interface MagicLinkModalProps {
  /** The URL to return the user to after sign-in (current product page path). */
  returnPath: string;
}

export default function MagicLinkModal({ returnPath }: MagicLinkModalProps) {
  const { user, showMagicLinkModal, openMagicLinkModal, closeMagicLinkModal } =
    useAuth();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 20-second auto-trigger (once per session, suppressed if already dismissed)
  useEffect(() => {
    if (user) return; // already signed in — never show
    if (typeof window === "undefined") return;

    const wasDismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (wasDismissed) return;

    timerRef.current = setTimeout(() => {
      openMagicLinkModal();
    }, 20_000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, openMagicLinkModal]);

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    closeMagicLinkModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, next: returnPath }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (!showMagicLinkModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Bottom sheet on mobile, centered card on desktop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to Luwia"
        className="fixed z-[70] bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md w-full"
      >
        <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl px-6 pt-6 pb-8 md:p-8 relative">
          {/* Drag handle (mobile only) */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 md:hidden" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {status !== "sent" ? (
            <>
              {/* Header */}
              <div className="mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "linear-gradient(135deg, #8B8FBF 0%, #6B6FA8 100%)" }}>
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 leading-snug">
                  Get exclusive offers &amp; track orders
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your email — we&apos;ll send a one-click sign-in link. No password needed.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    id="magic-link-email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all bg-gray-50 focus:bg-white"
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-500 px-1">{errorMsg}</p>
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

              {/* Guest option */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleDismiss}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
                >
                  Continue as guest
                </button>
              </div>
            </>
          ) : (
            /* Success state */
            <div className="py-4 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Check your inbox!
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                We sent a sign-in link to{" "}
                <span className="font-medium text-gray-700">{email}</span>.
                Click the link to sign in — it expires in 1 hour.
              </p>
              <button
                onClick={closeMagicLinkModal}
                className="mt-5 text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
              >
                Got it, close this
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
