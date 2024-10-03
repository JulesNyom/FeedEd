"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import UserButton from "@/components/shared/UserButton"
import { motion } from "framer-motion"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentUser } = useAuth()

  const navItems = [
    { name: "Accueil", href: "/" },
    { name: "Fonctionnalités", href: "/guide" },
    { name: "Contact", href: "/contact" }
  ]

  const linkVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  }

  const buttonVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  }

  return (
    <motion.nav
      className="bg-background"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div
            className="flex items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/" className="transition-transform hover:scale-105">
              <Image
                src="/assets/icons/feeded.svg"
                alt="Logo"
                width={150}
                height={75}
                className="text-background"
              />
            </Link>
          </motion.div>
          <div className="hidden md:block">
            <div className="flex 2xl:mr-24 lg:space-x-6 items-baseline">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={linkVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium relative group"
                  >
                    {item.name}
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex space-x-4">
            {currentUser ? (
              <UserButton />
            ) : (
              <>
                <motion.div variants={buttonVariants} initial="initial" animate="animate" whileHover="hover">
                  <Link href="/signup">
                    <Button className="rounded-2xl bg-card text-sm font-bold text-foreground border border-foreground/15 transition-transform hover:scale-105 hover:bg-card" variant="outline">
                      Inscription
                    </Button>
                  </Link>
                </motion.div>
                <motion.div variants={buttonVariants} initial="initial" animate="animate" whileHover="hover">
                  <Link href="/login">
                    <Button className="rounded-2xl mr-2 bg-gradient-to-br from-purple-500 to-indigo-600 font-bold text-secondary text-sm transition-transform hover:scale-105">
                      Connexion
                    </Button>
                  </Link>
                </motion.div>
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
                    <motion.div
                      key={item.name}
                      variants={linkVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                    >
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  {currentUser ? (
                    <UserButton />
                  ) : (
                    <>
                      <motion.div variants={buttonVariants} initial="initial" animate="animate" whileHover="hover">
                        <Link href="/signup">
                          <Button className="w-full bg-background text-foreground border-2 border-primary hover:bg-primary hover:text-background transition-colors duration-300" variant="outline">
                            Inscription
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div variants={buttonVariants} initial="initial" animate="animate" whileHover="hover">
                        <Link href="/login">
                          <Button className="w-full bg-primary text-background hover:bg-background hover:text-primary border-2 border-primary transition-colors duration-300">
                            Connexion
                          </Button>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}