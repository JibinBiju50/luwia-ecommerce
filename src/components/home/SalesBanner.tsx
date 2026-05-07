"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function SalesBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 });

  useEffect(() => {

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
  };

  if (dismissed) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="relative bg-gradient-to-r from-brand-dark via-brand-primary to-brand-dark text-white shadow-[0_0_35px_rgba(139,143,191,1)] z-40 font-serif">
      <div className="max-w-7xl mx-auto px-8 py-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base font-bold tracking-wide">
        <span className="font-black italic uppercase tracking-widest text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,1)] animate-pulse text-lg sm:text-xl">
          Upto 20% Offer
        </span>
        <span className="text-white/60 hidden sm:inline">•</span>
        <div className="flex items-center gap-2">
          <span className="text-white/95">Hurry Up! Sale ends in</span>
          <div className="flex items-center gap-1 font-mono font-bold text-base sm:text-lg">
            <span className="bg-white/20 rounded px-2 py-0.5 shadow-inner">{pad(timeLeft.hours)}</span>
            <span className="text-white/80">:</span>
            <span className="bg-white/20 rounded px-2 py-0.5 shadow-inner">{pad(timeLeft.minutes)}</span>
            <span className="text-white/80">:</span>
            <span className="bg-white/20 rounded px-2 py-0.5 shadow-inner">{pad(timeLeft.seconds)}</span>
          </div>
        </div>
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
