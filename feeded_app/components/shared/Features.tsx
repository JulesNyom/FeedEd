"use client"
import { use, useEffect, useState } from 'react'
import { Zap, Shield, Smartphone, Globe } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Experience unparalleled speed with our optimized platform, ensuring quick load times and seamless interactions.'
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    description: 'Rest easy knowing your data is protected by state-of-the-art security measures and encryption protocols.'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Enjoy a fully responsive experience across all devices, from desktops to smartphones and tablets.'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connect with users worldwide through our distributed network, ensuring low latency no matter where you are.'
  }
]

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold text-foreground tracking-tighter sm:text-5xl transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Powerful Features
          </h2>
          <p className={`mt-4 text-muted-foreground md:text-xl transition-all duration-500 ease-in-out delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Discover what makes our platform stand out from the rest
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={`flex flex-col items-center text-center transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="mb-4 p-3 rounded-full bg-primary/10">
                <feature.icon className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl text-foreground font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}