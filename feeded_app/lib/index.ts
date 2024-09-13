import { PenTool, BarChart2, Zap, Home,
    BookOpen,
    UserSquare2,
    ClipboardList,
    Settings, } from "lucide-react"

export const features = [
    {
      title: "Créateur de sondage intuitif",
      description: "Créez des sondages professionnels en quelques minutes grâce à notre interface glisser-déposer et nos modèles personnalisables.",
      icon: PenTool,
      image: "https://images.pexels.com/photos/1015568/pexels-photo-1015568.jpeg?auto=compress&cs=tinysrgb&w=800",
      badge: "Facile à utiliser"
    },
    {
      title: "Analyses avancées",
      description: "Obtenez des informations précieuses grâce à la visualisation des données en temps réel et des outils de reporting complets.",
      icon: BarChart2,
      image: "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      badge: "Basé sur les données"
    },
    {
      title: "Distribution intelligente",
      description: "Atteignez votre audience sur plusieurs canaux grâce aux campagnes e-mail automatisées et à l'intégration des médias sociaux.",
      icon: Zap,
      image: "https://images.pexels.com/photos/3277806/pexels-photo-3277806.jpeg?auto=compress&cs=tinysrgb&w=800",
      badge: "Efficace"
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

  