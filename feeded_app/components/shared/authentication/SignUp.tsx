"use client"

import React, { useState, FormEvent } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext"; // Adjust this import path as needed
import { Alert, AlertDescription } from "@/components/ui/alert";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust this import path as needed
import { User } from "firebase/auth"; // Import Firebase User type

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export function SignUp(): JSX.Element {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { signup } = useAuth();

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
  
    try {
      setError("");
      setLoading(true);
      const { user } = await signup(email, password) as { user: User };
      
      // Create user document in Firestore
      const userData: UserData = {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", user.uid), userData);
  
      console.log("Account created successfully");
      
      // Redirect to admin route
      window.location.href = '/admin';
    } catch (error: unknown) {
      setError("Nous n'avons pas pu vous créer de compte " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Inscription</CardTitle>
        <CardDescription>
          Entrez vos informations pour créer un compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">Prénom</Label>
              <Input 
                id="first-name" 
                placeholder="Max" 
                required 
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
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
          <div className="grid gap-2">
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
          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input 
              id="password" 
              type="password"
              required
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="rounded-xl mr-2 bg-gradient-to-br from-purple-500 to-indigo-600 font-bold text-secondary transition-transform hover:scale-105" disabled={loading}>
            {loading ? "Création du compte..." : "Créer un compte"}
          </Button>
        </form>
        <Button variant="outline" className="w-full mt-4">
          Inscription avec Google
        </Button>
        <div className="mt-4 text-center text-sm">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="underline">
            Connexion
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}