import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users, posts } from '@/lib/db/schema';

// User types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Post types
export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}