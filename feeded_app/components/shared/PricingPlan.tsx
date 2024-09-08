"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from 'lucide-react'

const pricingPlans = [
  {
    name: 'Basic',
    price: '$9',
    description: 'For individuals and small teams',
    features: ['Up to 5 projects', '5GB storage', 'Basic support'],
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For growing businesses',
    features: ['Unlimited projects', '50GB storage', 'Priority support', 'Advanced analytics'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: ['Unlimited everything', 'Dedicated support', 'Custom integrations', 'Advanced security'],
  },
]

export default function PricingSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold tracking-tighter sm:text-5xl transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Choose Your Plan
          </h2>
          <p className={`mt-4 text-muted-foreground md:text-xl transition-all duration-500 ease-in-out delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Select the perfect plan for your needs
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Card key={plan.name} className={`flex flex-col transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: `${(index + 1) * 100}ms` }}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-4xl font-bold mb-4">{plan.price}</div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Choose {plan.name}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}