import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function Password ({ onChangement }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onChangement()
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
            <Input id="mot-de-passe-actuel" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nouveau-mot-de-passe">Nouveau mot de passe</Label>
            <Input id="nouveau-mot-de-passe" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmer-mot-de-passe">Confirmer le nouveau mot de passe</Label>
            <Input id="confirmer-mot-de-passe" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Changer le mot de passe</Button>
        </CardFooter>
      </form>
    </Card>
  )
}