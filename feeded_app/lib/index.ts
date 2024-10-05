import { PenTool, BarChart2, Zap, Home,
    BookOpen,
    UserSquare2,
    ClipboardList,
    Settings, } from "lucide-react"

export const features = [
  {
    title: "Créateur d'enquêtes intuitif",
    description: "Concevez des enquêtes de formation professionnelles en quelques minutes ou utilisez nos modèles adaptés.",
    icon: PenTool,
    image: "/assets/images/coffe.jpeg",
    badge: "Ultra rapide"
  },
  {
    title: "Analyses instantanées",
    description: "Obtenez des insights précieux sur vos formations grâce à la visualisation des données en temps réel.",
    icon: BarChart2,
    image: "/assets/images/reunion.webp",
    badge: "Actionnable"
  },
  {
    title: "Distribution automatisée",
    description: "Envoyez vos enquêtes au bon moment grâce aux campagnes e-mail automatisées.",
    icon: Zap,
    image: "/assets/images/duo.jpeg",
    badge: "Gain de temps"
  }
]

export const navItems = [
    { name: "Accueil", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Tarifs", href: "/pricing" },
  ];

  interface PricingTier {
    name: string
    monthlyPrice: number
    yearlyPrice: number
    description: string
    features: string[]
    highlighted?: boolean
  }

  export const pricingTiers: PricingTier[] = [
    {
      name: "Débutant",
      monthlyPrice: 19,
      yearlyPrice: 190,
      description: "Parfait pour les particuliers et les petites équipes",
      features: ["Jusqu'à 5 sondages", "100 réponses par mois", "Analyses de base", "Support par e-mail"],
    },
    {
      name: "Pro",
      monthlyPrice: 49,
      yearlyPrice: 490,
      description: "Idéal pour les entreprises en croissance",
      features: ["Sondages illimités", "1000 réponses par mois", "Analyses avancées", "Support prioritaire", "Personnalisation de marque"],
      highlighted: true,
    },
    {
      name: "Entreprise",
      monthlyPrice: 99,
      yearlyPrice: 990,
      description: "Pour les grandes organisations aux besoins complexes",
      features: ["Tout en illimité", "Fonctionnalités de sécurité avancées", "Gestionnaire de compte dédié", "Accès API", "Intégrations personnalisées"],
    },
  ]

  export const navLinks = [
    { href: "/", icon: Home, label: "Accueil" },
    { href: "/formations", icon: BookOpen, label: "Formations" },
    { href: "/apprenants", icon: UserSquare2, label: "Apprenants" },
    { href: "/formulaires", icon: ClipboardList, label: "Formulaires" },
    { href: "/reglages", icon: Settings, label: "Réglages" },
  ];

  