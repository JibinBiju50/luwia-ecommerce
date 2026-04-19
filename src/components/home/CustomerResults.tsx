"use client";

import Image from "next/image";
import { PRODUCT } from "@/lib/product";
import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomerResults() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = PRODUCT.reviewImages;

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const child = el.children[index] as HTMLElement;
      if (!child) return;
      el.scrollTo({ left: child.offsetLeft - 16, behavior: "smooth" });
      setActiveIndex(index);
    },
    []
  );



  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const children = Array.from(el.children) as HTMLElement[];
    let closest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft - 16 - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };



  return (
    <section className="py-8 md:py-12 bg-brand-bg/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-text">
          Real Customer Results
        </h2>
        <p className="text-center text-gray-500 mt-3 max-w-lg mx-auto">
          See the transformation our customers experience with consistent use of Luwia Cream.
        </p>
      </div>

      {/* Manual Swipe Carousel */}
      <div className="relative max-w-7xl mx-auto px-4 group">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6"
        >
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="flex-shrink-0 w-[85vw] sm:w-[50vw] md:w-[35vw] lg:w-[25vw] relative rounded-2xl overflow-hidden shadow-brand snap-start"
            >
              <div className="relative h-[350px] md:h-[420px]">
                <Image
                  src={src}
                  alt={`Customer result ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 85vw, (max-width: 768px) 50vw, (max-width: 1024px) 35vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === activeIndex
                ? "bg-brand-primary w-6"
                : "bg-brand-primary/30 hover:bg-brand-primary/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>



      {/* CTA overlay text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
        <div className="inline-block bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-brand border border-brand-primary/10">
          <h3 className="text-xl md:text-2xl font-bold text-brand-text">
            Get Glass Skin with Luwia
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Pure care. Visible glow. Powered by Luwia.
          </p>
        </div>
      </div>
    </section>
  );
}
