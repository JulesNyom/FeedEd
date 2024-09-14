"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, differenceInMonths, isBefore, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { AddTraining } from "./AddTraining";
import { EditProgramme } from "./EditProgramme";

interface ProgrammeFormation {
  id: string;
  nom: string;
  etudiantsInscrits: number;
  statut: "en_cours" | "termine" | "a_venir";
  duree: "court_terme" | "long_terme";
  dateDebut: Date;
  dateFin: Date;
}

type ProgrammeFormationSansId = Omit<ProgrammeFormation, "id" | "duree" | "statut">;

export default function TrainingTable() {
  const [programmes, setProgrammes] = useState<ProgrammeFormation[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [programmeCourant, setProgrammeCourant] = useState<ProgrammeFormation | null>(null);
  const [filtreStatut, setFiltreStatut] = useState<ProgrammeFormation["statut"] | "tous">("tous");
  const [triPar, setTriPar] = useState<keyof ProgrammeFormation>("nom");

  useEffect(() => {
    const fetchProgrammes = async () => {
      const programmesCollection = collection(db, "programmes");
      const programmesSnapshot = await getDocs(programmesCollection);
      const programmesList = programmesSnapshot.docs.map((doc) => {
        const data = doc.data() as ProgrammeFormationSansId;
        const dateDebut = parseDate(data.dateDebut);
        const dateFin = parseDate(data.dateFin);
        const { duree, statut } = calculateDureeAndStatut(dateDebut, dateFin);
        return {
          id: doc.id,
          ...data,
          dateDebut,
          dateFin,
          duree,
          statut,
        } as ProgrammeFormation;
      });
      setProgrammes(programmesList);
    };

    fetchProgrammes();
  }, []);

  const parseDate = (date: unknown): Date => {
    if (date instanceof Date) return date;
    if (date && typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') return date.toDate();
    if (typeof date === 'string') return new Date(date);
    if (typeof date === 'number') return new Date(date);
    console.error("Invalid date format:", date);
    return new Date(); // Return current date as fallback
  };

  const calculateDureeAndStatut = (dateDebut: Date, dateFin: Date): { duree: ProgrammeFormation["duree"]; statut: ProgrammeFormation["statut"] } => {
    const now = new Date();
    const duree: ProgrammeFormation["duree"] = differenceInMonths(dateFin, dateDebut) >= 3 ? "long_terme" : "court_terme";
    let statut: ProgrammeFormation["statut"];

    if (isBefore(now, dateDebut)) {
      statut = "a_venir";
    } else if (isAfter(now, dateFin)) {
      statut = "termine";
    } else {
      statut = "en_cours";
    }

    return { duree, statut };
  };

  const handleAjouterProgramme = async (nouveauProgramme: ProgrammeFormationSansId) => {
    try {
      const { duree, statut } = calculateDureeAndStatut(nouveauProgramme.dateDebut, nouveauProgramme.dateFin);
      const programmeComplet = { ...nouveauProgramme, duree, statut };
      const programmesCollection = collection(db, "programmes");
      const docRef = await addDoc(programmesCollection, programmeComplet);
      setProgrammes([...programmes, { ...programmeComplet, id: docRef.id }]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du programme:", error);
    }
  };

  const handleModifierProgramme = async (programmeMisAJour: ProgrammeFormation) => {
    try {
      const { duree, statut } = calculateDureeAndStatut(programmeMisAJour.dateDebut, programmeMisAJour.dateFin);
      const programmeComplet = { ...programmeMisAJour, duree, statut };
      const programmeRef = doc(db, "programmes", programmeComplet.id);
      await updateDoc(programmeRef, {
        nom: programmeComplet.nom,
        etudiantsInscrits: programmeComplet.etudiantsInscrits,
        dateDebut: programmeComplet.dateDebut,
        dateFin: programmeComplet.dateFin,
        duree: programmeComplet.duree,
        statut: programmeComplet.statut,
      });
      setProgrammes(programmes.map((programme) =>
        programme.id === programmeComplet.id ? programmeComplet : programme
      ));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la modification du programme:", error);
    }
  };

  const handleSupprimerProgramme = async (id: string) => {
    try {
      await deleteDoc(doc(db, "programmes", id));
      setProgrammes(programmes.filter((programme) => programme.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du programme:", error);
    }
  };

  const programmesFiltres = programmes
    .filter((programme) => filtreStatut === "tous" || programme.statut === filtreStatut)
    .sort((a, b) => {
      if (a[triPar] < b[triPar]) return -1;
      if (a[triPar] > b[triPar]) return 1;
      return 0;
    });

  const couleursStatut: Record<ProgrammeFormation["statut"], string> = {
    en_cours: "bg-blue-100 text-blue-800",
    termine: "bg-green-100 text-green-800",
    a_venir: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="container mx-auto py-8 sm:px-6">
      <h1 className="text-3xl text-foreground font-bold mb-8">Gestion des formations</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="mb-1">Programmes de Formation</CardTitle>
          <CardDescription>Gérez et visualisez tous les programmes de formation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="filter-status">Filtrer par Statut :</Label>
              <Select
                value={filtreStatut}
                onValueChange={(value: ProgrammeFormation["statut"] | "tous") => setFiltreStatut(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="termine">Terminé</SelectItem>
                  <SelectItem value="a_venir">À venir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="sort-by">Trier par :</Label>
              <Select
                value={triPar}
                onValueChange={(value: keyof ProgrammeFormation) => setTriPar(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner un champ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nom">Nom</SelectItem>
                  <SelectItem value="etudiantsInscrits">Étudiants Inscrits</SelectItem>
                  <SelectItem value="dateDebut">Date de Début</SelectItem>
                  <SelectItem value="dateFin">Date de Fin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AddTraining onAjouter={handleAjouterProgramme} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Étudiants Inscrits</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Date de Début</TableHead>
                <TableHead>Date de Fin</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programmesFiltres.map((programme) => (
                <TableRow key={programme.id}>
                  <TableCell className="font-medium">{programme.nom}</TableCell>
                  <TableCell>{programme.etudiantsInscrits}</TableCell>
                  <TableCell>
                    <Badge className={couleursStatut[programme.statut]}>
                      {programme.statut === "en_cours" ? "En cours" : programme.statut === "termine" ? "Terminé" : "À venir"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {programme.duree === "court_terme" ? "Court terme" : "Long terme"}
                  </TableCell>
                  <TableCell>{format(programme.dateDebut, "PP", { locale: fr })}</TableCell>
                  <TableCell>{format(programme.dateFin, "PP", { locale: fr })}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setProgrammeCourant(programme);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSupprimerProgramme(programme.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditProgramme
  isOpen={isEditDialogOpen}
  onClose={() => setIsEditDialogOpen(false)}
  programme={programmeCourant}
  onUpdate={handleModifierProgramme}
  onDelete={handleSupprimerProgramme}
/>
    </div>
  );
}