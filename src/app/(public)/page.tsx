import { HeroSection } from "@/components/home/HeroSection";
import { BenefitsBar } from "@/components/home/BenefitsBar";
import { BrandsCarousel } from "@/components/home/BrandsCarousel";
import { PopularCategories } from "@/components/home/PopularCategories";
import { AllProductsSection } from "@/components/home/AllProductsSection";
import { ClickCollectBanner } from "@/components/home/ClickCollectBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsBar />
      <BrandsCarousel />
      <PopularCategories />
      <AllProductsSection />

      <ClickCollectBanner />
    </>
  );
}
