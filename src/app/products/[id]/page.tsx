"use client";

import { use } from "react";
import { notFound, usePathname } from "next/navigation";
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
import MagicLinkModal from "@/components/auth/MagicLinkModal";


interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  const pathname = usePathname();

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
          <div className="min-w-0">
            <ProductGallery images={product.gallery} />
          </div>
          <div className="min-w-0">
            <ProductInfo product={product} reviews={reviews} />
          </div>
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

      {/* Cream Bar Infographic — product-specific, full-width section */}
      {(product.id === "luwia-core" || product.id === "luwia-prime") && (
        <section className="w-full py-6 md:py-8 px-4 sm:px-6 lg:px-8"
          style={{ background: "linear-gradient(135deg, #fdf6ee 0%, #fef3e8 50%, #fdf6ee 100%)" }}>
          <div className="max-w-xl lg:max-w-lg mx-auto">
            {/* Decorative top label */}
            <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-orange-400 mb-4">
              Clinically Tested Results
            </p>

            {/* Image container */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-orange-100">
              <Image
                src={
                  product.id === "luwia-core"
                    ? "/images/men_cream_bar.jpeg"
                    : "/images/women_cream_bar.jpeg"
                }
                alt={
                  product.id === "luwia-core"
                    ? "Luwia Core — Tested & Loved visible results for men"
                    : "Luwia Prime — Tested & Loved visible results for women"
                }
                width={1080}
                height={1080}
                className="w-full h-auto object-cover"
                priority={false}
              />
            </div>
          </div>
        </section>
      )}

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

      {/* Magic link modal for Meta Ads conversion */}
      <MagicLinkModal returnPath={pathname} />
    </main>
  );
}
