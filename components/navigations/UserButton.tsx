"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  DollarSign,
  LogOut,
  Moon,
  Settings,
  SubscriptIcon,
  Sun,
  TruckIcon,
} from "lucide-react";
import { FaMoneyBill, FaMoneyCheck } from "react-icons/fa";

export function UserButton({ user }: Session) {
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
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group py-2 cursor-pointer font-medium ">
            <TruckIcon
              size={14}
              className="mr-2 group-hover:translate-x-2 transition-all duration-200"
            />
            My Orders
          </DropdownMenuItem>

          <DropdownMenuItem className="group py-2 cursor-pointer font-medium ">
            <Settings
              size={14}
              className="mr-2 group-hover:rotate-180 transition-all duration-200"
            />{" "}
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="group py-2 cursor-pointer font-medium ">
            <div className="flex items-center">
              <Sun size={14} />
              <Moon size={14} />
              Theme
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="group py-2 cursor-pointer focus:bg-destructive/20"
            onClick={() => signOut()}
          >
            <LogOut className="group-hover:scale-75 transition-all duration-200" />{" "}
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
