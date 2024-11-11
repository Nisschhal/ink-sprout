"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { AuthCard } from "./AuthCard";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { RegisterSchema } from "@/types/register-schema";
import { emailRegister } from "@/server/actions/email-register";
import { Loader2 } from "lucide-react";
import { FormSuccess } from "./FormSuccess";
import { FormError } from "./FormError";

export default function RegisterForm() {
  // Form State initialized with validation from zod and schema
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: "", password: "", name: "" },
  });

  // Error Status
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Server action using 'next-safe-action'
  // extract the execute function and form submit status
  const { execute, status, isExecuting } = useAction(emailRegister, {
    onSuccess(data) {
      console.log(data);
      if (data.data?.success) {
        console.log(data.data.success);
        setSuccess(data.data.success);
      }
      if (data.data?.error) {
        console.log(data.data.success);
        setError(data.data.error);
      }
    },
  });

  // When form submited invoke execute server function
  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    execute(data);
  };

  return (
    <AuthCard
      cardTitle="Create an account "
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account?"
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
              {/* // Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Your name here..."
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Success or Error message */}
              <FormSuccess message={success} />
              <FormError message={error} />
              {/* Forgot Password Link */}
              <Button variant={"link"} size={"sm"}>
                <Link href="/auth/reset">Forgot your password?</Link>
              </Button>
            </div>
            {/* Submit Button */}
            <Button type="submit" className={`w-full my-2`}>
              {isExecuting ? (
                <>
                  <Loader2 className="animate-spin size-3.5" /> Signing up...
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
