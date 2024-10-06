'use client'

import React, { useState, FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext" // Ensure this path is correct for your project structure
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MailIcon } from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function RecoverPassword(): JSX.Element {
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { resetPassword } = useAuth()

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    
    try {
      setError("")
      setSuccess("")
      setLoading(true)
      await resetPassword(email)
      setSuccess("Un e-mail de réinitialisation du mot de passe a été envoyé. Veuillez vérifier votre boîte de réception.")
      console.log("Password reset email sent")
    } catch (error: unknown) {
      setError("La réinitialisation du mot de passe a échoué. Veuillez vérifier votre adresse e-mail et réessayer.")
      console.error("Password reset error:", error instanceof Error ? error.message : String(error))
    }
    setLoading(false)
  }

  return (
    <motion.div 
      className="flex min-h-screen"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      <motion.div 
        className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
        variants={fadeIn}
      >
        <motion.div 
          className="mx-auto border shadow-xl rounded-xl 2xl:mx-36 w-full max-w-sm lg:w-96"
          variants={fadeIn}
        >
          <Card className="border-none shadow-none">
            <CardHeader className="space-y-1 text-center">
              <motion.div 
                className="flex justify-center"
                variants={fadeIn}
              >
                <Link href="/" className="inline-block">
                  <Image
                    src="/assets/images/feeded.png"
                    alt="Logo"
                    width={180}
                    height={90}
                    priority
                    className="dark:filter dark:invert"
                  />
                </Link>
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold tracking-tight"
                variants={fadeIn}
              >
                Récupérer votre mot de passe
              </motion.h2>
              <motion.p 
                className="text-sm text-muted-foreground"
                variants={fadeIn}
              >
                Entrez votre adresse e-mail pour recevoir un lien de réinitialisation
              </motion.p>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <motion.div variants={fadeIn}>
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {success && (
                <motion.div variants={fadeIn}>
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-4"
                variants={staggerChildren}
              >
                <motion.div className="space-y-2" variants={fadeIn}>
                  <Label htmlFor="email" className="sr-only">
                    Email
                  </Label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@exemple.com"
                      required
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Envoi en cours..." : "Réinitialiser votre mot de passe"}
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
            <CardFooter>
              <motion.p 
                className="text-center text-sm text-muted-foreground w-full"
                variants={fadeIn}
              >
                Vous vous souvenez de votre mot de passe ?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Connectez-vous
                </Link>
              </motion.p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
      <motion.div 
        className="relative hidden w-0 flex-1 lg:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/images/Carreaux.webp"
          alt="Students studying"
          width={1200}
          height={1200}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 mix-blend-overlay opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50" />
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <blockquote className="mt-8">
            <div className="relative text-lg font-medium text-white md:flex-grow">
              <svg
                className="absolute top-0 left-0 h-8 w-8 -translate-x-3 -translate-y-2 transform text-pink-400"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="relative">
                Le savoir est la seule matière qui s&lsquo;accroit avec le partage.
              </p>
            </div>
            <footer className="mt-4">
              <p className="text-base font-semibold text-pink-200">Socrate</p>
            </footer>
          </blockquote>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}