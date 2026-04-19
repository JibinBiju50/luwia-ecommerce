"use client";

import { useState } from "react";

export default function CommunityJoin() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // No backend for now — just show success
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="py-8 md:py-10 bg-gradient-to-b from-white to-brand-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
          Join Our 10 Lakhs Trusted Customers Community
        </h2>
        <p className="mt-3 text-gray-500 text-sm md:text-base">
          Get exclusive offers and early access to new launches.
        </p>

        {submitted ? (
          <div className="mt-8 py-4 px-6 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium text-sm animate-fade-in-up">
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
              className="flex-1 px-5 py-3.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
            />
            <button
              type="submit"
              className="px-8 py-3.5 text-sm font-semibold text-white gradient-brand rounded-full hover:opacity-90 transition-opacity shadow-brand"
            >
              Join Now
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
