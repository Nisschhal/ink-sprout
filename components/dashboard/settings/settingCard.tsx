"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { settings } from "@/server/actions/settings";
import { SettingSchema } from "@/types/settings-schema";
import { UploadButton } from "@/app/api/uploadthing/uploadthing";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";

type SettingsForm = {
  session: Session;
};

export default function SettingsCard(session: SettingsForm) {
  // set time for success or error message component to render for 5 seconds
  const [alertError, setAlertError] = useState<boolean>(false);
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setAlertError(false);
      setAlertSuccess(false);
    }, 5000);
  }, [alertError, alertSuccess]);

  // get the state for error || success || avataruploading
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [avatarUploading, setAvatarUploading] = useState(false);

  // VALIDATE THE FORM INPUT WITH SETTINGSCHEMA AND ADD DEFAULT VALUES FROM THE INCOMING PROPS SESSION  => {USER}
  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: session.session.user?.name || undefined,
      email: session.session.user?.email || undefined,
      image: session.session.user.image || undefined,
      isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || undefined,
    },
  });

  // EXECUTE THE SERVER ACTION USING USEACTION FROM THE 'next-safe-action'
  // you can use default action call as well but a lot of coding there
  const { execute, status } = useAction(settings, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setAlertSuccess(true);
        setSuccess(data.success);
      }
      if (data?.error) {
        setAlertError(true);
        setError(data.error);
      }
    },
    onError: (error) => {
      setError("Something went wrong");
    },
  });

  // when form is submitted
  const onSubmit = (values: z.infer<typeof SettingSchema>) => {
    execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        {/* // spread the useForm from 'react-form-hook' in the Shadcn Form */}
        <Form {...form}>
          {/* // next form to handle onsubmit function */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* NAME FIELD */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*  IMAGE FIELD */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {session.session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image
                        src={form.getValues("image")!}
                        width={42}
                        height={42}
                        className="rounded-full"
                        alt="User Image"
                      />
                    )}
                    <UploadButton
                      className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
                      endpoint="avatarUploader"
                      onUploadBegin={() => {
                        setAvatarUploading(true);
                      }}
                      onUploadError={(error) => {
                        form.setError("image", {
                          type: "validate",
                          message: error.message,
                        });
                        setAvatarUploading(false);
                        return;
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue("image", res[0].url!);
                        setAvatarUploading(false);
                        return;
                      }}
                      content={{
                        button({ ready }) {
                          if (ready) return <div>Change Avatar</div>;
                          return <div>Uploading...</div>;
                        },
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="User Image"
                      type="hidden"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PASSWORD FIELD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      disabled={
                        status === "executing" || session?.session.user.isOAuth
                      }
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NEW PASSWORD FIELD */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*******"
                      disabled={
                        status === "executing" || session?.session.user.isOAuth
                      }
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TWO FACTOR ON FIELD */}
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
                    <Switch
                      disabled={
                        status === "executing" ||
                        session.session.user.isOAuth === true
                      }
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ALER MESSAGE */}

            {/* FORM ERROR || SUCCESS */}
            {alertError && <FormError message={error} />}
            {alertSuccess && <FormSuccess message={success} />}

            {/* SUBMIT BUTTON FIELD */}
            <Button
              type="submit"
              disabled={status === "executing" || avatarUploading}
            >
              Update your settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
