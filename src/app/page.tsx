import SalesBanner from "@/components/home/SalesBanner";
import HeroSection from "@/components/home/HeroSection";
import ImageSlider from "@/components/home/ImageSlider";
import ProductCard from "@/components/home/ProductCard";
import ContentWithImage from "@/components/home/ContentWithImage";
import CustomerVideos from "@/components/home/CustomerVideos";
import CustomerResults from "@/components/home/CustomerResults";
import FeaturesSection from "@/components/home/FeaturesSection";
import CommunityJoin from "@/components/home/CommunityJoin";
import { PRODUCT } from "@/lib/product";
import { PRODUCTS } from "@/lib/products";

export default function HomePage() {
  const comboProduct = PRODUCTS.find((p) => p.id === "luwia-combo") || PRODUCTS[2];

  return (
    <>
      <SalesBanner />
      <HeroSection />
      <ImageSlider images={PRODUCT.sliderImages.cream} speed={25} />
      <ProductCard product={comboProduct} />
      <ImageSlider images={PRODUCT.sliderImages.ingredients} speed={28} objectFit="contain" height="aspect-[4/3] md:aspect-[16/9] bg-brand-light/20" />
      <ContentWithImage />
      <CustomerVideos />
      <CustomerResults />
      <FeaturesSection />
      <CommunityJoin />
    </>
  );
}
