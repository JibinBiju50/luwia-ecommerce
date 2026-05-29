"use client";

import { useState } from "react";
import { Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { Review } from "@/components/product/ProductInfo";

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
}

interface LightboxState {
  urls: string[];
  index: number;
}

export default function ReviewList({ reviews, loading }: ReviewListProps) {
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.star_rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  // Sort: text+media first → text only → rating only
  const sortedReviews = [...reviews].sort((a, b) => {
    const weight = (r: Review) => {
      const hasText = r.review_text?.trim().length > 0;
      const hasMedia = r.image_urls && r.image_urls.length > 0;
      if (hasText && hasMedia) return 0;
      if (hasText) return 1;
      return 2;
    };
    return weight(a) - weight(b);
  });

  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (diffDays === 0) return "Just now";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const openLightbox = (urls: string[], index: number) => {
    setLightbox({ urls, index });
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightbox(null);
    document.body.style.overflow = "";
  };

  const prevImage = () =>
    setLightbox((lb) => lb && { ...lb, index: (lb.index - 1 + lb.urls.length) % lb.urls.length });

  const nextImage = () =>
    setLightbox((lb) => lb && { ...lb, index: (lb.index + 1) % lb.urls.length });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-brand-text">
          Real Reviews
        </h2>
        <span className="text-sm text-brand-primary font-medium">
          {reviews.length} Review{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Average Rating */}
      <div className="text-center py-6 bg-brand-bg/30 rounded-2xl">
        <div className="text-4xl font-bold text-brand-text">{avgRating}</div>
        <div className="text-xs text-gray-400 mb-2">/5</div>
        <div className="flex items-center justify-center gap-0.5 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= Math.round(Number(avgRating))
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500">Highest Rated Moisturizer 2026</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">
          Based on verified clinical trials
        </p>
      </div>

      {/* Submitted Reviews */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReviews.map((review) => {
            const hasImages = review.image_urls && review.image_urls.length > 0;
            return (
              <div
                key={review.id}
                className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-sm font-semibold text-brand-primary">
                      {review.reviewer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-text">
                        {review.reviewer_name}
                      </p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.star_rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-brand-primary bg-brand-bg px-2 py-0.5 rounded-full">
                    VERIFIED
                  </span>
                </div>

                {review.review_text?.trim() && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    &ldquo;{review.review_text}&rdquo;
                  </p>
                )}

                {/* Review images */}
                {hasImages && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {review.image_urls.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => openLightbox(review.image_urls, idx)}
                        className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                        aria-label={`View photo ${idx + 1}`}
                      >
                        <Image
                          src={url}
                          alt={`Review photo ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* See more / less toggle */}
          {sortedReviews.length > 3 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="w-full py-3 text-sm font-semibold text-brand-primary border border-brand-primary/20 rounded-full hover:bg-brand-bg transition-all"
            >
              {showAll ? "Show Less" : `See All ${sortedReviews.length} Reviews`}
            </button>
          )}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          {lightbox.urls.length > 1 && (
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-white/70 bg-black/40 px-3 py-1 rounded-full">
              {lightbox.index + 1} / {lightbox.urls.length}
            </span>
          )}

          {/* Prev */}
          {lightbox.urls.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.urls[lightbox.index]}
              alt="Review photo"
              width={900}
              height={900}
              className="object-contain max-h-[85vh] w-auto"
              priority
            />
          </div>

          {/* Next */}
          {lightbox.urls.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
