import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "FeedEd",
  description:
    "FeedEd est une application web conçue pour faciliter les enquêtes de satisfaction pour les formateurs et les organismes de formation. Simplifiez la collecte de feedback, améliorez vos programmes et offrez une meilleure expérience d'apprentissage.",
  icons: {
    icon: "/assets/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="fr">
        <AuthProvider>
        <body className={poppins.className}>{children}</body>
        </AuthProvider>
      </html>
  );
}