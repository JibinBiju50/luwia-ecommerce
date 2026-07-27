"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export default function CustomerVideos() {
  const videoScrollRef = useRef<HTMLDivElement>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Drag to scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const isScrollable = scrollWidth > clientWidth;
    
    // Check if scrolled to the absolute right edge (with 5px buffer)
    const isAtEnd = isScrollable && scrollLeft + clientWidth >= scrollWidth - 5;
    const children = Array.from(el.children) as HTMLElement[];

    if (isAtEnd) {
      setActiveVideoIndex(children.length - 1);
      return;
    }

    // Find the video whose center is closest to the center of the visible area
    const viewportCenter = scrollLeft + clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    
    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(childCenter - viewportCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    
    setActiveVideoIndex(closest);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - videoScrollRef.current.offsetLeft);
    setScrollLeft(videoScrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !videoScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - videoScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll multiplier
    videoScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-2 md:py-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <h3 className="inline-block bg-brand-primary text-white px-5 py-2 rounded-full text-sm font-bold tracking-wider shadow-md mb-2">
          WATCH AND BUY
        </h3>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 group">
        <div
          ref={videoScrollRef}
          onScroll={handleVideoScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-4 overflow-x-auto no-scrollbar pb-6 select-none ${
            isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory"
          }`}
        >
          {videos.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="flex-shrink-0 w-[40vw] sm:w-[35vw] md:w-[25vw] lg:w-[18vw] aspect-[9/16] relative rounded-2xl overflow-hidden shadow-brand snap-start bg-brand-light/10"
            >
              <div className="relative w-full h-full flex items-center justify-center rounded-2xl">
                <LazyVideo src={src} isActive={i === activeVideoIndex} />
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

/**
 * LazyVideo — only loads the video when it scrolls into view.
 * Only plays the video if it is the currently active (centered) one to save memory on Android.
 */
function LazyVideo({ src, isActive }: { src: string; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasLoaded(true);
          observer.disconnect(); // Only need to load once
        }
      },
      { rootMargin: "300px" } // Start loading 300px before visible
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasLoaded) return;

    // On desktop, only play on hover. On mobile, play if active or hovered.
    const shouldPlay = isDesktop ? isHovered : (isActive || isHovered);

    if (shouldPlay) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, isHovered, hasLoaded, isDesktop]);

  return (
    <video
      ref={videoRef}
      src={hasLoaded ? src : undefined}
      className="w-full h-full object-cover rounded-2xl pointer-events-auto"
      muted
      loop
      playsInline
      preload="auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
}
