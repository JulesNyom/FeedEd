"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2, ChevronLeft, ChevronRight, Mail, CheckCircle, AlertCircle } from "lucide-react"

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  programId: string
  formStatus: "sent" | "responded" | "reminded" | "none"
}

interface TrainingProgram {
  id: string
  name: string
}

interface StudentTableProps {
  students: Student[]
  programs: TrainingProgram[]
  onEdit: (student: Student) => void
  onDelete: (id: string, programId: string) => void
}

export default function Component({ students, programs, onEdit, onDelete }: StudentTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 5

  const { currentStudents, totalPages } = useMemo(() => {
    const indexOfLastStudent = currentPage * studentsPerPage
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
    return {
      currentStudents: students.slice(indexOfFirstStudent, indexOfLastStudent),
      totalPages: Math.ceil(students.length / studentsPerPage)
    }
  }, [students, currentPage, studentsPerPage])

  const handleDelete = (student: Student) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${student.firstName} ${student.lastName} ?`)) {
      onDelete(student.id, student.programId)
    }
  }

  const getFormStatusIcon = (status: Student["formStatus"]) => {
    switch (status) {
      case "sent":
        return <Mail className="h-4 w-4 text-blue-500" />
      case "responded":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "reminded":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getFormStatusText = (status: Student["formStatus"]) => {
    switch (status) {
      case "sent":
        return "Envoyé"
      case "responded":
        return "Répondu"
      case "reminded":
        return "Rappelé"
      default:
        return "Non envoyé"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Prénom</TableHead>
              <TableHead className="font-semibold">Nom</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Formation</TableHead>
              <TableHead className="font-semibold">Statut du formulaire</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {programs.find((p) => p.id === student.programId)?.name || "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getFormStatusIcon(student.formStatus)}
                    <span>{getFormStatusText(student.formStatus)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(student)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier l&apos;étudiant</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(student)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer l&apos;étudiant</span>
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center items-center mt-4 space-x-2"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} mb-2 sm:mb-0`}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Précédente</span>
              <span className="sm:hidden">Préc</span>
            </Button>
          </motion.div>
          <div className="flex flex-wrap justify-center space-x-2 mb-2 sm:mb-0">
            {[...Array(totalPages)].map((_, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                  className="w-8 h-8 mb-2 sm:mb-0"
                >
                  {i + 1}
                </Button>
              </motion.div>
            ))}
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''} mb-2 sm:mb-0`}
            >
              <span className="hidden sm:inline">Suivante</span>
              <span className="sm:hidden">Suiv</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}