"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { db, auth } from '@/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrainingProgramList } from "./ProgramList"
import { TrainingProgramForm } from "./ProgramForm"

interface TrainingProgram {
  id: string
  name: string
  students: number
  status: "A venir" | "En cours" | "Terminé"
  startDate: string
  endDate: string
}

export default function ProgramTable() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([])
  const [filteredPrograms, setFilteredPrograms] = useState<TrainingProgram[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "A venir" | "En cours" | "Terminé">("all")

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPrograms(user.uid)
      } else {
        setPrograms([])
        setFilteredPrograms([])
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    filterPrograms()
  }, [programs, searchTerm, statusFilter])

  const fetchPrograms = async (userId: string) => {
    const programsCollection = collection(db, `users/${userId}/programs`)
    const programSnapshot = await getDocs(programsCollection)
    const programList = programSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TrainingProgram))
    setPrograms(programList)
  }

  const filterPrograms = () => {
    let filtered = programs
    if (searchTerm) {
      filtered = filtered.filter((program) =>
        program.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((program) => program.status === statusFilter)
    }
    setFilteredPrograms(filtered)
  }

  const determineStatus = (
    startDate: string,
    endDate: string
  ): TrainingProgram["status"] => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return "A venir"
    if (now > end) return "Terminé"
    return "En cours"
  }

  const handleSubmitProgram = async (programData: Omit<TrainingProgram, "id" | "status">) => {
    const user = auth.currentUser
    if (!user) {
      console.error("No authenticated user found")
      return
    }

    try {
      const status = determineStatus(programData.startDate, programData.endDate)
      
      if (editingProgram) {
        const programRef = doc(db, `users/${user.uid}/programs`, editingProgram.id)
        await updateDoc(programRef, { ...programData, status })
        setPrograms(programs.map(p => p.id === editingProgram.id ? { ...programData, id: editingProgram.id, status } : p))
      } else {
        const programsCollection = collection(db, `users/${user.uid}/programs`)
        const docRef = await addDoc(programsCollection, { ...programData, status })
        const newProgram = { ...programData, id: docRef.id, status }
        setPrograms([...programs, newProgram])
      }
      setShowForm(false)
      setEditingProgram(null)
    } catch (error) {
      console.error("Error adding/updating document: ", error)
    }
  }

  const handleDeleteProgram = async (id: string) => {
    const user = auth.currentUser
    if (!user) {
      console.error("No authenticated user found")
      return
    }

    try {
      await deleteDoc(doc(db, `users/${user.uid}/programs`, id))
      setPrograms(programs.filter(p => p.id !== id))
    } catch (error) {
      console.error("Error deleting document: ", error)
    }
  }
  
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
        Vos formations
      </motion.h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher des formations..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 w-fit sm:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(value: any) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="A venir">À venir</SelectItem>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Terminé">Terminé</SelectItem>
            </SelectContent>
          </Select>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl shadow-lg"
            >
              Ajouter une formation
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="overflow-hidden"
      >
        <TrainingProgramList
          programs={filteredPrograms}
          onEdit={setEditingProgram}
          onDelete={handleDeleteProgram}
        />
      </motion.div>

      <TrainingProgramForm
        show={showForm || !!editingProgram}
        onClose={() => {
          setShowForm(false)
          setEditingProgram(null)
        }}
        onSubmit={handleSubmitProgram}
        editingProgram={editingProgram}
      />
    </motion.div>
  )
}