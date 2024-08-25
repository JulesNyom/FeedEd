import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="w-full">
      <div className="wrapper flex items-center justify-between mx-5">
      <Link href="/" className="w-36">
          <Image 
            src="/assets/images/feeded.png" width={128} height={38}
            alt="Evently logo" 
          />
        </Link>
        <Button asChild className="bg-transparent text-black font-normal" size="lg">
              <Link href="/sign-in">
                Pricing
              </Link>
            </Button>
            <Button asChild className="bg-transparent text-black font-normal" size="lg">
              <Link href="/sign-in">
                Features
              </Link>
            </Button>
            <Button asChild className="bg-transparent text-black font-normal" size="lg">
              <Link href="/sign-in">
              About us
              </Link>
            </Button>
        <SignedIn>
        </SignedIn>

        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton showName/>
          </SignedIn>
          <SignedOut>
            <Button asChild className="" size="lg">
              <Link href="/sign-in">
                Try it for free
              </Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header