'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flame, Snowflake, ChevronRight, Eye, X, TrendingUp, TrendingDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const trainingPrograms = [
  { id: 1, name: 'New Employee Onboarding' },
  { id: 2, name: 'Leadership Development' },
  { id: 3, name: 'Customer Service Excellence' },
]

const surveyStats = {
  hot: { 
    sent: 150, 
    completed: 120, 
    avgResponseTime: '1 day', 
    activePrograms: 2,
    trend: 'up' as const,
    completionRate: '80%',
    avgSatisfaction: 4.5
  },
  cold: { 
    sent: 100, 
    completed: 80, 
    avgResponseTime: '5 days', 
    activePrograms: 3,
    trend: 'down' as const,
    completionRate: '75%',
    avgSatisfaction: 4.2
  }
}

const surveyQuestions = {
  hot: [
    "How would you rate the overall training experience? 🌟",
    "Was the content relevant to your job responsibilities? 🎯",
    "How likely are you to apply what you've learned in your daily work? 🚀",
    "Did the trainer effectively communicate the material? 🗣️",
    "What aspects of the training could be improved? 🔧"
  ],
  cold: [
    "Have you applied the skills learned in the training to your work? 💼",
    "Has the training improved your job performance? 📈",
    "What challenges have you faced in implementing what you learned? 🧗",
    "Would you recommend this training to your colleagues? 👥",
    "What additional support would help you better apply the training concepts? 🤝"
  ]
}

export default function FormManagement() {
  const [selectedPrograms, setSelectedPrograms] = useState({ hot: '', cold: '' })
  const [viewingSurvey, setViewingSurvey] = useState<'hot' | 'cold' | null>(null)
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [])

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleAttachSurvey = (surveyType: 'hot' | 'cold') => {
    if (!selectedPrograms[surveyType]) {
      showNotification(`Please select a training program for the ${surveyType} survey before attaching.`, 'error')
      return
    }

    console.log(`Attaching ${surveyType} survey to program: ${selectedPrograms[surveyType]}`)
    showNotification(`${surveyType.charAt(0).toUpperCase() + surveyType.slice(1)} survey successfully attached to "${selectedPrograms[surveyType]}". Participants will receive it shortly.`, 'success')
    setSelectedPrograms(prev => ({ ...prev, [surveyType]: '' }))
  }

  const SurveyCard = ({ type }: { type: 'hot' | 'cold' }) => {
    const isHot = type === 'hot'
    const icon = isHot ? <Flame className="text-yellow-300" size={28} /> : <Snowflake className="text-blue-300" size={28} />
    const title = isHot ? "Hot Survey" : "Cold Survey"
    const description = isHot 
      ? "Capture immediate feedback right after training sessions" 
      : "Assess long-term impact and application of training"
    const gradient = isHot 
      ? 'bg-gradient-to-br rounded-t-lg from-orange-400 via-red-500 to-pink-500'
      : 'bg-gradient-to-br rounded-t-lg from-blue-400 via-cyan-500 to-teal-500'

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="perspective-1000  w-full"
      >
        <Card className="flex flex-col group transform transition-all border-b rounded-b-lg duration-300 hover:shadow-xl">
          <CardHeader className={`${gradient} transition-colors duration-300 text-white`}>
            <CardTitle className="flex items-center 2xl:text-2xl sm:text-lg">
              {icon}
              <motion.span 
                className="ml-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.span>
            </CardTitle>
            <CardDescription className="text-white/80 2xl:text-lg sm:text-sm">{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow p-4 sm:p-6 bg-gradient-to-b from-white to-gray-50">
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <StatBox emoji="📤" value={surveyStats[type].sent} label="Surveys Sent" description="Total surveys distributed" />
              <StatBox emoji="✅" value={surveyStats[type].completed} label="Completed" description="Surveys filled out" />
              <StatBox emoji="⏱️" value={surveyStats[type].avgResponseTime} label="Avg. Response Time" description="Time to complete survey" />
              <StatBox emoji="👥" value={surveyStats[type].activePrograms} label="Active Programs" description="Ongoing trainings" />
              <StatBox 
                emoji={surveyStats[type].trend === 'up' ? "📈" : "📉"} 
                value={surveyStats[type].completionRate} 
                label="Completion Rate" 
                description="% of surveys completed"
                trend={surveyStats[type].trend}
              />
              <StatBox 
                emoji="⭐" 
                value={surveyStats[type].avgSatisfaction.toFixed(1)} 
                label="Avg. Satisfaction" 
                description="Out of 5 stars"
                showStars={true}
              />
            </motion.div>
            <div className="space-y-4">
              <Select value={selectedPrograms[type]} onValueChange={(value) => setSelectedPrograms(prev => ({ ...prev, [type]: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a training program to attach survey" />
                </SelectTrigger>
                <SelectContent>
                  {trainingPrograms.map((program) => (
                    <SelectItem key={program.id} value={program.name}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Button onClick={() => handleAttachSurvey(type)} className="w-full sm:text-xs sm:w-auto group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                    Attach {title.split(' ')[0]} Survey
                    <ChevronRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Button variant="outline" onClick={() => setViewingSurvey(type)} className="w-full sm:text-xs sm:w-auto group">
                    View Survey Questions
                    <Eye className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const StatBox = ({ emoji, value, label, description, trend, showStars }: { 
    emoji: string, 
    value: string | number, 
    label: string, 
    description: string,
    trend?: 'up' | 'down',
    showStars?: boolean
  }) => (
    <motion.div 
      className="flex flex-col items-center bg-white rounded-lg p-2 sm:p-4 shadow-md"
      whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0], transition: { duration: 0.2 } }}
    >
      <div className="mb-1 sm:mb-2 text-2xl sm:text-4xl">{emoji}</div>
      <span className="font-semibold text-sm sm:text-lg">{value}</span>
      <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">{label}</span>
      <span className="text-xs text-gray-500 text-center mt-1 hidden 2xl:block">{description}</span>
      {trend && (
        <div className={`mt-1 sm:mt-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="ml-1 text-xs">{trend === 'up' ? 'Increasing' : 'Decreasing'}</span>
        </div>
      )}
      {showStars && (
        <div className="mt-1 sm:mt-2 flex">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-xs sm:text-sm hidden 2xl:block ${i < Math.floor(Number(value)) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
          ))}
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="container mx-auto px-4 sm:p-5 lg:px-8 py-8 max-h-fit relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <SurveyCard type="hot" />
        <SurveyCard type="cold" />
      </div>

      <AnimatePresence>
        {viewingSurvey && (
          <Dialog open={!!viewingSurvey} onOpenChange={() => setViewingSurvey(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  {viewingSurvey === 'hot' ? (
                    <><Flame className="text-red-500 mr-2" size={24} /> Hot Survey Questions 🔥</>
                  ) : (
                    <><Snowflake className="text-blue-500 mr-2" size={24} /> Cold Survey Questions ❄️</>
                  )}
                </DialogTitle>
                <DialogDescription>
                  {viewingSurvey === 'hot' 
                    ? "These questions are asked immediately after training completion" 
                    : "These questions assess long-term impact, typically sent weeks after training"}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Survey Questions:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {surveyQuestions[viewingSurvey].map((question, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {question}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white flex items-center max-w-sm`}
          >
            <span className="text-sm sm:text-base">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}