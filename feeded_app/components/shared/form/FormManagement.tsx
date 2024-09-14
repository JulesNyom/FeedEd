"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  MoreHorizontal,
  Edit,
  Copy,
  Trash,
  Eye,
} from "lucide-react";

type Form = {
  id: string;
  name: string;
  createdAt: string;
  responses: number;
  status: "Actif" | "Inactif" | "Brouillon";
};

const initialForms: Form[] = [
  {
    id: "1",
    name: "Retour client",
    createdAt: "2023-05-15",
    responses: 150,
    status: "Actif",
  },
  {
    id: "2",
    name: "Enquête employé",
    createdAt: "2023-06-01",
    responses: 75,
    status: "Actif",
  },
  {
    id: "3",
    name: "Formulaire de commande",
    createdAt: "2023-06-10",
    responses: 320,
    status: "Actif",
  },
  {
    id: "4",
    name: "Inscription à l'événement",
    createdAt: "2023-06-15",
    responses: 0,
    status: "Brouillon",
  },
  {
    id: "5",
    name: "Retour sur le site web",
    createdAt: "2023-06-20",
    responses: 45,
    status: "Actif",
  },
  {
    id: "6",
    name: "Candidature d'emploi",
    createdAt: "2023-06-25",
    responses: 12,
    status: "Inactif",
  },
];

export default function FormManagement() {
  const [forms, setForms] = useState<Form[]>(initialForms);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Form["status"] | "Tous">(
    "Tous"
  );
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [newFormName, setNewFormName] = useState("");

  const filteredForms = forms.filter(
    (form) =>
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "Tous" || form.status === statusFilter)
  );

  const handleCreateForm = () => {
    const newForm: Form = {
      id: (forms.length + 1).toString(),
      name: newFormName,
      createdAt: new Date().toISOString().split("T")[0],
      responses: 0,
      status: "Brouillon",
    };
    setForms([...forms, newForm]);
    setIsCreateFormOpen(false);
    setNewFormName("");
  };

  const handleDeleteForm = (id: string) => {
    setForms(forms.filter((form) => form.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: Form["status"]) => {
    setForms(
      forms.map((form) =>
        form.id === id ? { ...form, status: newStatus } : form
      )
    );
  };

  return (
    <div className="container sm:px-6 mx-auto py-10">
      <h1 className="text-3xl font-bold text-foreground mb-8">Gestion des formulaires</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Rechercher des formulaires..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as Form["status"] | "Tous")
            }>
            <SelectTrigger className="w-36 text-muted-foreground">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous les statuts</SelectItem>
              <SelectItem value="Actif">Actif</SelectItem>
              <SelectItem value="Inactif">Inactif</SelectItem>
              <SelectItem value="Brouillon">Brouillon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer un nouveau formulaire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau formulaire</DialogTitle>
              <DialogDescription>
                Donnez un nom à votre nouveau formulaire pour commencer.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateForm}>Créer le formulaire</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-background shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px] font-semibold">Nom du formulaire</TableHead>
              <TableHead className="font-semibold">Créé le</TableHead>
              <TableHead className="font-semibold">Réponses</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredForms.map((form) => (
              <TableRow key={form.id}>
                <TableCell className="text-sm text-foreground">{form.name}</TableCell>
                <TableCell className="text-foreground">{form.createdAt}</TableCell>
                <TableCell className="text-foreground">{form.responses}</TableCell>
                <TableCell className="text-foreground">
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      handleStatusChange(form.id, value as Form["status"])
                    }>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actif">Actif</SelectItem>
                      <SelectItem value="Inactif">Inactif</SelectItem>
                      <SelectItem value="Brouillon">Brouillon</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="bg-background h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="text-foreground h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Voir</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Modifier</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Dupliquer</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteForm(form.id)}
                        className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
