import FeaturesSection from '@/components/shared/Features'
import HeroSection from '@/components/shared/HeroSection'
import PricingSection from '@/components/shared/PricingPlan'
import React from 'react'

const page = () => {
  return (
    <div>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
    </div>
  )
}

export default page