"use client"

import { useState, useEffect, useRef, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

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

export default function Component() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Add document to Firestore
      await addDoc(collection(db, "contact"), formData);
      setIsSubmitted(true);
      // Reset form data
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
      // Handle error (e.g., show error message to user)
    }
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
              Vous avez des questions sur FeedEd ? Nous sommes là pour vous
              fournir toutes les informations dont vous avez besoin sur notre
              application.
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
                      {" "}Nous vous répondrons dans les plus brefs délais.
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
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:scale-105 transition-all duration-300">
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
                    Autre moyen de nous contacter
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-center transition-all duration-300 hover:translate-x-2">
                      <Mail className="mr-2 h-5 w-5 text-primary" />
                      <Link
                        href="mailto:feeded.io@gmail.com"
                        className="flex items-center text-muted-foreground hover:text-primary/80 transition-colors duration-300 group">
                        feeded.io@gmail.com
                      </Link>
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
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                      aria-label="Facebook">
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                      aria-label="Twitter">
                      <Twitter className="h-6 w-6" />
                    </a>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                      aria-label="Instagram">
                      <Instagram className="h-6 w-6" />
                    </a>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 group"
                      aria-label="LinkedIn">
                      <Linkedin className="h-6 w-6 transition-all duration-300 group-hover:rotate-[360deg] group-hover:text-blue-500" />
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