import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, differenceInMonths, isBefore, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProgrammeFormation {
  id: string;
  nom: string;
  etudiantsInscrits: number;
  statut: "en_cours" | "termine" | "a_venir";
  duree: "court_terme" | "long_terme";
  dateDebut: Date;
  dateFin: Date;
}

interface EditProgrammeFormationProps {
  isOpen: boolean;
  onClose: () => void;
  programme: ProgrammeFormation | null;
  onUpdate: (programme: ProgrammeFormation) => void;
  onDelete: (id: string) => void;
}

export function EditProgramme({
  isOpen,
  onClose,
  programme,
  onUpdate,
  onDelete,
}: EditProgrammeFormationProps) {
  const [editedProgramme, setEditedProgramme] = useState<ProgrammeFormation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    if (programme) {
      setEditedProgramme({
        ...programme,
        dateDebut: new Date(programme.dateDebut),
        dateFin: new Date(programme.dateFin),
      });
    }
  }, [programme]);

  const calculateDureeAndStatut = (dateDebut: Date, dateFin: Date): { duree: ProgrammeFormation['duree']; statut: ProgrammeFormation['statut'] } => {
    const now = new Date();
    const duree: ProgrammeFormation['duree'] = differenceInMonths(dateFin, dateDebut) >= 3 ? "long_terme" : "court_terme";
    let statut: ProgrammeFormation['statut'];

    if (isBefore(now, dateDebut)) {
      statut = "a_venir";
    } else if (isAfter(now, dateFin)) {
      statut = "termine";
    } else {
      statut = "en_cours";
    }

    return { duree, statut };
  };

  const handleModifierProgramme = async () => {
    if (editedProgramme) {
      setIsLoading(true);
      setError(null);
      try {
        const { duree, statut } = calculateDureeAndStatut(editedProgramme.dateDebut, editedProgramme.dateFin);
        const updatedProgramme: ProgrammeFormation = { ...editedProgramme, duree, statut };
        const programmeRef = doc(db, "programmes", updatedProgramme.id);
        
        const updateData = {
          nom: updatedProgramme.nom,
          etudiantsInscrits: updatedProgramme.etudiantsInscrits,
          statut: updatedProgramme.statut,
          duree: updatedProgramme.duree,
          dateDebut: updatedProgramme.dateDebut,
          dateFin: updatedProgramme.dateFin,
        };
        
        await updateDoc(programmeRef, updateData);
        onUpdate(updatedProgramme);
        onClose();
      } catch (error) {
        console.error("Erreur lors de la modification du programme:", error);
        setError("Une erreur est survenue lors de la modification du programme.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteProgramme = async () => {
    if (editedProgramme) {
      setIsLoading(true);
      setError(null);
      try {
        await deleteDoc(doc(db, "programmes", editedProgramme.id));
        onDelete(editedProgramme.id);
        onClose();
      } catch (error) {
        console.error("Erreur lors de la suppression du programme:", error);
        setError("Une erreur est survenue lors de la suppression du programme.");
      } finally {
        setIsLoading(false);
        setShowDeleteConfirmation(false);
      }
    }
  };

  if (!editedProgramme) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le Programme de Formation</DialogTitle>
          <DialogDescription>
            Mettez à jour les détails du programme de formation ou supprimez-le.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-nom" className="text-right">
              Nom
            </Label>
            <Input
              id="edit-nom"
              value={editedProgramme.nom}
              onChange={(e) =>
                setEditedProgramme({
                  ...editedProgramme,
                  nom: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-etudiants" className="text-right">
              Étudiants
            </Label>
            <Input
              id="edit-etudiants"
              type="number"
              value={editedProgramme.etudiantsInscrits}
              onChange={(e) =>
                setEditedProgramme({
                  ...editedProgramme,
                  etudiantsInscrits: parseInt(e.target.value),
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-date-debut" className="text-right">
              Date de Début
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !editedProgramme.dateDebut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedProgramme.dateDebut ? (
                    format(editedProgramme.dateDebut, "PP", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={editedProgramme.dateDebut}
                  onSelect={(date) =>
                    date &&
                    setEditedProgramme({
                      ...editedProgramme,
                      dateDebut: date,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-date-fin" className="text-right">
              Date de Fin
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !editedProgramme.dateFin && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedProgramme.dateFin ? (
                    format(editedProgramme.dateFin, "PP", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={editedProgramme.dateFin}
                  onSelect={(date) =>
                    date &&
                    setEditedProgramme({
                      ...editedProgramme,
                      dateFin: date,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <DialogFooter className="sm:justify-between">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirmation(true)}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
          <Button onClick={handleModifierProgramme} disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer les Modifications"}
          </Button>
        </DialogFooter>
      </DialogContent>
      {showDeleteConfirmation && (
        <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce programme de formation ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteProgramme} disabled={isLoading}>
                {isLoading ? "Suppression..." : "Supprimer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}