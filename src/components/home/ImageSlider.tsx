"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  speed?: number;
  height?: string;
  objectFit?: "cover" | "contain";
}

export default function ImageSlider({
  images,
  height = "h-[450px] md:h-[600px]",
  objectFit = "cover",
}: ImageSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const handlePrev = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

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
    <section className="relative w-full group">
      {/* Scrollable container — full width, no padding */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={`flex-shrink-0 w-full ${height} relative snap-start`}
          >
            <Image
              src={src}
              alt={`Product showcase ${i + 1}`}
              fill
              className={`object-${objectFit}`}
              sizes="100vw"
            />
          </div>
        ))}
      </div>


      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeIndex
                  ? "bg-white/40 w-6"
                  : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
