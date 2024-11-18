"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";

// import theme hook from 'next-themes'

import { useTheme } from "next-themes";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";

export function UserButton({ user }: Session) {
  // redirect to pages
  const router = useRouter();

  // extract theme and setter function from hook
  const { setTheme, theme } = useTheme();
  // state to see if dark is on
  const [darkOn, setDarkOn] = useState(false);

  // function with switch to toogle between dark, light, or system
  function setSwitchState() {
    switch (theme) {
      case "dark": {
        return setDarkOn(true);
      }
      case "light": {
        return setDarkOn(false);
      }
      case "system": {
        return setDarkOn(false);
      }
    }
  }

  return (
    <div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage
              src={user?.image as string}
              alt={user?.name as string}
            />
            <AvatarFallback>
              <p className="font-bold">{user?.name?.charAt(0).toUpperCase()}</p>
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-6" align="end">
          <div className="mb-4 p-4 flex flex-col gap-1 items-center justify-center bg-primary/10 rounded-sm">
            {user?.image && (
              <Image
                src={user.image}
                width={36}
                height={36}
                className="rounded-full "
                alt="Profile pic"
              />
            )}
            <p className="font-bold text-sm">{user?.name}</p>
            <p className="font-medium text-xs text-secondary-foreground ">
              {user?.email}
            </p>
          </div>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/orders")}
            className="group py-2 cursor-pointer font-medium "
          >
            <TruckIcon
              size={14}
              className="mr-2 group-hover:translate-x-2 transition-all duration-200 ease-in-out"
            />
            My Orders
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="group py-2 cursor-pointer font-medium "
          >
            <Settings
              size={14}
              className="mr-2 group-hover:rotate-180 transition-all duration-200 ease-in-out"
            />
            Settings
          </DropdownMenuItem>
          {theme && (
            <DropdownMenuItem className="group py-2 cursor-pointer font-medium ">
              <div
                className="flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex mr-4">
                  <Sun
                    size={14}
                    className="absolute group-hover:text-yellow-600  group-hover:rotate-180 transition-all duration-200 ease-in-out dark:scale-0 dark:-rotate-90"
                  />
                  <Moon
                    size={14}
                    className="group-hover:text-blue-400 scale-0 dark:scale-100  transition-all duration-200 ease-in-out "
                  />
                </div>
                <p className="dark:text-blue-400 text-secondary-foreground/75  text-yellow-600 mr-3">
                  {theme[0].toUpperCase() + theme.slice(1)} Mode
                </p>
                <Switch
                  checked={darkOn}
                  onCheckedChange={(value) => {
                    setDarkOn((prev) => !prev);
                    // if checked set them to dark
                    if (value) setTheme("dark");
                    // if not then to light
                    if (!value) setTheme("light");
                  }}
                ></Switch>
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="group py-2 cursor-pointer focus:bg-destructive/20"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 group-hover:scale-75 transition-all duration-200" />{" "}
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
