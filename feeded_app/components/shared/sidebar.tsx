"use client";
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Icon from "../../constants/Icon";
import Advertisement from "./Advertisement";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 bg-white p-5 shadow-md shadow-purple-200/50 lg:flex">
      <div className="flex size-full flex-col gap-4">
        <Link href="/" className="w-36">
          <Image
            src="/assets/images/feeded.png"
            width={128}
            height={38}
            alt="Feeded logo"
          />
        </Link>
        <nav className="h-full flex-col justify-between md:flex md:gap-4">
          <SignedIn>
            <ul className="hidden w-full flex-col items-start gap-0 md:flex">
              {navLinks.map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={`${"flex-center p-16-semibold w-full text-xs whitespace-nowrap transition-all hover:text-sm"} 
                  ${isActive ? "text-purple" : "text-lightgray"}`}>
                    <Link
                      className="p-16-semibold flex size-full gap-4 p-4"
                      href={link.route}>
                      <Icon
                        name={link.icon}
                        className={`w-4 h-4 hover:size-4 ${
                          isActive ? "stroke-purple" : "stroke-lightgray"
                        }`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <Advertisement/>
              <li className="flex-center cursor-pointer gap-2 p-4">
                <UserButton showName />
              </li>
            </ul>
          </SignedIn>
          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
