import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  varchar, 
  uuid, 
  integer,
  real,
  pgEnum
} from 'drizzle-orm/pg-core';

// Enums
export const generationTypeEnum = pgEnum('generation_type', ['IMAGE', 'VIDEO', 'MUSIC']);
export const generationStatusEnum = pgEnum('generation_status', ['SUCCESS', 'FAILED']);

// Users table - now with UUID to match Stack Auth
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Quotas table for tracking user limits
export const quotas = pgTable('quotas', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  generationType: generationTypeEnum('generation_type').notNull(),
  dailyLimit: integer('daily_limit').notNull(), // Ex: 10 images/day
  monthlyLimit: integer('monthly_limit').notNull(), // Ex: 250 images/month
  dailyUsed: integer('daily_used').default(0).notNull(),
  monthlyUsed: integer('monthly_used').default(0).notNull(),
  lastReset: timestamp('last_reset').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Generations table for tracking all AI generation requests
export const generations = pgTable('generations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: generationTypeEnum('type').notNull(),
  prompt: text('prompt').notNull(),
  outputUri: varchar('output_uri', { length: 500 }),
  status: generationStatusEnum('status').notNull(),
  error: text('error'),
  cost: real('cost'), // Virtual USD or tokens
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User usage tracking table
export const userUsage = pgTable('user_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: generationTypeEnum('type').notNull(),
  count: integer('count').default(0).notNull(),
  lastUsed: timestamp('last_used').notNull(),
});

// Audit logs for security and debugging
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 255 }).notNull(),
  input: text('input').notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  ip: varchar('ip', { length: 45 }),
  system: varchar('system', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Keep posts table for compatibility (can be removed later)
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
