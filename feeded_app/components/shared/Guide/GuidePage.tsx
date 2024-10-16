"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, Users, Mail, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Créez votre formation",
    description:
      "Commencez par configurer votre nouvelle formation. Donnez-lui un titre accrocheur, définissez sa durée et le nombre d'apprenants prévus. C'est la première étape pour obtenir des retours précieux !",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Ajoutez vos apprenants",
    description:
      "Ensuite, ajoutez vos apprenants à la formation. Pour l'instant, vous pouvez les ajouter manuellement en renseignant leurs emails. Bientôt, vous pourrez importer vos fichiers Excel pour gagner du temps !",
  },
  {
    icon: <Mail className="h-8 w-8 text-primary" />,
    title: "Laissez la magie opérer",
    description:
      "C'est tout ! FeedEd s'occupe du reste. Nous envoyons automatiquement les demandes de feedback à J+1 et J+90. Vous n'avez plus qu'à attendre les précieux retours de vos apprenants.",
  },
];

const faqItems = [
  {
    question: "Combien de formations puis-je créer ?",
    answer:
      "Le ciel est la limite ! Vous pouvez créer autant de formations que vous le souhaitez. Que vous ayez une seule formation ou des centaines, FeedEd s'adapte à vos besoins.",
  },
  {
    question: "Les apprenants peuvent-ils répondre de manière anonyme ?",
    answer:
      "Pour garantir la qualité des réponses, les apprenants doivent s'identifier. Mais rassurez-vous, nous ne partageons jamais leurs données personnelles avec des tiers.",
  },
  {
    question: "Puis-je personnaliser les questions de feedback ?",
    answer:
      "Actuellement, nous utilisons des questionnaires standardisés pour assurer la cohérence des résultats. Mais nous sommes à l'écoute ! N'hésitez pas à nous faire part de vos suggestions pour l'avenir.",
  },
  {
    question: "Comment puis-je analyser les résultats ?",
    answer:
      "Nous vous proposons une visualisation intégré de vos données, ainsi que la possibilité d'analyser les tendances et d'exporter les données. Vous pourrez facilement identifier les points forts et les axes d'amélioration de vos formations.",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function EnhancedNarrativeUserGuide() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <motion.section
          className="max-w-3xl mx-auto text-center mb-16"
          initial="initial"
          animate="animate"
          variants={fadeInUp}>
          <h1 className="text-4xl font-bold mb-4 text-foreground bg-clip-text bg-gradient-to-r from-primary to-primary-foreground">
            Comment ça marche ?
          </h1>
          <p className="text-xl text-muted-foreground">
            Prêt à révolutionner vos formations ? Suivez le guide et découvrez
            comme il est simple de collecter des retours précieux.
          </p>
        </motion.section>

        <motion.section
          className="mb-20 max-w-3xl mx-auto"
          initial="initial"
          animate="animate"
          variants={fadeInUp}>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}>
                <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
                  <CardContent className="flex items-start gap-6 p-6">
                    <div className="flex-shrink-0 mt-1 bg-primary/10 rounded-full p-3">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="max-w-2xl mx-auto mb-20"
          initial="initial"
          animate="animate"
          variants={fadeInUp}>
          <h2 className="text-3xl font-semibold text-foreground mb-10 text-center">
            Questions fréquentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground hover:no-underline hover:text-primary transition-colors">
                  <span className="flex items-center">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.section>
      </main>
    </div>
  );
}
