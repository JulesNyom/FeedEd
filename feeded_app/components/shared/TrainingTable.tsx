"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Pencil, Trash2, Plus } from "lucide-react";

interface ProgrammeFormation {
  id: string;
  nom: string;
  etudiantsInscrits: number;
  statut: "en_cours" | "termine" | "a_venir";
  duree: "court_terme" | "long_terme";
  dateDebut: Date;
  dateFin: Date;
}

export default function GestionProgrammesFormation() {
  const [programmes, setProgrammes] = useState<ProgrammeFormation[]>([
    {
      id: "1",
      nom: "Bootcamp Développement Web",
      etudiantsInscrits: 25,
      statut: "en_cours",
      duree: "court_terme",
      dateDebut: new Date(2023, 5, 1),
      dateFin: new Date(2023, 7, 31),
    },
    {
      id: "2",
      nom: "Fondamentaux de la Science des Données",
      etudiantsInscrits: 30,
      statut: "a_venir",
      duree: "long_terme",
      dateDebut: new Date(2023, 8, 1),
      dateFin: new Date(2024, 1, 29),
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [programmeCourant, setProgrammeCourant] =
    useState<ProgrammeFormation | null>(null);
  const [filtreStatut, setFiltreStatut] = useState<
    ProgrammeFormation["statut"] | "tous"
  >("tous");
  const [triPar, setTriPar] = useState<keyof ProgrammeFormation>("nom");

  const [nouveauProgramme, setNouveauProgramme] = useState<
    Omit<ProgrammeFormation, "id">
  >({
    nom: "",
    etudiantsInscrits: 0,
    statut: "a_venir",
    duree: "court_terme",
    dateDebut: new Date(),
    dateFin: new Date(),
  });

  const handleAjouterProgramme = () => {
    const id = Date.now().toString();
    setProgrammes([...programmes, { ...nouveauProgramme, id }]);
    setIsAddDialogOpen(false);
    setNouveauProgramme({
      nom: "",
      etudiantsInscrits: 0,
      statut: "a_venir",
      duree: "court_terme",
      dateDebut: new Date(),
      dateFin: new Date(),
    });
  };

  const handleModifierProgramme = () => {
    if (programmeCourant) {
      setProgrammes(
        programmes.map((programme) =>
          programme.id === programmeCourant.id ? programmeCourant : programme
        )
      );
      setIsEditDialogOpen(false);
    }
  };

  const handleSupprimerProgramme = (id: string) => {
    setProgrammes(programmes.filter((programme) => programme.id !== id));
  };

  const programmesFiltres = programmes
    .filter(
      (programme) =>
        filtreStatut === "tous" || programme.statut === filtreStatut
    )
    .sort((a, b) => {
      if (a[triPar] < b[triPar]) return -1;
      if (a[triPar] > b[triPar]) return 1;
      return 0;
    });

  const couleursStatut = {
    en_cours: "bg-blue-100 text-blue-800",
    termine: "bg-green-100 text-green-800",
    a_venir: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="container mx-auto py-8 sm:px-6">
      <h1 className="text-3xl text-foreground font-bold mb-8">
        Gestion des Formations
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="mb-1">Programmes de Formation</CardTitle>
          <CardDescription>
            Gérez et visualisez tous les programmes de formation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="filter-status">Filtrer par Statut :</Label>
              <Select
                value={filtreStatut}
                onValueChange={(value: ProgrammeFormation["statut"] | "tous") =>
                  setFiltreStatut(value)
                }>
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
                onValueChange={(value: keyof ProgrammeFormation) =>
                  setTriPar(value)
                }>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner un champ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nom">Nom</SelectItem>
                  <SelectItem value="etudiantsInscrits">
                    Étudiants Inscrits
                  </SelectItem>
                  <SelectItem value="dateDebut">Date de Début</SelectItem>
                  <SelectItem value="dateFin">Date de Fin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un Programme
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    Ajouter un Nouveau Programme de Formation
                  </DialogTitle>
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
                    <Label htmlFor="statut" className="text-right">
                      Statut
                    </Label>
                    <Select
                      value={nouveauProgramme.statut}
                      onValueChange={(value: ProgrammeFormation["statut"]) =>
                        setNouveauProgramme({
                          ...nouveauProgramme,
                          statut: value,
                        })
                      }>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner le statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="termine">Terminé</SelectItem>
                        <SelectItem value="a_venir">À venir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duree" className="text-right">
                      Durée
                    </Label>
                    <Select
                      value={nouveauProgramme.duree}
                      onValueChange={(value: ProgrammeFormation["duree"]) =>
                        setNouveauProgramme({
                          ...nouveauProgramme,
                          duree: value,
                        })
                      }>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner la durée" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="court_terme">Court terme</SelectItem>
                        <SelectItem value="long_terme">Long terme</SelectItem>
                      </SelectContent>
                    </Select>
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
                            !nouveauProgramme.dateDebut &&
                              "text-muted-foreground"
                          )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {nouveauProgramme.dateDebut ? (
                            format(nouveauProgramme.dateDebut, "PP", {
                              locale: fr,
                            })
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
                            format(nouveauProgramme.dateFin, "PP", {
                              locale: fr,
                            })
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
                            setNouveauProgramme({
                              ...nouveauProgramme,
                              dateFin: date,
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAjouterProgramme}>
                    Ajouter le Programme
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                      {programme.statut === "en_cours"
                        ? "En cours"
                        : programme.statut === "termine"
                        ? "Terminé"
                        : "À venir"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {programme.duree === "court_terme"
                      ? "Court terme"
                      : "Long terme"}
                  </TableCell>
                  <TableCell>
                    {format(programme.dateDebut, "PP", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {format(programme.dateFin, "PP", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setProgrammeCourant(programme);
                          setIsEditDialogOpen(true);
                        }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSupprimerProgramme(programme.id)}>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le Programme de Formation</DialogTitle>
            <DialogDescription>
              Mettez à jour les détails du programme de formation.
            </DialogDescription>
          </DialogHeader>
          {programmeCourant && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nom" className="text-right">
                  Nom
                </Label>
                <Input
                  id="edit-nom"
                  value={programmeCourant.nom}
                  onChange={(e) =>
                    setProgrammeCourant({
                      ...programmeCourant,
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
                  value={programmeCourant.etudiantsInscrits}
                  onChange={(e) =>
                    setProgrammeCourant({
                      ...programmeCourant,
                      etudiantsInscrits: parseInt(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-statut" className="text-right">
                  Statut
                </Label>
                <Select
                  value={programmeCourant.statut}
                  onValueChange={(value: ProgrammeFormation["statut"]) =>
                    setProgrammeCourant({ ...programmeCourant, statut: value })
                  }>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                    <SelectItem value="a_venir">À venir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-duree" className="text-right">
                  Durée
                </Label>
                <Select
                  value={programmeCourant.duree}
                  onValueChange={(value: ProgrammeFormation["duree"]) =>
                    setProgrammeCourant({ ...programmeCourant, duree: value })
                  }>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner la durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="court_terme">Court terme</SelectItem>
                    <SelectItem value="long_terme">Long terme</SelectItem>
                  </SelectContent>
                </Select>
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
                        !programmeCourant.dateDebut && "text-muted-foreground"
                      )}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {programmeCourant.dateDebut ? (
                        format(programmeCourant.dateDebut, "PP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={programmeCourant.dateDebut}
                      onSelect={(date) =>
                        date &&
                        setProgrammeCourant({
                          ...programmeCourant,
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
                        !programmeCourant.dateFin && "text-muted-foreground"
                      )}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {programmeCourant.dateFin ? (
                        format(programmeCourant.dateFin, "PP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={programmeCourant.dateFin}
                      onSelect={(date) =>
                        date &&
                        setProgrammeCourant({
                          ...programmeCourant,
                          dateFin: date,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleModifierProgramme}>
              Enregistrer les Modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
