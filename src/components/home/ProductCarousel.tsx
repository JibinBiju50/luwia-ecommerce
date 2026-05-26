"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { PRODUCTS, type Product } from "@/lib/products";

interface ProductCarouselProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductCarousel({
  products = PRODUCTS,
  title = "Our Best Sellers",
  subtitle = "Choose the perfect formulation for your skin type."
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Use a small buffer (e.g. 5px) to account for rounding errors
      setIsAtStart(scrollLeft <= 5);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    }
  };

  useEffect(() => {
    // Initial check and setup resize listener
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      // scroll roughly one card width
      const scrollAmount = window.innerWidth * 0.8; 
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div 
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 md:gap-6 pb-6 hide-scrollbar lg:justify-center"
        >
          {products.map((product) => (
            <div 
              key={product.id}
              className="w-[80vw] sm:w-[40vw] md:w-[30vw] lg:w-[300px] shrink-0 snap-center flex"
            >
              <div className="w-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows for small/medium screens */}
        <div className="flex lg:hidden items-center justify-center gap-4 mt-2">
          <button
            onClick={() => scroll("left")}
            disabled={isAtStart}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
              isAtStart
                ? "bg-brand-light/10 text-brand-primary/40 cursor-not-allowed opacity-50"
                : "bg-brand-light/20 text-brand-primary hover:bg-brand-primary hover:text-white active:bg-brand-primary active:text-white active:shadow-[0_0_15px_rgba(30,58,138,0.6)] cursor-pointer"
            }`}
            aria-label="Previous product"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={isAtEnd}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
              isAtEnd
                ? "bg-brand-light/10 text-brand-primary/40 cursor-not-allowed opacity-50"
                : "bg-brand-light/20 text-brand-primary hover:bg-brand-primary hover:text-white active:bg-brand-primary active:text-white active:shadow-[0_0_15px_rgba(30,58,138,0.6)] cursor-pointer"
            }`}
            aria-label="Next product"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
