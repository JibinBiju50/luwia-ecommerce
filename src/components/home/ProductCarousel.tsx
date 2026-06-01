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
    <section className="py-4 md:py-6 bg-white overflow-hidden">
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
              className="w-[calc(50vw-1.5rem)] sm:w-[280px] lg:w-[300px] shrink-0 snap-start sm:snap-center flex"
            >
              <div className="w-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
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
