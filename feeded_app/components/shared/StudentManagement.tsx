'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Pencil, Trash2, AlertCircle } from 'lucide-react'

interface Etudiant {
  id: string
  prenom: string
  nom: string
  email: string
  enFormation: boolean
}

interface Notification {
  type: 'success' | 'error'
  message: string
}

export default function StudentManagement () {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([
    { id: '1', prenom: 'Jean', nom: 'Dupont', email: 'jean@exemple.com', enFormation: true },
    { id: '2', prenom: 'Marie', nom: 'Martin', email: 'marie@exemple.com', enFormation: false },
  ])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentEtudiant, setCurrentEtudiant] = useState<Etudiant | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)

  const [newEtudiant, setNewEtudiant] = useState<Omit<Etudiant, 'id'>>({
    prenom: '',
    nom: '',
    email: '',
    enFormation: false,
  })

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleAddEtudiant = () => {
    if (!newEtudiant.prenom || !newEtudiant.nom || !newEtudiant.email) {
      showNotification('error', 'Veuillez remplir tous les champs.')
      return
    }
    const id = Date.now().toString()
    setEtudiants([...etudiants, { ...newEtudiant, id }])
    setNewEtudiant({ prenom: '', nom: '', email: '', enFormation: false })
    setIsAddDialogOpen(false)
    showNotification('success', `${newEtudiant.prenom} ${newEtudiant.nom} a été ajouté avec succès.`)
  }

  const handleEditEtudiant = () => {
    if (currentEtudiant) {
      if (!currentEtudiant.prenom || !currentEtudiant.nom || !currentEtudiant.email) {
        showNotification('error', 'Veuillez remplir tous les champs.')
        return
      }
      setEtudiants(etudiants.map(etudiant => 
        etudiant.id === currentEtudiant.id ? currentEtudiant : etudiant
      ))
      setIsEditDialogOpen(false)
      showNotification('success', `Les informations de ${currentEtudiant.prenom} ${currentEtudiant.nom} ont été mises à jour.`)
    }
  }

  const handleDeleteEtudiant = (id: string) => {
    setEtudiants(etudiants.filter(etudiant => etudiant.id !== id))
    showNotification('success', "L'étudiant a été supprimé du système.")
  }

  const handleToggleFormation = (id: string) => {
    setEtudiants(etudiants.map(etudiant => 
      etudiant.id === id ? { ...etudiant, enFormation: !etudiant.enFormation } : etudiant
    ))
  }

  return (
    <div className="container mx-auto sm:px-6 py-10">
      <h1 className="text-3xl text-foreground font-bold mb-8">Gestion des Apprenants</h1>

      {notification && (
        <Alert variant={notification.type === 'error' ? "destructive" : "default"} className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{notification.type === 'error' ? 'Erreur' : 'Succès'}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="mb-1">Ajouter un nouvel apprenant</CardTitle>
          <CardDescription>Entrez les détails du nouvel étudiant.</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className='bg-primary border text-background'>Ajouter un Étudiant</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un Nouvel Étudiant</DialogTitle>
                <DialogDescription>Remplissez les informations de l'étudiant ci-dessous.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prenom" className="text-right">Prénom</Label>
                  <Input
                    id="prenom"
                    value={newEtudiant.prenom}
                    onChange={(e) => setNewEtudiant({ ...newEtudiant, prenom: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nom" className="text-right">Nom</Label>
                  <Input
                    id="nom"
                    value={newEtudiant.nom}
                    onChange={(e) => setNewEtudiant({ ...newEtudiant, nom: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEtudiant.email}
                    onChange={(e) => setNewEtudiant({ ...newEtudiant, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="enFormation" className="text-right text-foreground">En Formation</Label>
                  <Switch
                    id="enFormation"
                    checked={newEtudiant.enFormation}
                    onCheckedChange={(checked) => setNewEtudiant({ ...newEtudiant, enFormation: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddEtudiant}>Ajouter l'Étudiant</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Étudiants</CardTitle>
          <CardDescription>Gérez et visualisez tous les étudiants.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prénom</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Statut de Formation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {etudiants.map((etudiant) => (
                <TableRow key={etudiant.id}>
                  <TableCell>{etudiant.prenom}</TableCell>
                  <TableCell>{etudiant.nom}</TableCell>
                  <TableCell>{etudiant.email}</TableCell>
                  <TableCell>
                    <Switch
                      checked={etudiant.enFormation}
                      onCheckedChange={() => handleToggleFormation(etudiant.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentEtudiant(etudiant)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteEtudiant(etudiant.id)}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'Étudiant</DialogTitle>
            <DialogDescription>Mettez à jour les informations de l'étudiant ci-dessous.</DialogDescription>
          </DialogHeader>
          {currentEtudiant && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-prenom" className="text-right">Prénom</Label>
                <Input
                  id="edit-prenom"
                  value={currentEtudiant.prenom}
                  onChange={(e) => setCurrentEtudiant({ ...currentEtudiant, prenom: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nom" className="text-right">Nom</Label>
                <Input
                  id="edit-nom"
                  value={currentEtudiant.nom}
                  onChange={(e) => setCurrentEtudiant({ ...currentEtudiant, nom: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentEtudiant.email}
                  onChange={(e) => setCurrentEtudiant({ ...currentEtudiant, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-enFormation" className="text-right">En Formation</Label>
                <Switch
                  id="edit-enFormation"
                  checked={currentEtudiant.enFormation}
                  onCheckedChange={(checked) => setCurrentEtudiant({ ...currentEtudiant, enFormation: checked })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleEditEtudiant}>Enregistrer les Modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}