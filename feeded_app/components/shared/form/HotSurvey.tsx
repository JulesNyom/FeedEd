"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const questions = [
  {
    id: 1,
    type: "multiple",
    question: "Quelle est votre fréquence d'utilisation de FeedEd ?",
    options: ["Quotidiennement", "Hebdomadairement", "Mensuellement", "Rarement"]
  },
  {
    id: 2,
    type: "scale",
    question: "Sur une échelle de 1 à 5, comment évaluez-vous la facilité d'utilisation de FeedEd ?",
    min: 1,
    max: 5
  },
  {
    id: 3,
    type: "text",
    question: "Quelle fonctionnalité aimeriez-vous voir ajoutée à FeedEd ?"
  }
]

export default function HotSurvey () {
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

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col flex-grow">
        <div className="mb-8">
          <svg className="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-lg lg:max-w-xl xl:max-w-xl 2xl:max-w-xl">
            <motion.div
              className="h-2 bg-blue-200 rounded-full mb-8"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  {questions[currentQuestion].question}
                </h2>
                {questions[currentQuestion].type === "multiple" && (
                  <div className="space-y-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                          answers[questions[currentQuestion].id] === option
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
                {questions[currentQuestion].type === "scale" && (
                  <div className="flex justify-between items-center">
                    {[...Array(5)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index + 1)}
                        className={`w-12 h-12 rounded-full text-lg font-semibold transition-all duration-200 ${
                          answers[questions[currentQuestion].id] === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
                {questions[currentQuestion].type === "text" && (
                  <textarea
                    value={answers[questions[currentQuestion].id] || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="w-full p-4 rounded-lg bg-gray-100 text-gray-800 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre réponse ici..."
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md text-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestion === questions.length - 1}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 shadow-md text-white hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}