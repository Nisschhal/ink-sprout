"use client"; // Enables React's client-side rendering for this component.

import { InstantSearchNext } from "react-instantsearch-nextjs"; // Provides Algolia's Next.js integration.
import { Hits, SearchBox } from "react-instantsearch"; // Components for search box and displaying results.
import { searchClient } from "@/lib/algolia-client"; // The configured Algolia search client instance.
import Link from "next/link"; // For client-side navigation.
import Image from "next/image"; // Optimized image handling in Next.js.
import { Card } from "../ui/card"; // Custom styled card component.
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function AlgoliaSearch() {
  // Search Bar Active State
  const [active, setActive] = useState(false);
  // Create Memo motionCart
  const MotionCard = useMemo(() => motion(Card), []);
  return (
    <InstantSearchNext
      // According to docs, if any error when loading into another page or unmounted
      future={{
        persistHierarchicalRootCount: true,
        preserveSharedStateOnUnmount: true,
      }}
      indexName="products"
      searchClient={searchClient}
    >
      {/* Search Box */}
      <div className="relative">
        <SearchBox
          // When search bar is focused
          onFocus={() => setActive(true)}
          //  when search bar is not focused
          onBlur={() => setActive(false)}
          placeholder="search product..." // Placeholder text in the search box.
          classNames={{
            input:
              "flex inline h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            submitIcon: "hidden", // Hides the submit icon.
            form: "bg-blue-500 h-10 rounded-md", // Styles the form container.
            resetIcon: "hidden", // Hides the reset icon.
          }}
        />
        {/* Card to contain the search results when active is true */}
        <AnimatePresence>
          {active && (
            <MotionCard
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute w-full mt-2  max-h-96 overflow-y-auto "
            >
              <Hits hitComponent={Hit} className="rounded-md" />
              {/* Renders search results */}
            </MotionCard>
          )}
        </AnimatePresence>
      </div>
    </InstantSearchNext>
  );
}

function Hit({
  hit,
}: {
  hit: {
    objectID: string; // Algolia's unique ID for the product.
    id: string; // Product's internal ID.
    price: number; // Product price.
    title: string; // Product title.
    productType: string; // Product category/type.
    variantImages: string; // Product image URL.

    _highlightResult: {
      // Object containing search match details for highlighting.
      title: {
        value: string; // Highlighted title with matched words wrapped in <em>.
        matchLevel: string; // Indicates if the query matched (`full`, `partial`, `none`).
        fullyHighlighted: boolean; // Indicates if the whole field is highlighted.
        matchedWords: string[]; // List of matched words.
      };
      productType: {
        value: string; // Highlighted product type with matched words.
        matchLevel: string; // Same as above.
        fullyHighlighted: boolean;
        matchedWords: string[];
      };
    };
  };
}) {
  return (
    <div className="p-2 mb-4 hover:bg-secondary">
      {/* Navigates to a product detail page with query parameters */}
      <Link
        href={`/product/${hit.objectID}?id=${hit.objectID}&productId=${hit.id}&price=${hit.price}&title=${hit.title}&type=${hit.productType}&image=${hit.variantImages}`}
      >
        <div className="flex w-full gap-12 items-center justify-between">
          {/* Displays the product image */}
          <Image
            src={hit.variantImages!} // Image URL (ensured not null with `!`).
            alt={hit.title} // Alt text for accessibility.
            height={60} // Image height.
            width={60} // Image width.
          />
          {/* Displays the product title with highlighted search matches */}
          <p
            dangerouslySetInnerHTML={{
              __html: hit._highlightResult.title.value, // Renders HTML for highlighting matched text.
            }}
          />
          {/* Displays the productType with highlighted search matches */}
          <p
            dangerouslySetInnerHTML={{
              __html: hit._highlightResult.productType.value, // Renders HTML for highlighting matched text.
            }}
          />
          <p className="font-medium">${hit.price}</p>
        </div>
      </Link>
    </div>
  );
}
