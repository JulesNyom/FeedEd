"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Question {
  id: string;
  type: "text" | "scale" | "textarea";
  question: string;
  placeholder?: string;
}

const questions: Question[] = [
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
    id: "qualiteGlobale",
    type: "scale",
    question: "Comment évaluez-vous la qualité globale de la formation ?"
  },
  {
    id: "objectifsClairs",
    type: "scale",
    question: "Les objectifs de la formation ont-ils été clairement annoncés ?"
  },
  {
    id: "contenuAttentes",
    type: "scale",
    question: "Le contenu de la formation a-t-il répondu à vos attentes ?"
  },
  {
    id: "qualiteSupports",
    type: "scale",
    question: "Comment jugez-vous la qualité des supports pédagogiques utilisés ?"
  },
  {
    id: "maitriseSujet",
    type: "scale",
    question: "Le formateur maîtrisait-il le sujet ?"
  },
  {
    id: "interactivite",
    type: "scale",
    question: "Le formateur a-t-il su rendre la formation interactive et dynamique ?"
  },
  {
    id: "exercicesPertinents",
    type: "scale",
    question: "Les exercices pratiques étaient-ils pertinents et utiles ?"
  },
  {
    id: "organisationLogistique",
    type: "scale",
    question: "Comment évaluez-vous l'organisation logistique de la formation (salle, équipements, etc.) ?"
  },
  {
    id: "applicationConnaissances",
    type: "scale",
    question: "Pensez-vous pouvoir appliquer les connaissances acquises dans votre travail ?"
  },
  {
    id: "commentaires",
    type: "textarea",
    question: "Commentaires supplémentaires :",
    placeholder: "Vos commentaires ici"
  }
];

const HotSurvey: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAnswer = (answer: string | number) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
  };

  const isLastQuestion = currentQuestion === questions.length - 1;

  const validateAnswers = (): boolean => {
    return questions.every(q => answers[q.id] !== undefined && answers[q.id] !== "");
  };

  const handleSubmit = () => {
    if (validateAnswers()) {
      console.log("Submitting answers:", answers);
      setSubmitted(true);
    } else {
      alert("Veuillez répondre à toutes les questions avant de soumettre.");
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-orange-300 to-pink-500 animate-gradient-x"></div>
        <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-gray-200 text-center">
          <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Merci pour votre participation !</h2>
          <p className="text-gray-600">Vos réponses ont été enregistrées avec succès.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-orange-300 to-pink-500 animate-gradient-x"></div>
      <div className="relative w-full max-w-7xl mx-auto px-4 py-8 flex flex-col flex-grow z-10">
      <motion.div
            className="flex items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
          <p className="text-background text-xs font-semibold mt-3">En partenariat avec</p>
          
            <Link href="/" className="transition-transform hover:scale-105">
              <Image
                src="/assets/icons/feeded.svg"
                alt="Logo"
                width={125}
                height={50}
                className="text-background"
              />
            </Link>
          </motion.div>
        <div className="flex-grow flex flex-col items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-8 text-center"
          >
            Questionnaire de satisfaction à chaud - Formation
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
                  {questions[currentQuestion].question}
                </h2>
                {questions[currentQuestion].type === "text" && (
                  <input
                    type="text"
                    value={answers[questions[currentQuestion].id] as string || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder={questions[currentQuestion].placeholder}
                    className="w-full p-4 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200"
                  />
                )}
                {questions[currentQuestion].type === "scale" && (
                  <div className="flex justify-between items-center">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <motion.button
                        key={value}
                        onClick={() => handleAnswer(value)}
                        className={`w-12 h-12 rounded-full text-lg font-semibold transition-all duration-200 ${
                          answers[questions[currentQuestion].id] === value
                            ? "bg-orange-400 text-white"
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
                {questions[currentQuestion].type === "textarea" && (
                  <textarea
                    value={answers[questions[currentQuestion].id] as string || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder={questions[currentQuestion].placeholder}
                    className="w-full p-4 rounded-lg bg-gray-50 text-gray-800 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200"
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
                  className="flex items-center justify-center px-6 h-12 rounded-full bg-orange-400 shadow-md text-white hover:bg-orange-500 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Valider et envoyer
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleNext}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-400 shadow-md text-white hover:bg-orange-500 transition-all duration-200"
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
  );
};

export default HotSurvey;