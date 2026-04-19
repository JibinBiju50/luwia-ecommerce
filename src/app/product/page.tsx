"use client";

import { useState, useEffect } from "react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductDescription from "@/components/product/ProductDescription";
import CustomerVideos from "@/components/home/CustomerVideos";
import CustomerResults from "@/components/home/CustomerResults";
import FeaturesSection from "@/components/home/FeaturesSection";
import ReviewList from "@/components/product/ReviewList";
import ReviewForm from "@/components/product/ReviewForm";
import { PRODUCT } from "@/lib/product";
import { supabase } from "@/lib/supabase-client";
import { MessageCircle } from "lucide-react";

export interface Review {
  id: string;
  reviewer_name: string;
  star_rating: number;
  review_text: string;
  created_at: string;
}

export default function ProductPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setReviews(data);
        }
      } catch {
        console.log("Supabase fetch failed");
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const handleReviewSubmitted = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  return (
    <div className="bg-white relative pb-16 md:pb-0">
      {/* Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-brand-dark via-brand-primary to-brand-dark text-white overflow-hidden py-2.5 flex items-center">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee-slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-slide {
            display: flex;
            width: max-content;
            animation: marquee-slide 85s linear infinite;
            will-change: transform;
          }
          .animate-marquee-slide:hover {
            animation-play-state: paused;
          }
        `}} />
        <div className="animate-marquee-slide font-semibold text-sm tracking-widest uppercase gap-12 px-6">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="flex flex-row items-center gap-12 whitespace-nowrap text-white/90">
              <span className="text-white">✨ Exclusive offer! Flat {Math.round(((PRODUCT.originalPrice - PRODUCT.onlinePrice) / PRODUCT.originalPrice) * 100)}% off ✨</span>
              <span>🚚 Free All India Shipping 🚚</span>
              <span>🌟 Trusted by 10,000+ Happy Customers 🌟</span>
            </span>
          ))}
        </div>
      </div>

      {/* Product Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery image={PRODUCT.image} />
          <ProductInfo reviews={reviews} />
        </div>
      </div>

      {/* Product Description */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDescription />
      </div>

      {/* FDA Image */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center w-full">
        <img src="/images/FDA_crop.jpeg" alt="FDA Certificate" className="w-full max-w-md h-auto rounded-lg" />
      </div>

      {/* Customer Videos */}
      <div className="w-full">
        <CustomerVideos />
      </div>

      {/* Customer Review Images */}
      <div className="w-full">
        <CustomerResults />
      </div>

      {/* Reviews Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <ReviewList reviews={reviews} loading={loading} />
        <div className="mt-8">
          <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
        </div>
      </div>

      <FeaturesSection />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center cursor-pointer"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
