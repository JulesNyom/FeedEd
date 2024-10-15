import { useState, useEffect } from "react"
import { db, auth } from '@/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

export interface TrainingProgram {
  id: string
  name: string
  students: number
  status: "A venir" | "En cours" | "Terminé"
  startDate: string
  endDate: string
}

export type StatusFilterType = "all" | TrainingProgram["status"]

export function useProgramLogic() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([])
  const [filteredPrograms, setFilteredPrograms] = useState<TrainingProgram[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all")
  const [programToDelete, setProgramToDelete] = useState<string | null>(null)

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

  const handleDeleteProgram = (id: string) => {
    setProgramToDelete(id)
  }

  const confirmDeleteProgram = async () => {
    if (!programToDelete) return

    const user = auth.currentUser
    if (!user) {
      console.error("No authenticated user found")
      return
    }

    try {
      await deleteDoc(doc(db, `users/${user.uid}/programs`, programToDelete))
      setPrograms(programs.filter(p => p.id !== programToDelete))
      setProgramToDelete(null)
    } catch (error) {
      console.error("Error deleting document: ", error)
    }
  }

  const cancelDeleteProgram = () => {
    setProgramToDelete(null)
  }

  return {
    programs,
    filteredPrograms,
    showForm,
    setShowForm,
    editingProgram,
    setEditingProgram,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleSubmitProgram,
    handleDeleteProgram,
    programToDelete,
    confirmDeleteProgram,
    cancelDeleteProgram,
  }
}