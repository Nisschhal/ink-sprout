"use client";

import { verifyEmail } from "@/server/actions/tokens";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthCard } from "./AuthCard";
import { FormSuccess } from "./FormSuccess";
import { FormError } from "./FormError";

export const EmailVerification = () => {
  // get the token from search param
  const token = useSearchParams().get("token");

  // initiate the router for new page
  const router = useRouter();
  // state for error and success
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // execute handleVerfication when page mount
  const handleVerification = useCallback(() => {
    if (success || error) return;

    // if there is no token the set error
    if (!token) {
      setError("Token not found!");
    }

    // if there is token then verify that token with server action

    verifyEmail(token!).then((data) => {
      // if error while verifying error
      if (data.error) {
        setError(data.error);
      }
      // if succeed verifying email redirect to login
      if (data.success) {
        setSuccess(data.success);
        router.push("/auth/login");
      }
    });
  }, []);

  // when page mount invoke callbacke function
  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <AuthCard
      cardTitle="Verify you account"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center flex-col w-full justify-center">
        <p>{!success && !error ? "Verifying email..." : ""} </p>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
};
