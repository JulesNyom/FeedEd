'use client'

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import UserButton from "@/components/shared/UserButton"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion } from "framer-motion"
import {
  Menu,
  Search,
  Home,
  BookOpen,
  UserSquare2,
  ClipboardList,
} from "lucide-react"
import ProSubscriptionCard from "./SubscriptionCard"

const navItems = [
  { href: "/admin", icon: Home, label: "Dashboard" },
  { href: "/formations", icon: BookOpen, label: "Formations" },
  { href: "/apprenants", icon: UserSquare2, label: "Apprenants" },
  { href: "/formulaires", icon: ClipboardList, label: "Formulaires" },
]

export function Topbar(): JSX.Element {
  const pathname = usePathname()

  return (
    <header className="flex h-[70px] items-center gap-4 border-b bg-background px-4 lg:h-[70px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-[300px] flex-col p-0">
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
          <div className="mt-auto p-4">
            <ProSubscriptionCard />
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex w-full flex-1 items-center justify-between xs:">
        <form className="w-72">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une formation..."
              className="w-full appearance-none bg-background pl-8 shadow-none"
            />
          </div>
        </form>
        <UserButton />
      </div>
    </header>
  )
}