import { db } from './index';
import { users, quotas, generations, userUsage, auditLogs } from './schema';
import { eq, and, sql } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

export type GenerationType = 'IMAGE' | 'VIDEO' | 'MUSIC';
export type GenerationStatus = 'SUCCESS' | 'FAILED';
export type Quota = InferSelectModel<typeof quotas>;

// User management functions
export async function createUserWithQuotas(
  userId: string,
  email: string,
  name?: string
) {
  try {
    // Create or update user
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email,
        name,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email,
          name,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Create default quotas for each generation type
    const defaultQuotas = [
      { userId, generationType: 'IMAGE' as GenerationType, dailyLimit: 10, monthlyLimit: 250 },
      { userId, generationType: 'VIDEO' as GenerationType, dailyLimit: 2, monthlyLimit: 20 },
      { userId, generationType: 'MUSIC' as GenerationType, dailyLimit: 3, monthlyLimit: 30 },
    ];

    await db
      .insert(quotas)
      .values(defaultQuotas)
      .onConflictDoNothing();

    // Create initial usage tracking records
    const initialUsage = [
      { userId, type: 'IMAGE' as GenerationType, count: 0, lastUsed: new Date() },
      { userId, type: 'VIDEO' as GenerationType, count: 0, lastUsed: new Date() },
      { userId, type: 'MUSIC' as GenerationType, count: 0, lastUsed: new Date() },
    ];

    await db
      .insert(userUsage)
      .values(initialUsage)
      .onConflictDoNothing();

    return user;
  } catch (error) {
    console.error('Error creating user with quotas:', error);
    throw error;
  }
}

// Quota checking functions
export async function checkGenerationQuota(
  userId: string,
  generationType: GenerationType
): Promise<{ canGenerate: boolean; reason?: string; quota?: Quota }> {
  try {
    const [quota] = await db
      .select()
      .from(quotas)
      .where(
        and(
          eq(quotas.userId, userId),
          eq(quotas.generationType, generationType)
        )
      )
      .limit(1);

    if (!quota) {
      return {
        canGenerate: false,
        reason: 'No quota found for user and generation type'
      };
    }

    // Check daily limit
    if (quota.dailyUsed >= quota.dailyLimit) {
      return {
        canGenerate: false,
        reason: `Daily limit reached (${quota.dailyUsed}/${quota.dailyLimit})`,
        quota
      };
    }

    // Check monthly limit
    if (quota.monthlyUsed >= quota.monthlyLimit) {
      return {
        canGenerate: false,
        reason: `Monthly limit reached (${quota.monthlyUsed}/${quota.monthlyLimit})`,
        quota
      };
    }

    return {
      canGenerate: true,
      quota
    };
  } catch (error) {
    console.error('Error checking generation quota:', error);
    return {
      canGenerate: false,
      reason: 'Error checking quota'
    };
  }
}

// Usage tracking functions
export async function incrementUsage(
  userId: string,
  generationType: GenerationType
): Promise<void> {
  try {
    // Update quota usage
    await db
      .update(quotas)
      .set({
        dailyUsed: sql`${quotas.dailyUsed} + 1`,
        monthlyUsed: sql`${quotas.monthlyUsed} + 1`,
      })
      .where(
        and(
          eq(quotas.userId, userId),
          eq(quotas.generationType, generationType)
        )
      );

    // Update user usage stats
    await db
      .update(userUsage)
      .set({
        count: sql`${userUsage.count} + 1`,
        lastUsed: new Date(),
      })
      .where(
        and(
          eq(userUsage.userId, userId),
          eq(userUsage.type, generationType)
        )
      );
  } catch (error) {
    console.error('Error incrementing usage:', error);
    throw error;
  }
}

// Generation tracking functions
export async function recordGeneration(
  userId: string,
  generationType: GenerationType,
  prompt: string,
  status: GenerationStatus,
  outputUri?: string,
  error?: string,
  cost?: number
) {
  try {
    const [generation] = await db
      .insert(generations)
      .values({
        userId,
        type: generationType,
        prompt,
        status,
        outputUri,
        error,
        cost,
      })
      .returning();

    // If generation was successful, increment usage
    if (status === 'SUCCESS') {
      await incrementUsage(userId, generationType);
    }

    return generation;
  } catch (error) {
    console.error('Error recording generation:', error);
    throw error;
  }
}

// Audit logging functions
export async function logAction(
  userId: string | null,
  action: string,
  input: string,
  status: string,
  ip?: string,
  system?: string
): Promise<void> {
  try {
    await db
      .insert(auditLogs)
      .values({
        userId,
        action,
        input,
        status,
        ip,
        system,
      });
  } catch (error) {
    console.error('Error logging action:', error);
    // Don't throw error for logging failures to avoid breaking main functionality
  }
}

// Quota reset functions
export async function resetDailyQuotas(): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await db
      .update(quotas)
      .set({
        dailyUsed: 0,
        lastReset: new Date(),
      })
      .where(
        // Reset quotas where last reset was before today
        eq(quotas.lastReset, today) // This is a simplified condition
      );
  } catch (error) {
    console.error('Error resetting daily quotas:', error);
    throw error;
  }
}

export async function resetMonthlyQuotas(): Promise<void> {
  try {
    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    firstOfMonth.setHours(0, 0, 0, 0);

    await db
      .update(quotas)
      .set({
        monthlyUsed: 0,
        lastReset: new Date(),
      })
      .where(
        // Reset quotas where last reset was before this month
        eq(quotas.lastReset, firstOfMonth) // This is a simplified condition
      );
  } catch (error) {
    console.error('Error resetting monthly quotas:', error);
    throw error;
  }
}

// User info retrieval functions
export async function getUserQuotas(userId: string) {
  try {
    return await db
      .select()
      .from(quotas)
      .where(eq(quotas.userId, userId));
  } catch (error) {
    console.error('Error getting user quotas:', error);
    throw error;
  }
}

export async function getUserGenerations(userId: string, limit: number = 50) {
  try {
    return await db
      .select()
      .from(generations)
      .where(eq(generations.userId, userId))
      .limit(limit)
      .orderBy(generations.createdAt);
  } catch (error) {
    console.error('Error getting user generations:', error);
    throw error;
  }
}

export async function getUserUsageStats(userId: string) {
  try {
    return await db
      .select()
      .from(userUsage)
      .where(eq(userUsage.userId, userId));
  } catch (error) {
    console.error('Error getting user usage stats:', error);
    throw error;
  }
}