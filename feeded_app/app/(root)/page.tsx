import FeaturesSection from "@/components/shared/landing/Features";
import Footer from "@/components/shared//landing/Footer";
import HeroSection from "@/components/shared/landing/HeroSection";
import React from "react";

const Page = () => {
  return (
    <div>
    <div className="bg-background flex flex-col items-center">
      <div className="mt-3">
        <HeroSection />
      </div>
      <FeaturesSection />
    </div>
    <Footer />
    </div>
  );
};

export default Page;
