"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PRODUCT } from "@/lib/product";

type Section = "science" | "results" | "ingredients";

export default function ProductDescription() {
  const [openSection, setOpenSection] = useState<Section | null>("science");

  const toggle = (section: Section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="space-y-4">
      {/* The Science Behind It */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <button
          onClick={() => toggle("science")}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors"
        >
          <h2 className="text-base md:text-lg font-semibold text-brand-text">
            The Science Behind It
          </h2>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              openSection === "science" ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSection === "science" ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {PRODUCT.description}
          </div>
        </div>
      </div>

      {/* Visible Results */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <button
          onClick={() => toggle("results")}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors"
        >
          <h2 className="text-base md:text-lg font-semibold text-brand-text">
            Visible Results
          </h2>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              openSection === "results" ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSection === "results" ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-5 space-y-3">
            {PRODUCT.visibleResults.map((result) => (
              <div
                key={result.stat}
                className="flex items-center gap-4 bg-brand-bg/50 rounded-xl px-5 py-4"
              >
                <span className="text-lg font-bold text-brand-primary min-w-[60px]">
                  {result.stat}
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-text">
                    {result.title}
                  </p>
                  <p className="text-xs text-gray-500">{result.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Ingredients */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <button
          onClick={() => toggle("ingredients")}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors"
        >
          <h2 className="text-base md:text-lg font-semibold text-brand-text">
            Clean Ingredients
          </h2>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              openSection === "ingredients" ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSection === "ingredients" ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-5 space-y-4">
            {PRODUCT.ingredients.map((ingredient) => (
              <div key={ingredient.name}>
                <h3 className="text-sm font-semibold text-brand-text">
                  {ingredient.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {ingredient.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
