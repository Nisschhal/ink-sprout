"use client";

import { AuthCard } from "./AuthCard";

export default function LoginForm() {
  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocials
    >
      <div>
        <h1>hwy</h1>
      </div>
    </AuthCard>
  );
}
