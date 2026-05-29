"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function InstagramFeed() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const images = [
    "/images/cream_vertical_1.jpg",
    "/images/cream_vertical_2.jpg",
    "/images/cream_vertical_3.jpg",
    "/images/cream_vertical_4.jpg",
  ];

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-text mb-2">
          Follow Us On Instagram
        </h2>
        <p className="text-sm text-gray-500">
          Tag us <span className="font-semibold text-pink-500">@getluwia.In</span> to get featured
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto no-scrollbar pb-6 select-none ${
            isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory"
          }`}
        >
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="flex-shrink-0 h-[320px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative overflow-hidden shadow-sm snap-start group"
            >
              <Image
                src={src}
                alt={`Instagram post ${i + 1}`}
                width={800}
                height={1200}
                className="h-full w-auto object-contain pointer-events-none transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
