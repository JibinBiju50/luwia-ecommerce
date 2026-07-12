"use client";

import { use } from "react";
import { notFound, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/lib/products";
import { supabase } from "@/lib/supabase-client";
import { viewContent } from "@/lib/fbpixel";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductDescription from "@/components/product/ProductDescription";
import ReviewList from "@/components/product/ReviewList";
import ReviewForm from "@/components/product/ReviewForm";
import ProductFAQ from "@/components/product/ProductFAQ";
import ProductFeatures from "@/components/product/ProductFeatures";
import CustomerVideos from "@/components/home/CustomerVideos";
import ProductCarousel from "@/components/home/ProductCarousel";
import InstagramFeed from "@/components/home/InstagramFeed";
import FeaturesSection from "@/components/home/FeaturesSection";
import SalesBanner from "@/components/home/SalesBanner";

const WA_NUMBER = "917025459137";


interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  const pathname = usePathname();
  const otherProducts = PRODUCTS.filter((p) => p.id !== id);

  const [ratingInfo, setRatingInfo] = useState({ avgRating: 0, totalCount: 0 });
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchRatingInfo() {
      const { data, count } = await supabase
        .from("reviews")
        .select("star_rating", { count: "exact" })
        .eq("product_id", id);
      const total = count || 0;
      const avg =
        total > 0
          ? (data?.reduce((s: number, r: { star_rating: number }) => s + r.star_rating, 0) || 0) / total
          : 0;
      setRatingInfo({ avgRating: avg, totalCount: total });
    }
    fetchRatingInfo();
  }, [id, reviewRefreshKey]);

  // Fire ViewContent when the product page is viewed
  useEffect(() => {
    if (!product) return;
    viewContent({
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.onlinePrice,
      currency: "INR",
    });
  }, [product]);

  if (!product) return notFound();

  const handleReviewSubmitted = () => {
    setReviewRefreshKey((k) => k + 1);
  };

  return (
    <main className="bg-white min-h-screen">
      <SalesBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-3 flex items-center gap-2">
          <a href="/" className="hover:text-brand-primary transition-colors">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-brand-primary transition-colors">Products</a>
          <span>/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 mb-4 md:mb-6">
          <div className="min-w-0">
            <ProductGallery images={product.gallery} />
          </div>
          <div className="min-w-0">
            <ProductInfo product={product} avgRating={ratingInfo.avgRating} totalCount={ratingInfo.totalCount} />
          </div>
        </div>
        {/* Features Section for Non-Prime */}
        {product.id !== "luwia-prime" && (
          <ProductFeatures />
        )}
      </div>

      {/* Combined Image and Descriptions Section */}
      <section className="w-full bg-[#FEE5C7] py-8 md:py-12 border-t border-brand-primary/5 mt-4 md:mt-8">
        <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8">
          {product.id === "luwia-prime" ? (
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Side: Image */}
              <div className="w-full px-4 md:px-0 md:sticky md:top-24">
                <Image
                  src="/images/visible_result.png"
                  alt="Luwia Prime Visible Results"
                  width={1920}
                  height={1080}
                  className="w-full h-auto rounded-2xl md:rounded-3xl object-cover"
                />
              </div>
              {/* Right Side: Descriptions */}
              <div className="w-full">
                <ProductDescription product={product} />
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <ProductDescription product={product} />
            </div>
          )}
        </div>
      </section>

      {/* Daily Cream & Women Cream Bar — Luwia Prime only */}
      {product.id === "luwia-prime" && (
        <section className="w-full bg-[#FEE5C7] pb-0">
          <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 lg:gap-12">
            {/* Women Cream Bar Image */}
            <div className="w-full">
              <Image
                src="/images/women_cream_bar.jpeg"
                alt="Luwia Prime — Tested & Loved visible results for women"
                width={1080}
                height={1080}
                className="w-full h-auto object-cover md:rounded-t-3xl shadow-sm"
                priority={false}
              />
            </div>
            {/* Daily Cream Image */}
            <div className="w-full">
              <Image 
                src="/images/daily_cream.jpg"
                alt="Luwia Prime Daily Cream"
                width={1080}
                height={1080}
                className="w-full h-auto object-cover md:rounded-t-3xl shadow-sm"
              />
            </div>
          </div>
        </section>
      )}

      {/* Cream Bar — Luwia Core only */}
      {product.id === "luwia-core" && (
        <section className="w-full max-w-7xl mx-auto px-0 md:px-4 lg:px-8 md:my-6">
          {/* Mobile Image */}
          <Image
            src="/images/men_cream_bar.jpeg"
            alt="Luwia Core — Tested & Loved visible results for men"
            width={1080}
            height={1080}
            className="w-full h-auto object-cover block md:hidden"
            priority={false}
          />
          {/* Desktop Image */}
          <Image
            src="/images/men_cream_bar_widescreen.jpeg"
            alt="Luwia Core — Tested & Loved visible results for men"
            width={1920}
            height={1080}
            className="w-full h-auto object-cover hidden md:block md:rounded-xl"
            priority={false}
          />
        </section>
      )}

      {/* Customers Also Bought */}
      <div className="border-t border-brand-primary/10">
        <ProductCarousel 
          products={otherProducts} 
          title="Customers Also Bought" 
          subtitle="Complete your skincare routine with our highly recommended products." 
        />
      </div>

      {/* Videos Section — hidden for Luwia Core */}
      {product.id !== "luwia-core" && <CustomerVideos />}

      {/* Custom Image Section — Only for Luwia Core */}
      {product.id === "luwia-core" && (
        <section className="w-full py-3 md:py-5 px-4 sm:px-6 lg:px-8 bg-gray-50/80 border-y border-gray-100">
          <div className="max-w-xl lg:max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-brand-primary/10 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(30,58,138,0.5)] hover:-translate-y-2 group cursor-pointer">
              {/* Mobile Image */}
              <Image
                src="/images/cream_men.jpeg"
                alt="Luwia Core for Men"
                width={1080}
                height={1080}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 block md:hidden"
              />
              {/* Desktop Image */}
              <Image
                src="/images/cream_men_widescreen.png"
                alt="Luwia Core for Men"
                width={1920}
                height={1080}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 hidden md:block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </section>
      )}

      {/* Instagram Feed Section — Only for Luwia Prime */}
      {product.id === "luwia-prime" && <InstagramFeed />}

      {/* Reviews Section */}
      <section id="reviews" className="w-full bg-brand-light/10 border-y border-brand-primary/10 scroll-mt-16 md:scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="grid md:grid-cols-2 gap-4 lg:gap-8">
            <ReviewList
              productId={product.id}
              avgRating={ratingInfo.avgRating}
              totalCount={ratingInfo.totalCount}
              refreshKey={reviewRefreshKey}
            />
            <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <ProductFAQ />
      </div>

      {/* Floating WhatsApp Enquiry Button */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
          `Hi Luwia! I have a question about ${product.name}. Can you help me?`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-5 z-50 group flex items-center gap-2"
      >
        {/* Tooltip */}
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          Chat with us
          <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
        </span>

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />

        {/* Button */}
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 transition-transform duration-200 group-hover:scale-110 group-hover:shadow-xl">
          {/* WhatsApp SVG icon */}
          <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.64 4.64 1.853 6.64L2.667 29.333l6.907-1.813A13.28 13.28 0 0 0 16.004 29.333C23.36 29.333 29.333 23.36 29.333 16S23.36 2.667 16.004 2.667Zm0 24a11.6 11.6 0 0 1-5.92-1.627l-.427-.253-4.093 1.08 1.08-4-.28-.44A11.573 11.573 0 0 1 4.4 16c0-6.4 5.2-11.6 11.6-11.6S27.6 9.6 27.6 16s-5.2 11.667-11.596 11.667Zm6.373-8.693c-.347-.174-2.053-1.014-2.373-1.12-.32-.12-.547-.174-.773.174-.227.347-.88 1.12-1.08 1.347-.2.213-.4.24-.747.08-.347-.174-1.467-.547-2.787-1.733-1.027-.92-1.72-2.053-1.92-2.4-.2-.347-.013-.534.16-.707.146-.16.347-.413.52-.613.174-.2.227-.347.347-.573.12-.24.067-.44-.027-.614-.094-.173-.773-1.866-1.067-2.546-.28-.667-.56-.573-.773-.587h-.667c-.226 0-.586.08-.894.413-.306.333-1.186 1.16-1.186 2.827s1.213 3.28 1.386 3.507c.174.213 2.387 3.64 5.787 5.106.813.347 1.44.56 1.933.72.813.253 1.547.213 2.134.133.653-.094 2.013-.813 2.293-1.6.28-.787.28-1.467.2-1.6-.094-.147-.32-.24-.667-.414Z"/>
          </svg>
        </span>
      </a>

      {/* Magic link modal for Meta Ads conversion */}
    </main>
  );
}
