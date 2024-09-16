'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function ProSubscriptionCard () {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="animate-fade-in-up">
      <Card 
        className={`
          w-full max-w-sm overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 
          text-white shadow-lg transition-transform duration-300 ease-in-out
          ${isHovered ? 'scale-105' : 'scale-100'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="p-6">
          <div className={`transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}>
            <CardTitle className="text-2xl font-bold mb-2 flex items-center">
              <Sparkles className="mr-2" />
              Devenez Pro
            </CardTitle>
            <CardDescription className="text-purple-100">
              Débloquez toutes les fonctionnalités et obtenez un nombre illimité de formations.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Button 
            asChild
            className="
              w-full bg-white text-purple-600 hover:bg-purple-100 hover:text-purple-700 
              transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
            "
          >
            <Link href="/pricing">
              Abonnement pro
            </Link>
          </Button>
        </CardContent>
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-white opacity-10 transition-opacity duration-300" />
        </div>
      </Card>
    </div>
  )
}