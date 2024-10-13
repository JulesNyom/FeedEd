'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SearchIcon, UsersIcon, FlameIcon, SnowflakeIcon, ChevronDownIcon, SendIcon, DownloadIcon } from "lucide-react"
import { useSurveyManagement, Program, ResponseData } from "@/lib/useSurveyManagement"

const ResponseDetails: React.FC<{ responsesChaud: ResponseData; reponsesFroid: ResponseData }> = ({ responsesChaud, reponsesFroid }) => {
  const [showChaud, setShowChaud] = useState(true)
  const responses = showChaud ? responsesChaud : reponsesFroid

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="w-64 p-4 space-y-4">
      <div className="flex items-center justify-between space-x-4">
        <span className={`text-sm font-medium ${showChaud ? "text-orange-500" : "text-gray-500"}`}>À chaud</span>
        <Switch checked={!showChaud} onCheckedChange={() => setShowChaud(!showChaud)} className="data-[state=checked]:bg-blue-500" />
        <span className={`text-sm font-medium ${!showChaud ? "text-blue-500" : "text-gray-500"}`}>À froid</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={showChaud ? "chaud" : "froid"} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className="space-y-2">
          <h3 className="font-semibold mb-2">{showChaud ? "Réponses à chaud" : "Réponses à froid"}</h3>
          <div className="space-y-2">
            {Object.entries(responses).map(([key, value]) => (
              <div key={key} className={`flex justify-between items-center p-2 rounded ${key === 'envoye' ? 'bg-green-100 dark:bg-green-900' : key === 'enAttente' ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-red-100 dark:bg-red-900'}`}>
                <div className="text-sm">{key.charAt(0).toUpperCase() + key.slice(1)} :</div>
                <div className="text-sm font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default function Component() {
  const { programs, searchTerm, setSearchTerm, currentPage, setCurrentPage, isLoading, error, totalPages, sendHotSurveys, sendColdSurveys, fetchFormAnswersByProgram, downloadFormAnswers, setFormAnswers } = useSurveyManagement()
  const [sendingSurvey, setSendingSurvey] = useState<{ [key: string]: boolean }>({})
  const [downloadingAnswers, setDownloadingAnswers] = useState<{ [key: string]: boolean }>({})

  const handleSendSurvey = async (programId: string, type: "hot" | "cold") => {
    setSendingSurvey((prev) => ({ ...prev, [programId]: true }))
    try {
      await (type === "hot" ? sendHotSurveys(programId) : sendColdSurveys(programId))
      console.log(`Sent ${type} survey for program ${programId}`)
    } catch (error) {
      console.error(`Error sending ${type} survey for program ${programId}:`, error)
    } finally {
      setSendingSurvey((prev) => ({ ...prev, [programId]: false }))
    }
  }

  const handleDownloadResponses = async (programId: string, type: "hot" | "cold") => {
    setDownloadingAnswers((prev) => ({ ...prev, [programId]: true }))
    try {
      const fetchedAnswers = await fetchFormAnswersByProgram(programId)
      setFormAnswers(fetchedAnswers)
      await new Promise((resolve) => setTimeout(resolve, 0))
      downloadFormAnswers(type, fetchedAnswers)
      console.log(`Downloaded ${type} survey responses for program ${programId}`)
    } catch (error) {
      console.error(`Error downloading ${type} survey responses for program ${programId}:`, error)
    } finally {
      setDownloadingAnswers((prev) => ({ ...prev, [programId]: false }))
    }
  }

  if (isLoading) return <div className="text-center mt-8">Loading...</div>
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="container mx-auto p-4 space-y-6">
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-2xl font-bold">
        Gestion des enquêtes
      </motion.h1>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-1/2">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="text" placeholder="Rechercher une formation..." className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Link href="/hot">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg">
              <FlameIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Voir l&lsquo;enquête à chaud</span>
              <span className="sm:hidden">À chaud</span>
            </Button>
          </Link>
          <Link href="/cold">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl shadow-lg">
              <SnowflakeIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Voir l&lsquo;enquête à froid</span>
              <span className="sm:hidden">À froid</span>
            </Button>
          </Link>
        </div>
      </motion.div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Formation</TableHead>
              <TableHead className="text-center">Apprenants</TableHead>
              <TableHead className="text-center">Statuts</TableHead>
              <TableHead className="text-center">Envoyer</TableHead>
              <TableHead className="text-center">Télécharger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program: Program) => (
              <TableRow key={program.id}>
                <TableCell className="font-medium">{program.name}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
                    {program.students.length}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center justify-center">
                        <span className="mr-2">Voir détails</span>
                        <ChevronDownIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-0">
                      <ResponseDetails responsesChaud={program.reponsesChaud} reponsesFroid={program.reponsesFroid} />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" disabled={sendingSurvey[program.id]}>
                        Envoyer
                        {sendingSurvey[program.id] ? <span className="animate-spin ml-2">⏳</span> : <SendIcon className="h-4 w-4 ml-2" />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSendSurvey(program.id, "hot")}>
                        <FlameIcon className="h-4 w-4 mr-2 text-orange-500" />
                        <span>Enquête à chaud</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendSurvey(program.id, "cold")}>
                        <SnowflakeIcon className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Enquête à froid</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" disabled={downloadingAnswers[program.id]}>
                        Télécharger
                        {downloadingAnswers[program.id] ? <span className="animate-spin ml-2">⏳</span> : <DownloadIcon className="h-4 w-4 ml-2" />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownloadResponses(program.id, "hot")}>
                        <FlameIcon className="h-4 w-4 mr-2 text-orange-500" />
                        <span>Réponses à chaud</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadResponses(program.id, "cold")}>
                        <SnowflakeIcon className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Réponses à froid</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      )}
    </motion.div>
  )
}