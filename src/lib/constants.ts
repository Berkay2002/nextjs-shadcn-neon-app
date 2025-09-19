// AI Model Configurations
export const AI_MODELS = {
  IMAGE: 'gemini-2.5-flash-image-preview',
  VIDEO: 'veo-3.0-generate-preview',
  MUSIC: 'models/lyria-realtime-exp',
} as const;

// Generation Limits
export const GENERATION_LIMITS = {
  FREE_TIER: {
    IMAGE: 5,
    VIDEO: 0, // Video requires paid tier
    MUSIC: 0, // Music requires paid tier
    DAILY_REQUESTS: 25,
    REQUESTS_PER_MINUTE: 5,
  },
  PAID_TIER: {
    IMAGE: 100,
    VIDEO: 25,
    MUSIC: 50,
    DAILY_REQUESTS: 1000,
    REQUESTS_PER_MINUTE: 60,
  },
} as const;

// API Pricing (in USD)
export const PRICING = {
  IMAGE_GENERATION: 0.039, // per image
  VIDEO_GENERATION: 0.40,  // per second
  MUSIC_GENERATION: 0.06,  // per 30 seconds
  GEMINI_INPUT: 0.10,      // per 1M tokens
  GEMINI_OUTPUT: 0.40,     // per 1M tokens
} as const;

// Application Routes
export const ROUTES = {
  HOME: '/',
  GENERATE_IMAGE: '/generate/image',
  GENERATE_VIDEO: '/generate/video',
  GENERATE_MUSIC: '/generate/music',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SIGN_IN: '/handler/sign-in',
  SIGN_UP: '/handler/sign-up',
  SIGN_OUT: '/handler/sign-out',
} as const;

// File Upload Limits
export const FILE_LIMITS = {
  MAX_FILE_SIZE_MB: 20,
  MAX_FILE_SIZE_BYTES: 20 * 1024 * 1024,
  SUPPORTED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  SUPPORTED_VIDEO_FORMATS: ['video/mp4', 'video/webm', 'video/mov'],
  SUPPORTED_AUDIO_FORMATS: ['audio/mp3', 'audio/wav', 'audio/ogg'],
} as const;

// Media Processing Settings
export const MEDIA_SETTINGS = {
  IMAGE: {
    MAX_DIMENSIONS: 1024,
    QUALITY: 0.85,
    FORMAT: 'jpeg',
  },
  VIDEO: {
    MAX_WIDTH: 1280,
    MAX_HEIGHT: 720,
    SUPPORTED_RATIOS: ['16:9', '9:16', '1:1'],
  },
  MUSIC: {
    DEFAULT_DURATION: 30, // seconds
    MIN_DURATION: 10,
    MAX_DURATION: 120,
    DEFAULT_BPM: 120,
    MIN_BPM: 60,
    MAX_BPM: 200,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 20MB',
  UNSUPPORTED_FORMAT: 'File format is not supported',
  GENERATION_FAILED: 'Failed to generate content. Please try again.',
  QUOTA_EXCEEDED: 'You have exceeded your generation quota. Please upgrade your plan.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  INVALID_PROMPT: 'Please provide a valid prompt for generation.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  GENERATION_COMPLETE: 'Generation completed successfully!',
  FILE_UPLOADED: 'File uploaded successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const;