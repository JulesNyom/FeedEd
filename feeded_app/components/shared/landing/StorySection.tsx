'use client'

import { useState } from 'react'
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
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

export default function StorySection() {
  const [email, setEmail] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "launching"), {
        email: email,
        timestamp: new Date()
      })
      
      setIsDialogOpen(true)
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

  const timelineItems = [
    {
      id: 1,
      title: "Simplifier les retours",
      description: "Faciliter la collecte et l'analyse des feedbacks post-formation",
      image: "/assets/images/simple.jpeg",
    },
    {
      id: 2,
      title: "Améliorer la qualité",
      description: "Permettre une amélioration continue des formations grâce aux retours précis",
      image: "/assets/images/objectif.webp",
    },
    {
      id: 3,
      title: "Transformer l'expérience",
      description: "Optimiser l'expérience de formation pour tous les acteurs",
      image: "/assets/images/impact.webp",
    },
  ]

  return (
    <section className="relative bg-background py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
        >
          Pourquoi FeedEd ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-center text-gray-600 leading-relaxed mb-20 max-w-3xl mx-auto"
        >
          FeedEd a été créé pour répondre à un besoin crucial dans le domaine de la formation : 
          faciliter et optimiser le processus de retour d&apos;expérience post-formation. 
          Notre objectif est de transformer ces retours en un outil puissant d&apos;amélioration continue.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {timelineItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">{item.title}</h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-xl p-10 max-w-3xl mx-auto"
        >
          <h3 className="text-3xl font-bold mb-6 text-white">Soyez les premiers informés !</h3>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Recevez une notification dès que FeedEd sera prêt à révolutionner vos formations.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow bg-white text-gray-800 placeholder-gray-500"
            />
            <Button type="submit" className="bg-white text-purple-600 hover:bg-gray-100 transition-all duration-300">
              Être notifié
              <Mail className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </motion.div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
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