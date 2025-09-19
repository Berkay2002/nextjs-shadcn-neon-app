import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/integration';
import { geminiClient } from '@/lib/ai/gemini-client';
import { createAuditLog } from '@/lib/db/operations';
import { FILE_LIMITS } from '@/lib/constants';
import type { FileUploadResponse } from '@/types/generation';

const SUPPORTED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: ['audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg'],
} as const;

type SupportedMediaType = keyof typeof SUPPORTED_MIME_TYPES;

function validateFile(file: File, expectedType: SupportedMediaType): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > FILE_LIMITS.MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds ${FILE_LIMITS.MAX_FILE_SIZE_MB}MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    };
  }

  // Check MIME type
  const allowedTypes = SUPPORTED_MIME_TYPES[expectedType];
  if (!(allowedTypes as readonly string[]).includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Supported types: ${allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
}

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
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

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as 'image' | 'video' | 'audio';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!fileType || !['image', 'video', 'audio'].includes(fileType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Must be image, video, or audio' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file, fileType);
    if (!validation.valid) {
      await createAuditLog(
        user.id,
        'FILE_UPLOAD_VALIDATION_ERROR',
        `File: ${file.name}, Size: ${file.size}, Type: ${file.type}`,
        'FAILED',
        request.headers.get('x-forwarded-for') || 'unknown'
      );

      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    try {
      // Convert file to buffer
      const fileBuffer = await fileToBuffer(file);

      // Decide whether to use inline data or Files API
      const useFilesAPI = file.size > 20 * 1024 * 1024; // 20MB threshold

      let fileUri: string | undefined;
      let fileUrl: string | undefined;

      if (useFilesAPI) {
        // Upload to Google Files API for large files
        const uploadResult = await geminiClient.uploadFile(
          fileBuffer,
          file.type,
          `${user.id}-${Date.now()}-${file.name}`
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'File upload failed');
        }

        fileUri = uploadResult.fileUri;
      } else {
        // Use inline base64 for smaller files
        const base64Data = fileBuffer.toString('base64');
        fileUrl = `data:${file.type};base64,${base64Data}`;
      }

      // Log successful upload
      await createAuditLog(
        user.id,
        'FILE_UPLOAD_SUCCESS',
        `File: ${file.name}, Size: ${file.size}, Type: ${file.type}, Method: ${useFilesAPI ? 'FilesAPI' : 'Inline'}`,
        'SUCCESS',
        request.headers.get('x-forwarded-for') || 'unknown'
      );

      const response: FileUploadResponse = {
        success: true,
        fileUrl,
        fileId: fileUri,
      };

      return NextResponse.json(response, {
        status: 200,
        headers: {
          'X-Upload-Method': useFilesAPI ? 'FilesAPI' : 'Inline',
          'X-File-Size': file.size.toString(),
        },
      });

    } catch (error) {
      console.error('File upload error:', error);

      await createAuditLog(
        user.id,
        'FILE_UPLOAD_ERROR',
        `File: ${file.name}, Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'FAILED',
        request.headers.get('x-forwarded-for') || 'unknown'
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to upload file. Please try again.'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Upload API error:', error);

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

    return NextResponse.json({
      success: true,
      data: {
        limits: {
          maxFileSize: FILE_LIMITS.MAX_FILE_SIZE_MB,
          maxFileSizeBytes: FILE_LIMITS.MAX_FILE_SIZE_BYTES,
          supportedImageFormats: SUPPORTED_MIME_TYPES.image,
          supportedVideoFormats: SUPPORTED_MIME_TYPES.video,
          supportedAudioFormats: SUPPORTED_MIME_TYPES.audio,
        },
        upload: {
          inlineThreshold: 20 * 1024 * 1024, // 20MB
          filesApiThreshold: 20 * 1024 * 1024,
        }
      }
    });

  } catch (error) {
    console.error('GET /api/upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}