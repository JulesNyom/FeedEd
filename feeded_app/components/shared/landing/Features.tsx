import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { features } from "@/lib"

export default function SurveyFeatures() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Collectez des feedbacks formation en un éclair
          </h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            FeedEd simplifie chaque étape : de la création à l'analyse de vos enquêtes de satisfaction, en un temps record.
          </p>
        </div>
        <div className="grid gap-12 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="aspect-video relative">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <Badge variant="secondary" className="text-sm font-medium">
                    {feature.badge}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <feature.icon className="h-6 w-6 text-primary" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}