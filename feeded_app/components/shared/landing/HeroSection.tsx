"use client"

import { useState } from 'react'
import Image from "next/image"
import { Mail, CheckCircle } from "lucide-react"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { db } from '@/firebase' 
import { collection, addDoc } from 'firebase/firestore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function VerticalHero() {
  const [email, setEmail] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Add email to Firestore
      await addDoc(collection(db, "launching"), {
        email: email,
        timestamp: new Date()
      })
      
      setIsDialogOpen(true) // Open the dialog
      setEmail("")
    } catch (error) {
      console.error("Error adding document: ", error)
      toast({
        title: "Une erreur s'est produite",
        description: "Veuillez réessayer plus tard.",
        variant: "destructive"
      })
    }
  }

  return (
    <section className="text-gray-900 min-h-screen flex flex-col justify-between">
      <div className="max-w-6xl mx-auto px-4 py-12 flex-grow flex flex-col justify-center items-center text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            FeedEd arrive bientôt
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Préparez-vous à transformer vos formations avec des retours d&apos;expérience puissants. Sublimez vos formations, un retour à la fois.
          </p>
        </motion.div>

        <motion.div 
          className="relative w-full max-w-2xl aspect-video"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Image
            src="/assets/images/reunion.webp"
            alt="FeedEd App Preview"
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent rounded-lg"></div>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Input
            type="email"
            placeholder="Votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow"
          />
          <Button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-300">
            Être notifié
            <Mail className="ml-2 w-5 h-5" />
          </Button>
        </motion.form>

        <motion.div 
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
        
        </motion.div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Merci pour votre inscription !
            </DialogTitle>
            <DialogDescription>
              Votre adresse e-mail a bien été enregistrée. Nous vous tiendrons informé du lancement de FeedEd.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setIsDialogOpen(false)}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}