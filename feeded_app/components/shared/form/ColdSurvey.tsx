"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

const questions = [
  {
    id: "nom",
    type: "text",
    question: "Nom :",
    placeholder: "Votre nom"
  },
  {
    id: "prenom",
    type: "text",
    question: "Prénom :",
    placeholder: "Votre prénom"
  },
  {
    id: "formation",
    type: "text",
    question: "Intitulé de la formation suivie :",
    placeholder: "Nom de la formation"
  },
  {
    id: "situationProfessionnelle",
    type: "radio",
    question: "Quelle est votre situation professionnelle actuelle ?",
    options: [
      "En emploi (CDI, CDD, intérim)",
      "En formation complémentaire",
      "En recherche d'emploi",
      "Autre"
    ]
  },
  {
    id: "situationProfessionnelleAutre",
    type: "text",
    question: "Si 'Autre', précisez votre situation professionnelle :",
    placeholder: "Votre situation"
  },
  {
    id: "emploiGraceFormation",
    type: "radio",
    question: "Si vous êtes en emploi, est-ce grâce à la formation suivie ?",
    options: [
      "Oui, totalement",
      "Oui, partiellement",
      "Non",
      "Non applicable"
    ]
  },
  {
    id: "pertinenceConnaissances",
    type: "scale",
    question: "Les connaissances acquises lors de la formation sont pertinentes dans mon travail actuel ou ma recherche d'emploi."
  },
  {
    id: "miseEnPratique",
    type: "scale",
    question: "J'ai pu mettre en pratique les compétences apprises durant la formation."
  },
  {
    id: "impactSituation",
    type: "scale",
    question: "La formation a eu un impact positif sur ma situation professionnelle et/ou mon employabilité."
  },
  {
    id: "confiance",
    type: "scale",
    question: "Je me sens plus confiant(e) dans mes compétences professionnelles grâce à cette formation."
  },
  {
    id: "reponseBesoins",
    type: "scale",
    question: "Avec le recul, cette formation a répondu à mes besoins professionnels."
  },
  {
    id: "recommandation",
    type: "scale",
    question: "Je recommanderais cette formation à d'autres personnes dans ma situation."
  },
  {
    id: "suggestions",
    type: "textarea",
    question: "Avez-vous des suggestions pour améliorer cette formation et mieux préparer les apprenants au marché du travail ?",
    placeholder: "Vos suggestions ici"
  }
]

export default function ColdSurvey () {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

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

  const isLastQuestion = currentQuestion === questions.length - 1

  const validateAnswers = () => {
    return questions.every(q => answers[q.id] !== undefined && answers[q.id] !== "")
  }

  const handleSubmit = () => {
    if (validateAnswers()) {
      console.log("Submitting answers:", answers)
      setSubmitted(true)
    } else {
      alert("Veuillez répondre à toutes les questions avant de soumettre.")
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-400 animate-gradient-x"></div>
        <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-gray-200 text-center">
          <Check className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Merci pour votre participation !</h2>
          <p className="text-gray-600">Vos réponses ont été enregistrées avec succès.</p>
        </div>
      </div>
    )
  }

  const currentQuestionData = questions[currentQuestion]

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-400 animate-gradient-x"></div>
      <div className="relative w-full max-w-7xl mx-auto px-4 py-8 flex flex-col flex-grow z-10">
        <div className="mb-8">
          <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-8 text-center"
          >
            Questionnaire de satisfaction à froid - 3 mois après la formation
          </motion.h1>
          <div className="w-full max-w-lg lg:max-w-xl xl:max-w-xl 2xl:max-w-xl">
            <motion.div
              className="h-2 bg-white/30 rounded-full mb-8 overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  {currentQuestionData.question}
                </h2>
                {currentQuestionData.type === "text" && (
                  <input
                    type="text"
                    value={answers[currentQuestionData.id] || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder={currentQuestionData.placeholder}
                    className="w-full p-4 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                  />
                )}
                {currentQuestionData.type === "radio" && (
                  <div className="space-y-2">
                    {currentQuestionData.options.map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          value={option}
                          checked={answers[currentQuestionData.id] === option}
                          onChange={() => handleAnswer(option)}
                          className="form-radio text-blue-500 focus:ring-blue-400"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                {currentQuestionData.type === "scale" && (
                  <div className="flex justify-between items-center">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <motion.button
                        key={value}
                        onClick={() => handleAnswer(value)}
                        className={`w-12 h-12 rounded-full text-lg font-semibold transition-all duration-200 ${
                          answers[currentQuestionData.id] === value
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {value}
                      </motion.button>
                    ))}
                  </div>
                )}
                {currentQuestionData.type === "textarea" && (
                  <textarea
                    value={answers[currentQuestionData.id] || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder={currentQuestionData.placeholder}
                    className="w-full p-4 rounded-lg bg-gray-50 text-gray-800 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between mt-8">
              <motion.button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              {isLastQuestion ? (
                <motion.button
                  onClick={handleSubmit}
                  className="flex items-center justify-center px-6 h-12 rounded-full bg-blue-500 shadow-md text-white hover:bg-blue-600 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Valider et envoyer
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleNext}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 shadow-md text-white hover:bg-blue-600 transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}