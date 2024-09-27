'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PersonnalInfo } from '../profileSettings/PersonnalInfo'
import { Password } from '../profileSettings/Password'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { AvatarUpload } from '../AvatarUpload'

interface Utilisateur {
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: string;
}

interface Parametres {
  notificationsEmail: boolean;
  emailsMarketing: boolean;
}

interface UserDataObj extends Utilisateur {
  parametres: Parametres;
}

export default function AccountManagement() {
  const { currentUser, userDataObj, setUserDataObj } = useAuth() as {
    currentUser: { uid: string; email: string | null };
    userDataObj: UserDataObj;
    setUserDataObj: React.Dispatch<React.SetStateAction<UserDataObj>>;
  }
  
  const [utilisateur, setUtilisateur] = useState<Utilisateur>({
    displayName: '',
    email: '',
    photoURL: '',
    createdAt: '',
  })

  const [parametres, setParametres] = useState<Parametres>({
    notificationsEmail: true,
    emailsMarketing: false,
  })

  useEffect(() => {
    if (currentUser && userDataObj) {
      setUtilisateur({
        displayName: userDataObj.displayName || '',
        email: userDataObj.email || currentUser.email || '',
        photoURL: userDataObj.photoURL || '',
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
    }
  }

  const handleMiseAJourAvatar = async (nouveauUtilisateur: { photoURL: string }) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, { photoURL: nouveauUtilisateur.photoURL })
      setUtilisateur(prev => ({ ...prev, ...nouveauUtilisateur }))
      setUserDataObj(prev => ({ ...prev, ...nouveauUtilisateur }))
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar:", error)
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
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden p-4 lg:p-6 gap-6">
      <Card className="h-fit w-full lg:w-1/3 xl:w-1/4">
        <motion.div whileHover={{ scale: 1.03 }}>
          <CardContent className="p-6 flex flex-col items-center">
            <AvatarUpload 
              utilisateur={utilisateur} 
              onMiseAJour={handleMiseAJourAvatar} 
            />
            <div className='space-y-1 flex flex-col items-center mt-4 text-center'>
              <h2 className="text-xl font-semibold">{utilisateur.displayName}</h2>
              <p className="text-sm text-muted-foreground">{utilisateur.email}</p>
              <p className="text-sm text-muted-foreground">Membre depuis le {formatDate(utilisateur.createdAt)}</p>
            </div>
          </CardContent>
        </motion.div>
      </Card>

      <main className="flex-1 overflow-hidden">
          <div className="space-y-6">
            <PersonnalInfo 
              utilisateur={utilisateur} 
              onMiseAJour={handleMiseAJourUtilisateur} 
            />
            <Password />
          </div>
      </main>
    </div>
  )
}