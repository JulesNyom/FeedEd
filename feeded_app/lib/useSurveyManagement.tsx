import { useState, useEffect, useCallback } from "react"
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore'
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

  // Function to fetch programs from Firestore
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
        const programData = doc.data() as Omit<Program, 'id' | 'students'>
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
          reponsesChaud: programData.reponsesChaud || { envoye: 0, enAttente: 0, relance: 0 },
          reponsesFroid: programData.reponsesFroid || { envoye: 0, enAttente: 0, relance: 0 },
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

  // Updated function to send survey email
  const sendSurveyEmail = async (studentData: Student, programName: string, programId: string, type: 'hot' | 'cold') => {
    const user = auth.currentUser
    if (!user) {
      throw new Error("No authenticated user found")
    }

    const surveyLink = `http://localhost:3000/${type === 'hot' ? 'chaud' : 'froid'}/studentId=${studentData.id}&programId=${programId}`
    
    const subject = type === 'hot' 
      ? "Merci pour votre participation et enquête de satisfaction"
      : "Suivi de votre formation et enquête d'impact"

    const textContent = type === 'hot'
      ? `Cher(e) ${studentData.firstName} ${studentData.lastName},\n\nMerci d'avoir participé à notre programme de formation "${programName}". Nous espérons que vous avez trouvé cette expérience enrichissante.\n\nNous vous serions reconnaissants de bien vouloir prendre quelques minutes pour répondre à notre enquête de satisfaction : ${surveyLink}\n\nVotre feedback est précieux pour nous aider à améliorer nos formations.\n\nCordialement,\nL'équipe de formation`
      : `Cher(e) ${studentData.firstName} ${studentData.lastName},\n\n90 jours se sont écoulés depuis la fin de votre formation "${programName}". Nous espérons que les compétences acquises vous sont utiles dans votre travail quotidien.\n\nNous aimerions connaître l'impact à long terme de cette formation sur votre travail. Merci de prendre quelques minutes pour répondre à notre enquête : ${surveyLink}\n\nVotre retour d'expérience est très important pour nous.\n\nCordialement,\nL'équipe de formation`

    const htmlContent = type === 'hot'
      ? `<p>Cher(e) ${studentData.firstName} ${studentData.lastName},</p><p>Merci d'avoir participé à notre programme de formation "${programName}". Nous espérons que vous avez trouvé cette expérience enrichissante.</p><p>Nous vous serions reconnaissants de bien vouloir prendre quelques minutes pour répondre à notre <a href="${surveyLink}">enquête de satisfaction</a>.</p><p>Votre feedback est précieux pour nous aider à améliorer nos formations.</p><p>Cordialement,<br>L'équipe de formation</p>`
      : `<p>Cher(e) ${studentData.firstName} ${studentData.lastName},</p><p>90 jours se sont écoulés depuis la fin de votre formation "${programName}". Nous espérons que les compétences acquises vous sont utiles dans votre travail quotidien.</p><p>Nous aimerions connaître l'impact à long terme de cette formation sur votre travail. Merci de prendre quelques minutes pour répondre à notre <a href="${surveyLink}">enquête d'impact</a>.</p><p>Votre retour d'expérience est très important pour nous.</p><p>Cordialement,<br>L'équipe de formation</p>`

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          programId: programId,
          studentId: studentData.id,
          subject: subject,
          textContent: textContent,
          htmlContent: htmlContent,
          type: type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      console.log(`Email sent to ${studentData.email} for program ${programName} (${type})`)
      
      // Update survey counts in Firestore
      await updateSurveyCounts(programId, type, 'envoye');
      
      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Update pending count in case of failure
      await updateSurveyCounts(programId, type, 'enAttente');
      
      throw error;
    }
  };

  // Function to update survey counts in Firestore
  const updateSurveyCounts = async (programId: string, type: 'hot' | 'cold', field: 'envoye' | 'enAttente' | 'relance') => {
    const user = auth.currentUser
    if (!user) {
      console.error("No authenticated user found")
      return
    }

    const programDocRef = doc(db, `users/${user.uid}/programs`, programId)
    try {
      await updateDoc(programDocRef, {
        [`reponses${type === 'hot' ? 'Chaud' : 'Froid'}.${field}`]: increment(1)
      })
      console.log(`Updated ${type} survey ${field} count for program ${programId}`)
    } catch (error) {
      console.error(`Error updating ${type} survey ${field} count for program ${programId}:`, error)
    }
  }

  // Function to update student email status
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

  // Function to send hot surveys
  const sendHotSurveys = useCallback(async (programId: string) => {
    const program = programs.find(p => p.id === programId)
    if (!program) {
      console.error(`Program with id ${programId} not found`)
      return
    }

    const updatedProgram = { ...program }
    for (const student of updatedProgram.students) {
      if (!student.hotEmailSent) {
        try {
          await sendSurveyEmail(student, updatedProgram.name, updatedProgram.id, 'hot')
          await updateStudentEmailStatus(updatedProgram.id, student.id, 'hot')
          updatedProgram.reponsesChaud.envoye++
          student.hotEmailSent = true
        } catch (error) {
          console.error(`Failed to send hot survey email to ${student.email}:`, error)
          updatedProgram.reponsesChaud.enAttente++
        }
      }
    }

    setPrograms(prevPrograms => prevPrograms.map(p => p.id === programId ? updatedProgram : p))
  }, [programs])

  // Function to send cold surveys
  const sendColdSurveys = useCallback(async (programId: string) => {
    const program = programs.find(p => p.id === programId)
    if (!program) {
      console.error(`Program with id ${programId} not found`)
      return
    }

    const updatedProgram = { ...program }
    for (const student of updatedProgram.students) {
      if (!student.coldEmailSent) {
        try {
          await sendSurveyEmail(student, updatedProgram.name, updatedProgram.id, 'cold')
          await updateStudentEmailStatus(updatedProgram.id, student.id, 'cold')
          updatedProgram.reponsesFroid.envoye++
          student.coldEmailSent = true
        } catch (error) {
          console.error(`Failed to send cold survey email to ${student.email}:`, error)
          updatedProgram.reponsesFroid.enAttente++
        }
      }
    }

    setPrograms(prevPrograms => prevPrograms.map(p => p.id === programId ? updatedProgram : p))
  }, [programs])

  // Effect to fetch programs on component mount
  useEffect(() => {
    const fetchProgramsData = async () => {
      setIsLoading(true)
      const fetchedPrograms = await fetchPrograms()
      setPrograms(fetchedPrograms)
      setIsLoading(false)
    }

    fetchProgramsData()
  }, [])

  // Filter programs based on search term
  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPrograms = filteredPrograms.slice(startIndex, endIndex)

  // Function to refresh programs data
  const refreshPrograms = async () => {
    setIsLoading(true)
    const fetchedPrograms = await fetchPrograms()
    setPrograms(fetchedPrograms)
    setIsLoading(false)
  }

  return {
    programs: currentPrograms,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    isLoading,
    error,
    totalPages,
    sendHotSurveys,
    sendColdSurveys,
    refreshPrograms,
  }
}