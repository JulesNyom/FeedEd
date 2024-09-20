'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import { pricingTiers } from '@/lib'

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [hoveredTier, setHoveredTier] = useState<string | null>(null)

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Tarification simple et transparente
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-xl text-gray-500">
          Choisissez le forfait parfait pour vos besoins. Connaissez toujours ce que vous paierez.
        </p>
        <div className="mt-8 flex items-center justify-center space-x-4">
          <span className={`text-sm ${!isYearly ? 'text-primary font-semibold' : 'text-gray-500'}`}>Mensuel</span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <span className={`text-sm ${isYearly ? 'text-primary font-semibold' : 'text-gray-500'}`}>Annuel (Économisez 20%)</span>
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              className={`flex ${tier.highlighted ? 'lg:-mt-8' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onHoverStart={() => setHoveredTier(tier.name)}
              onHoverEnd={() => setHoveredTier(null)}
            >
              <Card 
                className={`flex flex-col justify-between w-full max-w-sm transition-all duration-300 ${
                  tier.highlighted 
                    ? 'border-primary shadow-lg scale-105 z-10' 
                    : 'border-gray-200 hover:border-primary/50'
                } ${hoveredTier === tier.name ? 'scale-105' : ''}`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                    {isYearly ? tier.yearlyPrice : tier.monthlyPrice}€
                    <span className="ml-1 text-2xl font-medium text-gray-500">/{isYearly ? 'an' : 'mois'}</span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${
                      tier.highlighted 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-primary/10 hover:bg-primary/20 text-primary'
                    }`}
                  >
                    Commencer
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-16 border-t border-gray-200 pt-16 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900">Questions fréquemment posées</h2>
        <div className="mt-6 space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Quels modes de paiement acceptez-vous ?</h3>
            <p className="mt-2 text-base text-gray-500">
              Nous acceptons toutes les principales cartes de crédit, PayPal et les virements bancaires pour les forfaits annuels.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Puis-je changer de forfait ultérieurement ?</h3>
            <p className="mt-2 text-base text-gray-500">
              Oui, vous pouvez passer à un forfait supérieur ou inférieur à tout moment. Les frais ou crédits au prorata seront appliqués à votre prochain cycle de facturation.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Quelle est votre politique de remboursement ?</h3>
            <p className="mt-2 text-base text-gray-500">
              Nous offrons une garantie de remboursement de 30 jours. Si vous n'êtes pas satisfait de notre produit, vous pouvez demander un remboursement complet dans les 30 premiers jours de votre abonnement.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-gray-200 pt-16 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Vous avez encore des questions ?</h2>
        <p className="mt-4 text-lg text-gray-500">
          Nous sommes là pour vous aider. Contactez notre équipe de support pour obtenir de l'aide.
        </p>
        <Button className="mt-6" variant="outline">
          Contacter le support
        </Button>
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
  )
}