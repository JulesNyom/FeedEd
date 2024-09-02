import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex justify-center items-center min-h-screen mt-4 mx-9 border-transparent rounded-3xl bg-lightblue/50">
      <div className="text-center">
        <p>Des enquêtes de satisfaction simples et rapides.</p>
        <h1 className="text-5xl font-bold mt-3 mb-8">
          Collectez des retours pertinents <br />et 
          améliorez vos formations.
        </h1>
        <p></p>
        <Button asChild className="hover:bg-purple/85 bg-purple text-white font-bold text-sm mr-6">
          <Link href="/sign-in">
            Démarrer gratuitement
          </Link>
        </Button>
        <Button className="font-bold border hover:border-purple hover:text-purple bg-white">
          Plus d'options
          </Button>
      </div>
    </main>
  );
}
