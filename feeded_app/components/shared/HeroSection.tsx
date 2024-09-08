"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className={`text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Revolutionize Your Workflow
              </h1>
              <p className={`max-w-[600px] text-muted-foreground md:text-xl transition-all duration-500 ease-in-out delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Streamline your projects, boost productivity, and achieve more with our cutting-edge platform.
              </p>
            </div>
            <div className={`flex flex-col gap-2 min-[400px]:flex-row transition-all duration-500 ease-in-out delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Button size="lg" className="inline-flex items-center justify-center">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className={`mx-auto flex items-center justify-center transition-all duration-1000 ease-in-out delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <img
              src=""
              width={550}
              height={550}
              alt="Hero"
              className="aspect-square rounded-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  )
}