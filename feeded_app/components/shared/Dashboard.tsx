"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Users, ThumbsUp, Star, Brain, Award, Send, MessageSquare, Zap, Snowflake } from 'lucide-react';
import { collection, query, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase'; // Adjust this import based on your project structure

export default function Dashboard() {
  const [period, setPeriod] = useState("mois");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalFormations: 0,
    satisfactionGlobale: 0,
    participantsFormes: 0,
    tauxRecommandation: 0,
    noteContenu: 0,
    noteFormateurs: 0,
    tauxApplication: 0,
    formsSent: 0,
    formsResponded: 0,
    hotSurveys: 0,
    coldSurveys: 0
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      setIsLoading(true);
      try {
        // Fetch user document
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();

        // Fetch programs
        const programsQuery = query(collection(db, "users", currentUser.uid, "programs"));
        const programsSnapshot = await getDocs(programsQuery);
        const programs = programsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch students
        let allStudents = [];
        for (const program of programs) {
          const studentsQuery = query(collection(db, "users", currentUser.uid, "programs", program.id, "students"));
          const studentsSnapshot = await getDocs(studentsQuery);
          allStudents = allStudents.concat(studentsSnapshot.docs.map(doc => ({ id: doc.id, programId: program.id, ...doc.data() })));
        }

        // Fetch forms
        const formsQuery = query(collection(db, "forms"));
        const formsSnapshot = await getDocs(formsQuery);
        const allForms = formsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter forms based on studentId and programId
        const forms = allForms.filter(form => 
          allStudents.some(student => 
            student.id === form.studentId && student.programId === form.programId
          )
        );

        // Process data
        const totalFormations = programs.length;
        const participantsFormes = allStudents.length;
        const formsSent = allStudents.filter(s => s.hotEmailSent || s.coldEmailSent).length;
        const formsResponded = forms.length;

        const hotForms = forms.filter(f => f.formType === 'hot');
        const coldForms = forms.filter(f => f.formType === 'cold');

        // Calculate averages and percentages
        const satisfactionGlobale = hotForms.reduce((sum, form) => sum + (form.qualiteGlobale || 0), 0) / hotForms.length || 0;
        const tauxRecommandation = coldForms.length ? (coldForms.filter(f => f.recommandation >= 4).length / coldForms.length) * 100 : 0;
        const noteContenu = hotForms.reduce((sum, form) => sum + (form.contenuAttentes || 0), 0) / hotForms.length || 0;
        const noteFormateurs = hotForms.reduce((sum, form) => sum + (form.maitriseSujet || 0), 0) / hotForms.length || 0;
        const tauxApplication = coldForms.length ? (coldForms.filter(f => f.miseEnPratique >= 4).length / coldForms.length) * 100 : 0;

        setDashboardData({
          totalFormations,
          satisfactionGlobale: Math.round(satisfactionGlobale * 20), // Convert to percentage
          participantsFormes,
          tauxRecommandation: Math.round(tauxRecommandation),
          noteContenu: (noteContenu).toFixed(1),
          noteFormateurs: (noteFormateurs).toFixed(1),
          tauxApplication: Math.round(tauxApplication),
          formsSent,
          formsResponded,
          hotSurveys: hotForms.length,
          coldSurveys: coldForms.length
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, period]); // Re-fetch when user or period changes

  const cardData = [
    { title: "Formations terminées", value: dashboardData.totalFormations, icon: BookOpen, detail: "Total des formations dans la période" },
    { title: "Satisfaction globale", value: `${dashboardData.satisfactionGlobale}%`, icon: ThumbsUp, detail: "Moyenne des notes de satisfaction" },
    { title: "Participants formés", value: dashboardData.participantsFormes, icon: Users, detail: "Nombre total de participants" },
    { title: "Taux de recommandation", value: `${dashboardData.tauxRecommandation}%`, icon: Star, detail: "Pourcentage qui recommanderait la formation" },
    { title: "Note du contenu", value: dashboardData.noteContenu, icon: Award, detail: "Note moyenne du contenu des formations" },
    { title: "Note des formateurs", value: dashboardData.noteFormateurs, icon: Star, detail: "Note moyenne des formateurs" },
    { title: "Taux d'application", value: `${dashboardData.tauxApplication}%`, icon: Brain, detail: "Pourcentage ayant appliqué les connaissances" },
    { title: "Formulaires envoyés", value: dashboardData.formsSent, icon: Send, detail: "Nombre de formulaires envoyés" },
    { title: "Formulaires répondus", value: dashboardData.formsResponded, icon: MessageSquare, detail: `Taux de réponse: ${((dashboardData.formsResponded / dashboardData.formsSent) * 100).toFixed(1)}%` },
    { title: "Enquêtes à chaud", value: dashboardData.hotSurveys, icon: Zap, detail: "Nombre d'enquêtes à chaud complétées" },
    { title: "Enquêtes à froid", value: dashboardData.coldSurveys, icon: Snowflake, detail: "Nombre d'enquêtes à froid complétées" },
  ];

  if (!currentUser) {
    return <div>Veuillez vous connecter pour voir le tableau de bord.</div>;
  }

  return (
    <div className="max-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8"
        >
          Bienvenue, {currentUser.displayName || currentUser.email}
        </motion.h1>
        
        <div className="mb-6">
          <Select onValueChange={setPeriod} defaultValue={period}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner la période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semaine">Cette semaine</SelectItem>
              <SelectItem value="mois">Ce mois</SelectItem>
              <SelectItem value="trimestre">Ce trimestre</SelectItem>
              <SelectItem value="annee">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="overflow-hidden"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{card.title}</h2>
                    <card.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold">{card.value}</p>
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: hoveredCard === index ? 1 : 0, height: hoveredCard === index ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-gray-600 mt-2"
                  >
                    {card.detail}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}