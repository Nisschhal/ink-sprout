"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

export function UserButton({ user }: Session) {
  return (
    <div>
      {user?.email}
      <p>
        <button onClick={() => signOut()}>Sign out</button>
      </p>
    </div>
  );
}
