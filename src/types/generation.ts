// Base generation types
export interface Generation {
  id: string;
  userId: string;
  type: 'image' | 'video' | 'music';
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  result?: GenerationResult;
  error?: string;
  metadata?: GenerationMetadata;
}

export interface GenerationResult {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  duration?: number; // For video/audio
  dimensions?: {
    width: number;
    height: number;
  }; // For images/video
}

export interface GenerationMetadata {
  model: string;
  parameters: Record<string, unknown>;
  processingTime: number;
  cost: number;
}

// Image generation types
export interface ImageGenerationRequest {
  prompt: string;
  width?: number;
  height?: number;
  quality?: number;
  style?: string;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  imageData?: string; // Base64 encoded
  error?: string;
  generationId?: string;
  quotaInfo?: {
    dailyRemaining: number;
    monthlyRemaining: number;
  };
}

// Video generation types
export interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  referenceImage?: File | string;
  style?: string;
}

export interface VideoGenerationResponse {
  success: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  operationId?: string;
  generationId?: string;
}

// Music generation types
export interface MusicGenerationRequest {
  prompt: string;
  duration?: number;
  bpm?: number;
  genre?: string;
  temperature?: number;
}

export interface MusicGenerationResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
  sessionId?: string;
  generationId?: string;
}

// User and usage types
export interface User {
  id: string;
  email: string;
  name?: string;
  plan: 'free' | 'paid';
  createdAt: Date;
  usage: UserUsage;
}

export interface UserUsage {
  totalGenerations: number;
  imagesGenerated: number;
  videosGenerated: number;
  musicGenerated: number;
  creditsUsed: number;
  creditsRemaining: number;
  lastResetDate: Date;
}

// Dashboard types
export interface DashboardStats {
  totalGenerations: number;
  imagesGenerated: number;
  videosGenerated: number;
  musicGenerated: number;
  creditsUsed: number;
  creditsRemaining: number;
}

export interface UsageData {
  date: string;
  images: number;
  videos: number;
  music: number;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// File upload types
export interface FileUploadResponse {
  success: boolean;
  fileUrl?: string;
  fileId?: string;
  error?: string;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}