'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Lock, User } from 'lucide-react'

export default function GestionCompte() {
  const [utilisateur, setUtilisateur] = useState({
    nom: 'Alice Dupont',
    email: 'alice@exemple.com',
    avatar: 'https://github.com/shadcn.png',
  })

  const [parametres, setParametres] = useState({
    notificationsEmail: true,
    emailsMarketing: false,
    authentificationDeuxFacteurs: true,
  })

  const handleMiseAJourUtilisateur = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Implémentez ici la logique de mise à jour de l'utilisateur
    console.log('Utilisateur mis à jour:', utilisateur)
  }

  const handleChangementMotDePasse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Implémentez ici la logique de changement de mot de passe
    console.log('Demande de changement de mot de passe')
  }

  const handleBasculementParametre = (parametre: keyof typeof parametres) => {
    setParametres(prev => ({ ...prev, [parametre]: !prev[parametre] }))
  }

  return (
    <div className="container sm:px-6 mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Gestion du Compte</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={utilisateur.avatar} alt={utilisateur.nom} />
                <AvatarFallback>{utilisateur.nom.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{utilisateur.nom}</h2>
              <p className="text-sm text-muted-foreground">{utilisateur.email}</p>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1">
          <Tabs defaultValue="personnel" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personnel">
                <User className="h-4 w-4 mr-2" />
                Infos Personnelles
              </TabsTrigger>
              <TabsTrigger value="securite">
                <Lock className="h-4 w-4 mr-2" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Bell className="h-4 w-4 mr-2" />
                Préférences
              </TabsTrigger>
            </TabsList>
            <TabsContent value="personnel">
              <Card>
                <form onSubmit={handleMiseAJourUtilisateur}>
                  <CardHeader>
                    <CardTitle>Informations Personnelles</CardTitle>
                    <CardDescription>Mettez à jour vos informations personnelles ici.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom Complet</Label>
                      <Input
                        id="nom"
                        value={utilisateur.nom}
                        onChange={(e) => setUtilisateur({ ...utilisateur, nom: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={utilisateur.email}
                        onChange={(e) => setUtilisateur({ ...utilisateur, email: e.target.value })}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Enregistrer les Modifications</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="securite">
              <Card>
                <form onSubmit={handleChangementMotDePasse}>
                  <CardHeader>
                    <CardTitle>Changer le Mot de Passe</CardTitle>
                    <CardDescription>Assurez-vous que votre compte utilise un mot de passe fort.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mot-de-passe-actuel">Mot de Passe Actuel</Label>
                      <Input id="mot-de-passe-actuel" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nouveau-mot-de-passe">Nouveau Mot de Passe</Label>
                      <Input id="nouveau-mot-de-passe" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmer-mot-de-passe">Confirmer le Nouveau Mot de Passe</Label>
                      <Input id="confirmer-mot-de-passe" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Changer le Mot de Passe</Button>
                  </CardFooter>
                </form>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Authentification à Deux Facteurs</CardTitle>
                  <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="deux-facteurs">Authentification à deux facteurs</Label>
                      <p className="text-sm text-muted-foreground">
                        Sécurisez votre compte avec l'authentification à deux facteurs.
                      </p>
                    </div>
                    <Switch
                      id="deux-facteurs"
                      checked={parametres.authentificationDeuxFacteurs}
                      onCheckedChange={() => handleBasculementParametre('authentificationDeuxFacteurs')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de Notification</CardTitle>
                  <CardDescription>Gérez vos paramètres de notification.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications-email">Notifications par Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des notifications sur l'activité de votre compte par email.
                      </p>
                    </div>
                    <Switch
                      id="notifications-email"
                      checked={parametres.notificationsEmail}
                      onCheckedChange={() => handleBasculementParametre('notificationsEmail')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emails-marketing">Emails Marketing</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des emails sur les nouvelles fonctionnalités, promotions et mises à jour.
                      </p>
                    </div>
                    <Switch
                      id="emails-marketing"
                      checked={parametres.emailsMarketing}
                      onCheckedChange={() => handleBasculementParametre('emailsMarketing')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}