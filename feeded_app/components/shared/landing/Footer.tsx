import Link from "next/link"
import { Mail, Linkedin, ChevronRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
          <div className="space-y-4 md:w-1/3">
            <h2 className="text-3xl font-bold tracking-tight">FeedEd</h2>
            <p className="text-sm text-purple-100">Sublimez vos formations, un retour à la fois</p>
            <Link 
              href="/guide" 
              className="inline-flex items-center text-sm font-medium text-white hover:text-purple-200 transition-colors duration-300"
            >
              En savoir plus <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-col space-y-4 md:items-end">
            <Link 
              href="mailto:feeded.io@gmail.com" 
              className="flex items-center hover:text-purple-200 transition-colors duration-300 group"
            >
              <Mail className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              feeded.io@gmail.com
            </Link>
            <Link 
              href="https://www.linkedin.com/in/jules-nyom-b21970160/" 
              className="flex items-center hover:text-purple-200 transition-colors duration-300 group"
            >
              <Linkedin className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              LinkedIn
            </Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-purple-400 text-sm text-center text-purple-100">
          <p>&copy; {new Date().getFullYear()} FeedEd. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}