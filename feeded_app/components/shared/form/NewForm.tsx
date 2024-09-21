'use client'

import { useState, useEffect, useRef } from 'react'
import { PlusCircle, Trash2, ChevronUp, ChevronDown, Plus, X, Copy, Sparkles, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  required: boolean
}

type QuestionItemProps = {
  question: Question
  index: number
  totalQuestions: number
  updateQuestion: (id: number, field: string, value: string | boolean) => void
  removeQuestion: (id: number) => void
  addOption: (questionId: number) => void
  updateOption: (questionId: number, optionId: number, text: string) => void
  removeOption: (questionId: number, optionId: number) => void
  moveQuestion: (id: number, direction: 'up' | 'down') => void
  duplicateQuestion: (id: number) => void
  setActiveQuestionId: (id: number | null) => void
  isActive: boolean
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
  moveQuestion,
  duplicateQuestion,
  setActiveQuestionId,
  isActive
}: QuestionItemProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isActive])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`border rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-md transition-all duration-300 ${isActive ? 'ring-2 ring-primary' : ''}`}
      onClick={() => setActiveQuestionId(question.id)}
    >
      <AccordionItem value={`item-${index}`}>
        <AccordionTrigger className="hover:no-underline px-4 py-3 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center w-full">
            <span className="font-medium mr-2 text-primary">{index + 1}.</span>
            <span className="text-left flex-grow truncate mr-2 font-semibold">{question.name || "Question sans nom"}</span>
            <span className="text-sm text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">{question.type}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2 bg-background">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Nom de la question"
                value={question.name}
                onChange={(e) => updateQuestion(question.id, 'name', e.target.value)}
                className="flex-grow"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Entrez le texte de la question"
                value={question.text}
                onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                className="flex-grow"
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
                  <SelectItem value="text">Texte</SelectItem>
                  <SelectItem value="multipleChoice">Choix multiple</SelectItem>
                  <SelectItem value="checkbox">Case à cocher</SelectItem>
                  <SelectItem value="rating">Évaluation</SelectItem>
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
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
                        className="flex-grow"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(question.id, option.id)}
                        disabled={question.options.length <= 2}
                        className="text-muted-foreground hover:text-destructive"
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
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une option
                </Button>
              </div>
            )}
            {question.type === 'rating' && (
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium">Note maximale :</Label>
                <Select
                  value={question.options[0]?.text || '5'}
                  onValueChange={(value) => updateOption(question.id, question.options[0]?.id || 0, value)}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Max" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 7, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={question.required}
                  onCheckedChange={(checked) => updateQuestion(question.id, 'required', checked)}
                  id={`required-${question.id}`}
                />
                <Label htmlFor={`required-${question.id}`}>Obligatoire</Label>
              </div>
              <div className="space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => moveQuestion(question.id, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Déplacer vers le haut</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => moveQuestion(question.id, 'down')}
                        disabled={index === totalQuestions - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Déplacer vers le bas</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => duplicateQuestion(question.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Dupliquer la question</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  )
}

export default function NewForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null)

  useEffect(() => {
    const savedSurvey = localStorage.getItem('savedSurvey')
    if (savedSurvey) {
      const { title, description, questions } = JSON.parse(savedSurvey)
      setTitle(title)
      setDescription(description)
      setQuestions(questions)
    }
  }, [])

  useEffect(() => {
    const surveyData = { title, description, questions }
    localStorage.setItem('savedSurvey', JSON.stringify(surveyData))
  }, [title, description, questions])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      name: `Question ${questions.length + 1}`,
      type: 'text',
      text: '',
      options: [],
      required: false
    }
    setQuestions([...questions, newQuestion])
    setActiveQuestionId(newQuestion.id)
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id))
    if (activeQuestionId === id) {
      setActiveQuestionId(questions.length > 1 ? questions[questions.length - 2].id : null)
    }
  }

  const updateQuestion = (id: number, field: string, value: string | boolean) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        if (field === 'type') {
          if (value === 'checkbox' || value === 'multipleChoice') {
            return { ...q, [field]: value, options: q.options.length === 0 ? [{ id: Date.now(), text: '' }, { id: Date.now() + 1, text: '' }] : q.options }
          } else if (value === 'rating') {
            return { ...q, [field]: value, options: [{ id: Date.now(), text: '5' }] }
          } else {
            return { ...q, [field]: value, options: [] }
          }
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

  const duplicateQuestion = (id: number) => {
    const questionToDuplicate = questions.find(q => q.id === id)
    if (questionToDuplicate) {
      const newQuestion = {
        ...questionToDuplicate,
        id: Date.now(),
        name: `${questionToDuplicate.name} (Copie)`,
        options: questionToDuplicate.options.map(o => ({ ...o, id: Date.now() + o.id }))
      }
      setQuestions([...questions, newQuestion])
      setActiveQuestionId(newQuestion.id)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (title.trim() === '') {
      setMessage({ type: 'error', text: "Veuillez entrer un titre pour le sondage." })
      return
    }

    if (questions.length === 0) {
      setMessage({ type: 'error', text: "Veuillez ajouter au moins une question." })
      return
    }

    if (questions.some(q => q.text.trim() === '')) {
      setMessage({ type: 'error', text: "Toutes les questions doivent avoir un texte." })
      return
    }

    if (questions.some(q => (q.type === 'checkbox' || q.type === 'multipleChoice') && q.options.length < 2)) {
      setMessage({ type: 'error', text: "Les questions à choix multiples et à cases à cocher doivent avoir au moins deux options." })
      return
    }

    console.log('Données du sondage:', { title, description, questions })

    setMessage({ type: 'success', text: "Votre sondage a été créé !" })

    setTitle('')
    setDescription('')
    setQuestions([])
    localStorage.removeItem('savedSurvey')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <Sparkles className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                Créateur de Sondage
              </span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Input
                placeholder="Entrez le titre du sondage"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full md:w-[300px]"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer le sondage
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/20">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                    <AlertTitle>{message.type === 'error' ? 'Erreur' : 'Succès'}</AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-lg font-medium">Description du sondage</Label>
                  <Textarea
                    id="description"
                    placeholder="Fournissez une brève description de votre sondage"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px] resize-y"
                  />
                </div>
                <div className="space-y-4">
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
                          duplicateQuestion={duplicateQuestion}
                          setActiveQuestionId={setActiveQuestionId}
                          isActive={activeQuestionId === question.id}
                        />
                      ))}
                    </AnimatePresence>
                  </Accordion>
                </div>
                <div className="flex justify-center space-x-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={addQuestion}
                          size="icon"
                          variant="outline"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ajouter une question</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {activeQuestionId !== null && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => removeQuestion(activeQuestionId)}
                            size="icon"
                            variant="outline"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supprimer la question</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}