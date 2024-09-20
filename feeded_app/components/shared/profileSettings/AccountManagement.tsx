'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PersonnalInfo } from '../profileSettings/PersonnalInfo'
import { Password } from '../profileSettings/Password'
import { PreferencesNotification } from '../profileSettings/PreferencesNotification'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { AvatarUpload } from '../AvatarUpload'

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
}

// Définition du type pour userDataObj
interface UserDataObj extends Utilisateur {
  parametres: Parametres;
  // Ajoutez ici d'autres propriétés si nécessaire
}

export default function AccountManagement() {
  // Mise à jour du type pour userDataObj et setUserDataObj
  const { currentUser, userDataObj, setUserDataObj } = useAuth() as {
    currentUser: { uid: string; email: string | null };
    userDataObj: UserDataObj;
    setUserDataObj: React.Dispatch<React.SetStateAction<UserDataObj>>;
  }
  
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
      setParametres(userDataObj.parametres)
    }
  }, [currentUser, userDataObj])

  const handleMiseAJourUtilisateur = async (nouveauUtilisateur: Partial<Utilisateur>) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, nouveauUtilisateur)
      setUtilisateur(prevUtilisateur => ({ ...prevUtilisateur, ...nouveauUtilisateur }))
      setUserDataObj(prevUserDataObj => ({ ...prevUserDataObj, ...nouveauUtilisateur }))
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
      // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
    }
  }

  const handleMiseAJourAvatar = async (nouveauUtilisateur: { profilePicture: string }) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, { profilePicture: nouveauUtilisateur.profilePicture })
      setUtilisateur(prev => ({ ...prev, ...nouveauUtilisateur }))
      setUserDataObj(prev => ({ ...prev, ...nouveauUtilisateur }))
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar:", error)
      // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
    }
  }

  const handleBasculementParametre = async (parametre: keyof Parametres) => {
    try {
      const newParametres = { ...parametres, [parametre]: !parametres[parametre] }
      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, { parametres: newParametres })
      setParametres(newParametres)
      setUserDataObj(prev => ({ ...prev, parametres: newParametres }))
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres:", error)
      // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="h-screen flex overflow-hidden">
            <motion.div whileHover={{ scale: 1.03 }}>
      <Card className="h-fit w-fit ml-6 mt-6">
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
      </motion.div>

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <PersonnalInfo 
              utilisateur={utilisateur} 
              onMiseAJour={handleMiseAJourUtilisateur} 
            />
            <Password />
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