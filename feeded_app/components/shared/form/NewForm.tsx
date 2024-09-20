"use client"

import { useState } from 'react'
import { PlusCircle, Trash2, ChevronUp, ChevronDown, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Option = {
  id: number
  text: string
}

type Question = {
  id: number
  name: string
  type: string
  text: string
  options: Option[]
}

type QuestionItemProps = {
  question: Question
  index: number
  totalQuestions: number
  updateQuestion: (id: number, field: string, value: string) => void
  removeQuestion: (id: number) => void
  addOption: (questionId: number) => void
  updateOption: (questionId: number, optionId: number, text: string) => void
  removeOption: (questionId: number, optionId: number) => void
  moveQuestion: (id: number, direction: 'up' | 'down') => void
}

const QuestionItem = ({ 
  question, 
  index, 
  totalQuestions,
  updateQuestion, 
  removeQuestion, 
  addOption, 
  updateOption, 
  removeOption,
  moveQuestion
}: QuestionItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      <AccordionItem value={`item-${index}`} className="border rounded-lg overflow-hidden mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <AccordionTrigger className="hover:no-underline px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
          <div className="flex items-center w-full">
            <span className="font-medium mr-2 text-blue-700 dark:text-blue-300">Q{index + 1}.</span>
            <span className="text-left flex-grow truncate mr-2">{question.name || "Unnamed Question"}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2 bg-white dark:bg-gray-800">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Question Name"
                value={question.name}
                onChange={(e) => updateQuestion(question.id, 'name', e.target.value)}
                className="flex-grow focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter question text"
                value={question.text}
                onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                className="flex-grow focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
              <Select
                value={question.type}
                onValueChange={(value) => updateQuestion(question.id, 'type', value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="multipleChoice">Multiple Choice</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(question.type === 'checkbox' || question.type === 'multipleChoice') && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Options</Label>
                <AnimatePresence>
                  {question.options.map((option, optionIndex) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center space-x-2"
                    >
                      {question.type === 'checkbox' ? (
                        <Checkbox disabled />
                      ) : (
                        <RadioGroup>
                          <RadioGroupItem value={option.id.toString()} disabled />
                        </RadioGroup>
                      )}
                      <Input
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option.text}
                        onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                        className="flex-grow focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(question.id, option.id)}
                        disabled={question.options.length <= 2}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors duration-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(question.id)}
                  className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveQuestion(question.id, 'up')}
                  disabled={index === 0}
                  className="transition-all duration-300"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveQuestion(question.id, 'down')}
                  disabled={index === totalQuestions - 1}
                  className="transition-all duration-300"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeQuestion(question.id)}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Question
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  )
}

export default function SurveyCreator() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      name: `Question ${questions.length + 1}`,
      type: 'text',
      text: '',
      options: []
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id: number, field: string, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        if (field === 'type' && (value === 'checkbox' || value === 'multipleChoice') && q.options.length === 0) {
          return { ...q, [field]: value, options: [{ id: Date.now(), text: '' }, { id: Date.now() + 1, text: '' }] }
        }
        return { ...q, [field]: value }
      }
      return q
    }))
  }

  const addOption = (questionId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, { id: Date.now(), text: '' }] }
      }
      return q
    }))
  }

  const updateOption = (questionId: number, optionId: number, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: q.options.map(o => o.id === optionId ? { ...o, text } : o) }
      }
      return q
    }))
  }

  const removeOption = (questionId: number, optionId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, options: q.options.filter(o => o.id !== optionId) }
      }
      return q
    }))
  }

  const moveQuestion = (id: number, direction: 'up' | 'down') => {
    const index = questions.findIndex(q => q.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return
    }

    const newQuestions = [...questions]
    const [movedQuestion] = newQuestions.splice(index, 1)
    newQuestions.splice(direction === 'up' ? index - 1 : index + 1, 0, movedQuestion)
    setQuestions(newQuestions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (title.trim() === '') {
      setMessage({ type: 'error', text: "Please enter a survey title." })
      return
    }

    if (questions.length === 0) {
      setMessage({ type: 'error', text: "Please add at least one question." })
      return
    }

    if (questions.some(q => q.text.trim() === '')) {
      setMessage({ type: 'error', text: "All questions must have text." })
      return
    }

    if (questions.some(q => (q.type === 'checkbox' || q.type === 'multipleChoice') && q.options.length < 2)) {
      setMessage({ type: 'error', text: "Checkbox and multiple choice questions must have at least two options." })
      return
    }

    // Here you would typically send the survey data to your backend
    console.log('Survey data:', { title, description, questions })

    setMessage({ type: 'success', text: "Your survey has been created!" })

    // Reset form
    setTitle('')
    setDescription('')
    setQuestions([])
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto shadow-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center">Create Your Survey</CardTitle>
            <CardDescription className="text-center text-blue-100">Design an engaging survey in minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-900">
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                <AlertTitle>{message.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-medium text-blue-700 dark:text-blue-300">Survey Title</Label>
              <Input
                id="title"
                placeholder="Enter an engaging title for your survey"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-medium text-blue-700 dark:text-blue-300">Survey Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a brief description of your survey"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-y focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={addQuestion}
                  variant="secondary"
                  size="sm"
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover: to-blue-600 text-white transition-all duration-300 hover:scale-105"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-2">
                <AnimatePresence>
                  {questions.map((question, index) => (
                    <QuestionItem
                      key={question.id}
                      question={question}
                      index={index}
                      totalQuestions={questions.length}
                      updateQuestion={updateQuestion}
                      removeQuestion={removeQuestion}
                      addOption={addOption}
                      updateOption={updateOption}
                      removeOption={removeOption}
                      moveQuestion={moveQuestion}
                    />
                  ))}
                </AnimatePresence>
              </Accordion>
            </div>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-blue-600 to-indigo-600">
            <Button
              type="submit"
              className="w-full text-lg font-semibold py-6 bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105"
            >
              Create Survey
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}