'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2 } from 'lucide-react'

type QuestionType = 'choix-multiple' | 'texte' | 'evaluation'

interface Question {
  id: string
  type: QuestionType
  text: string
  options: string[]
}

export default function NewForm () {
  const [surveyTitle, setSurveyTitle] = useState('')
  const [surveyDescription, setSurveyDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      text: '',
      options: type === 'choix-multiple' ? [''] : [],
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, field: keyof Question, value: string | string[]) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, options: [...q.options, ''] } : q
    ))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: q.options.map((opt, index) => index === optionIndex ? value : opt)
      } : q
    ))
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, vous enverriez généralement les données du sondage à votre backend
    console.log('Sondage soumis:', { surveyTitle, surveyDescription, questions })
  }

  return (
    <div className="container sm:px-6 mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Créer un nouveau sondage</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Détails du sondage</CardTitle>
            <CardDescription>Fournissez les informations de base sur votre sondage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="survey-title">Titre du sondage</Label>
              <Input
                id="survey-title"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                placeholder="Entrez le titre du sondage"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="survey-description">Description du sondage</Label>
              <Textarea
                id="survey-description"
                value={surveyDescription}
                onChange={(e) => setSurveyDescription(e.target.value)}
                placeholder="Entrez la description du sondage"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions du sondage</CardTitle>
            <CardDescription>Ajoutez et configurez vos questions de sondage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Question {index + 1}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={question.type}
                    onValueChange={(value: QuestionType) => updateQuestion(question.id, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type de question" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="choix-multiple">Choix multiple</SelectItem>
                      <SelectItem value="texte">Texte</SelectItem>
                      <SelectItem value="evaluation">Évaluation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                    placeholder="Entrez le texte de la question"
                  />
                  {question.type === 'choix-multiple' && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <Input
                          key={optionIndex}
                          value={option}
                          onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(question.id)}
                      >
                        Ajouter une option
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            <div className="flex space-x-2">
              <Button type="button" onClick={() => addQuestion('choix-multiple')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter un choix multiple
              </Button>
              <Button type="button" onClick={() => addQuestion('texte')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter une question texte
              </Button>
              <Button type="button" onClick={() => addQuestion('evaluation')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter une question d'évaluation
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Button type="submit" className="w-full">Créer le sondage</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}