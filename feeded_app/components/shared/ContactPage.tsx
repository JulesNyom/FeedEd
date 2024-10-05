"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({
  children,
  delay = 0,
}) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setVisible(entry.isIntersecting));
    });
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Ici, vous ajouteriez la logique pour envoyer le formulaire
    setIsSubmitted(true);
  };

  return (
    <div className="max-h-screen bg-background flex flex-col justify-between">
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-3xl mx-auto">
          <FadeInSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-foreground">
              Contactez-nous
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              Vous avez des questions sur FeedEd ? Notre équipe est là pour vous
              fournir toutes les informations dont vous avez besoin sur notre
              produit.
            </p>
          </FadeInSection>

          <div className="space-y-12">
            <FadeInSection delay={200}>
              <div className="space-y-8">
                {isSubmitted ? (
                  <div
                    className="bg-primary/10 border border-primary text-primary px-4 py-3 rounded-md"
                    role="alert">
                    <strong className="font-bold">
                      Merci pour votre message !
                    </strong>
                    <p className="block sm:inline">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="privacy" required />
                      <Label htmlFor="privacy">
                        J&lsquo;accepte la politique de confidentialité
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      className="w-full transition-all duration-300 hover:scale-105">
                      Envoyer
                    </Button>
                  </form>
                )}
              </div>
            </FadeInSection>

            <FadeInSection delay={400}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    Autres moyens de nous contacter
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-center transition-all duration-300 hover:translate-x-2">
                      <Mail className="mr-2 h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">
                        info@feeded.com
                      </span>
                    </li>
                    <li className="flex items-center transition-all duration-300 hover:translate-x-2">
                      <Phone className="mr-2 h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">
                        +33 1 23 45 67 89
                      </span>
                    </li>
                    <li className="flex items-center transition-all duration-300 hover:translate-x-2">
                      <Clock className="mr-2 h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">
                        Lun-Ven, 9h-18h
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    Suivez-nous
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
                      <Twitter className="h-6 w-6" />
                    </a>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
                      <Instagram className="h-6 w-6" />
                    </a>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
                      <Linkedin className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </main>
    </div>
  );
}
