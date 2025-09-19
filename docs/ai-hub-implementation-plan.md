Based on my research, I now have comprehensive information about Google's AI models (Lyria 2, Veo 3, and Gemini for image generation) and how to integrate them into a NextJS application. Let me provide you with a detailed guide for building your AI generation hub.

# Building an AI Generation Hub with Google's Latest Models

Creating a comprehensive AI generation platform using Google's Lyria 2 (music), Veo 3 (video), and Gemini 2.5 Flash Image Preview (formerly "Nano Banana") in a NextJS application with Tailwind CSS and shadcn/ui components.

## **Model Overview and Capabilities**

### **Lyria 2 - Music Generation**

Lyria 2 offers both batch generation and real-time streaming capabilities. The real-time version uses WebSocket connections for interactive music creation, allowing you to dynamically adjust prompts, BPM, and other parameters while music is being generated. It produces high-fidelity 48kHz stereo audio.[^1][^2]

### **Veo 3 - Video Generation**

Veo 3 generates 8-second 720p videos with native audio generation. It excels at dialogue, sound effects, and ambient audio, supporting both text-to-video and image-to-video generation (though image input is only available in Veo 2).[^1]

### **Gemini Image Generation (Nano Banana)**

Gemini 2.5 Flash Image Preview supports text-to-image, image editing, and multi-turn conversations for iterative refinement. It includes SynthID watermarking and can render accurate text within images.[^3]

## **API Pricing Structure**

### **Free Tier Limitations**

- **Gemini Models**: 5 requests per minute, 25 requests per day for free tier[^4][^5]
- **Image Generation**: Free on free tier, \$0.039 per image on paid tier[^6]
- **Video Generation (Veo 3)**: \$0.40 per second (paid tier only)[^6]
- **Music Generation (Lyria)**: Approximately \$0.06 per 30 seconds or \$0.105 per generation[^7][^8]


### **Paid Tier Pricing**

| Model | Free Tier | Paid Tier |
| :-- | :-- | :-- |
| Gemini 2.0 Flash Input | Free | \$0.10 per 1M tokens |
| Gemini 2.0 Flash Output | Free | \$0.40 per 1M tokens |
| Image Generation | Free | \$0.039 per image |
| Veo 3 Video | Not available | \$0.40 per second |
| Lyria 2 Music | Not available | ~\$0.06 per 30 seconds |

## **NextJS Integration Setup**

### **1. Project Setup**

```bash
npx create-next-app@latest ai-generation-hub
cd ai-generation-hub
npm install @google/genai @tailwindcss/typography react-markdown remark-gfm
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npx shadcn-ui@latest init
```


### **2. Environment Configuration**

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1
```


### **3. API Routes Setup**

**Image Generation API Route** (`/app/api/generate-image/route.ts`):

```typescript
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: prompt,
    });

    const imageData = response.candidates[^0].content.parts
      .find(part => part.inlineData)?.inlineData?.data;

    if (!imageData) {
      throw new Error('No image generated');
    }

    return NextResponse.json({
      success: true,
      imageData: `data:image/png;base64,${imageData}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
```

**Video Generation API Route** (`/app/api/generate-video/route.ts`):

```typescript
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { prompt, image } = await request.json();
    
    const operation = await client.models.generateVideos({
      model: 'veo-3.0-generate-preview',
      prompt: prompt,
      ...(image && { image: { imageBytes: image, mimeType: 'image/png' } })
    });

    // Poll for completion
    let currentOperation = operation;
    while (!currentOperation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      currentOperation = await client.operations.getVideosOperation({
        operation: currentOperation,
      });
    }

    const videoUri = currentOperation.response.generatedVideos[^0].video.uri;
    
    return NextResponse.json({
      success: true,
      videoUri,
      operationId: operation.name,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}
```

**Music Generation API Route** (`/app/api/generate-music/route.ts`):

```typescript
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  apiVersion: 'v1alpha',
});

export async function POST(request: Request) {
  try {
    const { prompts, bpm = 120, temperature = 1.0 } = await request.json();
    
    // For real-time streaming, you'll need WebSocket implementation
    // This is a simplified batch generation example
    
    const session = await client.live.music.connect({
      model: 'models/lyria-realtime-exp',
      callbacks: {
        onmessage: (message) => {
          // Handle audio chunks
        },
        onerror: (error) => console.error('Music session error:', error),
        onclose: () => console.log('Lyria RealTime stream closed.'),
      },
    });

    await session.setWeightedPrompts({
      weightedPrompts: prompts.map(p => ({ text: p, weight: 1.0 })),
    });

    await session.setMusicGenerationConfig({
      musicGenerationConfig: {
        bpm,
        temperature,
        audioFormat: 'pcm16',
        sampleRateHz: 44100,
      },
    });

    await session.play();

    return NextResponse.json({
      success: true,
      sessionId: 'session_id_here', // In real implementation, return session management
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to start music generation' },
      { status: 500 }
    );
  }
}
```


### **4. Frontend Components**

**Main Hub Component** (`/app/components/GenerationHub.tsx`):

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GenerationHub() {
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [musicPrompt, setMusicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState({
    image: null,
    video: null,
    music: null,
  });

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      
      const data = await response.json();
      if (data.success) {
        setResults(prev => ({ ...prev, image: data.imageData }));
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateVideo = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: videoPrompt,
          image: results.image // Use generated image if available
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setResults(prev => ({ ...prev, video: data.videoUri }));
      }
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        AI Generation Hub
      </h1>
      
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="image">Image Generation</TabsTrigger>
          <TabsTrigger value="video">Video Generation</TabsTrigger>
          <TabsTrigger value="music">Music Generation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Generate Images with Gemini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe the image you want to generate..."
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={generateImage} 
                disabled={isGenerating || !imagePrompt}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </Button>
              {results.image && (
                <div className="mt-4">
                  <img 
                    src={results.image} 
                    alt="Generated" 
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>Generate Videos with Veo 3</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe the video you want to generate..."
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={generateVideo} 
                disabled={isGenerating || !videoPrompt}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Video'}
              </Button>
              {results.video && (
                <div className="mt-4">
                  <video 
                    src={results.video} 
                    controls 
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="music">
          <Card>
            <CardHeader>
              <CardTitle>Generate Music with Lyria 2</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe the music style you want..."
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                rows={3}
              />
              <Button 
                disabled={isGenerating || !musicPrompt}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Music'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```


## **Authentication Setup**

For production use, implement Google OAuth authentication:

```bash
npm install next-auth
```

Create `/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```


## **Alternative: Using Replicate for Lyria 2**

Since Lyria 2 real-time streaming requires complex WebSocket handling, you might consider using Replicate's API for simpler integration:[^9]

```typescript
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  const { prompt } = await request.json();
  
  const output = await replicate.run(
    "google/lyria-2",
    {
      input: {
        prompt: prompt,
        duration: 30,
      }
    }
  );
  
  return NextResponse.json({ audioUrl: output });
}
```


## **Deployment Considerations**

1. **Rate Limiting**: Implement client-side rate limiting to respect API limits[^4]
2. **Error Handling**: Add comprehensive error handling for API failures
3. **File Storage**: Consider using cloud storage for generated media files
4. **Caching**: Implement caching strategies to reduce API costs
5. **User Management**: Add user accounts to track usage and implement quotas

## **Development Workflow**

1. Start with image generation using the free tier
2. Test video generation with paid tier (required)
3. Implement music generation last due to complexity
4. Add cross-model workflows (image → video)
5. Implement user authentication and usage tracking

This comprehensive setup provides a solid foundation for your AI generation hub, allowing users to create images, videos, and music through Google's latest AI models while maintaining good user experience and cost management.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40][^41][^42][^43][^44][^45][^46][^47]</span>

<div style="text-align: center">⁂</div>

[^1]: https://ai.google.dev/gemini-api/docs/video

[^2]: https://ai.google.dev/gemini-api/docs/music-generation

[^3]: https://cloud.google.com/vertex-ai/generative-ai/pricing

[^4]: https://ai.google.dev/gemini-api/docs/rate-limits

[^5]: https://www.cursor-ide.com/blog/gemini-2-5-pro-free-api-limits-guide

[^6]: https://ai.google.dev/gemini-api/docs/pricing

[^7]: https://www.cometapi.com/suno-4-5-vs-googles-lyria-2/

[^8]: https://aimlapi.com/models/lyria-2

[^9]: https://replicate.com/google/lyria-2

[^10]: https://gemini.google/overview/video-generation/

[^11]: https://one.google.com/about/google-ai-plans/

[^12]: https://www.reddit.com/r/googlecloud/comments/1jfk2jb/confused_about_pricing_differences_between_vertex/

[^13]: https://www.youtube.com/watch?v=6CgeNtJwKFs

[^14]: https://www.youtube.com/watch?v=lfE-csUyPF4

[^15]: https://www.reddit.com/r/Bard/comments/1jvfpmg/googles_veo_2_video_ai_is_accessible_via_api_at/

[^16]: https://cloud.google.com/vertex-ai/pricing

[^17]: https://avionmission.com/blog/gemini-api-tutorial/

[^18]: https://www.youtube.com/watch?v=lastLJONApg

[^19]: https://aistudio.google.com/models/veo-3

[^20]: https://www.segmind.com/models/lyria-2/pricing

[^21]: https://tomdekan.com/articles/google-sign-in-nextjs

[^22]: https://www.youtube.com/watch?v=8OH7tuqh7KA

[^23]: https://gemini.google/subscriptions/?hl=en-GB

[^24]: https://developers.google.com/program/plans-and-pricing

[^25]: https://ai.google.dev/gemini-api/docs/quickstart

[^26]: https://deepmind.google/models/lyria/

[^27]: https://cloud.google.com/vertex-ai/generative-ai/docs/music/generate-music

[^28]: https://dev.to/shubhamtiwari909/gemini-ai-next-js-15-tailwind-1247

[^29]: https://www.contentful.com/blog/nextjs-authentication/

[^30]: https://aisonggenerator.io/lyria-2

[^31]: https://www.youtube.com/watch?v=HcaR0oTReKs

[^32]: https://www.andela.com/blog-posts/implement-third-party-authentication-with-google-in-next-js

[^33]: https://aimlapi.com/ai-ml-api-pricing

[^34]: https://dev.to/souravvmishra/adding-google-authentication-in-nextjs-14-with-app-router-a-beginner-friendly-guide-3ag

[^35]: https://next.jqueryscript.net/next-js/gemini-image-generation-editing/

[^36]: https://nextjs.org/learn/dashboard-app/adding-authentication

[^37]: https://www.reddit.com/r/Bard/comments/1lj4wdp/gemini_free_tier_rate_limits_slashed_again/

[^38]: https://blog.laozhang.ai/ai-tools/gemini-api-rate-limits-guide/

[^39]: https://ai.google.dev/api/live_music

[^40]: https://www.youtube.com/watch?v=URIpmYjKgMA

[^41]: https://github.com/google-gemini/gemini-cli/discussions/2436

[^42]: https://ai.google.dev/gemini-api/docs/billing

[^43]: https://kartaca.com/en/lyria-by-google-deepmind-the-next-chapter-in-music-creation/

[^44]: https://github.com/replicate/replicate-javascript

[^45]: https://www.youtube.com/watch?v=8O2h56nCGuo

[^46]: https://www.segmind.com/models/lyria-2/api

[^47]: https://cloud.google.com/free/docs/free-cloud-features

