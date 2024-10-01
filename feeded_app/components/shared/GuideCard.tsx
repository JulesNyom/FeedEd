'use client'

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { PlayCircle } from "lucide-react"
import Link from "next/link"

export default function DiscoverFeedEdCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-[280px] overflow-hidden bg-gradient-to-br from-purple-700 via-purple-500 to-indigo-500 text-white shadow-lg">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src="https://images.pexels.com/photos/7516363/pexels-photo-7516363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Découvrez FeedEd"
            className="w-full h-[140px] object-cover"
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
          <motion.div 
            className="absolute bottom-2 left-2 flex items-center text-white text-sm font-semibold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PlayCircle className="w-4 h-4 mr-1" />
            Guide Rapide
          </motion.div>
        </motion.div>
        <CardContent className="p-4">
          <motion.h2 
            className="text-lg font-bold mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Démarrez avec FeedEd
          </motion.h2>
          <motion.p 
            className="text-sm text-white/80 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Maîtrisez FeedEd en quelques étapes simples.
          </motion.p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            <Link href="/guide">
            <Button className="w-full text-sm font-semibold bg-[#f8d254] text-black hover:scale-100 shadow-md" size="sm">
              Voir le guide
            </Button>
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}