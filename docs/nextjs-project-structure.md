Based on my research and your specific AI generation hub project requirements, here's the recommended folder structure for your Next.js application with Tailwind CSS, shadcn/ui, and Google AI models integration:

# Recommended Folder Structure for AI Generation Hub

## **Complete Project Structure**

```
ai-generation-hub/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── _components/
│   │   │   │   ├── GenerationStats.tsx
│   │   │   │   └── UsageChart.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── generate/
│   │   │   ├── image/
│   │   │   │   ├── _components/
│   │   │   │   │   ├── ImageGenerator.tsx
│   │   │   │   │   ├── ImagePreview.tsx
│   │   │   │   │   └── ImagePromptInput.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── video/
│   │   │   │   ├── _components/
│   │   │   │   │   ├── VideoGenerator.tsx
│   │   │   │   │   ├── VideoPreview.tsx
│   │   │   │   │   └── VideoPromptInput.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── music/
│   │   │   │   ├── _components/
│   │   │   │   │   ├── MusicGenerator.tsx
│   │   │   │   │   ├── AudioPlayer.tsx
│   │   │   │   │   └── MusicPromptInput.tsx
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── generate/
│   │   │   │   ├── image/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── video/
│   │   │   │   │   └── route.ts
│   │   │   │   └── music/
│   │   │   │       └── route.ts
│   │   │   ├── webhooks/
│   │   │   │   ├── replicate/
│   │   │   │   │   └── route.ts
│   │   │   │   └── google/
│   │   │   │       └── route.ts
│   │   │   └── user/
│   │   │       ├── profile/
│   │   │       │   └── route.ts
│   │   │       └── usage/
│   │   │           └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── QueryProvider.tsx
│   │   ├── forms/
│   │   │   ├── GenerationForm.tsx
│   │   │   └── SettingsForm.tsx
│   │   ├── media/
│   │   │   ├── ImageDisplay.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   └── AudioPlayer.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── Tooltip.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   ├── constants.ts
│   │   └── ai/
│   │       ├── gemini-client.ts
│   │       ├── replicate-client.ts
│   │       ├── vertex-ai-client.ts
│   │       └── types.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-local-storage.ts
│   │   ├── use-debounce.ts
│   │   ├── use-generation.ts
│   │   └── use-websocket.ts
│   ├── store/
│   │   ├── auth-store.ts
│   │   ├── generation-store.ts
│   │   └── ui-store.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── generation.ts
│   │   ├── api.ts
│   │   └── database.ts
│   └── styles/
│       ├── components.css
│       └── utilities.css
├── public/
│   ├── images/
│   │   ├── logos/
│   │   ├── examples/
│   │   └── placeholders/
│   ├── audio/
│   │   └── samples/
│   ├── icons/
│   └── favicon.ico
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
├── .env.local
├── .env.example
├── components.json           # shadcn/ui config
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md
```


## **Key Structure Decisions**

### **1. Using `src/` Directory**

Following current Next.js best practices, everything is organized within the `src/` directory for better separation between source code and configuration files.[^1][^2]

### **2. App Router with Private Folders**

- Route-specific components use the `_components` naming convention to indicate they're private folders that won't be treated as routes[^3]
- This keeps components colocated with the routes that use them while maintaining clear separation[^1]


### **3. Feature-Based Organization**

Each generation type (image, video, music) has its own dedicated folder structure:

```
generate/
├── image/
├── video/
└── music/
```


### **4. API Route Structure**

Clean API organization that mirrors your application structure:

```
api/
├── generate/
│   ├── image/route.ts
│   ├── video/route.ts
│   └── music/route.ts
├── webhooks/
└── auth/
```


### **5. Shared Components Architecture**

- `components/ui/` - shadcn/ui components[^4]
- `components/layout/` - Layout-related components
- `components/providers/` - Context providers
- `components/common/` - Shared utility components


## **Example File Contents**

### **Main Generation Hub Component** (`src/components/layout/GenerationHub.tsx`):

```typescript
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageGenerator } from '@/app/generate/image/_components/ImageGenerator';
import { VideoGenerator } from '@/app/generate/video/_components/VideoGenerator';
import { MusicGenerator } from '@/app/generate/music/_components/MusicGenerator';

export function GenerationHub() {
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
          <ImageGenerator />
        </TabsContent>
        
        <TabsContent value="video">
          <VideoGenerator />
        </TabsContent>
        
        <TabsContent value="music">
          <MusicGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```


### **Gemini Client Setup** (`src/lib/ai/gemini-client.ts`):

```typescript
import { GoogleGenAI } from '@google/genai';

export const geminiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const generateImage = async (prompt: string) => {
  const response = await geminiClient.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: prompt,
  });
  
  return response;
};

export const generateVideo = async (prompt: string, image?: string) => {
  const operation = await geminiClient.models.generateVideos({
    model: 'veo-3.0-generate-preview',
    prompt: prompt,
    ...(image && { image: { imageBytes: image, mimeType: 'image/png' } })
  });
  
  return operation;
};
```


### **Constants File** (`src/lib/constants.ts`):

```typescript
export const AI_MODELS = {
  IMAGE: 'gemini-2.5-flash-image-preview',
  VIDEO: 'veo-3.0-generate-preview',
  MUSIC: 'models/lyria-realtime-exp',
} as const;

export const GENERATION_LIMITS = {
  FREE_TIER: {
    IMAGE: 5,
    VIDEO: 0, // Video requires paid tier
    MUSIC: 0, // Music requires paid tier
  },
  PAID_TIER: {
    IMAGE: 100,
    VIDEO: 25,
    MUSIC: 50,
  },
} as const;

export const ROUTES = {
  HOME: '/',
  GENERATE_IMAGE: '/generate/image',
  GENERATE_VIDEO: '/generate/video',
  GENERATE_MUSIC: '/generate/music',
  DASHBOARD: '/dashboard',
} as const;
```


## **Benefits of This Structure**

1. **Scalability**: Easy to add new generation types or features
2. **Maintainability**: Clear separation of concerns and logical grouping
3. **Developer Experience**: Intuitive navigation and file discovery[^2][^5]
4. **Next.js Optimized**: Follows Next.js 15 App Router best practices[^1]
5. **Type Safety**: Dedicated types folder for better TypeScript support
6. **Component Reusability**: Shared components can be easily imported across the app

This structure will scale well as your AI generation hub grows and makes it easy for team members to understand and contribute to the codebase.[^5]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^6][^7][^8][^9]</span>

<div style="text-align: center">⁂</div>

[^1]: https://nextjs.org/docs/app/getting-started/project-structure

[^2]: https://www.wisp.blog/blog/the-ultimate-guide-to-organizing-your-nextjs-15-project-structure

[^3]: https://stackoverflow.com/questions/76214501/nextjs-13-folder-structure-best-practice

[^4]: https://www.shadcn.io/ui/installation/nextjs

[^5]: https://www.linkedin.com/pulse/nextjs-folder-structure-best-practices-scalable-dos-santos-guimarães-npxef

[^6]: https://www.reddit.com/r/nextjs/comments/1dc17tv/best_practice_for_folder_structure_in_nextjs_app/

[^7]: https://dev.to/jancodes/how-to-set-up-nextjs-15-for-production-in-2024-393

[^8]: https://github.com/nhanluongoe/nextjs-boilerplate

[^9]: https://gist.github.com/gregsantos/2fc7d7551631b809efa18a0bc4debd2a

[^10]: https://www.thatsoftwaredude.com/content/12869/a-simple-nextjs-api-folder-structure

[^11]: https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji

[^12]: https://dev.to/darshan_bajgain/setting-up-2025-nextjs-15-with-shadcn-tailwind-css-v4-no-config-needed-dark-mode-5kl

[^13]: https://nextjs.org/docs/pages/building-your-application/routing/api-routes

[^14]: https://www.youtube.com/watch?v=i6Fa5Oyr59k

[^15]: https://github.com/siddharthamaity/nextjs-15-starter-shadcn

[^16]: https://www.contentful.com/blog/next-js-app-directory-guide-tutorial/

[^17]: https://ui.shadcn.com/docs/monorepo

[^18]: https://dev.to/md-afsar-mahmud/folder-structure-for-a-nextjs-project-22fh

[^19]: https://www.youtube.com/watch?v=8TLM1yQsmwY

[^20]: https://www.instructa.ai/ai-prompts/next-shadcn-coding-standards

