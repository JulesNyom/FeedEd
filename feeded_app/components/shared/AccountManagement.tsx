'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PersonnalInfo } from './PersonnalInfo'
import { Password } from './Password'
import { PreferencesNotification } from './PreferencesNotification'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { AvatarUpload } from './AvatarUpload';  // Assurez-vous que le chemin est correct


interface Utilisateur {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  createdAt: string;
}

interface Parametres {
  notificationsEmail: boolean;
  emailsMarketing: boolean;
  authentificationDeuxFacteurs: boolean;
}

export default function AccountManagement() {
  const { currentUser, userDataObj, setUserDataObj } = useAuth()
  
  const [utilisateur, setUtilisateur] = useState<Utilisateur>({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '',
    createdAt: '',
  })

  const [parametres, setParametres] = useState<Parametres>({
    notificationsEmail: true,
    emailsMarketing: false,
    authentificationDeuxFacteurs: true,
  })

  useEffect(() => {
    if (currentUser && userDataObj) {
      setUtilisateur({
        firstName: userDataObj.firstName || '',
        lastName: userDataObj.lastName || '',
        email: userDataObj.email || currentUser.email || '',
        profilePicture: userDataObj.profilePicture || '',
        createdAt: userDataObj.createdAt || '',
      })
    }
  }, [currentUser, userDataObj])

  const handleMiseAJourUtilisateur = (nouveauUtilisateur: Utilisateur) => {
    setUtilisateur(nouveauUtilisateur)
    // Mettre à jour les informations dans Firebase
    const userRef = doc(db, 'users', currentUser.uid)
    updateDoc(userRef, nouveauUtilisateur)
    setUserDataObj({ ...userDataObj, ...nouveauUtilisateur })
  }

  const handleChangementMotDePasse = () => {
    console.log('Demande de changement de mot de passe')
    // Implémentez ici la logique de changement de mot de passe avec Firebase
  }

  const handleBasculementParametre = (parametre: keyof Parametres) => {
    setParametres(prev => ({ ...prev, [parametre]: !prev[parametre] }))
    // Mettre à jour les paramètres dans Firebase
  }

  const handleMiseAJourAvatar = (nouveauUtilisateur: { profilePicture: string }) => {
    setUtilisateur(prev => ({ ...prev, ...nouveauUtilisateur }));
    // Ici, vous pourriez également vouloir mettre à jour d'autres parties de votre application
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="h-screen flex overflow-hidden">
       <Card className="h-fit ml-6 mt-6">
        <CardContent className="mt-8 flex flex-col items-center">
          <AvatarUpload 
            utilisateur={utilisateur} 
            onMiseAJour={handleMiseAJourAvatar} 
          />
          <div className='space-y-1 flex flex-col items-center'>
          <h2 className="text-xl font-semibold mt-4">{utilisateur.firstName} {utilisateur.lastName}</h2>
          <p className="text-sm text-muted-foreground">{utilisateur.email}</p>
          <p className="text-sm text-muted-foreground">Membre depuis le {formatDate(utilisateur.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <PersonnalInfo 
              utilisateur={utilisateur} 
              onMiseAJour={handleMiseAJourUtilisateur} 
            />
            <Password onChangement={handleChangementMotDePasse} />
            <PreferencesNotification 
              parametres={parametres}
              onToggle={handleBasculementParametre}
            />
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}