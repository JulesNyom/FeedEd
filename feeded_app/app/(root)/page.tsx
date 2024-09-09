import CTASection from '@/components/shared/CtaSection'
import FeaturesSection from '@/components/shared/Features'
import Footer from '@/components/shared/Footer'
import HeroSection from '@/components/shared/HeroSection'
import PricingSection from '@/components/shared/PricingPlan'
import React from 'react'

const page = () => {
  return (
    <div>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
        <Footer />
    </div>
  )
}

export default page