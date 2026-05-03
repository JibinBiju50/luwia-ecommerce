"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Luwia Night Cream?",
    answer: "Luwia is a daily night repair cream for both men and women designed to hydrate, repair, and gradually brighten your skin while you sleep."
  },
  {
    question: "What makes Luwia effective?",
    answer: `Luwia is powered by proven ingredients:
• Niacinamide → improves texture & reduces dullness
• Licorice Extract → brightens and evens skin tone
• Kojic Acid → targets pigmentation & dark spots
• Shea Butter → deeply hydrates & repairs skin barrier

👉 Together, they work on hydration + repair + brightening.`
  },
  {
    question: "How do I use it?",
    answer: `Simple night routine:
1. Wash your face before sleep
2. Apply a small amount of Luwia evenly
3. Leave overnight

Morning:
Wash your face + apply sunscreen (very important)`
  },
  {
    question: "How long does it take to see results?",
    answer: `• Within 1 week: skin feels softer, more hydrated
• 2–3 weeks: smoother texture
• 3–4 weeks: visible brightening and even tone

👉 Results improve with consistent use.`
  },
  {
    question: "Is it suitable for men and women?",
    answer: "Yes — Luwia is unisex and works for all skin types."
  },
  {
    question: "Will it make my skin oily or sticky?",
    answer: "No — Luwia has a rich but non-greasy texture that absorbs well without leaving heaviness."
  },
  {
    question: "Can I use it every night?",
    answer: "Yes, it is safe for daily nighttime use."
  },
  {
    question: "Do I need to use sunscreen?",
    answer: "Yes (very important). Since Luwia works on brightening and repair, using sunscreen in the morning helps protect your results."
  },
  {
    question: "Does it help with dark spots and uneven skin tone?",
    answer: `Yes — ingredients like Kojic Acid, Niacinamide, and Licorice help reduce:
• dark spots
• uneven tone
• dullness over time`
  },
  {
    question: "Is it safe for sensitive skin?",
    answer: "Luwia is formulated to be gentle, but if you have sensitive skin, we recommend doing a patch test before full use."
  },
  {
    question: "Is this an instant fairness cream?",
    answer: "No. Luwia focuses on improving skin health first, which leads to natural, long-lasting brightness."
  }
];

export default function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-text mb-2">
          💎 LUWIA NIGHT CREAM – FAQ
        </h2>
        <p className="text-gray-500 text-sm">
          Everything you need to know about your new night routine.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors"
            >
              <h3 className="text-sm md:text-base font-semibold text-brand-text pr-4">
                ❓ {faq.question}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed whitespace-pre-line pl-11">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
