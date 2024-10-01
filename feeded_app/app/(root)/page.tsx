import CTASection from "@/components/shared/landing/CtaSection";
import FeaturesSection from "@/components/shared/landing/Features";
import Footer from "@/components/shared//landing/Footer";
import HeroSection from "@/components/shared/landing/HeroSection";
import QuestionSection from "@/components/shared/landing/QuestionSection";
import React from "react";
import EmailSender from "@/components/shared/test-email";

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
      <div className="bg-[#11253e] w-full max-w-[calc(100%-6rem)] mb-10 rounded-3xl border shadow-md overflow-hidden flex flex-col items-center justify-center">
        <CTASection />
        <Footer />
        <EmailSender />
      </div>
    </div>
  );
};

export default Page;
