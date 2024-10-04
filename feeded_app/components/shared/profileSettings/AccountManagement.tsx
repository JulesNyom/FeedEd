'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { PersonnalInfo } from '../profileSettings/PersonnalInfo'
import { Password } from '../profileSettings/Password'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { AvatarUpload } from '../AvatarUpload'
import { Loader2 } from 'lucide-react'

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
  const [isPhotoLoading, setIsPhotoLoading] = useState(true)

  useEffect(() => {
    if (currentUser && userDataObj) {
      setIsPhotoLoading(true)
      setUtilisateur({
        displayName: userDataObj.displayName || '',
        email: userDataObj.email || currentUser.email || '',
        photoURL: userDataObj.photoURL || '',
        createdAt: userDataObj.createdAt || '',
      })
      setIsPhotoLoading(false)
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
      setIsPhotoLoading(true)
      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, { photoURL: nouveauUtilisateur.photoURL })
      setUtilisateur(prev => ({ ...prev, ...nouveauUtilisateur }))
      setUserDataObj(prev => ({ ...prev, ...nouveauUtilisateur }))
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar:", error)
    } finally {
      setIsPhotoLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden p-4 lg:p-6 gap-6">
      <Card className="h-fit w-full lg:w-1/3 xl:w-1/4">
        <motion.div whileHover={{ scale: 1.03 }}>
          <CardContent className="p-6 flex flex-col items-center">
            {isPhotoLoading ? (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <AvatarUpload
                utilisateur={utilisateur}
                onMiseAJour={handleMiseAJourAvatar}
              />
            )}
            <div className='space-y-1 flex flex-col items-center mt-4 text-center'>
              <h2 className="text-xl font-semibold">{utilisateur.displayName}</h2>
              <p className="text-sm text-muted-foreground">{utilisateur.email}</p>
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