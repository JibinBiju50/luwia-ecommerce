"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";
import type { Review } from "@/components/product/ProductInfo";

const PAGE_SIZE = 6;

interface ReviewListProps {
  productId: string;
  avgRating: number;
  totalCount: number;
  refreshKey?: number; // increment from parent to reset to page 1 after new review
}

interface LightboxState {
  urls: string[];
  index: number;
}

/** Returns exactly 3 consecutive page numbers, sliding as the user navigates */
function getPageNumbers(current: number, total: number): number[] {
  if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);
  if (current === 1) return [1, 2, 3];
  if (current === total) return [total - 2, total - 1, total];
  return [current - 1, current, current + 1];
}

export default function ReviewList({
  productId,
  avgRating,
  totalCount,
  refreshKey = 0,
}: ReviewListProps) {
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pageTotal, setPageTotal] = useState(totalCount);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const displayedAvg = avgRating.toFixed(1);
  const displayedTotal = pageTotal;
  const totalPages = Math.ceil(displayedTotal / PAGE_SIZE);

  // ── Fetch a single page ─────────────────────────────────────
  const fetchPage = useCallback(
    async (pageNum: number) => {
      setLoading(true);
      const from = (pageNum - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, count, error } = await supabase
        .from("reviews")
        .select("*", { count: "exact" })
        .eq("product_id", productId)
        .order("sort_weight", { ascending: true })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (!error) {
        setReviews((data as Review[]) || []);
        if (count !== null) setPageTotal(count);
      }
      setLoading(false);
    },
    [productId]
  );

  // Fetch whenever page changes
  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  // When a new review is submitted (refreshKey increments), reset to page 1
  useEffect(() => {
    if (refreshKey === 0) return;
    if (page === 1) {
      fetchPage(1); // already on page 1 — manually trigger refetch
    } else {
      setPage(1);   // changing page triggers the effect above
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // ── Navigation ───────────────────────────────────────────────
  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Lightbox ─────────────────────────────────────────────────
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

  // ── Date formatting ──────────────────────────────────────────
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const diffDays = Math.max(
      0,
      Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
    );
    if (diffDays === 0) return "Just now";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  // ── Skeleton cards ───────────────────────────────────────────
  const SkeletonCard = () => (
    <div className="bg-gray-50 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-gray-200 rounded w-28" />
          <div className="h-2.5 bg-gray-200 rounded w-20" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-3/4" />
    </div>
  );

  const rangeStart = (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, displayedTotal);

  return (
    <div className="space-y-8" ref={sectionRef}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-brand-text">Real Reviews</h2>
        <span className="text-sm text-brand-primary font-medium">
          {displayedTotal} Review{displayedTotal !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Average Rating Summary */}
      <div className="text-center py-6 bg-brand-bg/30 rounded-2xl">
        <div className="text-4xl font-bold text-brand-text">{displayedAvg}</div>
        <div className="text-xs text-gray-400 mb-2">/5</div>
        <div className="flex items-center justify-center gap-0.5 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= Math.round(Number(displayedAvg))
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

      {/* Review Cards */}
      <div className="space-y-4">
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
          : reviews.map((review) => {
              const hasImages = review.image_urls && review.image_urls.length > 0;
              return (
                <div
                  key={review.id}
                  className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-sm font-semibold text-brand-primary">
                        {review.reviewer_name?.charAt(0).toUpperCase()}
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
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="space-y-3">
          {/* Range label */}
          <p className="text-center text-xs text-gray-400">
            Showing {rangeStart}–{rangeEnd} of {displayedTotal} reviews
          </p>

          <div className="flex items-center justify-center gap-1.5">
            {/* Prev */}
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>

            {/* Page numbers */}
            {getPageNumbers(page, totalPages).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`w-8 h-8 text-xs font-semibold rounded-lg transition-all ${
                  page === p
                    ? "text-white shadow-sm"
                    : "text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
                style={
                  page === p
                    ? { background: "linear-gradient(135deg, #1E3A8A 0%, #172554 100%)" }
                    : {}
                }
                aria-label={`Page ${p}`}
                aria-current={page === p ? "page" : undefined}
              >
                {p}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {lightbox.urls.length > 1 && (
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-white/70 bg-black/40 px-3 py-1 rounded-full">
              {lightbox.index + 1} / {lightbox.urls.length}
            </span>
          )}

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
