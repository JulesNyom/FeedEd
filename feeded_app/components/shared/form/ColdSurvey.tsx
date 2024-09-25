"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, ChevronLeft, Send } from 'lucide-react'

const questions = [
  { id: 1, type: 'text', question: "Votre nom :" },
  { id: 2, type: 'text', question: "Votre prénom :" },
  {
    id: 3,
    type: 'radio',
    question: "Avez-vous obtenu un emploi ou évolué professionnellement depuis la formation ?",
    options: [
      "Oui, j'ai trouvé un emploi lié à la formation.",
      "Oui, j'ai obtenu une promotion ou évolué dans mon poste actuel.",
      "Non, je suis toujours à la recherche d'un emploi.",
      "Non, je n'ai pas encore évolué professionnellement."
    ]
  },
  { id: 4, type: 'text', question: "Si vous avez obtenu un emploi, dans quel secteur travaillez-vous maintenant ?" },
  {
    id: 5,
    type: 'radio',
    question: "Dans quelle mesure utilisez-vous les compétences acquises lors de la formation dans votre travail quotidien ?",
    options: ['Très fréquemment', 'Fréquemment', 'De temps en temps', 'Rarement', 'Jamais']
  },
  {
    id: 6,
    type: 'radio',
    question: "Comment évalueriez-vous l'impact de la formation sur votre confiance en vos capacités professionnelles ?",
    options: ['Impact très positif', 'Impact positif', 'Peu d\'impact', 'Pas d\'impact du tout']
  },
  {
    id: 7,
    type: 'radio',
    question: "Pensez-vous que la formation vous a préparé(e) de manière adéquate aux défis professionnels que vous rencontrez ?",
    options: ['Oui, parfaitement', 'Oui, en partie', 'Non, pas vraiment', 'Non, pas du tout']
  },
  {
    id: 8,
    type: 'radio',
    question: "Depuis la formation, avez-vous entrepris d'autres actions pour développer vos compétences (formations supplémentaires, auto-apprentissage, etc.) ?",
    options: ['Oui', 'Non']
  },
  {
    id: 9,
    type: 'radio',
    question: "Recommanderiez-vous cette formation à d'autres personnes cherchant à évoluer dans leur carrière ?",
    options: ['Oui, sans hésiter', 'Oui, avec quelques réserves', 'Non, pas vraiment', 'Non, pas du tout']
  },
  {
    id: 10,
    type: 'textarea',
    question: "Quels sont les aspects de la formation que vous avez trouvés les plus bénéfiques ?"
  },
  {
    id: 11,
    type: 'textarea',
    question: "Y a-t-il des compétences ou des sujets que vous auriez aimé approfondir davantage pendant la formation ?"
  },
  {
    id: 12,
    type: 'textarea',
    question: "Avez-vous des suggestions sur comment nous pourrions améliorer cette formation pour mieux préparer les futurs apprenants à leurs carrières ?"
  },
  {
    id: 13,
    type: 'textarea',
    question: "Avez-vous des commentaires supplémentaires concernant votre expérience avec notre formation ?"
  }
]

export default function ColdSurvey() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 flex flex-col justify-between">
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
                {questions[currentQuestion].type === 'text' && (
                  <Input
                    type="text"
                    value={answers[questions[currentQuestion].id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="w-full bg-white bg-opacity-20 border-0 text-white text-sm sm:text-base placeholder-white placeholder-opacity-60 focus:ring-2 focus:ring-white py-1.5 sm:py-2"
                    placeholder="Tapez votre réponse ici"
                  />
                )}
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
                className="bg-white text-blue-600 hover:bg-opacity-90 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold"
              >
                Suivant
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="bg-white text-blue-600 hover:bg-opacity-90 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold"
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