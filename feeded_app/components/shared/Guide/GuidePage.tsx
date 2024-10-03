'use client'

import React, { useEffect, useState, useRef, ReactNode } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, Users, Mail, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion, useAnimation, useInView } from "framer-motion"

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { 
    once: true,
    amount: 0.1
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.section
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export default function UserGuide() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <motion.main
        className="container mx-auto px-4 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-12">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-center mb-6 text-foreground"
            variants={itemVariants}
          >
            Guide d&lsquo;utilisation
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground"
            variants={itemVariants}
          >
            Votre solution intuitive pour collecter et gérer les retours d&lsquo;expérience de vos formations. 
            Simplifiez votre processus de feedback et améliorez la qualité de vos formations.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection className="mb-16">
          <motion.h3
            className="text-2xl font-semibold text-foreground mb-8 text-center"
            variants={itemVariants}
          >
            Comment ça marche
          </motion.h3>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              {
                icon: <BookOpen className="h-12 w-12 text-primary mb-4" />,
                title: "Créer une formation",
                description: "Configurez facilement votre nouvelle formation avec tous les détails nécessaires.",
                points: ["Titre et description", "Dates et durée", "Objectifs d'apprentissage"]
              },
              {
                icon: <Users className="h-12 w-12 text-primary mb-4" />,
                title: "Ajouter des apprenants",
                description: "Gérez votre liste d'apprenants en quelques clics.",
                points: ["Importation en masse", "Ajout manuel", "Gestion des groupes"]
              },
              {
                icon: <Mail className="h-12 w-12 text-primary mb-4" />,
                title: "Envoi automatique des emails",
                description: "Laissez-nous nous occuper de l'envoi des demandes de feedback.",
                points: ["Personnalisation des emails", "Planification des envois", "Suivi des réponses"]
              }
            ].map((step, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + index * 0.2, type: "spring", stiffness: 260, damping: 20 }}
                    >
                      {step.icon}
                    </motion.div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">{index + 1}. {step.title}</h4>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <ul className="text-left text-muted-foreground">
                      {step.points.map((point, i) => (
                        <motion.li
                          key={i}
                          className="flex items-center mb-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + index * 0.2 + i * 0.1 }}
                        >
                          <ChevronRight className="h-4 w-4 text-primary mr-2" />
                          {point}
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="max-w-2xl mx-auto mb-16">
          <motion.h3 
            className="text-2xl font-semibold text-foreground mb-8 text-center"
            variants={itemVariants}
          >
            Foire Aux Questions
          </motion.h3>
          {isClient && (
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "Combien de formations puis-je créer ?",
                  answer: "Vous pouvez créer un nombre illimité de formations. Notre plateforme est conçue pour s'adapter à vos besoins, que vous ayez une seule formation ou des centaines."
                },
                {
                  question: "Les apprenants peuvent-ils répondre de manière anonyme ?",
                  answer: "Oui, nous offrons l'option de collecter des retours anonymes. Vous pouvez configurer chaque formation pour permettre des réponses anonymes, encourageant ainsi des feedbacks plus honnêtes et détaillés."
                },
                {
                  question: "Puis-je personnaliser les questions de feedback ?",
                  answer: "Absolument ! Vous pouvez créer des questionnaires sur mesure pour chaque formation. Vous pouvez ajouter des questions à choix multiples, des échelles de notation, et des champs de texte libre pour obtenir exactement les informations dont vous avez besoin."
                },
                {
                  question: "Comment puis-je analyser les résultats ?",
                  answer: "Nous proposons des outils d'analyse intégrés qui vous permettent de visualiser les tendances, de comparer les résultats entre les formations, et d&lsquo;exporter des rapports détaillés. Vous pouvez facilement identifier les points forts et les axes d'amélioration de vos formations."
                }
              ].map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-foreground hover:text-primary">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 * index }}
                    >
                      {item.question}
                    </motion.div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </AnimatedSection>
      </motion.main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <motion.p 
            className="mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            &copy; 2024 Tous droits réservés.
          </motion.p>
          <motion.div 
            className="space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/mentions-legales" className="hover:text-primary transition-colors duration-300">Mentions légales</Link>
            <Link href="/politique-de-confidentialite" className="hover:text-primary transition-colors duration-300">Politique de confidentialité</Link>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}