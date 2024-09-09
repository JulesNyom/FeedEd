import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Login() {
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
            <h1 className="text-2xl font-bold">Se connecter à FeedEd</h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@exemple.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mot de passe</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline">
                  Mot de passe oubliez ?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Connexion
            </Button>
            <Button variant="outline" className="w-full">
              Connexion avec Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Vous n'avez pas de compte ?{" "}
            <Link href="#" className="underline">
              Inscrivez-vous
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-full h-screen bg-muted relative overflow-hidden">
        <Image
          src="/assets/images/dome.jpg"
          alt="Image"
          layout="fill"
          className="dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
