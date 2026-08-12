"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function FloatingVideo() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  useEffect(() => {
    if (isDismissed) return;

    // Show video after a 4-second delay to prevent impacting initial page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only allow drag with primary button
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragRef.current) return;
    
    // Prevent default touch actions like scrolling while dragging
    e.preventDefault();

    const dx = e.clientX - dragRef.current.startX;
    // Note: y coordinates in browser go from top (0) to bottom (max).
    // Our position.y is from the bottom (like CSS bottom property).
    // So if clientY increases (moving down), we want position.y to decrease.
    const dy = e.clientY - dragRef.current.startY;
    
    setPosition({
      x: dragRef.current.initialX + dx,
      y: dragRef.current.initialY - dy, // subtract dy because position is relative to bottom
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: `${position.x}px`,
        bottom: `${position.y}px`,
        zIndex: 100,
        touchAction: "none",
      }}
      className="w-28 sm:w-40 md:w-48 lg:w-56 xl:w-64 shadow-2xl rounded-xl overflow-hidden bg-black ring-2 ring-brand-primary/20 transition-opacity duration-300 cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-black/60 to-transparent z-10 flex justify-end p-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-white hover:text-red-400 p-1.5 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md transition-colors"
          aria-label="Close video"
        >
          <X size={14} />
        </button>
      </div>
      <video
        src="/videos/video_7.mp4"
        className="w-full h-auto pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
