// Step 1: Import necessary types from Drizzle ORM
import type {
  BuildQueryResult, // Used to build the final type for query results.
  DBQueryConfig, // Describes the query configuration, including relationships and options.
  ExtractTablesWithRelations, // Extracts table schemas and their relationships.
} from "drizzle-orm";

// Step 2: Import the schema containing table definitions
import * as schema from "@/server/schema"; // Assume schema defines tables like products, productVariants, etc.

// Step 3: Create a type representing the schema
type Schema = typeof schema; // Gets the type of the imported schema (e.g., all tables and relations).
type TSchema = ExtractTablesWithRelations<Schema>; // Extracts relationships and structures from the schema.

// Step 4: Define a utility type to specify relations to include in queries
export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many", // Specifies if the relation is "one-to-one" or "one-to-many."
  boolean, // Specifies whether the relation is required.
  TSchema, // The schema that includes all tables and relationships.
  TSchema[TableName] // The specific table for which relations are being defined.
>["with"]; // The "with" property defines the included relations for the query.

// Step 5: Define a utility type to infer query result types
export type InferResultType<
  TableName extends keyof TSchema, // The table being queried.
  With extends IncludeRelation<TableName> | undefined = undefined // Relations to include (default: none).
> = BuildQueryResult<
  TSchema, // The full schema.
  TSchema[TableName], // The table being queried.
  {
    with: With; // The relations to include in the query result.
  }
>; // Produces the final type for query results based on the schema and included relations.

// Step 6: Define specific query types for tables and their relations

// Example: Query productVariants with its related variantImages and variantTags
export type VariantsWithImagesTags = InferResultType<
  "productVariants", // Table being queried: productVariants
  { variantImages: true; variantTags: true } // Relations to include: variantImages and variantTags
>;

// Example: Query products with its related productVariants
export type ProductsWithVariants = InferResultType<
  "products", // Table being queried: products
  { productVariants: true } // Relation to include: productVariants
>;

// Example: Query productVariants with related variantImages, variantTags, and product
export type VariantsWithProduct = InferResultType<
  "productVariants", // Table being queried: productVariants
  {
    variantImages: true; // Relation to include: variantImages
    variantTags: true; // Relation to include: variantTags
    product: true; // Relation to include: product
  }
>;

// // Example: Query reviews with related user data
// export type ReviewsWithUser = InferResultType<
//   "reviews", // Table being queried: reviews
//   { user: true } // Relation to include: user
// >;

// // Example: Query orderProduct with nested relations
// export type TotalOrders = InferResultType<
//   "orderProduct", // Table being queried: orderProduct
//   {
//     order: {
//       // Relation to include: order
//       with: { user: true }; // Include nested relation: user within order
//     };
//     product: true; // Relation to include: product
//     productVariants: {
//       // Relation to include: productVariants
//       with: { variantImages: true }; // Include nested relation: variantImages within productVariants
//     };
//   }
// >;
