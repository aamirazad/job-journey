import { USER_ROLES } from "@/schemas";
import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  pgEnum,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

// Create the PostgreSQL enum type
export const userRoleEnum = pgEnum("user_role", USER_ROLES);

export const applicationStatusEnum = pgEnum("application_status", [
  "APPLIED",
  "REJECTED",
  "ACCEPTED",
]);

export const postStatusEnum = pgEnum("post_status", [
  "UNREVIEWED",
  "ACCEPTED",
  "DELETED",
]);

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `japp_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role").default("STUDENT").notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const posts = createTable("posts", {
  // Internal
  postId: serial("post_id").notNull().primaryKey(),

  // Metrics
  dateCreated: timestamp("dateCreated", {
    mode: "date",
    withTimezone: true,
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  status: postStatusEnum("status").notNull().default("UNREVIEWED"),
  // Relations
  ownerId: varchar("owner_id", { length: 255 })
    .notNull()
    .references(() => users.id),

  // Basic job information
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),

  // Job details
  employmentType: varchar("employment_type", { length: 50 }).notNull(),
  workplaceType: varchar("workplace_type", { length: 50 }), // Remote, Hybrid, On-site
  experienceLevel: varchar("experience_level", { length: 50 }), // Entry, Mid, Senior
  pay: varchar("pay", { length: 255 }),

  // Job description and requirements
  description: text("description").notNull(),
  requirements: text("requirements"),
  responsibilities: text("responsibilities"),
  benefits: text("benefits"),
});

export type JobPost = typeof posts.$inferSelect;

export const postsRelations = relations(posts, ({ one, many }) => ({
  owner: one(users, {
    fields: [posts.ownerId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const applications = createTable("applications", {
  id: serial("id").notNull().primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.postId, { onDelete: "cascade" }),

  // Personal Information
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 50 }).notNull(),

  // User and Application Tracking
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Document References
  resumeId: varchar("resume_id", { length: 255 }),
  coverLetterId: varchar("cover_letter_id", { length: 255 }),

  // Application Status Tracking
  status: applicationStatusEnum("status").default("APPLIED").notNull(),

  // Timestamps
  dateApplied: timestamp("date_applied", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),

  dateUpdated: timestamp("date_updated", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),

  // Additional application metadata
  isWithdrawn: boolean("is_withdrawn").default(false).notNull(),
});

export const applicationsRelations = relations(applications, ({ one }) => ({
  post: one(posts, {
    fields: [applications.postId],
    references: [posts.postId],
  }),
  owner: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
}));
