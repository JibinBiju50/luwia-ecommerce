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

interface ReviewWithImage {
  url: string;
  review: Review;
}

interface LightboxState {
  items: ReviewWithImage[];
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
  const [galleryItems, setGalleryItems] = useState<ReviewWithImage[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const prevLightboxOpenRef = useRef(false);

  useEffect(() => {
    const isOpen = !!lightbox;
    if (isOpen && !prevLightboxOpenRef.current && carouselRef.current) {
      carouselRef.current.scrollLeft = lightbox.index * carouselRef.current.clientWidth;
    }
    prevLightboxOpenRef.current = isOpen;
  }, [lightbox]);

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

  // ── Fetch global images gallery ────────────────────────────────
  useEffect(() => {
    async function fetchGallery() {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) {
        const items = (data as Review[])
          .filter((r) => r.image_urls && r.image_urls.length > 0)
          .flatMap((r) => r.image_urls.map((url) => ({ url, review: r })));
        setGalleryItems(items.slice(0, 20));
      }
    }
    fetchGallery();
  }, [productId, refreshKey]);

  // ── Navigation ───────────────────────────────────────────────
  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Lightbox ─────────────────────────────────────────────────
  const openLightbox = (items: ReviewWithImage[], index: number) => {
    setLightbox({ items, index });
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    setLightbox(null);
    document.body.style.overflow = "";
  };

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
    <div className="space-y-2 min-w-0" ref={sectionRef}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-brand-text">Customer Reviews</h2>
      </div>

      {/* Average Rating Summary */}
      <div className="text-center py-4 bg-brand-bg/30 rounded-xl">
        <div className="text-4xl font-bold text-brand-text">{displayedAvg}</div>
        <div className="text-xs text-gray-400 mb-1">/5</div>
        <div className="flex items-center justify-center gap-0.5 mb-1">
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
        <p className="text-sm font-medium text-gray-600 mt-2">
          {displayedTotal} Verified Review{displayedTotal !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Review Images Gallery */}
      {galleryItems.length > 0 && (
        <div className="mt-4 mb-2 w-full overflow-hidden">
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {galleryItems.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => openLightbox(galleryItems, idx)}
                className="shrink-0 snap-start relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                aria-label={`View photo ${idx + 1}`}
              >
                <Image src={item.url} alt={`Review photo`} fill className="object-cover" sizes="96px" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Review Cards */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
          : reviews.map((review) => {
              const hasImages = review.image_urls && review.image_urls.length > 0;
              return (
                <div
                  key={review.id}
                  className="bg-gray-50/80 rounded-xl p-4 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
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
                    <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
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
                          onClick={() => openLightbox(review.image_urls.map(url => ({ url, review })), idx)}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
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

          <div
            className="relative w-full max-w-lg md:max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left/Top: Image Carousel */}
            <div className="relative w-full h-[45vh] md:w-3/5 md:h-[80vh] bg-gray-50 flex flex-col group">
              <div 
                ref={carouselRef}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                onScroll={(e) => {
                  const el = e.currentTarget;
                  if (el.clientWidth === 0) return;
                  const newIndex = Math.round(el.scrollLeft / el.clientWidth);
                  if (newIndex !== lightbox.index && newIndex >= 0 && newIndex < lightbox.items.length) {
                    setLightbox({ ...lightbox, index: newIndex });
                  }
                }}
              >
                {lightbox.items.map((item, idx) => (
                  <div key={idx} className="relative w-full h-full flex-shrink-0 snap-center">
                    <Image
                      src={item.url}
                      alt={`Review photo ${idx + 1}`}
                      fill
                      className="object-contain"
                      priority={idx === lightbox.index}
                    />
                  </div>
                ))}
              </div>
              
              {/* Image Counter overlay */}
              {lightbox.items.length > 1 && (
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/90 bg-black/50 px-3 py-1 rounded-full pointer-events-none z-10">
                  {lightbox.index + 1} / {lightbox.items.length}
                </span>
              )}
            </div>

            {/* Right/Bottom: Review Info */}
            <div className="w-full md:w-2/5 p-5 md:p-8 flex flex-col overflow-y-auto max-h-[45vh] md:max-h-[80vh]">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-brand-text text-lg">
                  {lightbox.items[lightbox.index].review.reviewer_name}
                </p>
                <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full shrink-0 ml-2">
                  VERIFIED
                </span>
              </div>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= lightbox.items[lightbox.index].review.star_rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-400 ml-2">
                  {formatDate(lightbox.items[lightbox.index].review.created_at)}
                </span>
              </div>
              {lightbox.items[lightbox.index].review.review_text && (
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  &ldquo;{lightbox.items[lightbox.index].review.review_text}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
