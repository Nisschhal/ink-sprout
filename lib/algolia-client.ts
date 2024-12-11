import { algoliasearch } from "algoliasearch";

export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH!
);

// Export the algolio searchClient by setting up the required keys
