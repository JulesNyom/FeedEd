import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { doc, updateDoc } from "firebase/firestore"
import { db } from '@/firebase'  // Assurez-vous que ce chemin est correct

interface Utilisateur {
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: string;
}

interface PersonnalInfoProps {
  utilisateur: Utilisateur;
  onMiseAJour: (nouveauUtilisateur: Utilisateur) => void;
}

export function PersonnalInfo({ utilisateur, onMiseAJour }: PersonnalInfoProps) {
  const [formData, setFormData] = useState<Utilisateur>(utilisateur)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { currentUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!currentUser) {
      setError("Utilisateur non connecté")
      setIsLoading(false)
      return
    }

    try {
      const userDocRef = doc(db, "users", currentUser.uid)
      await updateDoc(userDocRef, {
        displayName: formData.displayName,
        email: formData.email
      })

      onMiseAJour(formData)
      setError("Informations mises à jour avec succès")
    } catch (err) {
      console.error("Erreur lors de la mise à jour des informations:", err)
      setError("Erreur lors de la mise à jour des informations")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }))
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Mettez à jour vos informations personnelles ici.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={formData.displayName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          {error && <p className={error.includes("succès") ? "text-green-500" : "text-red-500"}>{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}