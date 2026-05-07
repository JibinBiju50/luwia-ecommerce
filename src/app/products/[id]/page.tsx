"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/lib/products";
import { supabase } from "@/lib/supabase-client";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo, { type Review } from "@/components/product/ProductInfo";
import ProductDescription from "@/components/product/ProductDescription";
import ReviewList from "@/components/product/ReviewList";
import ReviewForm from "@/components/product/ReviewForm";
import ProductFAQ from "@/components/product/ProductFAQ";
import ProductFeatures from "@/components/product/ProductFeatures";
import CustomerVideos from "@/components/home/CustomerVideos";
import SalesBanner from "@/components/home/SalesBanner";


interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setLoadingReviews(true);
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      setReviews((data as Review[]) || []);
      setLoadingReviews(false);
    }
    fetchReviews();
  }, []);

  if (!product) return notFound();

  const handleReviewSubmitted = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  return (
    <main className="bg-white min-h-screen">
      <SalesBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-6 flex items-center gap-2">
          <a href="/" className="hover:text-brand-primary transition-colors">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-brand-primary transition-colors">Products</a>
          <span>/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-16">
          <ProductGallery images={product.gallery} />
          <ProductInfo product={product} reviews={reviews} />
        </div>


        {/* Features Section */}
        <ProductFeatures />

        {/* Product Description */}
        <div className="mb-16">
          <h2 className="text-xl md:text-2xl font-bold text-brand-text mb-6">
            Product Details
          </h2>
          <ProductDescription product={product} />
        </div>
      </div>

      {/* Videos Section — full width */}
      <CustomerVideos />

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <ReviewList reviews={reviews} loading={loadingReviews} />
          <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
        </div>
      </div>
      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <ProductFAQ />
      </div>
    </main>
  );
}
