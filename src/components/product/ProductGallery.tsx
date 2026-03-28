"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  image: string;
}

export default function ProductGallery({ image }: ProductGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="w-full">
      {/* Main Image */}
      <div
        className="relative w-full h-[400px] sm:h-[500px] md:h-[550px] rounded-2xl overflow-hidden bg-brand-bg cursor-zoom-in group"
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <Image
          src={image}
          alt="Luwia Pearl Radiance Cream"
          fill
          className={`object-cover transition-transform duration-300 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          style={
            isZoomed
              ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
              : undefined
          }
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
      </div>
    </div>
  );
}
