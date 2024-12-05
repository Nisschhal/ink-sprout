import { auth } from "@/server/auth";
import { Logo } from "./Logo";
import { UserButton } from "./UserButton";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import CartDrawer from "../cart/cart-drawer";

export default async function NavBar() {
  const session = await auth();
  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li className="flex flex-1">
            <Link href="/" aria-label="sprout and scribble logo">
              <Logo />
            </Link>
          </li>
          <li className="pb-2 relative flex items-center hover:bg-muted cursor-pointer">
            <CartDrawer />
          </li>
          {!session ? (
            <li className="flex items-center justify-center">
              <Button asChild>
                <Link className="flex gap-2" href="/auth/login">
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li className="flex items-center justify-center">
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
