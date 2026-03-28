import SalesBanner from "@/components/home/SalesBanner";
import HeroSection from "@/components/home/HeroSection";
import ImageSlider from "@/components/home/ImageSlider";
import ProductCard from "@/components/home/ProductCard";
import ContentWithImage from "@/components/home/ContentWithImage";
import CustomerResults from "@/components/home/CustomerResults";
import FeaturesSection from "@/components/home/FeaturesSection";
import CommunityJoin from "@/components/home/CommunityJoin";
import { PRODUCT } from "@/lib/product";

export default function HomePage() {
  return (
    <>
      <SalesBanner />
      <HeroSection />
      <ImageSlider images={PRODUCT.sliderImages.cream} speed={25} />
      <ProductCard />
      <ImageSlider images={PRODUCT.sliderImages.ingredients} speed={28} />
      <ContentWithImage />
      <CustomerResults />
      <FeaturesSection />
      <CommunityJoin />
    </>
  );
}
