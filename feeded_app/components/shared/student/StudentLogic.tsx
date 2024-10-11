"use client";

import { useState, useEffect, useCallback } from "react";
import { db, auth } from "@/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
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
}

export function useStudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

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

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  const fetchUserData = async (userId: string) => {
    setError(null);
    try {
      await fetchPrograms(userId);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Unable to fetch user data. Please try again later.");
    }
  };

  const fetchPrograms = async (userId: string) => {
    try {
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

      await updateFormStatuses(userId, allStudents);

      setPrograms(programList);
      setStudents(allStudents);
    } catch (error) {
      console.error("Error fetching programs and students:", error);
      setError("Unable to fetch programs and students. Please try again later.");
    }
  };

  const updateFormStatuses = async (userId: string, studentsToUpdate: Student[]) => {
    try {
      const formsCollection = collection(db, 'forms');
      const formsSnapshot = await getDocs(formsCollection);
      const allForms = formsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Form));

      const updatedStudents = await Promise.all(studentsToUpdate.map(async (student) => {
        const studentForms = allForms.filter(form => 
          form.studentId === student.id && form.programId === student.programId
        );

        const hotForm = studentForms.find(form => form.formType === "hot");
        const coldForm = studentForms.find(form => form.formType === "cold");

        const hotStatus = hotForm ? "responded" : 
                          student.hotEmailSent ? "sent" : "none";
        const coldStatus = coldForm ? "responded" : 
                           student.coldEmailSent ? "sent" : "none";

        return {
          ...student,
          formStatusHot: hotStatus,
          formStatusCold: coldStatus,
        };
      }));

      setStudents(updatedStudents);
      setUpdateTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error updating form statuses:", error);
      setError("Unable to update form statuses. Some information may be outdated.");
    }
  };

  const filterStudents = useCallback(() => {
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
  }, [students, searchTerm]);

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
    if (program.currentStudents >= program.students && !studentData.id) {
      setError(`Le programme "${program.name}" a atteint son nombre maximum d'étudiants (${program.students})`);
      return;
    }

    const firestoreData = {
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      email: studentData.email,
      programId: programId,
      hotEmailSent: studentData.hotEmailSent,
      coldEmailSent: studentData.coldEmailSent,
      hotEmailSentDate: studentData.hotEmailSentDate,
      coldEmailSentDate: studentData.coldEmailSentDate,
      formStatusHot: studentData.formStatusHot,
      formStatusCold: studentData.formStatusCold,
    };

    try {
      if (studentData.id) {
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

        if (studentData.programId !== programId) {
          const updatedPrograms = [...programs];
          const oldProgramIndex = updatedPrograms.findIndex(
            (p) => p.id === studentData.programId
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
      setUpdateTrigger(prev => prev + 1);
      setShowForm(false);
      setEditingStudent(null);
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout/mise à jour de l'étudiant : ",
        error
      );
      setError("Une erreur est survenue lors de l'enregistrement de l'étudiant. Veuillez réessayer.");
    }
  };

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
      setUpdateTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étudiant : ", error);
      setError("Une erreur est survenue lors de la suppression de l'étudiant. Veuillez réessayer.");
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  return {
    students,
    filteredStudents,
    programs,
    error,
    searchTerm,
    setSearchTerm,
    handleSubmit,
    handleDelete,
    handleEdit,
    updateTrigger,
    showForm,
    setShowForm,
    editingStudent,
    currentPage,
    setCurrentPage,
    studentsPerPage,
  };
}