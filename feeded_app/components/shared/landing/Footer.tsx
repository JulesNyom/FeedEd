import Link from "next/link"
import { Mail, Linkedin, ChevronRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
          <div className="space-y-4 md:w-1/3">
            <h2 className="text-3xl font-bold tracking-tight text-primary">FeedEd</h2>
            <p className="text-sm text-muted-foreground">Sublimez vos formations, un retour à la fois</p>
            <Link 
              href="/guide" 
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-300"
            >
              En savoir plus <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-col space-y-4 md:items-end">
            <Link 
              href="mailto:feeded.io@gmail.com" 
              className="flex items-center text-primary hover:text-primary/80 transition-colors duration-300 group"
            >
              <Mail className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              feeded.io@gmail.com
            </Link>
            <Link 
              href="https://www.linkedin.com/in/jules-nyom-b21970160/" 
              className="flex items-center text-primary hover:text-primary/80 transition-colors duration-300 group"
            >
              <Linkedin className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              LinkedIn
            </Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FeedEd. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}