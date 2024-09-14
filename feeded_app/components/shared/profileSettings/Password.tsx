import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"

export function Password() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const { currentUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (!currentUser) {
      setError("Utilisateur non connecté")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    try {
      // Réauthentification de l'utilisateur
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        currentPassword
      )
      await reauthenticateWithCredential(currentUser, credential)

      // Changement du mot de passe
      await updatePassword(currentUser, newPassword)

      setSuccess("Mot de passe changé avec succès")
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error("Erreur lors du changement de mot de passe:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Une erreur est survenue lors du changement de mot de passe")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Changer le mot de passe</CardTitle>
          <CardDescription>Assurez-vous que votre compte utilise un mot de passe fort.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mot-de-passe-actuel">Mot de passe actuel</Label>
            <Input 
              id="mot-de-passe-actuel" 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nouveau-mot-de-passe">Nouveau mot de passe</Label>
            <Input 
              id="nouveau-mot-de-passe" 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmer-mot-de-passe">Confirmer le nouveau mot de passe</Label>
            <Input 
              id="confirmer-mot-de-passe" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Changement en cours..." : "Changer le mot de passe"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}