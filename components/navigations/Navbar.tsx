import { auth } from "@/server/auth";
import { Logo } from "./Logo";
import { UserButton } from "./UserButton";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function NavBar() {
  const session = await auth();
  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between gap-3 items-center py-3">
          <li className=" ">
            <Link href={"/"} aria-label="ink sprout logo">
              <Logo />
            </Link>
          </li>
          <li className="ml-auto">Home</li>
          {!session ? (
            <li>
              <Button variant={"ghost"} asChild>
                <Link href={"/auth/login"}>
                  <LogIn /> <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton
                user={session?.user}
                expires={session?.expires as string}
              />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
