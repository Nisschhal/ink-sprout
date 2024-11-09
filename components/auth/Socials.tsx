"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

export default function Socials() {
  return (
    <div>
      <Button
        onClick={() =>
          signIn("google", {
            redirect: true,
            callbackUrl: "/",
          })
        }
      >
        Sign in with Google
      </Button>
      <Button
        onClick={() =>
          signIn("github", {
            callbackUrl: "/",
          })
        }
      >
        Sign in with Github
      </Button>
    </div>
  );
}
