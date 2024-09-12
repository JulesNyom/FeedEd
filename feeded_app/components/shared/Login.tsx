"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Adjust the import path as needed

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function Login(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      // Redirect to admin page
      window.location.href = '/admin'
      console.log("Login successful");
    } catch (error: unknown) {
      setError("La connexion a échoué. Veuillez vérifier vos informations et réessayer à nouveau.");
      console.error("Login error:", error instanceof Error ? error.message : String(error));
    }
    setLoading(false);
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid mb-3 text-center">
            <div className="flex justify-center">
              <Link href="/" className="inline-block">
                <Image
                  src="/assets/images/feeded.png"
                  alt="Logo"
                  width={200}
                  height={100}
                  priority
                />
              </Link>
            </div>
            <h1 className="text-2xl text-foreground font-bold">Se connecter à FeedEd</h1>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
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
              <div className="flex items-center">
                <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto text-foreground inline-block text-sm underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion en cours..." : "Connexion"}
            </Button>
            <Button variant="outline" className="text-foreground w-full" type="button">
              Connexion avec Google
            </Button>
          </form>
          <div className="mt-4 text-center text-foreground text-sm">
            Vous n'avez pas de compte ?{" "}
            <Link href="#" className="text-foreground underline">
              Inscrivez-vous
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-full h-screen bg-muted relative overflow-hidden">
      <Image
        src="/assets/images/dome.jpg"
        alt="Image"
        fill
        style={{ objectFit: 'cover' }}
        className="dark:brightness-[0.2] dark:grayscale"
      />
    </div>
    </div>
  );
}