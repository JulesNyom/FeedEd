"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import StudentTable from "./StudentTable"
import StudentForm from "./StudentForm"
import { db, auth } from "@/firebase"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  programId: string
}

interface TrainingProgram {
  id: string
  name: string
  students: number
  currentStudents: number
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [programs, setPrograms] = useState<TrainingProgram[]>([])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPrograms(user.uid)
      } else {
        setStudents([])
        setFilteredStudents([])
        setPrograms([])
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm])

  const fetchPrograms = async (userId: string) => {
    const programsCollection = collection(db, `users/${userId}/programs`)
    const programSnapshot = await getDocs(programsCollection)
    const programList = programSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          name: doc.data().name,
          students: doc.data().students,
          currentStudents: 0,
        } as TrainingProgram)
    )

    const allStudents: Student[] = []
    for (const program of programList) {
      const studentsCollection = collection(
        db,
        `users/${userId}/programs/${program.id}/students`
      )
      const studentSnapshot = await getDocs(studentsCollection)
      const programStudents = studentSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            programId: program.id,
          } as Student)
      )
      allStudents.push(...programStudents)
      program.currentStudents = programStudents.length
    }
    setPrograms(programList)
    setStudents(allStudents)
  }

  const filterStudents = () => {
    let filtered = students
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredStudents(filtered)
  }

  const handleSubmit = async (studentData: Student, programId: string) => {
    const user = auth.currentUser
    if (!user) {
      console.error("No authenticated user found")
      return
    }

    const programIndex = programs.findIndex((p) => p.id === programId)
    if (programIndex === -1) {
      console.error("Program not found")
      return
    }

    const program = programs[programIndex]
    if (program.currentStudents >= program.students && !editingStudent) {
      alert(
        `Le programme "${program.name}" a atteint son nombre maximum d'étudiants (${program.students})`
      )
      return
    }

    const firestoreData = {
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      email: studentData.email,
      programId: programId,
    }

    try {
      if (editingStudent) {
        await updateDoc(
          doc(
            db,
            `users/${user.uid}/programs/${programId}/students`,
            studentData.id
          ),
          firestoreData
        )
        setStudents(
          students.map((s) =>
            s.id === studentData.id ? { ...studentData, programId } : s
          )
        )

        if (editingStudent.programId !== programId) {
          const updatedPrograms = [...programs]
          const oldProgramIndex = updatedPrograms.findIndex(
            (p) => p.id === editingStudent.programId
          )
          if (oldProgramIndex !== -1) {
            updatedPrograms[oldProgramIndex].currentStudents--
          }
          updatedPrograms[programIndex].currentStudents++
          setPrograms(updatedPrograms)
        }
      } else {
        const docRef = await addDoc(
          collection(db, `users/${user.uid}/programs/${programId}/students`),
          firestoreData
        )
        const newStudent = { ...studentData, id: docRef.id, programId }
        setStudents([...students, newStudent])

        const updatedPrograms = [...programs]
        updatedPrograms[programIndex].currentStudents++
        setPrograms(updatedPrograms)
      }
      setEditingStudent(null)
      setShowForm(false)
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout/mise à jour de l'étudiant : ",
        error
      )
    }
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setShowForm(true)
  }

  const handleDelete = async (id: string, programId: string) => {
    const user = auth.currentUser
    if (!user) {
      console.error("No authenticated user found")
      return
    }

    try {
      await deleteDoc(
        doc(db, `users/${user.uid}/programs/${programId}/students`, id)
      )
      setStudents(students.filter((s) => s.id !== id))

      const programIndex = programs.findIndex((p) => p.id === programId)
      if (programIndex !== -1) {
        const updatedPrograms = [...programs]
        updatedPrograms[programIndex].currentStudents--
        setPrograms(updatedPrograms)
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étudiant : ", error)
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
        Vos apprenants
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
            placeholder="Rechercher des étudiants..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl shadow-lg"
          >
            <Plus className="mr-2 h-5 w-5" /> Ajouter un apprenant
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="overflow-hidden"
      >
        <StudentTable
          students={filteredStudents}
          programs={programs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </motion.div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStudent
                ? "Modifier l'étudiant"
                : "Ajouter un nouvel étudiant"}
            </DialogTitle>
          </DialogHeader>
          <StudentForm
            student={editingStudent}
            programs={programs}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}