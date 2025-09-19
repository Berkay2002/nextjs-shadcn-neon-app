import { db } from './index';
import { users, generations, quotas, userUsage, auditLogs } from './schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import type { UserUsage as UserUsageType } from '@/types/generation';

export interface CreateGenerationParams {
  userId: string;
  type: 'IMAGE' | 'VIDEO' | 'MUSIC';
  prompt: string;
  status: 'SUCCESS' | 'FAILED';
  outputUri?: string;
  error?: string;
  cost?: number;
}

export interface QuotaCheck {
  canGenerate: boolean;
  dailyRemaining: number;
  monthlyRemaining: number;
  message?: string;
}

export interface QuotaDetails {
  dailyLimit: number;
  dailyUsed: number;
  monthlyLimit: number;
  monthlyUsed: number;
}

// User operations
export async function createUser(email: string, name?: string) {
  const [user] = await db.insert(users).values({
    email,
    name,
  }).returning();

  // Create default quotas for new user (free tier)
  await Promise.all([
    db.insert(quotas).values({
      userId: user.id,
      generationType: 'IMAGE',
      dailyLimit: 5,
      monthlyLimit: 25,
    }),
    db.insert(quotas).values({
      userId: user.id,
      generationType: 'VIDEO',
      dailyLimit: 0, // Free tier: no video
      monthlyLimit: 0,
    }),
    db.insert(quotas).values({
      userId: user.id,
      generationType: 'MUSIC',
      dailyLimit: 0, // Free tier: no music
      monthlyLimit: 0,
    }),
  ]);

  return user;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

// Quota operations
export async function checkUserQuota(
  userId: string,
  type: 'IMAGE' | 'VIDEO' | 'MUSIC'
): Promise<QuotaCheck> {
  const [quota] = await db.select().from(quotas).where(
    and(
      eq(quotas.userId, userId),
      eq(quotas.generationType, type)
    )
  );

  if (!quota) {
    return {
      canGenerate: false,
      dailyRemaining: 0,
      monthlyRemaining: 0,
      message: 'No quota found for user'
    };
  }

  // Check if we need to reset daily quota
  const now = new Date();
  const lastReset = new Date(quota.lastReset);
  const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceReset >= 1) {
    // Reset daily usage
    await db.update(quotas)
      .set({
        dailyUsed: 0,
        lastReset: now,
      })
      .where(eq(quotas.id, quota.id));
    quota.dailyUsed = 0;
  }

  // Check if we need to reset monthly quota (assuming 30-day cycle)
  if (daysSinceReset >= 30) {
    await db.update(quotas)
      .set({
        monthlyUsed: 0,
      })
      .where(eq(quotas.id, quota.id));
    quota.monthlyUsed = 0;
  }

  const dailyRemaining = quota.dailyLimit - quota.dailyUsed;
  const monthlyRemaining = quota.monthlyLimit - quota.monthlyUsed;

  const canGenerate = dailyRemaining > 0 && monthlyRemaining > 0;

  return {
    canGenerate,
    dailyRemaining,
    monthlyRemaining,
    message: !canGenerate ?
      dailyRemaining <= 0 ? 'Daily limit reached' : 'Monthly limit reached'
      : undefined
  };
}

export async function incrementQuotaUsage(userId: string, type: 'IMAGE' | 'VIDEO' | 'MUSIC') {
  await db.update(quotas)
    .set({
      dailyUsed: sql`${quotas.dailyUsed} + 1`,
      monthlyUsed: sql`${quotas.monthlyUsed} + 1`,
    })
    .where(
      and(
        eq(quotas.userId, userId),
        eq(quotas.generationType, type)
      )
    );
}

export async function upgradeUserToPaid(userId: string) {
  // Update quotas to paid tier limits
  await Promise.all([
    db.update(quotas)
      .set({
        dailyLimit: 50,
        monthlyLimit: 1000,
      })
      .where(
        and(
          eq(quotas.userId, userId),
          eq(quotas.generationType, 'IMAGE')
        )
      ),
    db.update(quotas)
      .set({
        dailyLimit: 10,
        monthlyLimit: 100,
      })
      .where(
        and(
          eq(quotas.userId, userId),
          eq(quotas.generationType, 'VIDEO')
        )
      ),
    db.update(quotas)
      .set({
        dailyLimit: 20,
        monthlyLimit: 200,
      })
      .where(
        and(
          eq(quotas.userId, userId),
          eq(quotas.generationType, 'MUSIC')
        )
      ),
  ]);
}

// Generation operations
export async function createGeneration(params: CreateGenerationParams) {
  const [generation] = await db.insert(generations).values(params).returning();

  // Update user usage tracking
  await db.insert(userUsage).values({
    userId: params.userId,
    type: params.type,
    count: 1,
    lastUsed: new Date(),
  }).onConflictDoUpdate({
    target: [userUsage.userId, userUsage.type],
    set: {
      count: sql`${userUsage.count} + 1`,
      lastUsed: new Date(),
    },
  });

  // Increment quota usage only if generation was successful
  if (params.status === 'SUCCESS') {
    await incrementQuotaUsage(params.userId, params.type);
  }

  return generation;
}

export async function getGenerationById(id: string) {
  const [generation] = await db.select().from(generations).where(eq(generations.id, id));
  return generation;
}

export async function getUserGenerations(userId: string, limit = 20) {
  return await db.select()
    .from(generations)
    .where(eq(generations.userId, userId))
    .orderBy(sql`${generations.createdAt} DESC`)
    .limit(limit);
}

export async function getUserUsageStats(userId: string): Promise<UserUsageType> {
  const usageData = await db.select()
    .from(userUsage)
    .where(eq(userUsage.userId, userId));

  const totalGenerations = usageData.reduce((sum, usage) => sum + usage.count, 0);
  const imagesGenerated = usageData.find(u => u.type === 'IMAGE')?.count || 0;
  const videosGenerated = usageData.find(u => u.type === 'VIDEO')?.count || 0;
  const musicGenerated = usageData.find(u => u.type === 'MUSIC')?.count || 0;

  // Calculate total cost from generations
  const costResult = await db.select({
    totalCost: sql<number>`COALESCE(SUM(${generations.cost}), 0)`
  })
  .from(generations)
  .where(eq(generations.userId, userId));

  const creditsUsed = costResult[0]?.totalCost || 0;

  return {
    totalGenerations,
    imagesGenerated,
    videosGenerated,
    musicGenerated,
    creditsUsed,
    creditsRemaining: Math.max(0, 100 - creditsUsed), // Assuming 100 credit limit
    lastResetDate: new Date(),
  };
}

// Audit log operations
export async function createAuditLog(
  userId: string | null,
  action: string,
  input: string,
  status: string,
  ip?: string,
  system?: string
) {
  await db.insert(auditLogs).values({
    userId,
    action,
    input,
    status,
    ip,
    system,
  });
}

// Analytics operations
export async function getDashboardStats(userId: string) {
  const [usageStats, quotaData] = await Promise.all([
    getUserUsageStats(userId),
    db.select().from(quotas).where(eq(quotas.userId, userId))
  ]);

  return {
    ...usageStats,
    quotas: quotaData.reduce((acc, quota) => {
      acc[quota.generationType.toLowerCase()] = {
        dailyLimit: quota.dailyLimit,
        dailyUsed: quota.dailyUsed,
        monthlyLimit: quota.monthlyLimit,
        monthlyUsed: quota.monthlyUsed,
      };
      return acc;
    }, {} as Record<string, QuotaDetails>)
  };
}

export async function getUsageHistory(userId: string, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await db.select({
    date: sql<string>`DATE(${generations.createdAt})`,
    type: generations.type,
    count: sql<number>`COUNT(*)`,
  })
  .from(generations)
  .where(
    and(
      eq(generations.userId, userId),
      gte(generations.createdAt, startDate),
      eq(generations.status, 'SUCCESS')
    )
  )
  .groupBy(sql`DATE(${generations.createdAt})`, generations.type)
  .orderBy(sql`DATE(${generations.createdAt}) DESC`);
}