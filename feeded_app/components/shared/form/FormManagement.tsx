'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Switch } from "@/components/ui/switch"
import Link from 'next/link'

interface Survey {
  id: number
  name: string
  creationDate: string
  responseCount: number
  programId: number | null
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
  const [programs, setPrograms] = useState<TrainingProgram[]>([
    { id: 1, name: 'Web Development' },
    { id: 2, name: 'Data Science' },
    { id: 3, name: 'UX Design' },
  ])
  const surveysPerPage = 5

  useEffect(() => {
    filterSurveys()
  }, [surveys, searchTerm])

  const filterSurveys = () => {
    let filtered = surveys
    if (searchTerm) {
      filtered = filtered.filter(survey => 
        survey.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredSurveys(filtered)
    setCurrentPage(1)
  }

  // Pagination logic
  const indexOfLastSurvey = currentPage * surveysPerPage
  const indexOfFirstSurvey = indexOfLastSurvey - surveysPerPage
  const currentSurveys = filteredSurveys.slice(indexOfFirstSurvey, indexOfLastSurvey)
  const totalPages = Math.ceil(filteredSurveys.length / surveysPerPage)

  const handleProgramView = (survey: Survey) => {
    setSelectedSurvey(survey)
    setShowProgramDialog(true)
  }

  const handleCreateSurvey = () => {
    // Redirect to survey creation page
    console.log("Redirecting to survey creation page")
  }

  const handleToggleChange = (id: number, isActive: boolean) => {
    // Here you would typically update the survey's active status in your backend
    console.log(`Survey ${id} active status changed to ${isActive}`)
  }

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-3xl font-bold mb-6">Survey Management</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search surveys..."
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
          <Link href="/createform" >
          Create New Survey
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Surveys ({surveys.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Creation Date</TableHead>
                  <TableHead>Responses</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Active</TableHead>
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
                      <Button variant="outline" size="sm" onClick={() => handleProgramView(survey)}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={true} // You would typically get this from the survey object
                        onCheckedChange={(checked) => handleToggleChange(survey.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
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
        <DialogContent className='w-80'>
          <DialogHeader>
            <DialogTitle>Training Program</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedSurvey && (
              <p>
                This survey is attached to the{" "}
                <strong>
                  {selectedSurvey.programId
                    ? programs.find(p => p.id === selectedSurvey.programId)?.name
                    : "No program assigned"}
                </strong>{" "}
                training program.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}