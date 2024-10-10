"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileSpreadsheet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StudentTable from "./StudentTable";
import StudentForm from "./StudentForm";
import { db, auth } from "@/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

// Interface definitions
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  programId: string;
  formStatusHot: "sent" | "responded" | "reminded" | "none";
  formStatusCold: "sent" | "responded" | "reminded" | "none";
  hotEmailSent?: boolean;
  coldEmailSent?: boolean;
  hotEmailSentDate?: Date;
  coldEmailSentDate?: Date;
}

interface TrainingProgram {
  id: string;
  name: string;
  students: number;
  currentStudents: number;
}

interface Form {
  id: string;
  formType: "hot" | "cold";
  studentId: string;
  programId: string;
  submittedAt: Date;
  // Add other form fields as needed
}

export default function StudentManagement() {
  // State declarations
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch user data on auth state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setStudents([]);
        setFilteredStudents([]);
        setPrograms([]);
        setError("No authenticated user found. Please log in.");
      }
    });

    return () => unsubscribe();
  }, []);

  // Effect to filter students when the search term or students list changes
  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  // Function to fetch user data
  const fetchUserData = async (userId: string) => {
    setError(null);
    try {
      await fetchPrograms(userId);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Unable to fetch user data. Please try again later.");
    }
  };

  // Function to fetch programs and associated students
  const fetchPrograms = async (userId: string) => {
    try {
      // Fetch programs
      const programsCollection = collection(db, `users/${userId}/programs`);
      const programSnapshot = await getDocs(programsCollection);
      const programList = programSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          name: doc.data().name,
          students: doc.data().students,
          currentStudents: 0,
        } as TrainingProgram)
      );

      // Fetch students for each program
      const allStudents: Student[] = [];
      for (const program of programList) {
        const studentsCollection = collection(
          db,
          `users/${userId}/programs/${program.id}/students`
        );
        const studentSnapshot = await getDocs(studentsCollection);
        const programStudents = studentSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
            programId: program.id,
            formStatusHot: "none",
            formStatusCold: "none",
          } as Student)
        );
        allStudents.push(...programStudents);
        program.currentStudents = programStudents.length;
      }

      // Update form statuses
      await updateFormStatuses(userId, allStudents);

      setPrograms(programList);
      setStudents(allStudents);
    } catch (error) {
      console.error("Error fetching programs and students:", error);
      setError("Unable to fetch programs and students. Please try again later.");
    }
  };

  // Function to update form statuses for all students
  const updateFormStatuses = async (userId: string, students: Student[]) => {
    try {
      // Fetch all forms for the user
      const formsCollection = collection(db, 'forms');
      const formsQuery = query(formsCollection, where("userId", "==", userId));
      const formsSnapshot = await getDocs(formsQuery);
      const forms = formsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Form));

      // Update each student's form status
      const updatedStudents = students.map(student => {
        // Find forms for this student
        const hotForm = forms.find(form => 
          form.studentId === student.id && 
          form.programId === student.programId && 
          form.formType === "hot"
        );
        const coldForm = forms.find(form => 
          form.studentId === student.id && 
          form.programId === student.programId && 
          form.formType === "cold"
        );

        // Determine form statuses
        const hotStatus = hotForm ? "responded" : 
                          student.hotEmailSent ? "sent" : "none";
        const coldStatus = coldForm ? "responded" : 
                           student.coldEmailSent ? "sent" : "none";

        return {
          ...student,
          formStatusHot: hotStatus,
          formStatusCold: coldStatus,
        };
      });

      setStudents(updatedStudents);
    } catch (error) {
      console.error("Error updating form statuses:", error);
      setError("Unable to update form statuses. Some information may be outdated.");
    }
  };

  // Function to filter students based on search term
  const filterStudents = () => {
    let filtered = students;
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredStudents(filtered);
  };

  // Function to handle student form submission (add/edit)
  const handleSubmit = async (studentData: Student, programId: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found");
      setError("You must be logged in to perform this action.");
      return;
    }

    const programIndex = programs.findIndex((p) => p.id === programId);
    if (programIndex === -1) {
      console.error("Program not found");
      setError("The selected program was not found.");
      return;
    }

    const program = programs[programIndex];
    if (program.currentStudents >= program.students && !editingStudent) {
      setError(`Le programme "${program.name}" a atteint son nombre maximum d'étudiants (${program.students})`);
      return;
    }

    const firestoreData = {
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      email: studentData.email,
      programId: programId,
    };

    try {
      if (editingStudent) {
        // Update existing student
        await updateDoc(
          doc(
            db,
            `users/${user.uid}/programs/${programId}/students`,
            studentData.id
          ),
          firestoreData
        );
        setStudents(
          students.map((s) =>
            s.id === studentData.id ? { ...studentData, programId } : s
          )
        );

        if (editingStudent.programId !== programId) {
          const updatedPrograms = [...programs];
          const oldProgramIndex = updatedPrograms.findIndex(
            (p) => p.id === editingStudent.programId
          );
          if (oldProgramIndex !== -1) {
            updatedPrograms[oldProgramIndex].currentStudents--;
          }
          updatedPrograms[programIndex].currentStudents++;
          setPrograms(updatedPrograms);
        }
      } else {
        // Add new student
        const docRef = await addDoc(
          collection(db, `users/${user.uid}/programs/${programId}/students`),
          firestoreData
        );
        const newStudent = { ...studentData, id: docRef.id, programId };
        setStudents([...students, newStudent]);

        const updatedPrograms = [...programs];
        updatedPrograms[programIndex].currentStudents++;
        setPrograms(updatedPrograms);
      }
      setEditingStudent(null);
      setShowForm(false);
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout/mise à jour de l'étudiant : ",
        error
      );
      setError("Une erreur est survenue lors de l'enregistrement de l'étudiant. Veuillez réessayer.");
    }
  };

  // Function to handle editing a student
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  // Function to handle deleting a student
  const handleDelete = async (id: string, programId: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found");
      setError("You must be logged in to perform this action.");
      return;
    }

    try {
      await deleteDoc(
        doc(db, `users/${user.uid}/programs/${programId}/students`, id)
      );
      setStudents(students.filter((s) => s.id !== id));

      const programIndex = programs.findIndex((p) => p.id === programId);
      if (programIndex !== -1) {
        const updatedPrograms = [...programs];
        updatedPrograms[programIndex].currentStudents--;
        setPrograms(updatedPrograms);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étudiant : ", error);
      setError("Une erreur est survenue lors de la suppression de l'étudiant. Veuillez réessayer.");
    }
  };

  // Render error message if there's an error
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Main component render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 sm:p-6 space-y-4">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl sm:text-2xl font-bold mb-4">
        Vos apprenants
      </motion.h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher un étudiant..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl shadow-lg">
            <Plus className="mr-2 h-5 w-5" /> Ajouter un apprenant
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl shadow-lg">
            <FileSpreadsheet className="mr-2 h-5 w-5" /> Exporter le tableau
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="overflow-hidden">
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
  );
}