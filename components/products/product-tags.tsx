"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductTags() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");

  const setFilter = (tag: string) => {
    if (tag) {
      router.push(`?tag=${tag}`);
    }
    if (!tag) router.push("/");
  };
  return (
    <div className="flex gap-4 items-center justify-center pt-3">
      <Badge
        className={cn(
          "cursor-pointer bg-black hover:bg-black/75  hover:opacity-100 my-2",
          !tag ? "opacity-100" : "opacity-50"
        )}
        onClick={() => setFilter("")}
      >
        All
      </Badge>
      <Badge
        className={cn(
          "cursor-pointer  bg-blue-500 hover:bg-blue-600   hover:opacity-100 my-2",
          tag && tag === "blue" ? "opacity-100" : "opacity-50"
        )}
        onClick={() => setFilter("blue")}
      >
        Blue
      </Badge>
      <Badge
        className={cn(
          "cursor-pointer bg-green-500 hover:bg-green-600  hover:opacity-100 my-2",
          tag && tag === "green" ? "opacity-100" : "opacity-50"
        )}
        onClick={() => setFilter("green")}
      >
        Green
      </Badge>
      <Badge
        className={cn(
          "cursor-pointer bg-purple-500 hover:bg-purple-600   hover:opacity-100 my-2",
          tag && tag === "purple" ? "opacity-100" : "opacity-50"
        )}
        onClick={() => setFilter("purple")}
      >
        Purple
      </Badge>
    </div>
  );
}
