"use client";

import { useState } from "react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductDescription from "@/components/product/ProductDescription";
import CustomerResults from "@/components/home/CustomerResults";
import ReviewList from "@/components/product/ReviewList";
import ReviewForm from "@/components/product/ReviewForm";
import { PRODUCT } from "@/lib/product";

interface Review {
  id: string;
  reviewer_name: string;
  star_rating: number;
  review_text: string;
  created_at: string;
}

export default function ProductPage() {
  const [newReview, setNewReview] = useState<Review | null>(null);

  return (
    <div className="bg-white">
      {/* Product Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery image={PRODUCT.image} />
          <ProductInfo />
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
        <ReviewList newReview={newReview} />
        <div className="mt-8">
          <ReviewForm onReviewSubmitted={(review) => setNewReview(review)} />
        </div>
      </div>
    </div>
  );
}
