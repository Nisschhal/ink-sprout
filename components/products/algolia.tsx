"use client";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Hits, SearchBox } from "react-instantsearch";
import { searchClient } from "@/lib/algolia-client";
import Link from "next/link";
import Image from "next/image";
import { Card } from "../ui/card";

export default function AlgoliaSearch() {
  return (
    <InstantSearchNext indexName="products" searchClient={searchClient}>
      {/* Search Box */}
      <div className="relative">
        <SearchBox
          placeholder="search product..."
          classNames={{
            input:
              "flex inline h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            submitIcon: "hidden",
            form: "bg-blue-500 h-10 rounded-md",
            resetIcon: "hidden",
          }}
        />
        <Card>
          <Hits hitComponent={Hit} className="rounded-md" />
        </Card>
      </div>
    </InstantSearchNext>
  );
}

function Hit({
  hit,
}: {
  hit: {
    objectID: string;
    id: string;
    price: number;
    title: string;
    productType: string;
    variantImages: string;

    _highlightResult: {
      title: {
        value: string;
        matchLevel: string;
        fullyHighlighted: boolean;
        matchedWords: string[];
      };
      productType: {
        value: string;
        matchLevel: string;
        fullyHighlighted: boolean;
        matchedWords: string[];
      };
    };
  };
}) {
  if (
    hit._hightlightResult.title.matchLevel === "none" &&
    hit._hightlightResult.productType.matchLevel === "none"
  ) {
    return null;
  }
  return (
    <div>
      <Link
        href={`/product/${hit.objectId}?id=${hit.objectId}&productId=${hit.id}&price=${hit.price}&title=${hit.title}&type=${hit.productType}&image=${hit.variantImage}`}
      >
        <div>
          <Image
            src={hit.variantImage}
            alt={hit.title}
            height={100}
            width={100}
          />
        </div>
      </Link>
    </div>
  );
}
