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
    products: true; // Relation to include: product
  }
>;

// Example: Query reviews with related user data
export type ReviewsWithUser = InferResultType<
  "reviews", // Table being queried: reviews
  { users: true } // Relation to include: user
>;

// Example: Query orderProduct with nested relations
export type TotalOrders = InferResultType<
  "orderProduct", // Table being queried: orderProduct
  {
    orders: {
      // Relation to include: order
      with: { users: true }; // Include nested relation: user within order
    };
    products: true; // Relation to include: product
    productVariants: {
      // Relation to include: productVariants
      with: { variantImages: true }; // Include nested relation: variantImages within productVariants
    };
  }
>;

/**
 * // Algorithm for handling query result types with Drizzle ORM:

// 1. **Import Necessary Types:**
//    - Import types such as `BuildQueryResult`, `DBQueryConfig`, and `ExtractTablesWithRelations` from Drizzle ORM.
//    - These types help define how to construct queries, include relationships, and extract the schema's structure.

// 2. **Define Schema Type:**
//    - Import the schema that contains all the table definitions (e.g., `products`, `productVariants`, etc.) from `@/server/schema`.
//    - Create a `Schema` type that infers the schema structure from the imported schema object.
//    - Extract table structures and their relationships using `ExtractTablesWithRelations<Schema>` to create the `TSchema` type.
//    - This allows you to reference and query specific tables and relationships in the database.

// 3. **Define IncludeRelation Utility Type:**
//    - `IncludeRelation` is a utility type that helps define which relations to include in a query.
//    - It accepts:
      // - `TableName` (name of the table being queried).
      // - The relation type: `one` for one-to-one, `many` for one-to-many.
      // - A boolean to indicate whether the relation is required or optional.
      // - The full schema and the specific table to include the relations for.
    // - This allows you to specify which relations to fetch alongside the main query result, making queries more efficient by fetching related data in one go.

// 4. **Define InferResultType Utility Type:**
//    - `InferResultType` is used to infer the query result type based on the table being queried and the included relations.
//    - It accepts:
      // - `TableName`: The name of the table being queried.
      // - `With`: The relations to include in the query result (optional).
    // - The type will be generated based on the provided table and its relationships, including nested relations if specified.
//    - The final query result type is constructed based on the schema, the table being queried, and any included relations.


// 5. **Examples of Query Types:**

    // Example 1: **Variants with Images and Tags**
    // - Query `productVariants` with its related `variantImages` and `variantTags`.
    export type VariantsWithImagesTags = InferResultType<
      "productVariants",
      { variantImages: true; variantTags: true }
    >;

    // Example 2: **Products with Variants**
    // - Query `products` with its related `productVariants`.
    export type ProductsWithVariants = InferResultType<
      "products",
      { productVariants: true }
    >;

    // Example 3: **Variants with Images, Tags, and Product**
    // - Query `productVariants` with `variantImages`, `variantTags`, and `products`.
    export type VariantsWithProduct = InferResultType<
      "productVariants",
      {
        variantImages: true;
        variantTags: true;
        products: true;
      }
    >;

    // Example 4: **Reviews with User Information**
    // - Query `reviews` with its related `user` data.
    export type ReviewsWithUser = InferResultType<
      "reviews",
      { users: true }
    >;

    // Example 5: **OrderProduct with Nested Relations**
    // - Query `orderProduct` with nested relations:
      // - Orders with users.
      // - Products.
      // - ProductVariants with variantImages.
    export type TotalOrders = InferResultType<
      "orderProduct",
      {
        orders: { with: { users: true } };
        products: true;
        productVariants: { with: { variantImages: true } };
      }
    >;


 * 
 */
