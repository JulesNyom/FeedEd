import { useState, useEffect, useCallback } from "react";
import { db, auth } from "@/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
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

  const filterStudents = useCallback(() => {
    console.log("Filtering students with search term:", searchTerm);
    let filtered = students;
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    console.log("Filtered students:", filtered);
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  useEffect(() => {
    filterStudents();
  }, [filterStudents]);

  useEffect(() => {
    console.log("Auth state changed");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User authenticated, fetching data");
        fetchUserData(user.uid);
      } else {
        console.log("No authenticated user");
        setStudents([]);
        setFilteredStudents([]);
        setPrograms([]);
        setError("No authenticated user found. Please log in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    console.log("Fetching user data for userId:", userId);
    setError(null);
    try {
      await fetchPrograms(userId);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Unable to fetch user data. Please try again later.");
    }
  };

  const fetchPrograms = async (userId: string) => {
    console.log("Fetching programs for userId:", userId);
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

      console.log("Fetched programs:", programList);

      const allStudents: Student[] = [];
      for (const program of programList) {
        const studentsCollection = collection(
          db,
          `users/${userId}/programs/${program.id}/students`
        );
        const studentSnapshot = await getDocs(studentsCollection);
        const programStudents = studentSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            programId: program.id,
            formStatusHot: "none",
            formStatusCold: "none",
            hotEmailSentDate: data.hotEmailSentDate ? data.hotEmailSentDate.toDate() : undefined,
            coldEmailSentDate: data.coldEmailSentDate ? data.coldEmailSentDate.toDate() : undefined,
          } as Student;
        });
        allStudents.push(...programStudents);
        program.currentStudents = programStudents.length;
      }

      console.log("Fetched students before form status update:", allStudents);

      const updatedStudents = await updateFormStatuses(userId, allStudents);

      setPrograms(programList);
      setStudents(updatedStudents);
      console.log("Students set after form status update:", updatedStudents);
    } catch (error) {
      console.error("Error fetching programs and students:", error);
      setError("Unable to fetch programs and students. Please try again later.");
    }
  };

  const updateFormStatuses = async (userId: string, studentsToUpdate: Student[]): Promise<Student[]> => {
    console.log("Updating form statuses for students:", studentsToUpdate);
    try {
      const formsCollection = collection(db, 'forms');
      const formsSnapshot = await getDocs(formsCollection);
      const allForms = formsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Form));

      console.log("All forms:", allForms);

      const updatedStudents = await Promise.all(studentsToUpdate.map(async (student) => {
        const studentForms = allForms.filter(form => 
          form.studentId === student.id && form.programId === student.programId
        );

        console.log(`Forms for student ${student.id}:`, studentForms);

        const hotForm = studentForms.find(form => form.formType === "hot");
        const coldForm = studentForms.find(form => form.formType === "cold");

        const hotStatus: Student['formStatusHot'] = hotForm ? "responded" : 
                          student.hotEmailSent ? "sent" : "none";
        const coldStatus: Student['formStatusCold'] = coldForm ? "responded" : 
                           student.coldEmailSent ? "sent" : "none";

        console.log(`Updated status for student ${student.id}:`, { hotStatus, coldStatus });

        return {
          ...student,
          formStatusHot: hotStatus,
          formStatusCold: coldStatus,
        };
      }));

      console.log("Students after form status update:", updatedStudents);
      return updatedStudents;
    } catch (error) {
      console.error("Error updating form statuses:", error);
      setError("Unable to update form statuses. Some information may be outdated.");
      return studentsToUpdate; // Return original students if update fails
    }
  };

  const handleSubmit = async (studentData: Student, programId: string) => {
    console.log("Submitting student data:", studentData, "for program:", programId);
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
      hotEmailSentDate: studentData.hotEmailSentDate ? Timestamp.fromDate(studentData.hotEmailSentDate) : null,
      coldEmailSentDate: studentData.coldEmailSentDate ? Timestamp.fromDate(studentData.coldEmailSentDate) : null,
      formStatusHot: studentData.formStatusHot,
      formStatusCold: studentData.formStatusCold,
    };

    try {
      if (studentData.id) {
        console.log("Updating existing student:", studentData.id);
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
        console.log("Adding new student");
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
      console.log("Student data submitted successfully");
    } catch (error) {
      console.error("Error submitting student data:", error);
      setError("Une erreur est survenue lors de l'enregistrement de l'étudiant. Veuillez réessayer.");
    }
  };

  const handleDelete = async (id: string, programId: string) => {
    console.log("Deleting student:", id, "from program:", programId);
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
      console.log("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Une erreur est survenue lors de la suppression de l'étudiant. Veuillez réessayer.");
    }
  };

  const handleEdit = (student: Student) => {
    console.log("Editing student:", student);
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