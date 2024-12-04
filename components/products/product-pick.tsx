"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductPick({
  id,
  color,
  productType,
  title,
  price,
  productId,
  image,
}: {
  id: number;
  color: string;
  productType: string;
  title: string;
  price: number;
  productId: number;
  image: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("type") || productType;
  return (
    <div
      style={{ backgroundColor: color }}
      className={cn(
        "w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:opacity-75",
        selectedColor === productType ? "opacity-100" : "opacity-50"
      )}
      onClick={() =>
        // push to next page but without default scroll to top
        router.push(
          `/product/${id}?id=${id}&productId=${productId}&price=${price}&title=${title}&type=${productType}&image=${image}`,
          { scroll: false }
        )
      }
    ></div>
  );
}
