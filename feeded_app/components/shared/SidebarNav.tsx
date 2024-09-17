'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  UserSquare2,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/formations", icon: BookOpen, label: "Formations" },
  { href: "/apprenants", icon: UserSquare2, label: "Apprenants" },
  { href: "/formulaires", icon: ClipboardList, label: "Questionnaires" },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="mt-4 grid items-start px-2 text-sm font-medium lg:px-4">
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
  )
}