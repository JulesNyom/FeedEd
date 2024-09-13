'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqItems: FAQItem[] = [
  {
    question: "Comment créer mon premier sondage ?",
    answer: "Pour créer votre premier sondage, connectez-vous à votre compte et cliquez sur le bouton 'Créer un nouveau sondage' sur votre tableau de bord. Vous pouvez ensuite choisir parmi nos modèles ou commencer de zéro. Notre interface intuitive de glisser-déposer facilite l'ajout de questions et la personnalisation de votre sondage.",
    category: "Premiers pas"
  },
  {
    question: "Quels types de questions puis-je inclure dans mon sondage ?",
    answer: "Nous proposons une large gamme de types de questions, notamment des choix multiples, des échelles d'évaluation, des réponses textuelles ouvertes, et plus encore. Vous pouvez également créer des questions basées sur la logique qui apparaissent en fonction des réponses précédentes.",
    category: "Conception de sondage"
  },
  {
    question: "Comment puis-je diffuser mon sondage ?",
    answer: "Vous pouvez diffuser votre sondage par différents canaux. Nous proposons des invitations par e-mail, le partage sur les réseaux sociaux, des codes QR et des widgets intégrables pour sites web. Vous pouvez également générer une URL unique pour votre sondage à partager directement avec les participants.",
    category: "Distribution"
  },
  {
    question: "Quels types d'analyses proposez-vous ?",
    answer: "Notre plateforme offre des analyses complètes comprenant des résultats en temps réel, des rapports personnalisés et des outils de visualisation de données. Vous pouvez voir les taux de réponse, les réponses individuelles et les données agrégées. Nous proposons également des options d'exportation de vos données pour une analyse plus approfondie.",
    category: "Analytique"
  },
  {
    question: "Mes données de sondage sont-elles sécurisées ?",
    answer: "Oui, nous prenons très au sérieux la sécurité des données. Toutes les données de sondage sont cryptées pendant le transit et au repos. Nous utilisons des protocoles de sécurité standards de l'industrie et effectuons régulièrement des audits de sécurité pour garantir que vos données restent protégées.",
    category: "Sécurité"
  },
  {
    question: "Quels forfaits tarifaires proposez-vous ?",
    answer: "Nous proposons des forfaits tarifaires flexibles adaptés aux entreprises de toutes tailles. Nos forfaits vont d'un niveau de base gratuit pour des sondages simples à des solutions d'entreprise pour des recherches à grande échelle. Vous pouvez consulter tous les détails de nos tarifs sur notre page de tarification.",
    category: "Tarification"
  },
]

export default function QuestionSection () {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section className="bg-gradient-to-b from-background to-primary/5 rounded-3xl py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4">FAQ</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Questions fréquemment posées
          </h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Trouvez des réponses aux questions courantes sur notre plateforme de sondage. Vous ne trouvez pas ce que vous cherchez ? Contactez notre équipe d'assistance.
          </p>
        </div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {faqItems.map((item, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
                expandedIndex === index ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => toggleExpand(index)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    {item.question}
                  </span>
                  {expandedIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent>
                      <p className="text-gray-600 mb-4">{item.answer}</p>
                      <Badge variant="secondary">{item.category}</Badge>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}