"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook
import UserButton from "@/components/shared/UserButton"; // Import the UserButton component

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth(); // Use the useAuth hook to get the current user

  const navItems = [
    { name: "Accueil", href: "/" },
    { name: "Fonctionnalités", href: "#features" },
  ];

  return (
    <nav className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
              <Image
                src="/assets/icons/feeded.svg"
                alt="Logo"
                width={150}
                height={75}
                className="text-background"
              />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-base px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block space-x-3">
            {currentUser ? (
              <UserButton />
            ) : (
              <>
                <Link href="/signup">
                  <Button className='bg-background text-foreground' variant={"outline"}>Inscription</Button>
                </Link>
                <Link href="/login">
                  <Button>Connexion</Button>
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col space-y-4 mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {currentUser ? (
                    <UserButton />
                  ) : (
                    <>
                      <Link href="/signup">
                        <Button variant={"outline"}>Inscription</Button>
                      </Link>
                      <Link href="/login">
                        <Button>Connexion</Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}