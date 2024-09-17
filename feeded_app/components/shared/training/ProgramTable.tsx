"use client"

import React, { useState, useEffect } from "react";
import { db, auth } from '@/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrainingProgramList } from "./ProgramList";
import { TrainingProgramForm } from "./ProgramForm";

interface TrainingProgram {
  id: string;
  name: string;
  students: number;
  status: "A venir" | "En cours" | "Terminé";
  startDate: string;
  endDate: string;
}

export default function ProgramTable() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<TrainingProgram[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "A venir" | "En cours" | "Terminé">("all");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchPrograms(user.uid);
      } else {
        setPrograms([]);
        setFilteredPrograms([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filterPrograms();
  }, [programs, searchTerm, statusFilter]);

  const fetchPrograms = async (userId: string) => {
    const programsCollection = collection(db, `users/${userId}/programs`);
    const programSnapshot = await getDocs(programsCollection);
    const programList = programSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TrainingProgram));
    setPrograms(programList);
  };

  const filterPrograms = () => {
    let filtered = programs;
    if (searchTerm) {
      filtered = filtered.filter((program) =>
        program.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((program) => program.status === statusFilter);
    }
    setFilteredPrograms(filtered);
  };

  const determineStatus = (
    startDate: string,
    endDate: string
  ): TrainingProgram["status"] => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "A venir";
    if (now > end) return "Terminé";
    return "En cours";
  };

  const handleSubmitProgram = async (programData: Omit<TrainingProgram, "id" | "status">) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    try {
      const status = determineStatus(programData.startDate, programData.endDate);
      
      if (editingProgram) {
        // Updating an existing program
        const programRef = doc(db, `users/${user.uid}/programs`, editingProgram.id);
        await updateDoc(programRef, { ...programData, status });
        setPrograms(programs.map(p => p.id === editingProgram.id ? { ...programData, id: editingProgram.id, status } : p));
      } else {
        // Adding a new program
        const programsCollection = collection(db, `users/${user.uid}/programs`);
        const docRef = await addDoc(programsCollection, { ...programData, status });
        const newProgram = { ...programData, id: docRef.id, status };
        setPrograms([...programs, newProgram]);
      }
      setShowForm(false);
      setEditingProgram(null);
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    try {
      await deleteDoc(doc(db, `users/${user.uid}/programs`, id));
      setPrograms(programs.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  
  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-3xl font-bold mb-6">Vos formations</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher des programmes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="A venir">À venir</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminé">Terminé</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg">
          Ajouter une formation
        </Button>
      </div>

      <TrainingProgramList
        programs={filteredPrograms}
        onEdit={setEditingProgram}
        onDelete={handleDeleteProgram}
      />

      <TrainingProgramForm
        show={showForm || !!editingProgram}
        onClose={() => {
          setShowForm(false);
          setEditingProgram(null);
        }}
        onSubmit={handleSubmitProgram}
        editingProgram={editingProgram}
      />
    </div>
  );
}