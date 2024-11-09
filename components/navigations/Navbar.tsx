import { auth } from "@/server/auth";
import { Logo } from "./Logo";
import { UserButton } from "./UserButton";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function NavBar() {
  const session = await auth();
  return (
    <header className="bg-slate-500 py-5">
      <nav>
        <ul className="flex justify-between gap-3">
          <li className="w-max-2xl overflow-hidden">
            <Logo />
          </li>
          <li className="ml-auto">Home</li>
          {!session ? (
            <li>
              <Button variant={"ghost"} asChild>
                <Link href={"/api/auth/signin"}>
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
