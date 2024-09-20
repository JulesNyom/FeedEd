"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
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
} from "firebase/firestore";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  programId: string;
}

interface TrainingProgram {
  id: string;
  name: string;
  students: number;
  currentStudents: number;
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPrograms(user.uid);
      } else {
        setStudents([]);
        setFilteredStudents([]);
        setPrograms([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  const fetchPrograms = async (userId: string) => {
    const programsCollection = collection(db, `users/${userId}/programs`);
    const programSnapshot = await getDocs(programsCollection);
    const programList = programSnapshot.docs.map(
      (doc) =>
        ({
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
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            programId: program.id,
          } as Student)
      );
      allStudents.push(...programStudents);
      program.currentStudents = programStudents.length;
    }
    setPrograms(programList);
    setStudents(allStudents);
  };

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

  const handleSubmit = async (studentData: Student, programId: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    const programIndex = programs.findIndex((p) => p.id === programId);
    if (programIndex === -1) {
      console.error("Program not found");
      return;
    }

    const program = programs[programIndex];
    if (program.currentStudents >= program.students && !editingStudent) {
      alert(
        `Le programme "${program.name}" a atteint son nombre maximum d'étudiants (${program.students})`
      );
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
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = async (id: string, programId: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found");
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
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-3xl font-bold mb-6">Vos apprenants</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher des étudiants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg">
          <Plus className="mr-2 h-5 w-5" /> Ajouter un apprenant
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Apprenants ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentTable
            students={filteredStudents}
            programs={programs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

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
    </div>
  );
}
