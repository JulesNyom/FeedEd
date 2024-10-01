'use client'

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SearchIcon, UsersIcon, FlameIcon, SnowflakeIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const mockSurveys = [
  { id: 1, formation: "Formation en Développement Web", apprenants: 25, reponsesChaud: { envoye: 20, enAttente: 3, relance: 2 }, reponsesFroid: { envoye: 18, enAttente: 5, relance: 2 } },
  { id: 2, formation: "Gestion de Projet Agile", apprenants: 30, reponsesChaud: { envoye: 28, enAttente: 1, relance: 1 }, reponsesFroid: { envoye: 25, enAttente: 3, relance: 2 } },
  { id: 3, formation: "Marketing Digital", apprenants: 20, reponsesChaud: { envoye: 18, enAttente: 1, relance: 1 }, reponsesFroid: { envoye: 15, enAttente: 3, relance: 2 } },
  { id: 4, formation: "Intelligence Artificielle", apprenants: 15, reponsesChaud: { envoye: 14, enAttente: 1, relance: 0 }, reponsesFroid: { envoye: 12, enAttente: 2, relance: 1 } },
  { id: 5, formation: "Cybersécurité", apprenants: 22, reponsesChaud: { envoye: 20, enAttente: 1, relance: 1 }, reponsesFroid: { envoye: 19, enAttente: 2, relance: 1 } },
  { id: 6, formation: "Design UX/UI", apprenants: 18, reponsesChaud: { envoye: 16, enAttente: 1, relance: 1 }, reponsesFroid: { envoye: 14, enAttente: 3, relance: 1 } },
  { id: 7, formation: "Data Science", apprenants: 28, reponsesChaud: { envoye: 25, enAttente: 2, relance: 1 }, reponsesFroid: { envoye: 22, enAttente: 4, relance: 2 } },
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

  const ResponseDetails = ({ responses, title }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-fit p-4 space-y-2"
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center bg-green-100 dark:bg-green-900 p-2 rounded">
          <div className="text-sm">Envoyé :</div>
          <div className="text-sm font-semibold">{responses.envoye}</div>
        </div>
        <div className="flex justify-between items-center bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
          <div className="text-sm">En attente :</div>
          <div className="text-sm font-semibold">{responses.enAttente}</div>
        </div>
        <div className="flex justify-between items-center bg-red-100 dark:bg-red-900 p-2 rounded">
          <div className="text-sm">Relancé :</div>
          <div className="text-sm font-semibold">{responses.relance}</div>
        </div>
      </div>
    </motion.div>
  )

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
        Gestion des enquêtes
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
              <TableHead className="text-center">Apprenants</TableHead>
              <TableHead className="text-center">Réponses à chaud</TableHead>
              <TableHead className="text-center">Réponses à froid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSurveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.formation}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
                    {survey.apprenants}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                        <Button variant="outline" size="sm" className="w-[100px]">
                          Voir détails
                          <ChevronDownIcon className="h-4 w-4 ml-2" />
                        </Button>
                      </motion.div>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-0">
                      <ResponseDetails responses={survey.reponsesChaud} title="Réponses à chaud" />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="text-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                        <Button variant="outline" size="sm" className="w-[100px]">
                          Voir détails
                          <ChevronDownIcon className="h-4 w-4 ml-2" />
                        </Button>
                      </motion.div>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-0">
                      <ResponseDetails responses={survey.reponsesFroid} title="Réponses à froid" />
                    </PopoverContent>
                  </Popover>
                </TableCell>
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