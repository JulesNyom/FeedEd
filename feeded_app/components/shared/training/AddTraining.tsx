import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase"; 

interface ProgrammeFormation {
    id?: string;
    nom: string;
    etudiantsInscrits: number;
    dateDebut: Date;
    dateFin: Date;
  }
  
  interface AjouterFormationProps {
    onAjouter: (nouveauProgramme: ProgrammeFormation) => void;
  }
  
  export function AddTraining({ onAjouter }: AjouterFormationProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
  
    const [nouveauProgramme, setNouveauProgramme] = useState<ProgrammeFormation>({
      nom: "",
      etudiantsInscrits: 0,
      dateDebut: new Date(),
      dateFin: new Date(),
    });
  
    const handleAjouter = async () => {
      if (!currentUser) {
        setError("Vous devez être connecté pour ajouter une formation.");
        return;
      }
  
      setIsLoading(true);
      setError(null);
  
      try {
        const formationData = {
          ...nouveauProgramme,
          createdBy: currentUser.uid,
          createdAt: new Date(),
        };
  
        const docRef = await addDoc(collection(db, "formations"), {
          ...formationData,
          dateDebut: formationData.dateDebut.toISOString(),
          dateFin: formationData.dateFin.toISOString(),
          createdAt: formationData.createdAt.toISOString(),
        });
  
        console.log("Formation ajoutée avec ID: ", docRef.id);
        onAjouter({ ...formationData, id: docRef.id });
        setIsOpen(false);
        resetForm();
      } catch (e) {
        console.error("Erreur lors de l'ajout de la formation: ", e);
        setError("Une erreur est survenue lors de l'ajout de la formation.");
      } finally {
        setIsLoading(false);
      }
    };
  
    const resetForm = () => {
      setNouveauProgramme({
        nom: "",
        etudiantsInscrits: 0,
        dateDebut: new Date(),
        dateFin: new Date(),
      });
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un Programme
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un Nouveau Programme de Formation</DialogTitle>
          <DialogDescription>
            Entrez les détails du nouveau programme de formation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nom" className="text-right">
              Nom
            </Label>
            <Input
              id="nom"
              value={nouveauProgramme.nom}
              onChange={(e) =>
                setNouveauProgramme({
                  ...nouveauProgramme,
                  nom: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="etudiants" className="text-right">
              Étudiants
            </Label>
            <Input
              id="etudiants"
              type="number"
              value={nouveauProgramme.etudiantsInscrits}
              onChange={(e) =>
                setNouveauProgramme({
                  ...nouveauProgramme,
                  etudiantsInscrits: parseInt(e.target.value),
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date-debut" className="text-right">
              Date de Début
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !nouveauProgramme.dateDebut && "text-muted-foreground"
                  )}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {nouveauProgramme.dateDebut ? (
                    format(nouveauProgramme.dateDebut, "PP", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={nouveauProgramme.dateDebut}
                  onSelect={(date) =>
                    date &&
                    setNouveauProgramme({
                      ...nouveauProgramme,
                      dateDebut: date,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date-fin" className="text-right">
              Date de Fin
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !nouveauProgramme.dateFin && "text-muted-foreground"
                  )}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {nouveauProgramme.dateFin ? (
                    format(nouveauProgramme.dateFin, "PP", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={nouveauProgramme.dateFin}
                  onSelect={(date) =>
                    date &&
                    setNouveauProgramme({ ...nouveauProgramme, dateFin: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <DialogFooter>
          <Button onClick={handleAjouter} disabled={isLoading}>
            {isLoading ? "Ajout en cours..." : "Ajouter une formation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}