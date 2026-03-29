"use client";

import { useState, useEffect } from "react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductDescription from "@/components/product/ProductDescription";
import CustomerResults from "@/components/home/CustomerResults";
import ReviewList from "@/components/product/ReviewList";
import ReviewForm from "@/components/product/ReviewForm";
import { PRODUCT } from "@/lib/product";
import { supabase } from "@/lib/supabase-client";

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
    <div className="bg-white">
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
    </div>
  );
}
