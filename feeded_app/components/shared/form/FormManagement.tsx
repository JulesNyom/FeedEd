"use client"

import React from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Clock, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

interface QuestionnaireStats {
  responseRate: number
  satisfactionScore: number
  averageResponseTime: string
  topStrengths: string[]
  topImprovements: string[]
  averageCollectionTime: number
}

interface QuestionnaireProps {
  title: string
  emoji: string
  stats: QuestionnaireStats
  gradient: string
  detailsLink: string
}

const StatBadge: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '%' }) => {
  let color = 'bg-red-500'
  if (value > 50) color = 'bg-yellow-500'
  if (value > 75) color = 'bg-green-500'
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Badge className={`${color} text-white`}>
        {value}{suffix}
      </Badge>
    </motion.div>
  )
}

const StatCard: React.FC<{ title: string; value: React.ReactNode; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
    <CardContent className="p-4 flex flex-col justify-between flex-grow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800 mt-auto">{value}</div>
    </CardContent>
  </Card>
)

const ListCard: React.FC<{ title: string; items: string[]; icon: React.ReactNode }> = ({ title, items, icon }) => (
  <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
    <CardContent className="p-4 flex flex-col flex-grow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {icon}
      </div>
      <ul className="list-disc list-inside flex-grow">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-gray-700">{item}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
)

const QuestionnaireCard: React.FC<QuestionnaireProps> = ({ title, emoji, stats, gradient, detailsLink }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full h-full"
  >
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className={`${gradient} p-4 lg:p-6 text-white`}>
        <motion.h2 
          className="text-xl lg:text-2xl font-bold flex items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="mr-2" role="img" aria-label={title}>{emoji}</span>
          {title}
        </motion.h2>
      </div>
      <CardContent className="p-4 lg:p-6 bg-gray-50 flex-grow">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          <StatCard 
            title="Taux de réponse global" 
            value={<StatBadge value={stats.responseRate} />} 
            icon={<span className="text-2xl" role="img" aria-label="Pourcentage">📊</span>}
          />
          <StatCard 
            title="Score de satisfaction" 
            value={`${stats.satisfactionScore.toFixed(1)}/5`} 
            icon={<Star className="w-6 h-6 text-yellow-400" />}
          />
          <StatCard 
            title="Temps moyen avant réponse" 
            value={stats.averageResponseTime} 
            icon={<Clock className="w-6 h-6 text-blue-500" />}
          />
          <ListCard 
            title="Top 3 des points forts" 
            items={stats.topStrengths} 
            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
          />
          <ListCard 
            title="Top 3 des axes d'amélioration" 
            items={stats.topImprovements} 
            icon={<TrendingDown className="w-6 h-6 text-red-500" />}
          />
          <StatCard 
            title="Délai moyen de collecte" 
            value={`${stats.averageCollectionTime}h`} 
            icon={<span className="text-2xl" role="img" aria-label="Sablier">⏳</span>}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end p-4 lg:p-6 bg-white">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href={detailsLink} passHref>
            <Button className={`text-white ${gradient}`}>
              Voir les détails <span className="ml-2" role="img" aria-label="Arrow right">➡️</span>
            </Button>
          </Link>
        </motion.div>
      </CardFooter>
    </Card>
  </motion.div>
)

export default function FormManagement () {
  const hotQuestionnaireStats: QuestionnaireStats = {
    responseRate: 85,
    satisfactionScore: 4.2,
    averageResponseTime: '2m 30s',
    topStrengths: ['Réactivité', 'Qualité du service', 'Amabilité'],
    topImprovements: ['Temps d\'attente', 'Suivi', 'Communication'],
    averageCollectionTime: 24
  }

  const coldQuestionnaireStats: QuestionnaireStats = {
    responseRate: 92,
    satisfactionScore: 4.5,
    averageResponseTime: '4m 15s',
    topStrengths: ['Résolution de problèmes', 'Expertise', 'Support technique'],
    topImprovements: ['Disponibilité', 'Documentation', 'Personnalisation'],
    averageCollectionTime: 48
  }

  return (
    <div className="h-fit bg-white m-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl grid gap-8 lg:grid-cols-2 place-items-stretch">
        <AnimatePresence>
          <QuestionnaireCard 
            title="Questionnaire à chaud" 
            emoji="🔥"
            stats={hotQuestionnaireStats} 
            gradient="bg-gradient-to-r from-orange-400 to-pink-500"
            detailsLink="/hot"
          />
          <QuestionnaireCard 
            title="Questionnaire à froid" 
            emoji="❄️"
            stats={coldQuestionnaireStats} 
            gradient="bg-gradient-to-r from-blue-400 to-indigo-500"
            detailsLink="/cold"
          />
        </AnimatePresence>
      </div>
    </div>
  )
}