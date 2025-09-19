import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/integration';
import { geminiClient } from '@/lib/ai/gemini-client';
import { checkUserQuota, createGeneration, createAuditLog } from '@/lib/db/operations';
import { calculateImageCost, formatCost } from '@/lib/utils/cost-calculator';
import { imageGenerationSchema } from '@/lib/validations';
import type { ImageGenerationRequest, ImageGenerationResponse } from '@/types/generation';

const MAX_REQUESTS_PER_MINUTE = 5;
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRateLimit = requestCounts.get(userId);

  if (!userRateLimit || now > userRateLimit.resetTime) {
    requestCounts.set(userId, {
      count: 1,
      resetTime: now + 60000, // Reset after 1 minute
    });
    return true;
  }

  if (userRateLimit.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  userRateLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get user from Stack Auth
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      await createAuditLog(
        user.id,
        'IMAGE_GENERATION_RATE_LIMITED',
        'Rate limit exceeded',
        'BLOCKED',
        request.headers.get('x-forwarded-for') || 'unknown'
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait before making another request.'
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = imageGenerationSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      await createAuditLog(
        user.id,
        'IMAGE_GENERATION_VALIDATION_ERROR',
        JSON.stringify(body),
        'FAILED',
        request.headers.get('x-forwarded-for') || 'unknown'
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors
        },
        { status: 400 }
      );
    }

    const generationRequest: ImageGenerationRequest = validationResult.data;

    // Check user quota
    const quotaCheck = await checkUserQuota(user.id, 'IMAGE');
    if (!quotaCheck.canGenerate) {
      await createAuditLog(
        user.id,
        'IMAGE_GENERATION_QUOTA_EXCEEDED',
        JSON.stringify(generationRequest),
        'BLOCKED',
        request.headers.get('x-forwarded-for') || 'unknown'
      );

      return NextResponse.json(
        {
          success: false,
          error: quotaCheck.message || 'Generation quota exceeded',
          quotaInfo: {
            dailyRemaining: quotaCheck.dailyRemaining,
            monthlyRemaining: quotaCheck.monthlyRemaining,
          }
        },
        { status: 429 }
      );
    }

    // Calculate cost
    const costCalculation = calculateImageCost(generationRequest);

    try {
      // Generate image with Gemini
      const startTime = Date.now();
      const result = await geminiClient.generateImage(generationRequest);
      const processingTime = Date.now() - startTime;

      if (!result.success) {
        // Log failed generation
        await createGeneration({
          userId: user.id,
          type: 'IMAGE',
          prompt: generationRequest.prompt,
          status: 'FAILED',
          error: result.error,
          cost: 0, // No cost for failed generation
        });

        await createAuditLog(
          user.id,
          'IMAGE_GENERATION_FAILED',
          JSON.stringify(generationRequest),
          'FAILED',
          request.headers.get('x-forwarded-for') || 'unknown'
        );

        return NextResponse.json(
          {
            success: false,
            error: result.error || 'Image generation failed'
          },
          { status: 500 }
        );
      }

      // Save successful generation to database
      const generation = await createGeneration({
        userId: user.id,
        type: 'IMAGE',
        prompt: generationRequest.prompt,
        status: 'SUCCESS',
        outputUri: result.imageData || result.imageUrl,
        cost: costCalculation.estimatedCost,
      });

      await createAuditLog(
        user.id,
        'IMAGE_GENERATION_SUCCESS',
        JSON.stringify(generationRequest),
        'SUCCESS',
        request.headers.get('x-forwarded-for') || 'unknown'
      );

      const response: ImageGenerationResponse = {
        success: true,
        imageData: result.imageData,
        imageUrl: result.imageUrl,
        generationId: generation.id,
      };

      return NextResponse.json(response, {
        status: 200,
        headers: {
          'X-Processing-Time': processingTime.toString(),
          'X-Cost': formatCost(costCalculation.estimatedCost),
          'X-Quota-Remaining': `${quotaCheck.dailyRemaining - 1}`,
        },
      });

    } catch (error) {
      console.error('Image generation error:', error);

      // Log failed generation
      await createGeneration({
        userId: user.id,
        type: 'IMAGE',
        prompt: generationRequest.prompt,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
        cost: 0,
      });

      await createAuditLog(
        user.id,
        'IMAGE_GENERATION_ERROR',
        JSON.stringify(generationRequest),
        'FAILED',
        request.headers.get('x-forwarded-for') || 'unknown'
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Internal server error during image generation'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's quota information
    const quotaCheck = await checkUserQuota(user.id, 'IMAGE');
    const costInfo = calculateImageCost({ prompt: 'sample' });

    return NextResponse.json({
      success: true,
      data: {
        quota: {
          dailyRemaining: quotaCheck.dailyRemaining,
          monthlyRemaining: quotaCheck.monthlyRemaining,
          canGenerate: quotaCheck.canGenerate,
        },
        pricing: {
          baseCost: costInfo.estimatedCost,
          currency: costInfo.currency,
          formattedCost: formatCost(costInfo.estimatedCost),
        },
        limits: {
          maxPromptLength: 1000,
          maxDimensions: 2048,
          rateLimit: `${MAX_REQUESTS_PER_MINUTE} requests per minute`,
        }
      }
    });

  } catch (error) {
    console.error('GET /api/generate/image error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}