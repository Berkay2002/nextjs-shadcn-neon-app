import { NextRequest } from 'next/server';
import { withAuthApi, getUserIP, getUserAgent } from '@/lib/auth/integration';
import { recordGeneration, logAction, GenerationType, GenerationStatus } from '@/lib/db/helpers';

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
    const { 
      generationType, 
      prompt, 
      status, 
      outputUri, 
      error, 
      cost 
    } = body;

    // Validate required fields
    if (!generationType || !['IMAGE', 'VIDEO', 'MUSIC'].includes(generationType)) {
      return Response.json(
        { 
          success: false, 
          error: 'Invalid generation type. Must be IMAGE, VIDEO, or MUSIC' 
        },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== 'string') {
      return Response.json(
        { 
          success: false, 
          error: 'Prompt is required and must be a string' 
        },
        { status: 400 }
      );
    }

    if (!status || !['SUCCESS', 'FAILED'].includes(status)) {
      return Response.json(
        { 
          success: false, 
          error: 'Status is required and must be SUCCESS or FAILED' 
        },
        { status: 400 }
      );
    }

    // Record the generation
    const generation = await recordGeneration(
      user.id,
      generationType as GenerationType,
      prompt,
      status as GenerationStatus,
      outputUri,
      error,
      cost
    );

    // Log the action
    await logAction(
      user.id,
      'RECORD_GENERATION',
      `Recorded ${generationType} generation: ${status}`,
      'SUCCESS',
      await getUserIP(),
      await getUserAgent()
    );

    return Response.json({
      success: true,
      data: {
        id: generation.id,
        status: generation.status,
        createdAt: generation.createdAt
      }
    });

  } catch (error) {
    console.error('Error in record-generation API:', error);

    // Log the failed action
    try {
      await logAction(
        null,
        'RECORD_GENERATION',
        'Failed to record generation',
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