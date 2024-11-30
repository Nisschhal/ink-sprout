"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

// DropDown imports
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ProductColumns = {
  id: number;
  title: string;
  image: string;
  price: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants: any;
};

export const columns: ColumnDef<ProductColumns>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "variants",
    header: "Variants",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-left font-medium ">{formatted}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <Image
          src={row.getValue("image")}
          alt={row.getValue("title")}
          width={64}
          height={64}
          className="rounded-md"
        />
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer"
              onClick={() => console.log(product)}
            >
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuItem className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer">
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
