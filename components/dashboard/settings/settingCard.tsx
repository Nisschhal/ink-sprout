"use client";
import { Session } from "next-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingSchema } from "@/types/settings-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import Image from "next/image";

// make own type to avoid session props errors
type SettingForm = {
  session: Session;
};

export default function SettingCard({ session }: SettingForm) {
  console.log(session, "session");
  // form from 'react-form-hook with type from SettingSchema
  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      name: session.user?.name || undefined,
      email: session.user?.email || undefined,
      image: session.user?.image || undefined,
      password: "",
      newPassword: "",
      isTwoFactorEnable: false,
    },
  });

  const [isExecuting, setIsExecution] = useState<boolean | null>(false);

  const [avatarUploading, setAvatarUploading] = useState<boolean | null>(false);
  // Form error or success message
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form submit
  function onSubmit(values: z.infer<typeof SettingSchema>) {
    execute(values);
  }

  // formstate
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* // custom form using react-hook-form*/}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={status == "executing"}
                      placeholder="Your Name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Image Hidden Field */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  {/* Display Auth image */}
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") ? (
                      <div className="font-bold">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <Image
                        src={session.user?.image as string}
                        alt="User image"
                        className="rounded-full"
                        height={42}
                        width={42}
                      />
                    )}
                  </div>
                  <FormControl>
                    <Input
                      placeholder="User Image"
                      type="hidden"
                      disabled={status == "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={status == "executing"}
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* New Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={status == "executing"}
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Two Factor Authentication Switch Field */}
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account
                  </FormDescription>
                  <FormControl>
                    <Switch disabled={status === "executing"} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FORM ERROR || SUCCESS */}
            <FormError message={error} />
            <FormSuccess message={success} />
            {/* Submit Button */}
            <Button type="submit" className="w-full my-2">
              {status === "executing" && avatarUploading ? (
                <>
                  <Loader2 className="animate-spin size-3.5" /> Updating
                  profile..
                </>
              ) : (
                "Update"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p>Card footer</p>
      </CardFooter>
    </Card>
  );
}
