import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';

const UserButton = () => {
  const { currentUser, userDataObj, logout } = useAuth();
  const [photoURL, setPhotoURL] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (currentUser && userDataObj) {
      setPhotoURL(userDataObj.photoURL || "");
      setUserName(`${userDataObj.displayName}`);
    }
  }, [currentUser, userDataObj]);

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logged out successfully");
      // Redirect to login page or home page
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="transition-transform hover:scale-125">
              <AvatarImage src={photoURL} alt={userName} />
              <AvatarFallback>
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="hover:text-primary">
            <Link href="/profile">Mon compte</Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/admin">
              Tableau de bord
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
          <Link href="/contact">
          Contact
          </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
};

export default UserButton;