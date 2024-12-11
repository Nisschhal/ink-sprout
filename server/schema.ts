// Importing necessary modules from the drizzle ORM and core package for database interaction
import { relations } from "drizzle-orm"; // For defining relationships between tables
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  pgEnum,
  serial,
  real,
  index,
} from "drizzle-orm/pg-core"; // Types for table fields
import type { AdapterAccountType } from "next-auth/adapters"; // Type for account adapter in authentication

// Defining an Enum for user roles (user, admin)
export const RoleEnum = pgEnum("roles", ["user", "admin"]);

// USER MODEL: Represents users in the system
export const users = pgTable("user", {
  // Unique identifier for the user, generated using crypto.randomUUID
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"), // User's name
  password: text("password"), // User's password
  email: text("email").unique(), // Unique email for the user
  emailVerified: timestamp("emailVerified", { mode: "date" }), // Timestamp when the user's email was verified
  image: text("image"), // URL for user's profile image
  twoFactorEnabled: boolean("twoFactorEnabled").default(false), // Boolean to check if 2FA is enabled
  role: RoleEnum("roles").default("user"), // User's role (user or admin)
  customerId: text("customerId"), // Customer ID associated with an external service
});

// Relation between user and reviews/orders (one-to-many relationship)
export const userRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, { relationName: "user_reviews" }), // A user can have many reviews
  orders: many(orders, { relationName: "user_orders" }), // A user can place many orders
}));

// ACCOUNT MODEL: Represents authentication accounts (e.g., Google, GitHub) for a user
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // User reference, if user is deleted, the account is also deleted
    type: text("type").$type<AdapterAccountType>().notNull(), // Type of account (e.g., Google, GitHub)
    provider: text("provider").notNull(), // Provider of the account (Google, GitHub)
    providerAccountId: text("providerAccountId").notNull(), // Account ID from the provider
    refresh_token: text("refresh_token"), // Token used to refresh the session
    access_token: text("access_token"), // Access token for the session
    expires_at: integer("expires_at"), // Expiry timestamp of the access token
    token_type: text("token_type"), // Type of token (e.g., Bearer)
    scope: text("scope"), // Access scope of the token
    id_token: text("id_token"), // ID token provided by the provider
    session_state: text("session_state"), // Session state for tracking session status
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId], // Compound key for account provider and account ID
    }),
  })
);

// EMAIL TOKEN VERIFICATION MODEL: Used for verifying email address
export const emailTokens = pgTable(
  "email_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()), // Unique ID for the token
    token: text("token").notNull(), // Verification token
    expires: timestamp("expires", { mode: "date" }).notNull(), // Token expiration timestamp
    email: text("email").notNull(), // Email associated with the token
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token], // Composite primary key for the token ID and value
    }),
  })
);

// PASSWORD RESET TOKEN MODEL: Used for password reset functionality
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()), // Unique ID for the reset token
    token: text("token").notNull(), // Password reset token
    expires: timestamp("expires", { mode: "date" }).notNull(), // Expiration timestamp
    email: text("email").notNull(), // Email of the user requesting the reset
  },
  (resetToken) => ({
    compositePk: primaryKey({
      columns: [resetToken.id, resetToken.token], // Composite primary key for token ID and token itself
    }),
  })
);

// TWO FACTOR ON TOKEN MODEL: Stores tokens for 2FA verification
export const twoFactorTokens = pgTable(
  "two_factor_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()), // Unique ID for the token
    token: text("token").notNull(), // 2FA token
    expires: timestamp("expires", { mode: "date" }).notNull(), // Token expiration timestamp
    email: text("email").notNull(), // Email associated with the token
  },
  (twoFactorTokens) => ({
    compositePk: primaryKey({
      columns: [twoFactorTokens.id, twoFactorTokens.token], // Composite primary key for token ID and token itself
    }),
  })
);

// PRODUCT MODEL: Represents a product available in the store
export const products = pgTable("products", {
  id: serial("id").primaryKey(), // Unique identifier for the product
  description: text("description").notNull(), // Product description
  title: text("title").notNull(), // Product title
  created: timestamp("created").defaultNow(), // Timestamp when the product was created
  price: real("price").notNull(), // Product price
});

// PRODUCT VARIANTS MODEL: Represents different variations of a product (e.g., color, size)
export const productVariants = pgTable("productVariants", {
  id: serial("id").primaryKey(), // Unique identifier for the variant
  color: text("color").notNull(), // Color of the variant
  productType: text("productType").notNull(), // Type of product variant (e.g., size, style)
  updated: timestamp("updated").defaultNow(), // Timestamp when the variant was last updated
  productId: serial("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }), // References the product this variant belongs to
});

// Variant Images Model: Stores images associated with a product variant
export const variantImages = pgTable("variantImages", {
  id: serial("id").primaryKey(), // Unique identifier for the image
  url: text("url").notNull(), // Image URL
  size: real("size").notNull(), // Image size
  name: text("name").notNull(), // Image file name
  order: real("order").notNull(), // Order in which the image should be displayed
  variantId: serial("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }), // References the variant this image belongs to
});

// Variant Tags Model: Stores tags associated with a product variant
export const variantTags = pgTable("variantTags", {
  id: serial("id").primaryKey(), // Unique identifier for the tag
  tag: text("tag").notNull(), // Tag associated with the variant
  variantId: serial("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }), // References the variant the tag belongs to
});

// PRODUCTS RELATION to reviews and variants (one-to-many relation)
export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: "productVariants" }), // One product has many variants
  reviews: many(reviews, { relationName: "reviews" }), // One product has many reviews
}));

// PRODUCT VARIANTS RELATION to product and variant images/tags (one-to-one and one-to-many relations)
export const productVariantsRelations = relations(
  productVariants,
  ({ many, one }) => ({
    products: one(products, {
      relationName: "productVariants", // One product variant corresponds to one product
      fields: [productVariants.productId],
      references: [products.id],
    }),
    variantImages: many(variantImages, { relationName: "variantImages" }), // One variant can have many images
    variantTags: many(variantTags, { relationName: "variantTags" }), // One variant can have many tags
  })
);

// Variant Images Relation to productVariant (one-to-one relation)
export const variantImageRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariants, {
    relationName: "variantImages",
    fields: [variantImages.variantId],
    references: [productVariants.id],
  }),
}));

// Variant Tags Relation to productVariant (one-to-one relation)
export const variantTagsRelation = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariants, {
    relationName: "variantTags",
    fields: [variantTags.variantId],
    references: [productVariants.id],
  }),
}));

// REVIEW MODEL: Represents a review for a product
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(), // Unique identifier for the review
    rating: real("rating").notNull(), // Rating value (e.g., 1-5 stars)
    comment: text("comment").notNull(), // Review comment
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Reference to the user who left the review
    productId: serial("productId")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }), // Reference to the product being reviewed
    created: timestamp("created").defaultNow(), // Timestamp when the review was created
  },
  (table) => {
    return {
      productIdx: index("productIdx").on(table.productId), // Index for productId
      userIdx: index("userIdx").on(table.userId), // Index for userId
    };
  }
);

// Review Relation to User and Product
export const reviewRelations = relations(reviews, ({ one }) => ({
  users: one(users, {
    fields: [reviews.userId],
    references: [users.id],
    relationName: "user_reviews", // Relation between review and user
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
    relationName: "reviews", // Relation between review and product
  }),
}));

// ORDER MODEL: Represents an order placed by a user

//------------- MODEL Order
export const orders = pgTable("order", {
  id: serial("id").primaryKey(), // Generates a unique id for each order, set as the primary key.
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Links the order to a specific user by referencing their id. Ensures that if the user is deleted, all related orders are also deleted (cascade).
  total: real("total").notNull(), // Represents the total amount of the order, marked as not nullable to ensure every order has a total amount.
  status: text("status").notNull(), // Indicates the status of the order (e.g., "pending", "completed"), ensuring that every order has a valid status.
  created: timestamp("created").defaultNow(), // Automatically stores the timestamp when the order is created, defaulting to the current date and time.
  receiptURL: text("receiptURL"), // Stores an optional URL for the order's receipt.
  paymentIntentId: text("paymentIntentId"), // Holds the unique ID related to the payment intent (used by services like Stripe to track payments).
});

//Relation with User and orderProduct
export const ordersRelations = relations(orders, ({ one, many }) => ({
  users: one(users, {
    fields: [orders.userId],
    references: [users.id],
    relationName: "user_orders", // Creates a one-to-one relationship with the users table, ensuring that each order is linked to a single user.
  }),
  orderProduct: many(orderProduct, {
    relationName: "orderProduct", // Creates a one-to-many relationship with the orderProduct table, allowing multiple products per order.
  }),
}));

// -------- MODEL OrderProduct
// get the product, and productVariant based on their id
export const orderProduct = pgTable("orderProduct", {
  id: serial("id").primaryKey(), // Generates a unique id for each order-product entry, set as the primary key.
  quantity: integer("quantity").notNull(), // Represents the quantity of the product ordered, marked as not nullable to ensure each entry specifies a quantity.
  productVariantId: serial("productVariantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }), // Links to the specific product variant ordered. Cascade delete ensures the entry is removed if the product variant is deleted.
  orderId: serial("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }), // References the order that the product belongs to. Cascade delete ensures the entry is removed if the order is deleted.
  productId: serial("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }), // References the product associated with the order-product entry. Cascade delete ensures the entry is removed if the product is deleted.
});

// OrderProduct Relation to order, products, and productVariant
export const OrderProductRelations = relations(orderProduct, ({ one }) => ({
  orders: one(orders, {
    fields: [orderProduct.orderId],
    references: [orders.id],
    relationName: "orderProduct", // Creates a one-to-one relationship with the orders table, linking each order-product entry to a specific order.
  }),
  products: one(products, {
    fields: [orderProduct.productId],
    references: [products.id],
    relationName: "products", // Creates a one-to-one relationship with the products table, linking each order-product entry to a specific product.
  }),
  productVariants: one(productVariants, {
    fields: [orderProduct.productVariantId],
    references: [productVariants.id],
    relationName: "productVariants", // Creates a one-to-one relationship with the productVariants table, linking each order-product entry to a specific product variant.
  }),
}));

// ---------------------
