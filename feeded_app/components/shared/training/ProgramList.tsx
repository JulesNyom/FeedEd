import React, { useState } from "react"
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
import { Users, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

interface TrainingProgram {
  id: string
  name: string
  students: number
  status: "A venir" | "En cours" | "Terminé"
  startDate: string
  endDate: string
}

interface TrainingProgramListProps {
  programs: TrainingProgram[]
  onEdit: (program: TrainingProgram) => void
  onDelete: (id: string) => void
}

export function TrainingProgramList({
  programs,
  onEdit,
  onDelete,
}: TrainingProgramListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const programsPerPage = 5

  const indexOfLastProgram = currentPage * programsPerPage
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage
  const currentPrograms = programs.slice(indexOfFirstProgram, indexOfLastProgram)
  const totalPages = Math.ceil(programs.length / programsPerPage)

  const isLongProgram = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 90
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
              <TableHead>Nom</TableHead>
              <TableHead>Étudiants</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="hidden md:table-cell">Date de début</TableHead>
              <TableHead className="hidden md:table-cell">Date de fin</TableHead>
              <TableHead className="hidden md:table-cell">Durée</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPrograms.map((program) => (
              <TableRow key={program.id}>
                <TableCell className="font-medium">{program.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                    {program.students}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      program.status === "A venir"
                        ? "bg-blue-100 text-blue-800"
                        : program.status === "En cours"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {program.status === "A venir"
                      ? "À venir"
                      : program.status === "En cours"
                      ? "En cours"
                      : "Terminé"}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">{program.startDate}</TableCell>
                <TableCell className="hidden md:table-cell">{program.endDate}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {isLongProgram(program.startDate, program.endDate) ? "Longue" : "Courte"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(program)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(program.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
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