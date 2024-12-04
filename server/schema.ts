import { relations } from "drizzle-orm";
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
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// roles enum
export const RoleEnum = pgEnum("roles", ["user", "admin"]);

// USER MODEL
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  password: text("password"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  role: RoleEnum("roles").default("user"),
});

// ------------ Relation User to Reviews
// User relation to review [one U - to - many R ]
export const userRelations = relations(users, ({ many }) => ({
  reviews: many(reviews, { relationName: "user_reviews" }),
}));

// ------------- Models Providers Account

// ACCOUNT MODEL [GOOGLE || GITHUB]
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

// ------------- Models Token for Email

// EMAIL TOKEN VERFICATION MODEL
export const emailTokens = pgTable(
  "email_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);

// PASSWORD RESET TOKEN MODEL
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (resetToken) => ({
    compositePk: primaryKey({
      columns: [resetToken.id, resetToken.token],
    }),
  })
);

// TWO FACTOR ON TOKEN MODEL
export const twoFactorTokens = pgTable(
  "two_factor_tokens",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (twoFactorTokens) => ({
    compositePk: primaryKey({
      columns: [twoFactorTokens.id, twoFactorTokens.token],
    }),
  })
);

// ------------------------- PRODUCT----------------------
// PRODUCT MODEL
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  title: text("title").notNull(),
  created: timestamp("created").defaultNow(),
  price: real("price").notNull(),
});

// PRODUCT VARIANTS

export const productVariants = pgTable("productVariants", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  updated: timestamp("updated").defaultNow(),
  productId: serial("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});

// Variant Images Model
export const variantImages = pgTable("variantImages", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: real("order").notNull(),
  variantId: serial("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

// Variant Tags Model
export const variantTags = pgTable("variantTags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantId: serial("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
});

// ------------- RELATIONS -----------------

// PRODUCTS RELATION to reviews && variants [one P - to - many V|R]
export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants, { relationName: "productVariants" }),
  reviews: many(reviews, { relationName: "reviews" }),
}));

// PRODUCT VARIANTS RELATION to  product && variantImages [one V - to - one P] && [one V - to - many vI]

// parent is productVariant
// child is product
export const productVariantsRelations = relations(
  productVariants,
  ({ many, one }) => ({
    products: one(products, {
      relationName: "productVariants",
      fields: [productVariants.productId], // child foreign key
      references: [products.id], // parent primary key
    }),
    variantImages: many(variantImages, {
      relationName: "variantImages",
    }),
    variantTags: many(variantTags, {
      relationName: "variantTags",
    }),
  })
);

// variantImages relation to variantProduct [one vI - to -  one pV]
export const variantImageRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariants, {
    relationName: "variantImages",
    fields: [variantImages.variantId],
    references: [productVariants.id],
  }),
}));

// variantTags relation to productVarint [one T - to - one pV]
export const variantTagsRelation = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariants, {
    relationName: "variantTags",
    fields: [variantTags.variantId],
    references: [productVariants.id],
  }),
}));

// ------------------------ Model & Relation ------------------
// Review
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    rating: real("rating").notNull(),
    comment: text("comment").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: serial("productId")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    created: timestamp("created").defaultNow(),
  },
  (table) => {
    return {
      productIdx: index("productIdx").on(table.productId),
      userIdx: index("userIdx").on(table.userId),
    };
  }
);

// Review Relation with user U [ one R - to - one U  ] and product P [one R - to - one P]
export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
    relationName: "user_reviews",
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
    relationName: "reviews",
  }),
}));
