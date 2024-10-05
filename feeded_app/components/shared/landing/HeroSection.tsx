'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

export default function VerticalHero() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="text-gray-900 min-h-screen flex flex-col justify-between">
      <div className="max-w-6xl mx-auto px-4 py-12 flex-grow flex flex-col justify-center items-center text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            FeedEd arrive bientôt
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Préparez-vous à transformer vos formations avec des retours d&lsquo;expérience puissants. Sublimez vos formations, un retour à la fois.
          </p>
        </motion.div>

        <motion.div 
          className="relative w-full max-w-2xl aspect-video"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Image
            src="/assets/images/reunion.webp"
            alt="FeedEd App Preview"
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent rounded-lg"></div>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-300">
            <Link href="/signup">
              Être notifié au lancement
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors duration-300">
            <Link href="/guide">
              En savoir plus
            </Link>
          </Button>
        </motion.div>
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  )
}