import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface PricingTier {
  name: string
  price: number
  description: string
  features: string[]
  highlighted?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    price: 9,
    description: "Essential features for individuals",
    features: ["1 user", "5 projects", "5GB storage", "Basic support"],
  },
  {
    name: "Pro",
    price: 29,
    description: "Advanced features for professionals",
    features: ["5 users", "20 projects", "50GB storage", "Priority support", "Advanced analytics"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: 99,
    description: "Complete solution for large teams",
    features: ["Unlimited users", "Unlimited projects", "500GB storage", "24/7 dedicated support", "Custom integrations"],
  },
]

export default function PricingPage() {
  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-xl text-gray-500">
          Choose the perfect plan for your needs. Always know what you'll pay.
        </p>
      </div>

      <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
        {pricingTiers.map((tier) => (
          <Card 
            key={tier.name} 
            className={`flex flex-col justify-between ${
              tier.highlighted 
                ? 'border-primary shadow-lg scale-105 z-10' 
                : 'border-gray-200'
            }`}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
              <CardDescription className="mt-2">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                ${tier.price}
                <span className="ml-1 text-2xl font-medium text-gray-500">/mo</span>
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
                Get started
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 border-t border-gray-200 pt-16 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900">Frequently asked questions</h2>
        <div className="mt-6 space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900">What forms of payment do you accept?</h3>
            <p className="mt-2 text-base text-gray-500">
              We accept all major credit cards, PayPal, and bank transfers for annual plans.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Can I change my plan later?</h3>
            <p className="mt-2 text-base text-gray-500">
              Yes, you can upgrade or downgrade your plan at any time. Prorated charges or credits will be applied to your next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">What is your refund policy?</h3>
            <p className="mt-2 text-base text-gray-500">
              We offer a 30-day money-back guarantee. If you're not satisfied with our product, you can request a full refund within the first 30 days of your subscription.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-gray-200 pt-16 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Still have questions?</h2>
        <p className="mt-4 text-lg text-gray-500">
          We're here to help. Contact our support team for assistance.
        </p>
        <Button className="mt-6" variant="outline">
          Contact Support
        </Button>
      </div>
    </div>
  )
}