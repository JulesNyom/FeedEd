import Footer from "@/components/shared/landing/Footer";
import HeroSection from "@/components/shared/landing/HeroSection";
import StorySection from "@/components/shared/landing/StorySection";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col">
        <HeroSection />
        <StorySection />
        <Footer />
    </div>
  );
};

export default Page;
