"use client";

import Link from "next/link";
import { useState } from "react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const infoLinks = [
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/terms", label: "Terms and Conditions" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="bg-brand-primary border-t border-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4">
          
          {/* Left Side: Community Join */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Join Our 10 Lakhs Trusted Customers Community
            </h2>
            <p className="mt-3 text-white/80 text-sm md:text-base">
              Get exclusive offers and early access to new launches.
            </p>

            {submitted ? (
              <div className="mt-8 py-4 px-6 bg-white/10 border border-white/20 rounded-xl text-white font-medium text-sm animate-fade-in-up backdrop-blur-sm">
                ✨ Thanks for joining! We&apos;ll keep you updated.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-5 py-3.5 rounded-full border border-white/20 bg-white/10 text-white placeholder:text-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 text-sm font-semibold text-brand-text bg-white rounded-full hover:bg-gray-50 transition-colors shadow-sm shrink-0"
                >
                  Join Now
                </button>
              </form>
            )}
          </div>

          {/* Right Side: Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 lg:pt-0 lg:pl-12">
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-white/80 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Information
              </h3>
              <ul className="space-y-2">
                {infoLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-white/80 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Follow Us
              </h3>
              <a
                href="https://www.instagram.com/getluwia.in?igsh=MTVoOXZwZTk1YzBuZw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/80 hover:text-white transition-colors duration-200"
              >
                <InstagramIcon className="w-5 h-5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-xs text-white/70 mt-1">Kottayam, Kerala, India</p>
          <p className="text-xs text-white/60 mt-4">
            © {new Date().getFullYear()} LUWIA SKIN SCIENCE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
