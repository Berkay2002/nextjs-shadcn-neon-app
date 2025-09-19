import type { ImageGenerationRequest, VideoGenerationRequest, MusicGenerationRequest } from '@/types/generation';

// Current pricing as of December 2024 (in USD)
export const GENERATION_COSTS = {
  IMAGE: {
    // Gemini 2.0 Flash Experimental pricing: $30 per 1M output tokens
    // Images up to 1024x1024px consume 1290 tokens = $0.039 per image
    BASE_COST: 0.039, // Per image (1290 tokens)
    TOKENS_PER_IMAGE: 1290, // For 1024x1024px images
    FREE_TIER_DAILY: 5,
    FREE_TIER_MONTHLY: 25,
  },
  VIDEO: {
    // Veo 3 via Vertex AI pricing (updated from $0.75 to $0.40 per second)
    BASE_COST_PER_SECOND: 0.40, // Per second of video
    DEFAULT_DURATION: 5, // Default 5 seconds
    FREE_TIER_DAILY: 0, // Paid tier only
    FREE_TIER_MONTHLY: 0,
  },
  MUSIC: {
    // Lyria 2 via Vertex AI pricing: $0.06 per 30 seconds
    BASE_COST_PER_SECOND: 0.002, // $0.06 ÷ 30 seconds = $0.002 per second
    BASE_COST_30_SECONDS: 0.06, // Official pricing: $0.06 per 30 seconds
    DEFAULT_DURATION: 30, // Default 30 seconds
    FREE_TIER_DAILY: 0, // Paid tier only
    FREE_TIER_MONTHLY: 0,
  },
} as const;

export const RATE_LIMITS = {
  FREE_TIER: {
    REQUESTS_PER_MINUTE: 5,
    REQUESTS_PER_DAY: 25,
  },
  PAID_TIER: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_DAY: 1000,
  },
} as const;

export interface CostCalculation {
  estimatedCost: number;
  breakdown: {
    baseCost: number;
    duration?: number;
    multipliers?: Record<string, number>;
  };
  currency: 'USD';
  type: 'IMAGE' | 'VIDEO' | 'MUSIC';
}

export function calculateImageCost(request: ImageGenerationRequest): CostCalculation {
  const baseCost = GENERATION_COSTS.IMAGE.BASE_COST;

  // Quality multiplier (higher quality = slightly higher cost)
  const qualityMultiplier = request.quality ? (request.quality / 100) * 1.2 : 1.0;

  // Resolution multiplier (larger images = higher cost)
  let resolutionMultiplier = 1.0;
  if (request.width && request.height) {
    const totalPixels = request.width * request.height;
    const basePixels = 1024 * 1024; // Base 1024x1024
    resolutionMultiplier = Math.max(1.0, totalPixels / basePixels);
  }

  const estimatedCost = baseCost * qualityMultiplier * resolutionMultiplier;

  return {
    estimatedCost,
    breakdown: {
      baseCost,
      multipliers: {
        quality: qualityMultiplier,
        resolution: resolutionMultiplier,
      },
    },
    currency: 'USD',
    type: 'IMAGE',
  };
}

export function calculateVideoCost(request: VideoGenerationRequest): CostCalculation {
  const duration = request.duration || GENERATION_COSTS.VIDEO.DEFAULT_DURATION;
  const baseCostPerSecond = GENERATION_COSTS.VIDEO.BASE_COST_PER_SECOND;

  // Aspect ratio multiplier (non-standard ratios may cost more)
  let aspectRatioMultiplier = 1.0;
  if (request.aspectRatio === '9:16' || request.aspectRatio === '1:1') {
    aspectRatioMultiplier = 1.1; // Slightly higher for mobile/square formats
  }

  // Reference image multiplier (image-to-video costs more)
  const referenceImageMultiplier = request.referenceImage ? 1.5 : 1.0;

  const estimatedCost = duration * baseCostPerSecond * aspectRatioMultiplier * referenceImageMultiplier;

  return {
    estimatedCost,
    breakdown: {
      baseCost: baseCostPerSecond,
      duration,
      multipliers: {
        aspectRatio: aspectRatioMultiplier,
        referenceImage: referenceImageMultiplier,
      },
    },
    currency: 'USD',
    type: 'VIDEO',
  };
}

export function calculateMusicCost(request: MusicGenerationRequest): CostCalculation {
  const duration = request.duration || GENERATION_COSTS.MUSIC.DEFAULT_DURATION;
  const baseCostPerSecond = GENERATION_COSTS.MUSIC.BASE_COST_PER_SECOND;

  // Temperature multiplier (higher creativity = higher cost)
  const temperatureMultiplier = request.temperature ? (1 + request.temperature * 0.2) : 1.0;

  // BPM multiplier (complex rhythms may cost more)
  let bpmMultiplier = 1.0;
  if (request.bpm && (request.bpm > 140 || request.bpm < 60)) {
    bpmMultiplier = 1.1; // Extreme BPMs cost slightly more
  }

  const estimatedCost = duration * baseCostPerSecond * temperatureMultiplier * bpmMultiplier;

  return {
    estimatedCost,
    breakdown: {
      baseCost: baseCostPerSecond,
      duration,
      multipliers: {
        temperature: temperatureMultiplier,
        bpm: bpmMultiplier,
      },
    },
    currency: 'USD',
    type: 'MUSIC',
  };
}

export function formatCost(cost: number): string {
  if (cost < 0.01) {
    return '< $0.01';
  }
  return `$${cost.toFixed(2)}`;
}

export function getFreeTierLimits(type: 'IMAGE' | 'VIDEO' | 'MUSIC') {
  switch (type) {
    case 'IMAGE':
      return {
        daily: GENERATION_COSTS.IMAGE.FREE_TIER_DAILY,
        monthly: GENERATION_COSTS.IMAGE.FREE_TIER_MONTHLY,
      };
    case 'VIDEO':
      return {
        daily: GENERATION_COSTS.VIDEO.FREE_TIER_DAILY,
        monthly: GENERATION_COSTS.VIDEO.FREE_TIER_MONTHLY,
      };
    case 'MUSIC':
      return {
        daily: GENERATION_COSTS.MUSIC.FREE_TIER_DAILY,
        monthly: GENERATION_COSTS.MUSIC.FREE_TIER_MONTHLY,
      };
  }
}

export function isFreeTierType(type: 'IMAGE' | 'VIDEO' | 'MUSIC'): boolean {
  const limits = getFreeTierLimits(type);
  return limits.daily > 0 && limits.monthly > 0;
}

export function getRateLimit(userTier: 'free' | 'paid') {
  return userTier === 'free' ? RATE_LIMITS.FREE_TIER : RATE_LIMITS.PAID_TIER;
}

// Utility to validate if user can afford generation
export function canAffordGeneration(
  userCredits: number,
  estimatedCost: number,
  userTier: 'free' | 'paid' = 'free'
): {
  canAfford: boolean;
  message?: string;
} {
  // Free tier users don't pay with credits for free-tier generations
  if (userTier === 'free') {
    return { canAfford: true };
  }

  if (userCredits >= estimatedCost) {
    return { canAfford: true };
  }

  return {
    canAfford: false,
    message: `Insufficient credits. Need $${estimatedCost.toFixed(2)}, have $${userCredits.toFixed(2)}`,
  };
}

// Utility for bulk cost calculation
export function calculateBulkCost(
  requests: Array<{
    type: 'IMAGE' | 'VIDEO' | 'MUSIC';
    request: ImageGenerationRequest | VideoGenerationRequest | MusicGenerationRequest;
  }>
): {
  totalCost: number;
  breakdown: CostCalculation[];
} {
  const breakdown = requests.map(({ type, request }) => {
    switch (type) {
      case 'IMAGE':
        return calculateImageCost(request as ImageGenerationRequest);
      case 'VIDEO':
        return calculateVideoCost(request as VideoGenerationRequest);
      case 'MUSIC':
        return calculateMusicCost(request as MusicGenerationRequest);
    }
  });

  const totalCost = breakdown.reduce((sum, calc) => sum + calc.estimatedCost, 0);

  return {
    totalCost,
    breakdown,
  };
}