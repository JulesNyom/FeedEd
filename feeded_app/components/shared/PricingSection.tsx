'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, X } from 'lucide-react'
import { pricingTiers } from '@/lib'

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)
  const [hoveredTier, setHoveredTier] = useState<string | null>(null)

  return (
    <div className="py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4">Tarification</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Choisissez le forfait parfait pour vos besoins
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
            Options de tarification flexibles adaptées aux entreprises de toutes tailles. Pas de frais cachés, annulez à tout moment.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isYearly ? 'text-primary font-semibold' : 'text-gray-500'}`}>Mensuel</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm ${isYearly ? 'text-primary font-semibold' : 'text-gray-500'}`}>Annuel (Économisez 20%)</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch space-y-8 lg:space-y-0 lg:space-x-8">
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              className={`w-full max-w-sm ${tier.highlighted ? 'lg:-mt-8' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onHoverStart={() => setHoveredTier(tier.name)}
              onHoverEnd={() => setHoveredTier(null)}
            >
              <Card className={`h-full transition-all duration-300 ${tier.highlighted ? 'border-primary shadow-lg' : 'hover:border-primary/50'} ${hoveredTier === tier.name ? 'scale-105' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {isYearly ? tier.yearlyPrice : tier.monthlyPrice}€
                    </span>
                    <span className="text-gray-500">/{isYearly ? 'an' : 'mois'}</span>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={tier.highlighted ? "default" : "outline"}>
                    Commencer
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {hoveredTier && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-8 right-8 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg"
            >
              <p className="font-semibold">Point fort du forfait {hoveredTier}</p>
              <p className="text-sm">
                {pricingTiers.find(tier => tier.name === hoveredTier)?.features[0]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}