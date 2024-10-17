'use client'

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import UserButton from "@/components/shared/UserButton"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  Home,
  BookOpen,
  UserSquare2,
  ClipboardList,
} from "lucide-react"
import GuideCard from "./Guide/GuideCard"
import { useEffect, useState } from "react"
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { href: "/admin", icon: Home, label: "Dashboard" },
  { href: "/formations", icon: BookOpen, label: "Formations" },
  { href: "/apprenants", icon: UserSquare2, label: "Apprenants" },
  { href: "/formulaires", icon: ClipboardList, label: "Formulaires" },
]

interface UserDataObj {
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: string;
}

export function Topbar(): JSX.Element {
  const pathname = usePathname()
  const { currentUser, userDataObj } = useAuth() as {
    currentUser: { uid: string; email: string | null };
    userDataObj: UserDataObj;
  }
  
  const [utilisateur, setUtilisateur] = useState<UserDataObj>({
    displayName: '',
    email: '',
    photoURL: '',
    createdAt: '',
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (currentUser && userDataObj) {
      setUtilisateur({
        displayName: userDataObj.displayName || '',
        email: userDataObj.email || currentUser.email || '',
        photoURL: userDataObj.photoURL || '',
        createdAt: userDataObj.createdAt || '',
      })
    }
  }, [currentUser, userDataObj])

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-[70px] items-center gap-4 border-b bg-background px-6 lg:h-[70px] lg:px-4"
    >
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 90 }}
                    exit={{ rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </motion.div>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-[300px] min-h-screen flex-col p-0">
          <div className="border-b px-6 py-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/feeded.png"
                alt="Logo"
                width={125}
                height={75}
                priority
                className="object-contain"
              />
            </Link>
          </div>
          <div className="flex flex-col min-h-screen">
            <nav className="grid gap-2 p-4 text-sm font-medium">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-primary"
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ scale: isActive ? 1.2 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                    </motion.div>
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: isActive ? 4 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                    {isActive && (
                      <motion.div
                        className="absolute left-0 h-full w-1"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-auto mb-24 p-6">
              <GuideCard />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex w-full flex-1 items-center justify-between xs:">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg font-semibold"
        >
          Bienvenue, {utilisateur.displayName || 'Utilisateur'}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <UserButton />
        </motion.div>
      </div>
    </motion.header>
  )
}