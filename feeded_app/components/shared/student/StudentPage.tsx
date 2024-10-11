"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  FileSpreadsheet,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useStudentManagement } from "./StudentLogic";

export default function StudentManagementUI() {
  const {
    students,
    filteredStudents,
    programs,
    error,
    searchTerm,
    setSearchTerm,
    handleSubmit,
    handleDelete,
    handleEdit,
    updateTrigger,
    showForm,
    setShowForm,
    editingStudent,
    currentPage,
    setCurrentPage,
    studentsPerPage,
  } = useStudentManagement();

  const { currentStudents, totalPages } = useMemo(() => {
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(
      indexOfFirstStudent,
      indexOfLastStudent
    );
    return {
      currentStudents,
      totalPages: Math.ceil(filteredStudents.length / studentsPerPage),
    };
  }, [filteredStudents, currentPage, studentsPerPage]);

  const getFormStatusIcon = (
    status: "sent" | "responded" | "reminded" | "none"
  ) => {
    switch (status) {
      case "sent":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "responded":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "reminded":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "none":
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getFormStatusText = (
    status: "sent" | "responded" | "reminded" | "none"
  ) => {
    switch (status) {
      case "sent":
        return "Envoyé";
      case "responded":
        return "Répondu";
      case "reminded":
        return "Rappelé";
      case "none":
        return "Non envoyé";
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderFormStatus = (status: "hot" | "cold", student: Student) => {
    const formStatus =
      status === "hot" ? student.formStatusHot : student.formStatusCold;
    const emailSent =
      status === "hot" ? student.hotEmailSent : student.coldEmailSent;
    const emailSentDate =
      status === "hot" ? student.hotEmailSentDate : student.coldEmailSentDate;

    return (
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          {getFormStatusIcon(formStatus)}
          <span>{getFormStatusText(formStatus)}</span>
        </div>
        {emailSent && (
          <span className="text-xs text-gray-500">
            Envoyé le: {formatDate(emailSentDate)}
          </span>
        )}
      </div>
    );
  };

  return (
    <motion.div
      key={updateTrigger}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 sm:p-6 space-y-4">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl sm:text-2xl font-bold mb-4">
        Vos apprenants
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
            placeholder="Rechercher un étudiant..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl shadow-lg">
            <Plus className="mr-2 h-5 w-5" /> Ajouter un apprenant
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl shadow-lg">
            <FileSpreadsheet className="mr-2 h-5 w-5" /> Exporter le tableau
          </Button>
        </motion.div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-red-500">
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Prénom</TableHead>
              <TableHead className="font-semibold">Nom</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Formation</TableHead>
              <TableHead className="font-semibold">
                Formulaire à chaud
              </TableHead>
              <TableHead className="font-semibold">
                Formulaire à froid
              </TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {programs.find((p) => p.id === student.programId)?.name ||
                    "N/A"}
                </TableCell>
                <TableCell>{renderFormStatus("hot", student)}</TableCell>
                <TableCell>{renderFormStatus("cold", student)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(student)}
                        className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier l'étudiant</span>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Êtes-vous sûr de vouloir supprimer ${student.firstName} ${student.lastName} ?`
                            )
                          ) {
                            handleDelete(student.id, student.programId);
                          }
                        }}
                        className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer l'étudiant</span>
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center items-center mt-4 space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              } mb-2 sm:mb-0`}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Précédente</span>
              <span className="sm:hidden">Préc</span>
            </Button>
          </motion.div>
          <div className="flex flex-wrap justify-center space-x-2 mb-2 sm:mb-0">
            {[...Array(totalPages)].map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Button
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                  className="w-8 h-8 mb-2 sm:mb-0">
                  {i + 1}
                </Button>
              </motion.div>
            ))}
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } mb-2 sm:mb-0`}>
              <span className="hidden sm:inline">Suivante</span>
              <span className="sm:hidden">Suiv</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStudent
                ? "Modifier l'étudiant"
                : "Ajouter un nouvel étudiant"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const studentData = {
                id: editingStudent?.id || "",
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                email: formData.get("email") as string,
                programId: formData.get("programId") as string,
                hotEmailSent: formData.get("hotEmailSent") === "on",
                coldEmailSent: formData.get("coldEmailSent") === "on",
                formStatusHot: formData.get("formStatusHot") as
                  | "sent"
                  | "responded"
                  | "reminded"
                  | "none",
                formStatusCold: formData.get("formStatusCold") as
                  | "sent"
                  | "responded"
                  | "reminded"
                  | "none",
              };
              handleSubmit(studentData, studentData.programId);
            }}
            className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={editingStudent?.firstName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={editingStudent?.lastName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={editingStudent?.email}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Formation</Label>
              <Select
                name="programId"
                defaultValue={editingStudent?.programId}
                required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un programme" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name} ({program.currentStudents}/
                      {program.students} étudiants)
                      {program.currentStudents >= program.students &&
                        " - Complet"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Formulaire à chaud</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hotEmailSent"
                  name="hotEmailSent"
                  defaultChecked={editingStudent?.hotEmailSent}
                />
                <Label htmlFor="hotEmailSent">Email envoyé</Label>
              </div>
              <Select
                name="formStatusHot"
                defaultValue={editingStudent?.formStatusHot || "none"}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non envoyé</SelectItem>
                  <SelectItem value="sent">Envoyé</SelectItem>
                  <SelectItem value="responded">Répondu</SelectItem>
                  <SelectItem value="reminded">Rappelé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Formulaire à froid</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="coldEmailSent"
                  name="coldEmailSent"
                  defaultChecked={editingStudent?.coldEmailSent}
                />
                <Label htmlFor="coldEmailSent">Email envoyé</Label>
              </div>
              <Select
                name="formStatusCold"
                defaultValue={editingStudent?.formStatusCold || "none"}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non envoyé</SelectItem>
                  <SelectItem value="sent">Envoyé</SelectItem>
                  <SelectItem value="responded">Répondu</SelectItem>
                  <SelectItem value="reminded">Rappelé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700">
              {editingStudent
                ? "Mettre à jour l'apprenant"
                : "Ajouter un apprenant"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
