"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function SalesBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 });

  useEffect(() => {
    // Check if banner was dismissed in this session
    const wasDismissed = sessionStorage.getItem("luwia-sale-banner-dismissed");
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) {
          // Reset to a new cycle
          return { hours: 23, minutes: 59, seconds: 59 };
        }
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("luwia-sale-banner-dismissed", "true");
  };

  if (dismissed) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="relative bg-gradient-to-r from-brand-dark via-brand-primary to-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-xs sm:text-sm">
        <span className="font-medium">Hurry Up</span>
        <span className="text-white/60">•</span>
        <span className="text-white/90">Sale ends in</span>
        <div className="flex items-center gap-1 font-mono font-bold">
          <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(timeLeft.hours)}</span>
          <span className="text-white/60">:</span>
          <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(timeLeft.minutes)}</span>
          <span className="text-white/60">:</span>
          <span className="bg-white/20 rounded px-1.5 py-0.5">{pad(timeLeft.seconds)}</span>
        </div>
        <Link
          href="/product"
          className="ml-2 bg-white text-brand-primary px-4 py-1 rounded-full text-xs font-semibold hover:bg-white/90 transition-colors"
        >
          Shop Now
        </Link>
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors"
          aria-label="Dismiss sale banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
