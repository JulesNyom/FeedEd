import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full">
      <div className="wrapper flex items-center justify-between mx-5">
        <Link href="/" className="w-36">
          <Image
            src="/assets/images/feeded.png"
            width={128}
            height={38}
            alt="Feeded logo"
          />
        </Link>
        <div>
          <Button
            asChild
            className="bg-transparent text-black font-normal"
            size="lg"
            variant="link">
            <Link href="/sign-in">Tarifs</Link>
          </Button>
          <Button
            asChild
            className="bg-transparent text-black font-normal "
            size="lg"
            variant="link">
            <Link href="/sign-in">Fonctionnalités</Link>
          </Button>
          <Button
            asChild
            className="bg-transparent text-black font-normal"
            size="lg"
            variant="link">
            <Link href="/sign-in">A propos</Link>
          </Button>
        </div>

        <SignedIn></SignedIn>

        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton showName />
          </SignedIn>
          <SignedOut>
            <Button asChild className="text-sm text-white font-bold hover:bg-purple/85 bg-purple">
              <Link href="/sign-in">Démarrer gratuitement</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
