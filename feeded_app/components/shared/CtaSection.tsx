'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="lg:w-3/4 m-10 py-12 md:py-24 flex border-transparent rounded-3xl justify-center lg:py-32 bg-gradient-to-r from-[#9e7eff] from-15% via-[#7b57f9]  to-[#6740f3] text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className={`space-y-2 transition-all mb-5 duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl mb-5 font-bold tracking-tighter sm:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of satisfied customers and take your business to the next level.
            </p>
          </div>
          <div className={`transition-all duration-500 ease-in-out delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Link href="/signup">
            <Button 
              size="lg" 
              className="bg-[#f8d254] font-semibold text-black text-base hover:bg-gray-100 hover:text-purple-700 mr-4"
            >
              Démarrez gratuitement
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
            <Link href="/login">
            <Button 
              size="lg" 
              className="bg-transparent text-base font-semibold text-white border border-white hover:bg-gray-100 hover:text-purple-700"
            >
              Connexion
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}