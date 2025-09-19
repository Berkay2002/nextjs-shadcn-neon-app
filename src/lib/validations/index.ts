import { z } from 'zod';
import type { ValidationResult, ValidationError } from '@/types/generation';
import { FILE_LIMITS, MEDIA_SETTINGS } from '@/lib/constants';

// Zod schemas for API validation
export const imageGenerationSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000, 'Prompt must be less than 1000 characters'),
  width: z.number().min(256).max(2048).optional(),
  height: z.number().min(256).max(2048).optional(),
  quality: z.number().min(10).max(100).optional(),
  style: z.string().optional(),
});

export const videoGenerationSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(500, 'Prompt must be less than 500 characters'),
  duration: z.number().min(1).max(30).optional(),
  aspectRatio: z.enum(['16:9', '9:16', '1:1']).optional(),
  referenceImageId: z.string().optional(),
  style: z.string().optional(),
});

export const musicGenerationSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(300, 'Prompt must be less than 300 characters'),
  duration: z.number().min(5).max(120).optional(),
  bpm: z.number().min(60).max(200).optional(),
  genre: z.string().optional(),
  temperature: z.number().min(0).max(1).optional(),
});

export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['image', 'video', 'audio']),
});

// Basic validation functions (keeping for backward compatibility)

export function validatePrompt(prompt: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!prompt || !prompt.trim()) {
    errors.push({
      field: 'prompt',
      message: 'Prompt is required'
    });
  }

  if (prompt.length < 10) {
    errors.push({
      field: 'prompt',
      message: 'Prompt must be at least 10 characters long'
    });
  }

  if (prompt.length > 1000) {
    errors.push({
      field: 'prompt',
      message: 'Prompt must be less than 1000 characters'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateFile(file: File, type: 'image' | 'video' | 'audio'): ValidationResult {
  const errors: ValidationError[] = [];

  // Check file size
  if (file.size > FILE_LIMITS.MAX_FILE_SIZE_BYTES) {
    errors.push({
      field: 'file',
      message: `File size must be less than ${FILE_LIMITS.MAX_FILE_SIZE_MB}MB`
    });
  }

  // Check file type
  let supportedFormats: readonly string[] = [];
  switch (type) {
    case 'image':
      supportedFormats = FILE_LIMITS.SUPPORTED_IMAGE_FORMATS;
      break;
    case 'video':
      supportedFormats = FILE_LIMITS.SUPPORTED_VIDEO_FORMATS;
      break;
    case 'audio':
      supportedFormats = FILE_LIMITS.SUPPORTED_AUDIO_FORMATS;
      break;
  }

  if (!supportedFormats.includes(file.type)) {
    errors.push({
      field: 'file',
      message: `File type ${file.type} is not supported. Supported formats: ${supportedFormats.join(', ')}`
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateImageDimensions(width?: number, height?: number): ValidationResult {
  const errors: ValidationError[] = [];
  const maxDim = MEDIA_SETTINGS.IMAGE.MAX_DIMENSIONS;

  if (width && width > maxDim) {
    errors.push({
      field: 'width',
      message: `Width must be less than ${maxDim}px`
    });
  }

  if (height && height > maxDim) {
    errors.push({
      field: 'height',
      message: `Height must be less than ${maxDim}px`
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateMusicParams(bpm?: number, duration?: number): ValidationResult {
  const errors: ValidationError[] = [];
  const musicSettings = MEDIA_SETTINGS.MUSIC;

  if (bpm && (bpm < musicSettings.MIN_BPM || bpm > musicSettings.MAX_BPM)) {
    errors.push({
      field: 'bpm',
      message: `BPM must be between ${musicSettings.MIN_BPM} and ${musicSettings.MAX_BPM}`
    });
  }

  if (duration && (duration < musicSettings.MIN_DURATION || duration > musicSettings.MAX_DURATION)) {
    errors.push({
      field: 'duration',
      message: `Duration must be between ${musicSettings.MIN_DURATION} and ${musicSettings.MAX_DURATION} seconds`
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEmail(email: string): ValidationResult {
  const errors: ValidationError[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !email.trim()) {
    errors.push({
      field: 'email',
      message: 'Email is required'
    });
  } else if (!emailRegex.test(email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}