"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function StorySection() {
  const [details, setDetails] = useState(false)

  const timelineItems = [
    {
      id: 1,
      title: "Idée",
      description: "Faciliter les feedbacks post-formation",
      icon: <ChevronLeft className="w-6 h-6" />,
      image: "/assets/images/idea.svg",
    },
    {
      id: 2,
      title: "Mission",
      description: "Améliorer la qualité des formations",
      icon: <ChevronRight className="w-6 h-6" />,
      image: "/assets/images/mission.svg",
    },
    {
      id: 3,
      title: "Innovation",
      description: "Simplifier la validation Qualiopi",
      icon: <ChevronLeft className="w-6 h-6" />,
      image: "/assets/images/qualiopi.svg",
    },
    {
      id: 4,
      title: "Impact",
      description: "Transformer l'expérience formation",
      icon: <ChevronRight className="w-6 h-6" />,
      image: "/assets/images/impact.svg",
    },
  ]

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary">
          L'histoire de FeedEd : Révolutionner le feedback en formation
        </h2>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="relative w-full aspect-[2/1] max-w-md mx-auto">
              <Image
                src="/assets/images/feedback-loop.svg"
                alt="Feedback loop"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-lg text-center lg:text-left text-muted-foreground">
              Notre histoire commence en 2020, lorsque nous avons découvert que
              les retours post-formation étaient un élément clé pour améliorer la
              qualité des formations. Nous avons alors décidé de créer une
              plateforme qui faciliterait ce processus.
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {timelineItems.map((item) => (
                <li key={item.id} className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: details ? 1 : 0.8, opacity: details ? 1 : 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={80}
                      height={80}
                    />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <Button
            variant="outline"
            className="px-6 py-2"
            onClick={() => setDetails(!details)}
          >
            {details ? "Vue d'ensemble" : "Vue détaillée"}
          </Button>
        </div>
        <AnimatePresence>
          {details && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-12 space-y-6"
            >
              <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
                Notre mission est de faciliter la collecte de retours post-formation
                pour améliorer la qualité des formations. Nous nous engageons à
                vous fournir des outils pour recueillir, analyser et partager ces
                retours de manière simple et efficace.
              </p>
              <div className="text-center">
                <Link href="/contact" passHref>
                  <Button variant="default" size="lg">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}