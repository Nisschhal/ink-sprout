"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";

// DropDown imports
import { MoreHorizontal, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAction } from "next-safe-action/hooks";
import { deleteProduct } from "@/server/actions/delete-product";
import { toast } from "sonner";
import Link from "next/link";
import { VariantsWithImagesTags } from "@/lib/infer-type";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProductVariant from "./product-variant";

export type ProductColumns = {
  id: number;
  title: string;
  image: string;
  price: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants: VariantsWithImagesTags[];
};

// Action cell Component to use with useAction

const ActionCell = ({ row }: { row: Row<ProductColumns> }) => {
  // delete the product row
  const { execute } = useAction(deleteProduct, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data.success);
      }
    },
    onExecute: () => {
      toast.info("Product deleting...", { duration: 2000 });
    },
  });

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
          <Link href={`/dashboard/add-product?id=${product.id}`}>
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
          onClick={() => execute({ id: product.id })}
        >
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
    cell: ({ row }) => {
      const variants = row.getValue("variants") as VariantsWithImagesTags[];
      return (
        <div className="flex gap-1 ">
          {variants.map((variant) => (
            <div key={variant.id} className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ProductVariant
                      editMode
                      productId={variant.productId}
                      variant={variant}
                    >
                      <div
                        className="rounded-full w-4 h-4"
                        key={variant.id}
                        style={{ backgroundColor: variant.color }}
                      />
                    </ProductVariant>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to library</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ProductVariant editMode={false} productId={row.original.id}>
                  <PlusCircle className="text-primary h-4 w-4" />
                </ProductVariant>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
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
          priority
          className="rounded-md"
        />
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ActionCell,
  },
];
