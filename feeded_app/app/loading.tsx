'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const faitsAmusants = [
  "Le saviez-vous ? Le premier 'bug' informatique était un vrai insecte.",
  "Le terme 'robot' vient du mot tchèque 'robota' qui signifie travail forcé.",
  "La première souris d'ordinateur était en bois.",
  "Le premier nom de domaine jamais enregistré était Symbolics.com.",
  "La disposition du clavier AZERTY a été conçue pour ralentir les dactylographes.",
]

export default function PageDeChargement() {
  const [progres, setProgres] = useState(0)
  const [indexFait, setIndexFait] = useState(0)

  useEffect(() => {
    const minuteur = setInterval(() => {
      setProgres((ancienProgres) => {
        const nouveauProgres = Math.min(ancienProgres + Math.random() * 10, 100)
        if (nouveauProgres === 100) {
          clearInterval(minuteur)
        }
        return nouveauProgres
      })
    }, 500)

    return () => clearInterval(minuteur)
  }, [])

  useEffect(() => {
    const minuteurFait = setInterval(() => {
      setIndexFait((ancienIndex) => (ancienIndex + 1) % faitsAmusants.length)
    }, 5000)

    return () => clearInterval(minuteurFait)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <motion.div
        className="w-24 h-24 border-4 border-purple-200 rounded-full"
        animate={{
          borderColor: ['#e9d5ff', '#9333ea', '#e9d5ff'],
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <h1 className="mt-8 text-2xl font-semibold text-purple-800">Un instant, nous préparons tout pour vous</h1>
      <div className="mt-4 w-64 h-2 bg-purple-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progres}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="mt-2 text-purple-600">{Math.round(progres)}%</p>
      <motion.p
        className="mt-8 text-sm text-purple-700 max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        key={indexFait}
      >
        {faitsAmusants[indexFait]}
      </motion.p>
    </div>
  )
}