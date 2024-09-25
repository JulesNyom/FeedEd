"use client"

import React, { useState, FormEvent } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { User } from "firebase/auth"
import { FcGoogle } from "react-icons/fc"

interface UserData {
  firstName: string
  lastName: string
  email: string
  createdAt: string
}

export default function SignUp(): JSX.Element {
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { signup, loginWithGoogle } = useAuth()

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
  
    try {
      setError("")
      setLoading(true)
      const { user } = await signup(email, password) as { user: User }
      
      const userData: UserData = {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
      }
      await setDoc(doc(db, "users", user.uid), userData)
  
      console.log("Account created successfully")
      
      window.location.href = '/admin'
    } catch (error: unknown) {
      setError("Nous n'avons pas pu vous créer de compte " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignUp(): Promise<void> {
    try {
      setError("")
      setLoading(true)
      await loginWithGoogle()
      console.log("Google account linked successfully")
      window.location.href = '/admin'
    } catch (error: unknown) {
      setError("Nous n'avons pas pu vous connecter avec Google " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 relative">
            <img
              src="https://images.pexels.com/photos/2102850/pexels-photo-2102850.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Abstract background"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-75" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <h2 className="text-4xl font-bold mb-4">Bienvenue</h2>
                <p className="text-xl mx-10">Rejoignez FeedEd et simplifiez l'évaluation de vos formations</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Inscription</CardTitle>
              <CardDescription>
                Entrez vos informations pour créer un compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">Prénom</Label>
                    <Input 
                      id="first-name" 
                      placeholder="Max" 
                      required 
                      value={firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Nom</Label>
                    <Input 
                      id="last-name" 
                      placeholder="Robinson" 
                      required 
                      value={lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@exemple.com"
                    required
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input 
                    id="password" 
                    type="password"
                    required
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 font-bold text-white transition-all hover:shadow-lg" disabled={loading}>
                    {loading ? "Création du compte..." : "Créer un compte"}
                  </Button>
                </motion.div>
              </form>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Ou continuez avec</span>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center"
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                  >
                    <FcGoogle className="size-4 mr-2" />
                    Inscription avec Google
                  </Button>
                </motion.div>
              </div>
              <div className="mt-6 text-center text-sm">
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  Connexion
                </Link>
              </div>
            </CardContent>
          </div>
        </div>
      </motion.div>
    </div>
  )
}