'use client'

import React, { useState, FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext" // Adjust the import path as needed

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { FcGoogle } from "react-icons/fc"
import { LockIcon, MailIcon } from "lucide-react"

export default function Login(): JSX.Element {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { login, loginWithGoogle } = useAuth()

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    
    try {
      setError("")
      setLoading(true)
      await login(email, password)
      // Redirect to admin page
      window.location.href = '/admin'
      console.log("Login successful")
    } catch (error: unknown) {
      setError("La connexion a échoué. Veuillez vérifier vos informations et réessayer à nouveau.")
      console.error("Login error:", error instanceof Error ? error.message : String(error))
    }
    setLoading(false)
  }

  async function handleGoogleLogin(): Promise<void> {
    try {
      setError("")
      setLoading(true)
      await loginWithGoogle()
      // Redirect to admin page
      window.location.href = '/admin'
      console.log("Google login successful")
    } catch (error: unknown) {
      setError("La connexion avec Google a échoué. Veuillez réessayer.")
      console.error("Google login error:", error instanceof Error ? error.message : String(error))
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto border shadow-xl rounded-xl 2xl:mx-36 w-full max-w-sm lg:w-96">
          <Card className="border-none shadow-none">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center">
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
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Se connecter à FeedEd</h2>
              <p className="text-sm text-muted-foreground">
                Entrez vos identifiants pour accéder à votre compte
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
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
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="sr-only">
                      Mot de passe
                    </Label>
                    <Link
                      href="/recover"
                      className="ml-auto text-sm text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <FcGoogle className="mr-2 size-4" />
                Connexion avec Google
              </Button>
            </CardContent>
            <CardFooter>
              <p className="text-center text-sm text-muted-foreground w-full">
                Vous n&lsquo;avez pas de compte ?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Inscrivez-vous
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/images/ice.jpeg"
          alt="Students studying"
          width={1200}
          height={1200}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 mix-blend-overlay opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
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
              Vos clients les plus mécontents sont votre plus grande source d&lsquo;apprentissage.
              </p>
            </div>
            <footer className="mt-4">
              <p className="text-base font-semibold text-pink-200">Bill Gates</p>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}