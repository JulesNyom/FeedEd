"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Users, ThumbsUp, Star, Brain, Award, Send, MessageSquare } from 'lucide-react'

const dashboardData = {
  totalFormations: 120,
  satisfactionGlobale: 92,
  participantsFormes: 1500,
  tauxRecommandation: 95,
  noteContenu: 4.7,
  noteFormateurs: 4.8,
  tauxApplication: 88,
  formsSent: 2000,
  formsResponded: 1850
}

export default function Dashboard() {
  const [period, setPeriod] = useState("mois")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Simuler un chargement de données
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const cardData = [
    { title: "Formations terminées", value: dashboardData.totalFormations, icon: BookOpen, detail: "Augmentation de 15% par rapport à la période précédente" },
    { title: "Satisfaction globale", value: `${dashboardData.satisfactionGlobale}%`, icon: ThumbsUp, detail: "Stable par rapport à la période précédente" },
    { title: "Participants formés", value: dashboardData.participantsFormes, icon: Users, detail: "Augmentation de 10% par rapport à la période précédente" },
    { title: "Taux de recommandation", value: `${dashboardData.tauxRecommandation}%`, icon: Star, detail: "Augmentation de 5% par rapport à la période précédente" },
    { title: "Note du contenu", value: dashboardData.noteContenu.toFixed(1), icon: Award, detail: "Sur une échelle de 1 à 5" },
    { title: "Note des formateurs", value: dashboardData.noteFormateurs.toFixed(1), icon: Star, detail: "Sur une échelle de 1 à 5" },
    { title: "Taux d'application", value: `${dashboardData.tauxApplication}%`, icon: Brain, detail: "Des connaissances acquises mises en pratique" },
    { title: "Formulaires envoyés", value: dashboardData.formsSent, icon: Send, detail: "Total des formulaires envoyés" },
    { title: "Formulaires répondus", value: dashboardData.formsResponded, icon: MessageSquare, detail: `Taux de réponse: ${((dashboardData.formsResponded / dashboardData.formsSent) * 100).toFixed(1)}%` },
  ]

  return (
    <div className="max-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8"
        >
          Bonjour, Marie
        </motion.h1>
        
        <div className="mb-6">
          <Select onValueChange={setPeriod} defaultValue={period}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner la période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semaine">Cette semaine</SelectItem>
              <SelectItem value="mois">Ce mois</SelectItem>
              <SelectItem value="trimestre">Ce trimestre</SelectItem>
              <SelectItem value="annee">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="overflow-hidden"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{card.title}</h2>
                    <card.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold">{card.value}</p>
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: hoveredCard === index ? 1 : 0, height: hoveredCard === index ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-gray-600 mt-2"
                  >
                    {card.detail}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}