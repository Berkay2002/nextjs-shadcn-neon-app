import { GoogleGenAI } from '@google/genai';
import type {
  ImageGenerationResponse,
  VideoGenerationResponse,
  ImageGenerationRequest
} from '@/types/generation';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class GeminiClient {
  private client: GoogleGenAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retries: number = MAX_RETRIES
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === retries - 1) throw error;

        // Exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, i);
        await this.sleep(delay);
      }
    }
    throw new Error('Max retries exceeded');
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      return await this.retryWithBackoff(async () => {
        const prompt = `Create an image: ${request.prompt}`;
        const result = await this.client.models.generateImages({
          model: 'gemini-2.5-flash-image-preview',
          prompt: prompt
        });

        // Handle the new API response structure
        if (!result || !result.generatedImages || result.generatedImages.length === 0) {
          throw new Error('No images returned from Gemini');
        }

        const generatedImage = result.generatedImages[0];
        if (generatedImage?.image?.imageBytes) {
          return {
            success: true,
            imageData: `data:image/png;base64,${generatedImage.image.imageBytes}`,
          };
        }

        throw new Error('No image data found in response');
      });
    } catch (error) {
      console.error('Gemini image generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate image'
      };
    }
  }

  async uploadFile(file: Buffer, mimeType: string, displayName?: string): Promise<{
    success: boolean;
    fileUri?: string;
    error?: string;
  }> {
    try {
      return await this.retryWithBackoff(async () => {
        // Create a new Uint8Array to avoid ArrayBufferLike type issues
        const uint8Array = new Uint8Array(file);
        const blob = new Blob([uint8Array], { type: mimeType });

        const uploadResponse = await this.client.files.upload({
          file: blob,
          config: {
            mimeType,
            displayName: displayName || `upload-${Date.now()}`
          }
        });

        // Ensure we have a valid file name
        const fileName = uploadResponse.name;
        if (!fileName) {
          throw new Error('No file name returned from upload');
        }

        // Wait for file to be processed
        let file_state = await this.client.files.get({ name: fileName });
        while (file_state.state?.toString?.() === 'PROCESSING' || file_state.state === 'PROCESSING') {
          await this.sleep(1000);
          if (!file_state.name) {
            throw new Error('File state missing name');
          }
          file_state = await this.client.files.get({ name: file_state.name });
        }

        if (file_state.state?.toString?.() === 'FAILED' || file_state.state === 'FAILED') {
          throw new Error('File processing failed');
        }

        return {
          success: true,
          fileUri: file_state.uri
        };
      });
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file'
      };
    }
  }

  async generateVideo(): Promise<VideoGenerationResponse> {
    try {
      // TODO: Implement Veo 3 video generation via Vertex AI
      return {
        success: false,
        error: 'Video generation not implemented yet'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate video'
      };
    }
  }
}

export const geminiClient = new GeminiClient();