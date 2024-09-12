"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Menu,
  Search,
  BookOpen,
  UserSquare2,
  ClipboardList,
  Settings,
} from "lucide-react";

const navLinks = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/formations", icon: BookOpen, label: "Formations" },
  { href: "/apprenants", icon: UserSquare2, label: "Apprenants" },
  { href: "/formulaires", icon: ClipboardList, label: "Formulaires" },
  { href: "/reglages", icon: Settings, label: "Réglages" },
];

export function Topbar(): JSX.Element {
  const [userName, setUserName] = useState("Jane Doe");
  const { logout } = useAuth(); // Access the logout function from AuthContext

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logged out successfully");
      // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, you can show an error message to the user here
    }
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/assets/images/feeded.png"
                alt="Logo"
                width={150}
                height={75}
                priority
              />
            </Link>
            {navLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Card className="">
              <CardHeader>
                <CardTitle>Devenez pro</CardTitle>
                <CardDescription>
                  Débloquez toutes les fonctionnalités et obtenez un nombre
                  illimité de formations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Abonnement pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une formation..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt={userName} />
              <AvatarFallback>
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/profile" className="your-styling-classes">
              Réglages
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Aide</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
