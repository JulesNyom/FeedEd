import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, updateDoc, increment, query, where } from 'firebase/firestore';
import { db, auth } from '@/firebase';

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

export type FormAnswer = {
  id: string;
  formType: "hot" | "cold";
  studentId: string;
  programId: string;
  submittedAt: Date;
  answers: HotSurveyAnswers | ColdSurveyAnswers;
};

type HotSurveyAnswers = {
  applicationConnaissances: number;
  commentaires: string;
  contenuAttentes: number;
  exercicesPertinents: number;
  formation: string;
  interactivite: number;
  maitriseSujet: number;
  nom: string;
  objectifsClairs: number;
  organisationLogistique: number;
  prenom: string;
  qualiteGlobale: number;
  qualiteSupports: number;
};

type ColdSurveyAnswers = {
  confiance?: number;
  emploiGraceFormation?: string;
  formation?: string;
  impactSituation?: number;
  miseEnPratique?: number;
  nom?: string;
  pertinenceConnaissances?: number;
  prenom?: string;
  recommandation?: number;
  reponseBesoins?: number;
  situationProfessionnelle?: string;
  situationProfessionnelleAutre?: string;
  suggestions?: string;
};

export type OrganizedFormAnswers = {
  hot: FormAnswer[];
  cold: FormAnswer[];
}

export const useSurveyManagement = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formAnswers, setFormAnswers] = useState<OrganizedFormAnswers | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const itemsPerPage = 5;

  const showAlert = useCallback((type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const fetchPrograms = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("No authenticated user found");
      setIsLoading(false);
      return [];
    }

    try {
      const programsCollection = collection(db, `users/${user.uid}/programs`);
      const programSnapshot = await getDocs(programsCollection);
      const programList = await Promise.all(programSnapshot.docs.map(async (doc) => {
        const programData = doc.data() as Omit<Program, 'id' | 'students'>;
        const studentsCollection = collection(db, `users/${user.uid}/programs/${doc.id}/students`);
        const studentSnapshot = await getDocs(studentsCollection);
        const students = studentSnapshot.docs.map(studentDoc => ({
          id: studentDoc.id,
          ...studentDoc.data()
        })) as Student[];
        
        return {
          id: doc.id,
          ...programData,
          students,
          reponsesChaud: programData.reponsesChaud || { envoye: 0, enAttente: 0, relance: 0 },
          reponsesFroid: programData.reponsesFroid || { envoye: 0, enAttente: 0, relance: 0 },
        };
      }));
      
      console.log("Fetched programs:", programList);
      
      if (programList.length === 0) {
        setError("No programs found");
      }
      
      return programList;
    } catch (error) {
      console.error("Error fetching programs: ", error);
      setError("Failed to fetch programs. Please try again later.");
      return [];
    }
  }, []);

  const sendSurveyEmail = useCallback(async (studentData: Student, programName: string, programId: string, type: 'hot' | 'cold') => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found");
    }

    const surveyLink = `http://localhost:3000/${type === 'hot' ? 'chaud' : 'froid'}/${programId}-${studentData.id}`;
    
    const subject = type === 'hot' 
      ? "Merci pour votre participation et enquête de satisfaction"
      : "Suivi de votre formation et enquête d'impact";

    const textContent = type === 'hot'
      ? `Cher(e) ${studentData.firstName} ${studentData.lastName},\n\nMerci d'avoir participé à notre programme de formation "${programName}". Nous espérons que vous avez trouvé cette expérience enrichissante.\n\nNous vous serions reconnaissants de bien vouloir prendre quelques minutes pour répondre à notre enquête de satisfaction : ${surveyLink}\n\nVotre feedback est précieux pour nous aider à améliorer nos formations.\n\nCordialement,\nL'équipe de formation`
      : `Cher(e) ${studentData.firstName} ${studentData.lastName},\n\n90 jours se sont écoulés depuis la fin de votre formation "${programName}". Nous espérons que les compétences acquises vous sont utiles dans votre travail quotidien.\n\nNous aimerions connaître l'impact à long terme de cette formation sur votre travail. Merci de prendre quelques minutes pour répondre à notre enquête : ${surveyLink}\n\nVotre retour d'expérience est très important pour nous.\n\nCordialement,\nL'équipe de formation`;

    const htmlContent = type === 'hot'
      ? `<p>Cher(e) ${studentData.firstName} ${studentData.lastName},</p><p>Merci d'avoir participé à notre programme de formation "${programName}". Nous espérons que vous avez trouvé cette expérience enrichissante.</p><p>Nous vous serions reconnaissants de bien vouloir prendre quelques minutes pour répondre à notre <a href="${surveyLink}">enquête de satisfaction</a>.</p><p>Votre feedback est précieux pour nous aider à améliorer nos formations.</p><p>Cordialement,<br>L'équipe de formation</p>`
      : `<p>Cher(e) ${studentData.firstName} ${studentData.lastName},</p><p>90 jours se sont écoulés depuis la fin de votre formation "${programName}". Nous espérons que les compétences acquises vous sont utiles dans votre travail quotidien.</p><p>Nous aimerions connaître l'impact à long terme de cette formation sur votre travail. Merci de prendre quelques minutes pour répondre à notre <a href="${surveyLink}">enquête d'impact</a>.</p><p>Votre retour d'expérience est très important pour nous.</p><p>Cordialement,<br>L'équipe de formation</p>`;

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

      console.log(`Email sent to ${studentData.email} for program ${programName} (${type})`);
      
      await updateSurveyCounts(programId, type, 'envoye');
      
      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      
      await updateSurveyCounts(programId, type, 'enAttente');
      
      throw error;
    }
  }, []);

  const updateSurveyCounts = useCallback(async (programId: string, type: 'hot' | 'cold', field: 'envoye' | 'enAttente' | 'relance') => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    const programDocRef = doc(db, `users/${user.uid}/programs`, programId);
    try {
      await updateDoc(programDocRef, {
        [`reponses${type === 'hot' ? 'Chaud' : 'Froid'}.${field}`]: increment(1)
      });
      console.log(`Updated ${type} survey ${field} count for program ${programId}`);
    } catch (error) {
      console.error(`Error updating ${type} survey ${field} count for program ${programId}:`, error);
    }
  }, []);

  const updateStudentEmailStatus = useCallback(async (programId: string, studentId: string, type: 'hot' | 'cold') => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    const studentDocRef = doc(db, `users/${user.uid}/programs/${programId}/students`, studentId);
    try {
      await updateDoc(studentDocRef, {
        [type === 'hot' ? 'hotEmailSent' : 'coldEmailSent']: true
      });
      console.log(`Updated ${type} email status for student ${studentId}`);
    } catch (error) {
      console.error(`Error updating ${type} email status for student ${studentId}:`, error);
    }
  }, []);

  const sendHotSurveys = useCallback(async (programId: string) => {
    const program = programs.find(p => p.id === programId);
    if (!program) {
      console.error(`Program with id ${programId} not found`);
      showAlert('error', `Program with id ${programId} not found`);
      return;
    }

    const updatedProgram = { ...program };
    let sentCount = 0;
    let errorCount = 0;

    for (const student of updatedProgram.students) {
      if (!student.hotEmailSent) {
        try {
          await sendSurveyEmail(student, updatedProgram.name, updatedProgram.id, 'hot');
          await updateStudentEmailStatus(updatedProgram.id, student.id, 'hot');
          updatedProgram.reponsesChaud.envoye++;
          student.hotEmailSent = true;
          sentCount++;
        } catch (error) {
          console.error(`Failed to send hot survey email to ${student.email}:`, error);
          updatedProgram.reponsesChaud.enAttente++;
          errorCount++;
        }
      }
    }

    setPrograms(prevPrograms => prevPrograms.map(p => p.id === programId ? updatedProgram : p));

    if (sentCount > 0) {
      showAlert('success', `Successfully sent ${sentCount} hot survey${sentCount > 1 ? 's' : ''}.`);
    }
    if (errorCount > 0) {
      showAlert('error', `Failed to send ${errorCount} hot survey${errorCount > 1 ? 's' : ''}.`);
    }
    if (sentCount === 0 && errorCount === 0) {
      showAlert('info', 'No new hot surveys to send.');
    }
  }, [programs, sendSurveyEmail, updateStudentEmailStatus, showAlert]);

  const sendColdSurveys = useCallback(async (programId: string) => {
    const program = programs.find(p => p.id === programId);
    if (!program) {
      console.error(`Program with id ${programId} not found`);
      showAlert('error', `Program with id ${programId} not found`);
      return;
    }

    const updatedProgram = { ...program };
    let sentCount = 0;
    let errorCount = 0;

    for (const student of updatedProgram.students) {
      if (!student.coldEmailSent) {
        try {
          await sendSurveyEmail(student, updatedProgram.name, updatedProgram.id, 'cold');
          await updateStudentEmailStatus(updatedProgram.id, student.id, 'cold');
          updatedProgram.reponsesFroid.envoye++;
          student.coldEmailSent = true;
          sentCount++;
        } catch (error) {
          console.error(`Failed to send cold survey email to ${student.email}:`, error);
          updatedProgram.reponsesFroid.enAttente++;
          errorCount++;
        }
      }
    }

    setPrograms(prevPrograms => prevPrograms.map(p => p.id === programId ? updatedProgram : p));

    if (sentCount > 0) {
      showAlert('success', `Successfully sent ${sentCount} cold survey${sentCount > 1 ? 's' : ''}.`);
    }
    if (errorCount > 0) {
      showAlert('error', `Failed to send ${errorCount} cold survey${errorCount > 1 ? 's' : ''}.`);
    }
    if (sentCount === 0 && errorCount === 0) {
      showAlert('info', 'No new cold surveys to send.');
    }
  }, [programs, sendSurveyEmail, updateStudentEmailStatus, showAlert]);

  const fetchFormAnswersByProgram = useCallback(async (programId: string): Promise<OrganizedFormAnswers> => {
    console.log(`Starting fetchFormAnswersByProgram for programId: ${programId}`);
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found");
      throw new Error("No authenticated user found");
    }

    try {
      console.log("Creating query for forms collection");
      const formsCollection = collection(db, 'forms');
      const q = query(formsCollection, where("programId", "==", programId));
      
      console.log("Executing query");
      const querySnapshot = await getDocs(q);
      
      console.log(`Query returned ${querySnapshot.size} documents`);

      const organizedAnswers: OrganizedFormAnswers = {
        hot: [],
        cold: []
      };

      querySnapshot.forEach(doc => {
        console.log(`Processing document ${doc.id}`);
        const data = doc.data();
        console.log("Raw document data:", data);

        const formAnswer: FormAnswer = {
          id: doc.id,
          formType: data.formType,
          studentId: data.studentId,
          programId: data.programId,
          submittedAt: data.submittedAt.toDate(),
          answers: data
        };

        if (formAnswer.formType === "hot") {
          organizedAnswers.hot.push(formAnswer);
        } else if (formAnswer.formType === "cold") {
          organizedAnswers.cold.push(formAnswer);
        } else {
          console.warn(`Unknown form type: ${formAnswer.formType}`);
        }
      });

      console.log(`Organized answers:`, JSON.stringify(organizedAnswers, null, 2));
      return organizedAnswers;
    } catch (error) {
      console.error("Error fetching form answers for program:", error);
      throw new Error("Unable to fetch form answers for the specified program.");
    }
  }, []);

  const generateCSV = useCallback((formAnswers: FormAnswer[], formType: 'hot' | 'cold'): string => {
    if (formAnswers.length === 0) {
      return "No data available";
    }

    let headers: string[];
    let csvRows: string[];

    if (formType === 'hot') {
      headers = [
        "Student ID", "Submitted At", "Application Connaissances", "Commentaires", "Contenu Attentes",
        "Exercices Pertinents", "Formation", "Interactivite", "Maitrise Sujet", "Nom",
        "Objectifs Clairs", "Organisation Logistique", "Prenom", "Qualite Globale", "Qualite Supports"
      ];
      csvRows = [headers.join(',')];

      for (const answer of formAnswers) {
        const hotAnswers = answer.answers as HotSurveyAnswers;
        const row = [
          answer.studentId,
          answer.submittedAt.toISOString(),
          escapeCSVField(hotAnswers.applicationConnaissances?.toString() ?? ''),
          escapeCSVField(hotAnswers.commentaires ?? ''),
          escapeCSVField(hotAnswers.contenuAttentes?.toString() ?? ''),
          escapeCSVField(hotAnswers.exercicesPertinents?.toString() ?? ''),
          escapeCSVField(hotAnswers.formation ?? ''),
          escapeCSVField(hotAnswers.interactivite?.toString() ?? ''),
          escapeCSVField(hotAnswers.maitriseSujet?.toString() ?? ''),
          escapeCSVField(hotAnswers.nom ?? ''),
          escapeCSVField(hotAnswers.objectifsClairs?.toString() ?? ''),
          escapeCSVField(hotAnswers.organisationLogistique?.toString() ?? ''),
          escapeCSVField(hotAnswers.prenom ?? ''),
          escapeCSVField(hotAnswers.qualiteGlobale?.toString() ?? ''),
          escapeCSVField(hotAnswers.qualiteSupports?.toString() ?? '')
        ];
        csvRows.push(row.join(','));
      }
    } else {
      headers = [
        "Student ID", "Submitted At", "Confiance", "Emploi Grace Formation", "Formation",
        "Impact Situation", "Mise En Pratique", "Nom", "Pertinence Connaissances", "Prenom",
        "Recommandation", "Reponse Besoins", "Situation Professionnelle", "Situation Professionnelle Autre",
        "Suggestions"
      ];
      csvRows = [headers.join(',')];

      for (const answer of formAnswers) {
        const coldAnswers = answer.answers as ColdSurveyAnswers;
        const row = [
          answer.studentId,
          answer.submittedAt.toISOString(),
          escapeCSVField(coldAnswers.confiance?.toString() ?? ''),
          escapeCSVField(coldAnswers.emploiGraceFormation ?? ''),
          escapeCSVField(coldAnswers.formation ?? ''),
          escapeCSVField(coldAnswers.impactSituation?.toString() ?? ''),
          escapeCSVField(coldAnswers.miseEnPratique?.toString() ?? ''),
          escapeCSVField(coldAnswers.nom ?? ''),
          escapeCSVField(coldAnswers.pertinenceConnaissances?.toString() ?? ''),
          escapeCSVField(coldAnswers.prenom ?? ''),
          escapeCSVField(coldAnswers.recommandation?.toString() ?? ''),
          escapeCSVField(coldAnswers.reponseBesoins?.toString() ?? ''),
          escapeCSVField(coldAnswers.situationProfessionnelle ?? ''),
          escapeCSVField(coldAnswers.situationProfessionnelleAutre ?? ''),
          escapeCSVField(coldAnswers.suggestions ?? '')
        ];
        csvRows.push(row.join(','));
      }
    }

    console.log('CSV Rows before join:', csvRows);
    return csvRows.join('\n');
  }, []);
  
  const escapeCSVField = (field: string): string => {
    if (field.includes(',') || field.includes('\n') || field.includes('"')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const downloadCSV = useCallback((csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const downloadFormAnswers = useCallback((formType: "hot" | "cold", currentFormAnswers: OrganizedFormAnswers | null = formAnswers) => {
    console.log("Attempting to download form answers. Current formAnswers state:", currentFormAnswers);
    
    if (!currentFormAnswers) {
      console.error("formAnswers is null. Please fetch the data first.");
      showAlert('error', "No form answers available. Please fetch the data first.");
      return;
    }

    const answers = formType === "hot" ? currentFormAnswers.hot : currentFormAnswers.cold;
    
    if (answers.length === 0) {
      console.error(`No ${formType} form answers available.`);
      showAlert('error', `No ${formType} form answers available for download.`);
      return;
    }

    console.log(`Generating CSV for ${formType} answers:`, answers);
    const csv = generateCSV(answers, formType);
    
    if (csv === "No data available") {
      console.error(`Generated CSV is empty for ${formType} answers.`);
      showAlert('error', `No data available for ${formType} form answers.`);
      return;
    }

    console.log("CSV generated successfully. Initiating download...");
    downloadCSV(csv, `${formType}_form_answers.csv`);
    console.log("Download initiated.");
    showAlert('success', `${formType.charAt(0).toUpperCase() + formType.slice(1)} form answers downloaded successfully.`);
  }, [formAnswers, generateCSV, downloadCSV, showAlert]);

  useEffect(() => {
    const fetchProgramsData = async () => {
      setIsLoading(true);
      const fetchedPrograms = await fetchPrograms();
      setPrograms(fetchedPrograms);
      setIsLoading(false);
    };

    fetchProgramsData();
  }, [fetchPrograms]);

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrograms = filteredPrograms.slice(startIndex, endIndex);

  const refreshPrograms = useCallback(async () => {
    setIsLoading(true);
    const fetchedPrograms = await fetchPrograms();
    setPrograms(fetchedPrograms);
    setIsLoading(false);
  }, [fetchPrograms]);

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
    fetchFormAnswersByProgram,
    downloadFormAnswers,
    formAnswers,
    setFormAnswers,
    generateCSV,
    alert,
    showAlert,
    hideAlert
  };
};