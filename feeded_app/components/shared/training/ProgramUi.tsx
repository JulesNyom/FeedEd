"use client";

import React from "react";
import { motion } from "framer-motion";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  useProgramLogic,
  TrainingProgram,
  StatusFilterType,
} from "./ProgramLogic";

export default function ProgramUI() {
  const {
    filteredPrograms,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    showForm,
    setShowForm,
    editingProgram,
    setEditingProgram,
    handleSubmitProgram,
    handleDeleteProgram,
    programToDelete,
    confirmDeleteProgram,
    cancelDeleteProgram,
  } = useProgramLogic();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto min-h-screen flex flex-col">
      <div className="p-4 sm:p-6 space-y-4 flex flex-col flex-grow">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl sm:text-2xl font-bold mb-4">
          Vos formations
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Rechercher une formation..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 w-fit sm:w-auto">
            <Select
              value={statusFilter}
              onValueChange={(value: StatusFilterType) =>
                setStatusFilter(value)
              }>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="A venir">À venir</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl shadow-lg">
                Ajouter une formation
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex-grow overflow-hidden max-h-[calc(100vh-15rem)] group">
          <div className="h-full overflow-auto invisible-scrollbar group-hover:visible-scrollbar">
            <TrainingProgramList
              programs={filteredPrograms}
              onEdit={setEditingProgram}
              onDelete={handleDeleteProgram}
            />
          </div>
        </motion.div>

        <TrainingProgramForm
          show={showForm || !!editingProgram}
          onClose={() => {
            setShowForm(false);
            setEditingProgram(null);
          }}
          onSubmit={handleSubmitProgram}
          editingProgram={editingProgram}
        />

        <DeleteConfirmationDialog
          isOpen={!!programToDelete}
          onConfirm={confirmDeleteProgram}
          onCancel={cancelDeleteProgram}
        />
      </div>
    </motion.div>
  );
}

interface TrainingProgramListProps {
  programs: TrainingProgram[];
  onEdit: (program: TrainingProgram) => void;
  onDelete: (id: string) => void;
}

function TrainingProgramList({
  programs,
  onEdit,
  onDelete,
}: TrainingProgramListProps) {
  const isLongProgram = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 90;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Étudiants</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="hidden md:table-cell">
                Date de début
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Date de fin
              </TableHead>
              <TableHead className="hidden md:table-cell">Durée</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell className="font-medium">{program.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                    {program.students}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      program.status === "A venir"
                        ? "bg-blue-100 text-blue-800"
                        : program.status === "En cours"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                    {program.status === "A venir"
                      ? "À venir"
                      : program.status === "En cours"
                      ? "En cours"
                      : "Terminé"}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {program.startDate}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {program.endDate}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {isLongProgram(program.startDate, program.endDate)
                    ? "Longue"
                    : "Courte"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(program)}
                        className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(program.id)}
                        className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}

interface TrainingProgramFormProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (program: Omit<TrainingProgram, "id" | "status">) => void;
  editingProgram: TrainingProgram | null;
}

function TrainingProgramForm({
  show,
  onClose,
  onSubmit,
  editingProgram,
}: TrainingProgramFormProps) {
  const [formData, setFormData] = React.useState<
    Omit<TrainingProgram, "id" | "status">
  >({
    name: "",
    students: 0,
    startDate: "",
    endDate: "",
  });

  React.useEffect(() => {
    if (editingProgram) {
      const { name, students, startDate, endDate } = editingProgram;
      setFormData({ name, students, startDate, endDate });
    } else {
      setFormData({
        name: "",
        students: 0,
        startDate: "",
        endDate: "",
      });
    }
  }, [editingProgram]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "students" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingProgram
              ? "Modifier le programme de formation"
              : "Ajouter un nouveau programme de formation"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du programme</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="students">Nombre d&apos;étudiants</Label>
            <Input
              id="students"
              name="students"
              type="number"
              value={formData.students}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Date de fin</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
            {editingProgram
              ? "Mettre à jour le programme"
              : "Ajouter le programme"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Êtes-vous sûr de vouloir supprimer ce programme de formation ?</p>
          <p className="text-sm text-gray-500 mt-2">
            Cette action est irréversible.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}