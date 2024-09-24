"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, ChevronLeft, Send } from 'lucide-react'

const questions = [
  {
    id: 1,
    type: 'radio',
    question: "À quel point êtes-vous satisfait(e) de cette formation ?",
    options: ['Très satisfait(e)', 'Satisfait(e)', 'Moyennement satisfait(e)', 'Insatisfait(e)', 'Très insatisfait(e)']
  },
  {
    id: 2,
    type: 'radio',
    question: "La formation a-t-elle répondu à vos attentes ?",
    options: ['Oui, entièrement', 'Oui, en partie', 'Non, pas vraiment', 'Non, pas du tout']
  },
  {
    id: 3,
    type: 'radio',
    question: "Comment évaluez-vous le contenu de la formation ?",
    options: ['Très utile et pertinent', 'Utile', 'Moyennement utile', 'Pas utile du tout']
  },
  {
    id: 4,
    type: 'radio',
    question: "Comment évaluez-vous la clarté des explications fournies par le formateur ?",
    options: ['Très clair', 'Clair', 'Moyennement clair', 'Pas clair du tout']
  },
  {
    id: 5,
    type: 'radio',
    question: "Comment évaluez-vous l'accessibilité et la disponibilité du centre de formation ?",
    options: ['Très accessible et disponible', 'Accessible et disponible', 'Moyennement accessible', 'Pas du tout accessible']
  },
  {
    id: 6,
    type: 'radio',
    question: "Comment évaluez-vous la communication avec le centre de formation (informations, rappels, organisation) ?",
    options: ['Très bonne', 'Bonne', 'Moyenne', 'Mauvaise']
  },
  {
    id: 7,
    type: 'textarea',
    question: "Qu'avez-vous le plus apprécié dans cette formation et dans votre relation avec le centre de formation ?"
  },
  {
    id: 8,
    type: 'radio',
    question: "Recommanderiez-vous cette formation et ce centre de formation à d'autres personnes ?",
    options: ['Oui', 'Non', 'Peut-être']
  },
  {
    id: 9,
    type: 'textarea',
    question: "Avez-vous des suggestions ou des commentaires supplémentaires concernant votre expérience avec le centre de formation ?"
  }
]

export default function HotSurvey() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer })
  }

  const handleSubmit = () => {
    console.log('Survey submitted:', answers)
    // Here you would typically send the answers to your backend
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex flex-col justify-between">
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="space-y-1 sm:space-y-2 text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">{questions[currentQuestion].question}</h2>
                <p className="text-xs sm:text-sm text-white text-opacity-80">Question {currentQuestion + 1} sur {questions.length}</p>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {questions[currentQuestion].type === 'radio' && (
                  <RadioGroup
                    value={answers[questions[currentQuestion].id] || ''}
                    onValueChange={handleAnswer}
                    className="space-y-1.5 sm:space-y-2"
                  >
                    {questions[currentQuestion].options.map((option) => (
                      <div key={option} className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-md p-1.5 sm:p-2 transition-colors hover:bg-opacity-30">
                        <RadioGroupItem value={option} id={option} className="border-white text-white" />
                        <Label htmlFor={option} className="text-white text-xs sm:text-sm font-medium cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {questions[currentQuestion].type === 'textarea' && (
                  <Textarea
                    value={answers[questions[currentQuestion].id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="w-full bg-white bg-opacity-20 border-0 text-white text-sm sm:text-base placeholder-white placeholder-opacity-60 focus:ring-2 focus:ring-white py-1.5 sm:py-2"
                    placeholder="Tapez votre réponse ici"
                    rows={4}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 sm:mt-6 flex justify-between items-center">
            <Button 
              onClick={handlePrevious} 
              disabled={currentQuestion === 0} 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 sm:p-1.5"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sr-only">Précédent</span>
            </Button>
            {currentQuestion < questions.length - 1 ? (
              <Button 
                onClick={handleNext} 
                className="bg-white text-purple-600 hover:bg-opacity-90 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold"
              >
                Suivant
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="bg-white text-purple-600 hover:bg-opacity-90 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold"
              >
                Soumettre
                <Send className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-0.5 bg-white bg-opacity-20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}