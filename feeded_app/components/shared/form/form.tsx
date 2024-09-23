"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, ChevronLeft, Send } from 'lucide-react'

interface Question {
  id: number;
  type: 'text' | 'email' | 'radio' | 'textarea';
  question: string;
  options?: string[];
}

const questions: Question[] = [
  { id: 1, type: 'text', question: "What's your name?" },
  { id: 2, type: 'email', question: "What's your email address?" },
  { id: 3, type: 'radio', question: "How did you hear about us?", options: ['Social Media', 'Friend', 'Advertisement', 'Other'] },
  { id: 4, type: 'textarea', question: "Any additional comments?" },
]

interface Answers {
  [key: number]: string;
}

export default function Component() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})

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

  const handleAnswer = (answer: string) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questions[currentQuestion].id]: answer
    }));
  }

  const handleSubmit = () => {
    console.log('Survey submitted:', answers)
    // Here you would typically send the answers to your backend
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-500 flex flex-col justify-between">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-1 text-center">
                <h2 className="text-2xl font-bold text-white tracking-tight">{questions[currentQuestion].question}</h2>
                <p className="text-sm text-purple-100">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
              <div className="space-y-2">
                {questions[currentQuestion].type === 'text' && (
                  <Input
                    type="text"
                    value={answers[questions[currentQuestion].id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="w-full bg-white bg-opacity-20 border-0 text-white text-sm placeholder-purple-200 placeholder-opacity-70 focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30 py-1.5"
                    placeholder="Type your answer here"
                  />
                )}
                {questions[currentQuestion].type === 'email' && (
                  <Input
                    type="email"
                    value={answers[questions[currentQuestion].id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="w-full bg-white bg-opacity-20 border-0 text-white text-sm placeholder-purple-200 placeholder-opacity-70 focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30 py-1.5"
                    placeholder="Enter your email"
                  />
                )}
                {questions[currentQuestion].type === 'radio' && questions[currentQuestion].options && (
                  <RadioGroup
                    value={answers[questions[currentQuestion].id] || ''}
                    onValueChange={handleAnswer}
                    className="space-y-1.5"
                  >
                    {questions[currentQuestion].options.map((option) => (
                      <div key={option} className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-md p-2 transition-colors hover:bg-opacity-30">
                        <RadioGroupItem value={option} id={option} className="border-purple-200 text-purple-200" />
                        <Label htmlFor={option} className="text-white text-sm font-medium cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {questions[currentQuestion].type === 'textarea' && (
                  <Textarea
                    value={answers[questions[currentQuestion].id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="w-full bg-white bg-opacity-20 border-0 text-white text-sm placeholder-purple-200 placeholder-opacity-70 focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30"
                    placeholder="Type your comments here"
                    rows={3}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex justify-between items-center">
            <Button 
              onClick={handlePrevious} 
              disabled={currentQuestion === 0} 
              variant="outline" 
              className="border-purple-200 text-purple-200 hover:bg-purple-200 hover:bg-opacity-20 rounded-full p-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            {currentQuestion < questions.length - 1 ? (
              <Button 
                onClick={handleNext} 
                className="bg-purple-200 text-purple-800 hover:bg-purple-100 rounded-full px-4 py-1.5 font-semibold text-sm"
              >
                Next
                <ChevronRight className="h-3 w-3 ml-1.5" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="bg-purple-200 text-purple-800 hover:bg-purple-100 rounded-full px-4 py-1.5 font-semibold text-sm"
              >
                Submit
                <Send className="h-3 w-3 ml-1.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-0.5 bg-purple-200 bg-opacity-20">
        <motion.div
          className="h-full bg-purple-200"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}