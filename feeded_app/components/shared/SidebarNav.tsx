import Link  from "next/link"
import {
    Home,
    BookOpen,
    UserSquare2,
    ClipboardList,
    Settings
  } from "lucide-react"

export function SidebarNav () {
    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Accueil
        </Link>
        <Link
          href="/formations"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <BookOpen className="h-4 w-4" />
          Formations
        </Link>
        <Link
          href="/apprenants"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <UserSquare2 className="h-4 w-4" />
          Apprenants
        </Link>
        <Link
          href="/formulaires"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <ClipboardList className="h-4 w-4" />
          Formulaires
        </Link>
        <Link
          href="/reglages"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <Settings className="h-4 w-4" />
          Réglages
        </Link>
      </nav>
    )
}

