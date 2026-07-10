"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const safeImages = images && images.length > 0 ? images : ["/images/luwia_combo.jpeg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => Math.min(safeImages.length - 1, prev + 1));
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
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Image */}
      <div
        className="relative w-full h-[300px] sm:h-[500px] md:h-[550px] rounded-2xl overflow-hidden bg-brand-bg cursor-zoom-in group"
        onClick={() => setIsLightboxOpen(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {safeImages.map((src, i) => (
            <div key={src} className="relative w-full h-full flex-shrink-0">
              <Image
                src={src}
                alt={`Luwia product photo ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300"
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>


        {/* Navigation Arrows */}
        {safeImages.length > 1 && (
          <>
            {activeIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}
            {activeIndex < safeImages.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}
          </>
        )}

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
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-12 h-12 object-cover rounded-xl overflow-hidden border-2 transition-all duration-200 ${
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

      {/* Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-2 z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div 
            className="relative w-full max-w-5xl h-full max-h-[85vh] cursor-default" 
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={safeImages[activeIndex]}
              alt={`Luwia product photo zoomed`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Lightbox Navigation Arrows */}
          {safeImages.length > 1 && (
            <>
              {activeIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all z-[110]"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              )}
              {activeIndex < safeImages.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all z-[110]"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
