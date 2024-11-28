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
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { settings } from "@/server/actions/settings";
import { UploadButton } from "@/app/api/uploadthing/uploadthing";
// make own type to avoid session props errors
type SettingForm = {
  session: Session;
};

export default function SettingCard({ session }: SettingForm) {
  console.log(session);
  // set time for success or error message component to render for 5 seconds
  const [showAlert, setShowAlert] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }, [showAlert]);
  // form from 'react-form-hook with type from SettingSchema
  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: session.user?.name || undefined,
      email: session.user?.email || undefined,
      image: session.user.image || undefined,
      isTwoFactorEnabled: session.user?.isTwoFactorEnabled || undefined,
    },
  });

  const [avatarUploading, setAvatarUploading] = useState<boolean>(false);
  // Form error or success message
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  // action via useAction next-safe-action
  const { execute, status } = useAction(settings, {
    onSuccess(data) {
      setShowAlert(true);

      if (data.data?.success) {
        setSuccess("Setting updated Successfully!");
      }

      if (data.data?.error) {
        setError(data.data.error);
      }
    },
    onError() {
      setError("Something went wrong while setting action");
    },
  });
  // Form submit handler
  function onSubmit(values: z.infer<typeof SettingSchema>) {
    execute(values);
    console.log(values);
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
                    {/* // IF NO IMAGE THEN SHOW CHARACTER */}
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {typeof form.getValues("image") == "string" && (
                      <Image
                        src={form.getValues("image")!}
                        width={42}
                        height={42}
                        className="rounded-full"
                        alt="User Image"
                        {...field}
                      />
                    )}

                    {/* UPLOAD THING  */}
                    <UploadButton
                      className="scale-75 ut-button:bg-primary/75 hover:ut-button:bg-primary/100 ut-button:transition-all ut-button:duration-500 ut-label:hidden ut-allowed-content:hidden"
                      endpoint={"avatarUploader"}
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
                        form.setValue("image", res[0].url);
                        setAvatarUploading(false);
                      }}
                      content={{
                        button({ ready }) {
                          if (ready) return <div>Change Avatar </div>;
                          return <div> Uploading... </div>;
                        },
                      }}
                      {...field}
                    />
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
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={status === "executing" || session.user.isOAuth}
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
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
                      disabled={status === "executing" || session.user.isOAuth}
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
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={status === "executing" || session.user.isOAuth}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* FORM ERROR || SUCCESS */}
            {showAlert && <FormError message={error} />}
            {showAlert && <FormSuccess message={success} />}
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={status == "executing" || (avatarUploading as boolean)}
              className="w-full my-2"
            >
              {status == "executing" || avatarUploading ? (
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
