"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { AuthCard } from "./AuthCard";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/login-schema";
import * as z from "zod";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAction } from "next-safe-action/hooks";
import { emailSignIn } from "@/server/actions/email-signin";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FormSuccess } from "./FormSuccess";
import { FormError } from "./FormError";

// INPUT OTP
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function LoginForm() {
  // set time for success or error message component to render for 5 seconds
  const [alertError, setAlertError] = useState<boolean>(false);
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);

  // Two factor UI
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);

  // useEffect to timeout alerts
  useEffect(() => {
    setTimeout(() => {
      setAlertError(false);
      setAlertSuccess(false);
    }, 5000);
  }, [alertError, alertSuccess]);

  // Form State initialized with validation from zod and schema
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Error Status
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Server action using 'next-safe-action'
  // extract the execute function and form submit status
  const { execute, isExecuting, status } = useAction(emailSignIn, {
    onSuccess({ data }) {
      if (data?.success) {
        setAlertSuccess(true);
        setSuccess(data?.success);
      }
      if (data?.error) {
        setAlertError(true);
        setError(data?.error);
      }

      if (data?.twoFactor) setShowTwoFactor(true);
    },
  });

  // When form submited invoke execute server function
  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    execute(data);
  };

  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Form Fields */}
            <div className="space-y-5">
              {showTwoFactor && (
                <>
                  {" "}
                  {/* TWO fACTOR CODE */}
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          We&apos;ve sent you a two factor code to your email.
                        </FormLabel>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            {...field}
                            disabled={status === "executing"}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="youremail@gmail.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* // Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your password here..."
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Forgot Password Link */}
              <Button variant={"link"} size={"sm"}>
                <Link href="/auth/reset">Forgot your password?</Link>
              </Button>
              {/* FORM ERROR || SUCCESS */}
              {alertError && <FormError message={error} />}
              {alertSuccess && <FormSuccess message={success} />}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full my-2">
              {isExecuting ? (
                <>
                  <Loader2 className="animate-spin size-3.5" /> Loggin in...
                </>
              ) : (
                <>{showTwoFactor ? "Verify" : "Login"}</>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
