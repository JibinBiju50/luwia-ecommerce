"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function SalesBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 35, seconds: 0 });

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
    <div className="flex flex-col w-full relative z-[60]">

      {/* Existing Banner */}
      <div className="relative bg-gradient-to-r from-brand-dark via-brand-primary to-brand-dark text-white shadow-[0_0_35px_rgba(139,143,191,1)] font-nunito">
        <div className="max-w-7xl mx-auto px-2 py-2 md:py-3 flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
          <span className="font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] text-md sm:text-lg tracking-wide">
            FLAT 24% OFF
          </span>
          <span className="font-edu text-[#FFE400] text-md sm:text-xl">
            +Free Shipping Ends In
          </span>
          
          <div className="flex items-center gap-1.5 ml-1">
            <div className="bg-white rounded flex flex-col items-center justify-center px-1.5 py-1 min-w-[36px] sm:min-w-[42px] shadow-sm">
              <span className="text-[#F43F5E] text-sm sm:text-lg font-black leading-none">{pad(timeLeft.hours)}</span>
              <span className="text-black text-[7px] sm:text-[8px] font-bold tracking-wider mt-1 uppercase">Hour</span>
            </div>
            
            <div className="bg-white rounded flex flex-col items-center justify-center px-1.5 py-1 min-w-[36px] sm:min-w-[42px] shadow-sm">
              <span className="text-[#F43F5E] text-sm sm:text-lg font-black leading-none">{pad(timeLeft.minutes)}</span>
              <span className="text-black text-[7px] sm:text-[8px] font-bold tracking-wider mt-1 uppercase">Minutes</span>
            </div>
            
            <div className="bg-white rounded flex flex-col items-center justify-center px-1.5 py-1 min-w-[36px] sm:min-w-[42px] shadow-sm">
              <span className="text-[#F43F5E] text-sm sm:text-lg font-black leading-none">{pad(timeLeft.seconds)}</span>
              <span className="text-black text-[7px] sm:text-[8px] font-bold tracking-wider mt-1 uppercase">Second</span>
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
    </div>
  );
}
