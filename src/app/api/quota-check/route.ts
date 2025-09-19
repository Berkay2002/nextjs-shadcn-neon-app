import { NextRequest } from 'next/server';
import { withAuthApi, getUserIP, getUserAgent } from '@/lib/auth/integration';
import { checkGenerationQuota, logAction, GenerationType } from '@/lib/db/helpers';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await withAuthApi(request);
    
    // If withAuthApi returned a Response (error), return it
    if (user instanceof Response) {
      return user;
    }

    // Parse request body
    const body = await request.json();
    const { generationType } = body;

    // Validate generation type
    if (!generationType || !['IMAGE', 'VIDEO', 'MUSIC'].includes(generationType)) {
      return Response.json(
        { 
          success: false, 
          error: 'Invalid generation type. Must be IMAGE, VIDEO, or MUSIC' 
        },
        { status: 400 }
      );
    }

    // Check quota
    const quotaCheck = await checkGenerationQuota(user.id, generationType as GenerationType);

    // Log the action
    await logAction(
      user.id,
      'CHECK_QUOTA',
      `Quota check for ${generationType}`,
      quotaCheck.canGenerate ? 'SUCCESS' : 'QUOTA_EXCEEDED',
      await getUserIP(),
      await getUserAgent()
    );

    return Response.json({
      success: true,
      data: {
        canGenerate: quotaCheck.canGenerate,
        reason: quotaCheck.reason,
        quota: quotaCheck.quota ? {
          dailyUsed: quotaCheck.quota.dailyUsed,
          dailyLimit: quotaCheck.quota.dailyLimit,
          monthlyUsed: quotaCheck.quota.monthlyUsed,
          monthlyLimit: quotaCheck.quota.monthlyLimit,
          generationType: quotaCheck.quota.generationType
        } : null
      }
    });

  } catch (error) {
    console.error('Error in quota-check API:', error);

    // Log the failed action
    try {
      await logAction(
        null,
        'CHECK_QUOTA',
        'Failed to check generation quota',
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