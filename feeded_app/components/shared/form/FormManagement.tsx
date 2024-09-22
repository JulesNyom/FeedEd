'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from 'next/link'

interface Survey {
  id: number
  name: string
  creationDate: string
  responseCount: number
  programId: number | null
  isDeletable: boolean
}

interface TrainingProgram {
  id: number
  name: string
}

export default function FormManagement() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [filteredSurveys, setFilteredSurveys] = useState<Survey[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showProgramDialog, setShowProgramDialog] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null)
  const [programs] = useState<TrainingProgram[]>([
    { id: 1, name: 'Web Development' },
    { id: 2, name: 'Data Science' },
    { id: 3, name: 'UX Design' },
  ])
  const surveysPerPage = 5

  useEffect(() => {
    // Simuler le chargement des enquêtes depuis une API
    const mockSurveys: Survey[] = [
      { id: 1, name: "Enquête à chaud (par défaut)", creationDate: "2024-01-01", responseCount: 0, programId: null, isDeletable: false },
      { id: 2, name: "Enquête à froid (par défaut)", creationDate: "2024-01-01", responseCount: 0, programId: null, isDeletable: false },
      { id: 3, name: "Satisfaction Client", creationDate: "2024-09-15", responseCount: 150, programId: 1, isDeletable: true },
      { id: 4, name: "Évaluation des Compétences", creationDate: "2024-09-16", responseCount: 75, programId: 2, isDeletable: true },
    ];
    setSurveys(mockSurveys);
  }, []);

  const filterSurveys = useCallback(() => {
    let filtered = surveys
    if (searchTerm) {
      filtered = filtered.filter(survey => 
        survey.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredSurveys(filtered)
    setCurrentPage(1)
  }, [surveys, searchTerm])

  useEffect(() => {
    filterSurveys()
  }, [filterSurveys])

  // Logique de pagination
  const indexOfLastSurvey = currentPage * surveysPerPage
  const indexOfFirstSurvey = indexOfLastSurvey - surveysPerPage
  const currentSurveys = filteredSurveys.slice(indexOfFirstSurvey, indexOfLastSurvey)
  const totalPages = Math.ceil(filteredSurveys.length / surveysPerPage)

  const handleAttachProgram = (survey: Survey) => {
    setSelectedSurvey(survey)
    setSelectedProgramId(survey.programId)
    setShowProgramDialog(true)
  }

  const handleCreateSurvey = () => {
    // Redirection vers la page de création d'enquête
    console.log("Redirection vers la page de création d'enquête")
  }

  const handleProgramAttachment = () => {
    if (selectedSurvey && selectedProgramId !== null) {
      setSurveys(prevSurveys =>
        prevSurveys.map(survey =>
          survey.id === selectedSurvey.id ? { ...survey, programId: selectedProgramId } : survey
        )
      )
      setShowProgramDialog(false)
    }
  }

  const handleDeleteSurvey = (id: number) => {
    setSurveys(prevSurveys => prevSurveys.filter(survey => survey.id !== id))
  }

  const deletableSurveysCount = surveys.filter(survey => survey.isDeletable).length

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-3xl font-bold mb-6">Gestion des Enquêtes</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher des enquêtes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button 
          onClick={handleCreateSurvey}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" /> 
          <Link href="/createform">
            Créer une Nouvelle Enquête
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enquêtes ({deletableSurveysCount})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Date de Création</TableHead>
                  <TableHead>Réponses</TableHead>
                  <TableHead>Programme</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSurveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell>{survey.name}</TableCell>
                    <TableCell>{survey.creationDate}</TableCell>
                    <TableCell>{survey.responseCount}</TableCell>
                    <TableCell>
                      {survey.programId 
                        ? programs.find(p => p.id === survey.programId)?.name 
                        : "Non attaché"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleAttachProgram(survey)}>
                          Attacher
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteSurvey(survey.id)}
                          disabled={!survey.isDeletable}
                          aria-label={survey.isDeletable ? `Supprimer ${survey.name}` : `Impossible de supprimer ${survey.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      <Dialog open={showProgramDialog} onOpenChange={setShowProgramDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Attacher à un Programme</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="program" className="text-right">
                Programme
              </label>
              <Select
                value={selectedProgramId?.toString() || ""}
                onValueChange={(value) => setSelectedProgramId(Number(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un programme" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id.toString()}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleProgramAttachment}>Attacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}