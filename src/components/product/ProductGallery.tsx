"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const safeImages = images && images.length > 0 ? images : ["/images/luwia_combo.jpeg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const activeImage = safeImages[activeIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
      setIsZoomed(false);
    }
    if (isRightSwipe) {
      setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
      setIsZoomed(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Image */}
      <div
        className="relative w-full h-[400px] sm:h-[500px] md:h-[550px] rounded-2xl overflow-hidden bg-brand-bg cursor-zoom-in group"
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={activeImage}
          alt="Luwia product photo"
          fill
          className={`object-contain transition-transform duration-300 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : undefined}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-brand-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
            SKIN SCIENCE
          </span>
          <span className="bg-white/90 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
            NEW FORMULA
          </span>
        </div>

        {/* Image count badge (only when multiple) */}
        {safeImages.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur-sm">
            {activeIndex + 1} / {safeImages.length}
          </span>
        )}
      </div>

      {/* Thumbnail strip */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {safeImages.map((src, i) => (
            <button
              key={src}
              onClick={() => { setActiveIndex(i); setIsZoomed(false); }}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                i === activeIndex
                  ? "border-brand-primary shadow-brand"
                  : "border-gray-200 hover:border-brand-primary/40 opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`Product image ${i + 1}`}
                fill
                className="object-contain"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
