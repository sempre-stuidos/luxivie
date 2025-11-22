import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { BrandPromise } from "@/components/BrandPromise";
import { IngredientTransparency } from "@/components/IngredientTransparency";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { BrandStory } from "@/components/BrandStory";
import { CustomerReviews } from "@/components/CustomerReviews";
import { HowToUse } from "@/components/HowToUse";
import { Sustainability } from "@/components/Sustainability";
import { FinalCTA } from "@/components/FinalCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F9F6]">
      <Navigation />
      <HeroSection />
      <BrandPromise />
      <IngredientTransparency />
      <FeaturedProducts />
      <BrandStory />
      <CustomerReviews />
      <HowToUse />
      <Sustainability />
      <FinalCTA />
    </div>
  );
}

