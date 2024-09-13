import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Utilisateur {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  createdAt: string;
}

interface PersonnalInfoProps {
  utilisateur: Utilisateur;
  onMiseAJour: (nouveauUtilisateur: Utilisateur) => void;
}

export function PersonnalInfo({ utilisateur, onMiseAJour }: PersonnalInfoProps) {
  const [formData, setFormData] = useState<Utilisateur>(utilisateur)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onMiseAJour(formData)
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
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={formData.lastName}
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
          {/* Nous ne permettons pas la modification directe de profilePicture et createdAt ici */}
        </CardContent>
        <CardFooter>
          <Button type="submit">Enregistrer les modifications</Button>
        </CardFooter>
      </form>
    </Card>
  )
}