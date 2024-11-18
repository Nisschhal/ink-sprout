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

export default function LoginForm() {
  // set time for success or error message component to render for 5 seconds
  const [showAlert, setShowAlert] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }, [showAlert]);

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
  const { execute, isExecuting } = useAction(emailSignIn, {
    onSuccess({ data }) {
      console.log(data);
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
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
              {showAlert && <FormError message={error} />}
              {showAlert && <FormSuccess message={success} />}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full my-2">
              {isExecuting ? (
                <>
                  <Loader2 className="animate-spin size-3.5" /> Loggin in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
