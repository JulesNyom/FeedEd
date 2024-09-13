import CTASection from "@/components/shared/CtaSection";
import FeaturesSection from "@/components/shared/Features";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/shared/HeroSection";
import PricingSection from "@/components/shared/PricingSection";
import QuestionSection from "@/components/shared/QuestionSection";
import React from "react";

const Page = () => {
  return (
    <div className="bg-background flex flex-col items-center">
      <div className="mt-3">
        <HeroSection />
      </div>
      <FeaturesSection />
      <div className="">
      <QuestionSection />
      </div>
      <PricingSection />
      <div className="bg-[#11253e] w-full max-w-[calc(100%-6rem)] mb-10 rounded-3xl border shadow-md overflow-hidden flex flex-col items-center justify-center">
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Page;
