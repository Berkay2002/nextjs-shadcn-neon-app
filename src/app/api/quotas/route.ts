import { NextRequest } from 'next/server';
import { withAuthApi, getUserIP, getUserAgent } from '@/lib/auth/integration';
import { getUserQuotas, logAction } from '@/lib/db/helpers';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await withAuthApi(request);
    
    // If withAuthApi returned a Response (error), return it
    if (user instanceof Response) {
      return user;
    }

    // Get user quotas
    const quotas = await getUserQuotas(user.id);

    // Log the action
    await logAction(
      user.id,
      'GET_QUOTAS',
      'User requested quota information',
      'SUCCESS',
      await getUserIP(),
      await getUserAgent()
    );

    return Response.json({
      success: true,
      data: quotas
    });

  } catch (error) {
    console.error('Error in quotas API:', error);

    // Log the failed action
    try {
      await logAction(
        null,
        'GET_QUOTAS',
        'Failed to get user quotas',
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