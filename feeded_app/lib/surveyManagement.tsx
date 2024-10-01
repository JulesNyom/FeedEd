import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '@/firebase'

export type ResponseData = {
  envoye: number;
  enAttente: number;
  relance: number;
}

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  hotEmailSent?: boolean;
  coldEmailSent?: boolean;
}

export type Program = {
  id: string;
  name: string;
  students: Student[];
  status: "A venir" | "En cours" | "Terminé";
  startDate: string;
  endDate: string;
  reponsesChaud: ResponseData;
  reponsesFroid: ResponseData;
}

export const useSurveyManagement = () => {
  const [programs, setPrograms] = useState<Program[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 5

  const fetchPrograms = async () => {
    const user = auth.currentUser
    if (!user) {
      setError("No authenticated user found")
      setIsLoading(false)
      return []
    }

    try {
      const programsCollection = collection(db, `users/${user.uid}/programs`)
      const programSnapshot = await getDocs(programsCollection)
      const programList = await Promise.all(programSnapshot.docs.map(async (doc) => {
        const programData = doc.data() as Omit<Program, 'id' | 'students' | 'reponsesChaud' | 'reponsesFroid'>
        const studentsCollection = collection(db, `users/${user.uid}/programs/${doc.id}/students`)
        const studentSnapshot = await getDocs(studentsCollection)
        const students = studentSnapshot.docs.map(studentDoc => ({
          id: studentDoc.id,
          ...studentDoc.data()
        })) as Student[]
        
        return {
          id: doc.id,
          ...programData,
          students,
          reponsesChaud: { envoye: 0, enAttente: 0, relance: 0 },
          reponsesFroid: { envoye: 0, enAttente: 0, relance: 0 },
        }
      }))
      
      console.log("Fetched programs:", programList)
      
      if (programList.length === 0) {
        setError("No programs found")
      }
      
      return programList
    } catch (error) {
      console.error("Error fetching programs: ", error)
      setError("Failed to fetch programs. Please try again later.")
      return []
    }
  }

  const sendSurveyEmail = async (studentData: Student, programName: string, programId: string, type: 'hot' | 'cold') => {
    try {
      const response = await fetch('/api/emailSurvey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: auth.currentUser?.uid,
          programId: programId,
          studentId: studentData.id,
          subject: type === 'hot' ? "Merci pour votre participation" : "Suivi de votre formation",
          textContent: type === 'hot' 
            ? `Cher(e) ${studentData.firstName} ${studentData.lastName},\n\nMerci d'avoir participé à notre programme de formation "${programName}". Nous espérons que vous avez trouvé cette expérience enrichissante.\n\nCordialement,\nL'équipe de formation`
            : `Cher(e) ${studentData.firstName} ${studentData.lastName},\n\n90 jours se sont écoulés depuis la fin de votre formation "${programName}". Nous espérons que les compétences acquises vous sont utiles dans votre travail quotidien.\n\nCordialement,\nL'équipe de formation`,
          htmlContent: type === 'hot'
            ? `<p>Cher(e) ${studentData.firstName} ${studentData.lastName},</p><p>Merci d'avoir participé à notre programme de formation "${programName}". Nous espérons que vous avez trouvé cette expérience enrichissante.</p><p>Cordialement,<br>L'équipe de formation</p>`
            : `<p>Cher(e) ${studentData.firstName} ${studentData.lastName},</p><p>90 jours se sont écoulés depuis la fin de votre formation "${programName}". Nous espérons que les compétences acquises vous sont utiles dans votre travail quotidien.</p><p>Cordialement,<br>L'équipe de formation</p>`,
          type: type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      console.log(`Email sent to ${studentData.email} for program ${programName} (${type})`)
      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const updateStudentEmailStatus = async (programId: string, studentId: string, type: 'hot' | 'cold') => {
    const user = auth.currentUser
    if (!user) {
      console.error("No authenticated user found")
      return
    }

    const studentDocRef = doc(db, `users/${user.uid}/programs/${programId}/students`, studentId)
    try {
      await updateDoc(studentDocRef, {
        [type === 'hot' ? 'hotEmailSent' : 'coldEmailSent']: true
      })
      console.log(`Updated ${type} email status for student ${studentId}`)
    } catch (error) {
      console.error(`Error updating ${type} email status for student ${studentId}:`, error)
    }
  }

  const sendProgramEmails = async (program: Program) => {
    console.log(`Processing program: ${program.name}, Status: ${program.status}, End Date: ${program.endDate}`)
    
    const currentDate = new Date()
    const endDate = new Date(program.endDate)
    const daysSinceEnd = Math.floor((currentDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24))
    
    console.log(`Days since end: ${daysSinceEnd}`)

    if (program.status === "Terminé" && daysSinceEnd >= 1) {
      console.log(`Sending hot survey emails for program: ${program.name}`)
      for (const student of program.students) {
        if (!student.hotEmailSent) {
          try {
            await sendSurveyEmail(student, program.name, program.id, 'hot')
            await updateStudentEmailStatus(program.id, student.id, 'hot')
            program.reponsesChaud.envoye++
            student.hotEmailSent = true
          } catch (error) {
            console.error(`Failed to send hot survey email to ${student.email}:`, error)
            program.reponsesChaud.enAttente++
          }
        } else {
          console.log(`Hot email already sent to ${student.email}`)
        }
      }
    }

    const programDuration = Math.floor((endDate.getTime() - new Date(program.startDate).getTime()) / (1000 * 60 * 60 * 24))
    console.log(`Program duration: ${programDuration} days`)
    
    if (programDuration > 60 && daysSinceEnd >= 90) {
      console.log(`Sending cold survey emails for program: ${program.name}`)
      for (const student of program.students) {
        if (!student.coldEmailSent) {
          try {
            await sendSurveyEmail(student, program.name, program.id, 'cold')
            await updateStudentEmailStatus(program.id, student.id, 'cold')
            program.reponsesFroid.envoye++
            student.coldEmailSent = true
          } catch (error) {
            console.error(`Failed to send cold survey email to ${student.email}:`, error)
            program.reponsesFroid.enAttente++
          }
        } else {
          console.log(`Cold email already sent to ${student.email}`)
        }
      }
    }

    return program
  }

  useEffect(() => {
    const fetchProgramsAndSendEmails = async () => {
      setIsLoading(true)
      const fetchedPrograms = await fetchPrograms()
      if (fetchedPrograms.length > 0) {
        const updatedPrograms = await Promise.all(fetchedPrograms.map(sendProgramEmails))
        console.log("Updated programs after sending emails:", updatedPrograms)
        setPrograms(updatedPrograms)
      }
      setIsLoading(false)
    }

    fetchProgramsAndSendEmails()
  }, [])

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPrograms = filteredPrograms.slice(startIndex, endIndex)

  return {
    programs: currentPrograms,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    isLoading,
    error,
    totalPages,
  }
}