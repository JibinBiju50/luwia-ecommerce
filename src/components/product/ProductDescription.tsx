"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/lib/products";

type Section = "science" | "results" | "benefits" | "safety";

interface ProductDescriptionProps {
  product: Product;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const [openSection, setOpenSection] = useState<Section | null>("science");

  const toggle = (section: Section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="border border-brand-primary/10 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
      {/* The Science Behind It */}
      <div className="border-b border-brand-primary/10">
        <button
          onClick={() => toggle("science")}
          className="group w-full flex items-center justify-between px-6 py-4 text-left hover:bg-brand-primary/5 transition-colors"
        >
          <h2 className="text-base md:text-lg font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
            Ingredients
          </h2>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-all duration-300 ${
              openSection === "science" ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSection === "science" ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-5 text-xs md:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>
      </div>

      {/* Visible Results */}
      <div className="border-b border-brand-primary/10">
        <button
          onClick={() => toggle("results")}
          className="group w-full flex items-center justify-between px-6 py-4 text-left hover:bg-brand-primary/5 transition-colors"
        >
          <h2 className="text-base md:text-lg font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
            How to use
          </h2>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-all duration-300 ${
              openSection === "results" ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSection === "results" ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-5 text-xs md:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.usage}
          </div>
        </div>
      </div>

      {/* Skin Benefits */}
      <div className="border-b border-brand-primary/10">
        <button
          onClick={() => toggle("benefits")}
          className="group w-full flex items-center justify-between px-6 py-4 text-left hover:bg-brand-primary/3 transition-colors"
        >
          <h2 className="text-base md:text-lg font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
            Skin Benefits
          </h2>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-all duration-300 ${
              openSection === "benefits" ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSection === "benefits" ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
            {[
              "Helps achieve a radiant glass-skin glow.",
              "Brightens dull and uneven skin tone.",
              "Helps fade pigmentation, tanning & acne marks.",
              "Deeply hydrates for soft, plump skin.",
              "Supports collagen for firmer-looking skin.",
              "Helps minimize the appearance of pores.",
              "Strengthens the skin barrier.",
              "Calms redness and irritation.",
              "Suitable for men & women.",
              "Suitable for all skin types."
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Standards */}
      <div>
        <button
          onClick={() => toggle("safety")}
          className="group w-full flex items-center justify-between px-6 py-4 text-left hover:bg-brand-primary/10 transition-colors"
        >
          <h2 className="text-base md:text-lg font-semibold text-brand-text group-hover:text-brand-primary transition-colors">
           Safety Standards
          </h2>
          <ChevronDown
            className={`w-5 h-5 text-brand-primary group-hover:text-brand-dark transition-all duration-300 ${
              openSection === "safety" ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSection === "safety" ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
            {[
              "Manufactured in a GMP-certified facility.",
              "Premium Dermatology-tested skincare formulation.",
              "Free from mercury / steroids / harsh bleaching agents.",
              "Suitable for daily nighttime use.",
              "Patch test before first use.",
              "For external use only.",
              "Avoid direct contact with eyes.",
              "Store in a cool, dry place away from direct sunlight."
            ].map((point, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-xs text-brand-text font-medium leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
