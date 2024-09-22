import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  programId: string;
}

interface TrainingProgram {
  id: string;
  name: string;
  students: number;
  currentStudents: number;
}

interface StudentFormProps {
  student: Student | null;
  programs: TrainingProgram[];
  onSubmit: (student: Student, programId: string) => void;
}

export default function StudentForm({
  student,
  programs,
  onSubmit,
}: StudentFormProps) {
  const [formData, setFormData] = useState<Omit<Student, "id" | "programId">>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      });
      setSelectedProgramId(student.programId);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
      });
      setSelectedProgramId("");
    }
  }, [student]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProgramChange = (value: string) => {
    setSelectedProgramId(value);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgramId) {
      setError("Veuillez choisir une formation.");
      return;
    }

    const selectedProgram = programs.find((p) => p.id === selectedProgramId);
    if (!selectedProgram) {
      setError("La formation sélectionnée n'existe pas.");
      return;
    }

    if (
      selectedProgram.currentStudents >= selectedProgram.students &&
      !student
    ) {
      setError(
        `La formation "${selectedProgram.name}" a atteint son nombre maximum d'étudiants (${selectedProgram.students}).`
      );
      return;
    }

    const studentData: Student = {
      id: student?.id || Date.now().toString(),
      ...formData,
      programId: selectedProgramId,
    };
    onSubmit(studentData, selectedProgramId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom</Label>
        <Input
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom</Label>
        <Input
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="program">Formation</Label>
        <Select
          value={selectedProgramId}
          onValueChange={handleProgramChange}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un programme" />
          </SelectTrigger>
          <SelectContent>
            {programs.map((program) => (
              <SelectItem 
                key={program.id} 
                value={program.id}
                disabled={program.currentStudents >= program.students && !student}
              >
                {program.name} ({program.currentStudents}/{program.students} étudiants)
                {program.currentStudents >= program.students && " - Complet"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
      >
        {student ? "Mettre à jour l'apprenant" : "Ajouter un apprenant"}
      </Button>
    </form>
  );
}