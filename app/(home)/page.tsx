import Hero from "@/components/agency/AgencyHero";
import FeaturesSection from "@/components/agency/FeaturesSection";
import PainPointsSection from "@/components/agency/PainPointsSection";
import BentoGrid from "@/components/agency/BentoGrid";
import FeatureShowcase from "@/components/agency/FeatureShowcase";
import CTABanner from "@/components/agency/CTABanner";
import FAQSection from "@/components/agency/FAQSection";
import React from "react";

export default function page() {
  return (
    <div>
      <Hero />
      <PainPointsSection />
      <FeaturesSection />
      <BentoGrid />
      <FeatureShowcase />
      <CTABanner />
      <FAQSection />
    </div>
  );
}
