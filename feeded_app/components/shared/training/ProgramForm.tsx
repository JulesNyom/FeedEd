import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TrainingProgram {
  id: string;
  name: string;
  students: number;
  status: "A venir" | "En cours" | "Terminé";
  startDate: string;
  endDate: string;
}

interface TrainingProgramFormProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (program: Omit<TrainingProgram, "id" | "status">) => void;
  editingProgram: TrainingProgram | null;
}

export function TrainingProgramForm({
  show,
  onClose,
  onSubmit,
  editingProgram,
}: TrainingProgramFormProps) {
  const [formData, setFormData] = useState<Omit<TrainingProgram, "id" | "status">>({
    name: "",
    students: 0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
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
            className="w-full bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          >
            {editingProgram
              ? "Mettre à jour le programme"
              : "Ajouter le programme"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}