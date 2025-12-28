import { Hero } from "@/components/home/Hero";
import { CategoryHighlights } from "@/components/home/CategoryHighlights";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { SellerCta } from "@/components/home/SellerCta";

export default function Home() {
  return (
    <div className="space-y-14">
      <Hero />
      <CategoryHighlights />
      <ProductShowcase />
      <SellerCta />
    </div>
  );
}
