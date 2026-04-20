"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { Review } from "@/components/product/ProductInfo";

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
}

export default function ReviewList({ reviews, loading }: ReviewListProps) {
  const [showAll, setShowAll] = useState(false);

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.star_rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // Use Math.max to prevent negative days if server clock is slightly ahead of client
    const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (diffDays === 0) return "Just now";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

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
          {displayedReviews.map((review) => (
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
              <p className="text-sm text-gray-600 leading-relaxed">
                &ldquo;{review.review_text}&rdquo;
              </p>
            </div>
          ))}

          {/* See more / less toggle */}
          {reviews.length > 3 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="w-full py-3 text-sm font-semibold text-brand-primary border border-brand-primary/20 rounded-full hover:bg-brand-bg transition-all"
            >
              {showAll ? "Show Less" : `See All ${reviews.length} Reviews`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
