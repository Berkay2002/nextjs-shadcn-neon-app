import { NextRequest } from 'next/server';
import { withAuthApi, getUserIP, getUserAgent } from '@/lib/auth/integration';
import { getUserGenerations, getUserUsageStats, logAction } from '@/lib/db/helpers';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await withAuthApi(request);
    
    // If withAuthApi returned a Response (error), return it
    if (user instanceof Response) {
      return user;
    }

    // Get URL parameters for pagination
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const maxLimit = Math.min(limit, 200); // Cap at 200 to prevent excessive queries

    // Get user data
    const [generations, usageStats] = await Promise.all([
      getUserGenerations(user.id, maxLimit),
      getUserUsageStats(user.id)
    ]);

    // Log the action
    await logAction(
      user.id,
      'GET_USER_STATS',
      `User requested stats and generations (limit: ${maxLimit})`,
      'SUCCESS',
      await getUserIP(),
      await getUserAgent()
    );

    return Response.json({
      success: true,
      data: {
        generations: generations.map(gen => ({
          id: gen.id,
          type: gen.type,
          prompt: gen.prompt.substring(0, 100) + (gen.prompt.length > 100 ? '...' : ''), // Truncate long prompts
          status: gen.status,
          outputUri: gen.outputUri,
          cost: gen.cost,
          createdAt: gen.createdAt
        })),
        usageStats: usageStats.map(stat => ({
          type: stat.type,
          count: stat.count,
          lastUsed: stat.lastUsed
        })),
        meta: {
          generationsCount: generations.length,
          requestedLimit: maxLimit,
          hasMore: generations.length === maxLimit
        }
      }
    });

  } catch (error) {
    console.error('Error in user-stats API:', error);

    // Log the failed action
    try {
      await logAction(
        null,
        'GET_USER_STATS',
        'Failed to get user stats',
        'ERROR',
        await getUserIP(),
        await getUserAgent()
      );
    } catch (logError) {
      console.error('Error logging failed action:', logError);
    }

    return Response.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}