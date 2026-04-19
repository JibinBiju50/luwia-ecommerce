"use client";

import { useRef, useState, useCallback } from "react";

export default function CustomerVideos() {
  const videoScrollRef = useRef<HTMLDivElement>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const videos = [
    "/videos/video_1.mp4",
    "/videos/video_2.mp4",
    "/videos/video_3.mp4",
    "/videos/video_4.mp4",
    "/videos/video_5.mp4",
    "/videos/video_6.mp4",
  ];

  const scrollToVideoIndex = useCallback(
    (index: number) => {
      const el = videoScrollRef.current;
      if (!el) return;
      const child = el.children[index] as HTMLElement;
      if (!child) return;
      el.scrollTo({ left: child.offsetLeft - 16, behavior: "smooth" });
      setActiveVideoIndex(index);
    },
    []
  );

  const handleVideoScroll = () => {
    const el = videoScrollRef.current;
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
    setActiveVideoIndex(closest);
  };

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h3 className="inline-block bg-brand-primary text-white px-5 py-2 rounded-full text-sm font-bold tracking-wider shadow-md mb-2">
          WATCH AND BUY
        </h3>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 group">
        <div
          ref={videoScrollRef}
          onScroll={handleVideoScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6"
        >
          {videos.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="flex-shrink-0 w-[60vw] sm:w-[35vw] md:w-[25vw] lg:w-[18vw] relative rounded-2xl overflow-hidden shadow-brand snap-start"
            >
              <div className="relative w-full flex items-center justify-center rounded-2xl">
                <video
                  src={src}
                  className="w-full h-auto rounded-2xl"
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {videos.map((_, i) => (
          <button
            key={`video-dot-${i}`}
            onClick={() => scrollToVideoIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === activeVideoIndex
                ? "bg-brand-primary w-6"
                : "bg-brand-primary/30 hover:bg-brand-primary/50"
            }`}
            aria-label={`Go to video ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
