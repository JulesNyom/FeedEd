import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, Clock } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-b rounded-3xl from-primary/10 to-background">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <Badge className="mb-4">Tout-en-un</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              Feedbacks formation en{" "}
              <span className="text-primary">un clic</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-3xl">
              Créez, envoyez et analysez vos enquêtes de satisfaction en
              quelques secondes. Gagnez du temps, optimisez vos formations.
              Simple, rapide, efficace.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="rounded-2xl mr-2 bg-gradient-to-br from-purple-500 to-indigo-600 font-bold text-secondary text-base transition-transform hover:scale-105">
                    Démarrez gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
            <Button 
              size="lg" 
              className="rounded-2xl bg-card text-base font-bold text-foreground border border-foreground/15 hover:scale-105 hover:bg-card"
            >
              Connexion
            </Button>
            </Link>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-x-4 text-sm text-gray-500">
              <div className="flex items-center gap-x-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                Essai gratuit
              </div>
              <div className="flex items-center gap-x-1">
                <CheckCircle className="h-4 w-4 text-primary" />
                Sans engagement
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-10 rounded-2xl blur-2xl"></div>
            <img
              src="https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Interface rapide FeedEd"
              className="relative rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-background p-4 rounded-lg shadow-lg flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ultra Rapide</p>
                <p className="text-sm text-gray-500">
                  Enquêtes prêtes à l'emploi
                </p>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 bg-background p-4 rounded-lg shadow-lg flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Gain de temps</p>
                <p className="text-sm text-gray-500">Automatisation complète</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
