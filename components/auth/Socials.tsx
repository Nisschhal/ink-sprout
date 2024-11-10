"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Socials() {
  return (
    <div className="flex flex-col w-full gap-4">
      <Button
        variant={"outline"}
        onClick={() =>
          signIn("google", {
            redirect: true,
            callbackUrl: "/",
          })
        }
        className="flex gap-4 w-full"
      >
        <p>Sign in with Google</p>
        <FcGoogle className="size-4" />
      </Button>
      <Button
        variant={"outline"}
        onClick={() =>
          signIn("github", {
            callbackUrl: "/",
          })
        }
        className="flex gap-4 w-full"
      >
        <p> Sign in with Github</p>
        <FaGithub className="size-4" />
      </Button>
    </div>
  );
}
