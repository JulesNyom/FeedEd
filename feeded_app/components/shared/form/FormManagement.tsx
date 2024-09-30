"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SearchIcon, UsersIcon, FlameIcon, SnowflakeIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const mockSurveys = [
  { id: 1, formation: "Formation en Développement Web", apprenants: 25, reponsesChaud: 20, reponsesFroid: 18, statutChaud: "Envoyé", statutFroid: "Envoyé" },
  { id: 2, formation: "Gestion de Projet Agile", apprenants: 30, reponsesChaud: 28, reponsesFroid: 25, statutChaud: "Envoyé", statutFroid: "Non envoyé" },
  { id: 3, formation: "Marketing Digital", apprenants: 20, reponsesChaud: 18, reponsesFroid: 15, statutChaud: "Envoyé", statutFroid: "Envoyé" },
  { id: 4, formation: "Intelligence Artificielle", apprenants: 15, reponsesChaud: 14, reponsesFroid: 12, statutChaud: "Non envoyé", statutFroid: "Non envoyé" },
  { id: 5, formation: "Cybersécurité", apprenants: 22, reponsesChaud: 20, reponsesFroid: 19, statutChaud: "Envoyé", statutFroid: "Envoyé" },
  { id: 6, formation: "Design UX/UI", apprenants: 18, reponsesChaud: 16, reponsesFroid: 14, statutChaud: "Envoyé", statutFroid: "Non envoyé" },
  { id: 7, formation: "Data Science", apprenants: 28, reponsesChaud: 25, reponsesFroid: 22, statutChaud: "Envoyé", statutFroid: "Envoyé" },
]

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredSurveys = mockSurveys.filter(survey =>
    survey.formation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSurveys = filteredSurveys.slice(startIndex, endIndex)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 sm:p-6 space-y-4"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl sm:text-2xl font-bold mb-4"
      >
        Gestion des Enquêtes
      </motion.h1>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <div className="relative w-full">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher une formation..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/hot">
              <Button className="mr-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 rounded-xl shadow-lg hover:to-red-600 text-white border-none flex-1 sm:flex-none">
                <FlameIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Voir l&apos;enquête à chaud</span>
                <span className="sm:hidden">À chaud</span>
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/cold">
              <Button className="rounded-xl shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-none flex-1 sm:flex-none">
                <SnowflakeIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Voir l&apos;enquête à froid</span>
                <span className="sm:hidden">À froid</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="border rounded-lg overflow-x-auto"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Formation</TableHead>
              <TableHead>Apprenants</TableHead>
              <TableHead className="min-w-[100px]">Statut</TableHead>
              <TableHead>Réponses à chaud</TableHead>
              <TableHead>Réponses à froid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSurveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.formation}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
                    {survey.apprenants}
                  </div>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" className="w-[100px]">
                          Voir statut
                          <ChevronDownIcon className="h-4 w-4 ml-2" />
                        </Button>
                      </motion.div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 space-y-2"
                      >
                        <h4 className="font-semibold text-sm mb-2">Statut des enquêtes</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <FlameIcon className="h-4 w-4 text-orange-500" />
                            <span className="text-sm">À chaud</span>
                          </div>
                          <Badge variant={survey.statutChaud === "Envoyé" ? "secondary" : "destructive"} className="justify-center">
                            {survey.statutChaud}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <SnowflakeIcon className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">À froid</span>
                          </div>
                          <Badge variant={survey.statutFroid === "Envoyé" ? "secondary" : "destructive"} className="justify-center">
                            {survey.statutFroid}
                          </Badge>
                        </div>
                      </motion.div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>{survey.reponsesChaud}</TableCell>
                <TableCell>{survey.reponsesFroid}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
      {totalPages > 1 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-wrap justify-center items-center mt-4 space-x-2"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} mb-2 sm:mb-0`}
            >
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
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
              <ChevronRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}