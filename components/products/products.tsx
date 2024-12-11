"use client";

import { VariantsWithProduct } from "@/lib/infer-type";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import formatPrice from "@/lib/format-price";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type ProductTypes = {
  variants: VariantsWithProduct[];
};

export default function Products({ variants }: ProductTypes) {
  const searchParams = useSearchParams();
  const paramTag = searchParams.get("tag");

  const filteredVariants = useMemo(() => {
    if (paramTag && variants) {
      // return/filter variants which matches the tag with paramTag
      return variants.filter((variant) =>
        variant.variantTags.some((t) => t.tag === paramTag)
      );
    }
    return variants;
  }, [paramTag, variants]);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3">
      {filteredVariants.map((variant) => (
        <Link
          className="py-2"
          href={`/product/${variant.id}?id=${variant.id}&productId=${variant.productId}&price=${variant.products.price}&title=${variant.products.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
          key={variant.id}
        >
          <Image
            src={variant.variantImages[0].url}
            alt={variant.products.title}
            className="rounded-md"
            width={720}
            height={480}
            loading="lazy"
          />
          <div className="flex justify-between">
            <div className="font-medium">
              <h2>{variant.products.title}</h2>
              <p className="text-sm text-muted-foreground">
                {variant.productType}
              </p>
            </div>

            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {formatPrice(variant.products.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
