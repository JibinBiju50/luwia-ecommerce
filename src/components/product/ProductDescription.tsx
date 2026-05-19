"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/lib/products";

type Section = "science" | "results" | "ingredients";

interface ProductDescriptionProps {
  product: Product;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
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
          <div className="px-4 pb-5 text-xs md:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
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
            {product.visibleResults.map((result) => (
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
            openSection === "ingredients" ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.ingredients.map((ingredient) => (
              <div 
                key={ingredient.name}
                className="bg-brand-bg/30 border border-brand-primary/10 rounded-xl p-4 hover:shadow-sm hover:border-brand-primary/20 transition-all duration-300"
              >
                <h3 className="text-sm font-semibold text-brand-text flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  {ingredient.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed pl-3.5">
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
