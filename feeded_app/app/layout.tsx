import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { frFR } from '@clerk/localizations'


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "FeedEd",
  description:
    "FeedEd est une application web conçue pour faciliter les enquêtes de satisfaction pour les formateurs et les organismes de formation. Simplifiez la collecte de feedback, améliorez vos programmes et offrez une meilleure expérience d'apprentissage.",
  icons :{
    icon: '/assets/images/logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR}>
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
