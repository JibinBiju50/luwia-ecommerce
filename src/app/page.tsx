import SalesBanner from "@/components/home/SalesBanner";
import HeroSection from "@/components/home/HeroSection";
import Image from "next/image";
import ProductCarousel from "@/components/home/ProductCarousel";
import ContentWithImage from "@/components/home/ContentWithImage";
import CustomerVideos from "@/components/home/CustomerVideos";
import CustomerResults from "@/components/home/CustomerResults";
import FeaturesSection from "@/components/home/FeaturesSection";
import InstagramFeed from "@/components/home/InstagramFeed";

import { PRODUCT } from "@/lib/product";
import { PRODUCTS } from "@/lib/products";

export default function HomePage() {
  const comboProduct = PRODUCTS.find((p) => p.id === "luwia-combo") || PRODUCTS[2];

  return (
    <>
      <SalesBanner />
      <HeroSection />
      <section className="w-full py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-brand-light/10">
        <div className="max-w-xl lg:max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-brand-primary/10 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(30,58,138,0.5)] hover:-translate-y-1 group cursor-pointer">
            <Image
              src="/images/save 20 offer _page-0001.jpg"
              alt="Save 20% Offer"
              width={1080}
              height={1080}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-brand-primary/10 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(30,58,138,0.5)] hover:-translate-y-1 group cursor-pointer">
            <Image
              src="/images/men and women landscape in square_page-0001.jpg"
              alt="Luwia Core and Prime Results"
              width={1080}
              height={1080}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
        </div>
      </section>
      <ProductCarousel />
      <ContentWithImage />
      <CustomerVideos />
      <CustomerResults />
      <FeaturesSection />
      <InstagramFeed />
    </>
  );
}
