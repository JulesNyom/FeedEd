"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUpIcon, ChevronDownIcon, GripVerticalIcon, PlusIcon, TrashIcon } from "lucide-react"

type QuestionType = "text" | "multiple_choice" | "checkbox" | "dropdown" | "rating_scale"

type Question = {
  id: string
  type: QuestionType
  title: string
  required: boolean
  options?: string[]
  minRating?: number
  maxRating?: number
}

type Section = {
  id: string
  title: string
  questions: Question[]
}

export default function SurveyCreator() {
  const [surveyTitle, setSurveyTitle] = useState("")
  const [surveyDescription, setSurveyDescription] = useState("")
  const [sections, setSections] = useState<Section[]>([
    { id: "section1", title: "Section 1", questions: [] },
  ])

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: `question${Date.now()}`,
      type: "text",
      title: "New Question",
      required: false,
    }
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    )
  }

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<Question>) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId ? { ...q, ...updates } : q
              ),
            }
          : section
      )
    )
  }

  const moveQuestion = (sectionId: string, questionId: string, direction: "up" | "down") => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const questionIndex = section.questions.findIndex((q) => q.id === questionId)
          if (questionIndex === -1) return section

          const newQuestions = [...section.questions]
          const [removedQuestion] = newQuestions.splice(questionIndex, 1)
          const newIndex = direction === "up" ? questionIndex - 1 : questionIndex + 1

          if (newIndex >= 0 && newIndex < newQuestions.length) {
            newQuestions.splice(newIndex, 0, removedQuestion)
          } else {
            newQuestions.splice(questionIndex, 0, removedQuestion)
          }

          return { ...section, questions: newQuestions }
        }
        return section
      })
    )
  }

  const addSection = () => {
    setSections([...sections, { id: `section${Date.now()}`, title: "New Section", questions: [] }])
  }

  const saveSurvey = () => {
    console.log("Saving survey:", { surveyTitle, surveyDescription, sections })
  }

  const publishSurvey = () => {
    console.log("Publishing survey:", { surveyTitle, surveyDescription, sections })
  }

  const addOption = (sectionId: string, questionId: string) => {
    updateQuestion(sectionId, questionId, {
      options: [...(sections.find(s => s.id === sectionId)?.questions.find(q => q.id === questionId)?.options || []), ""]
    })
  }

  const updateOption = (sectionId: string, questionId: string, optionIndex: number, value: string) => {
    const question = sections.find(s => s.id === sectionId)?.questions.find(q => q.id === questionId)
    if (question && question.options) {
      const newOptions = [...question.options]
      newOptions[optionIndex] = value
      updateQuestion(sectionId, questionId, { options: newOptions })
    }
  }

  const removeOption = (sectionId: string, questionId: string, optionIndex: number) => {
    const question = sections.find(s => s.id === sectionId)?.questions.find(q => q.id === questionId)
    if (question && question.options) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex)
      updateQuestion(sectionId, questionId, { options: newOptions })
    }
  }

  const renderQuestionFields = (section: Section, question: Question) => {
    switch (question.type) {
      case "text":
        return <Input disabled placeholder="Text answer" />
      case "multiple_choice":
      case "checkbox":
      case "dropdown":
        return (
          <div>
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center mt-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(section.id, question.id, index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(section.id, question.id, index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={() => addOption(section.id, question.id)} className="mt-2">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        )
      case "rating_scale":
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={question.minRating}
              onChange={(e) => updateQuestion(section.id, question.id, { minRating: parseInt(e.target.value) })}
              className="w-20"
            />
            <span>to</span>
            <Input
              type="number"
              placeholder="Max"
              value={question.maxRating}
              onChange={(e) => updateQuestion(section.id, question.id, { maxRating: parseInt(e.target.value) })}
              className="w-20"
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Create Your Survey</h1>
      <Card>
        <CardHeader>
          <CardTitle>Survey Details</CardTitle>
          <CardDescription>Enter the basic information about your survey</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-4">
              <div>
                <Label htmlFor="survey-title">Survey Title</Label>
                <Input
                  id="survey-title"
                  value={surveyTitle}
                  onChange={(e) => setSurveyTitle(e.target.value)}
                  placeholder="Enter survey title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="survey-description">Survey Description</Label>
                <Textarea
                  id="survey-description"
                  value={surveyDescription}
                  onChange={(e) => setSurveyDescription(e.target.value)}
                  placeholder="Enter survey description"
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {sections.map((section) => (
        <Card key={section.id} className="mt-6">
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {section.questions.map((question, index) => (
              <div key={question.id} className="mb-4 p-4 bg-gray-100 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <GripVerticalIcon className="mr-2 text-gray-400" />
                    <Input
                      value={question.title}
                      onChange={(e) =>
                        updateQuestion(section.id, question.id, {
                          title: e.target.value,
                        })
                      }
                      placeholder="Question title"
                      className="mr-2"
                    />
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveQuestion(section.id, question.id, "up")}
                      disabled={index === 0}
                    >
                      <ChevronUpIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveQuestion(section.id, question.id, "down")}
                      disabled={index === section.questions.length - 1}
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Select
                  value={question.type}
                  onValueChange={(value) =>
                    updateQuestion(section.id, question.id, {
                      type: value as QuestionType,
                      options: ["multiple_choice", "checkbox", "dropdown"].includes(value) ? [""] : undefined,
                      minRating: value === "rating_scale" ? 1 : undefined,
                      maxRating: value === "rating_scale" ? 5 : undefined,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                    <SelectItem value="rating_scale">Rating Scale</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  {renderQuestionFields(section, question)}
                </div>
                <div className="flex items-center mt-2">
                  <Switch
                    id={`required-${question.id}`}
                    checked={question.required}
                    onCheckedChange={(checked) =>
                      updateQuestion(section.id, question.id, { required: checked })
                    }
                  />
                  <Label htmlFor={`required-${question.id}`} className="ml-2">
                    Required
                  </Label>
                </div>
              </div>
            ))}
            <Button onClick={() => addQuestion(section.id)} className="mt-4">
              Add Question
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addSection} className="mt-4">
        Add Section
      </Button>
      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline">Preview</Button>
        <Button onClick={saveSurvey}>Save</Button>
        <Button onClick={publishSurvey}>Publish</Button>
      </div>
    </div>
  )
}