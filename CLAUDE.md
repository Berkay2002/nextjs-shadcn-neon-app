# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI Generation Hub built with Next.js 15, featuring Google's latest AI models for multimodal content generation. The application enables users to generate images (Gemini 2.5 Flash Image Preview), videos (Veo 3), and music (Lyria 2) through an intuitive interface built with shadcn/ui components, Tailwind CSS, and Neon PostgreSQL with authentication via Neon Auth (Stack framework). The project follows modern React patterns with server components and implements comprehensive AI generation workflows with proper cost tracking and user management.

## Technology Stack

### Core Framework
- **Next.js 15** - App Router with TypeScript and React 19
- **TypeScript 5** - Strict type checking enabled
- **React 19** - Latest React features and server components

### AI Integration
- **Google Gemini 2.5 Flash** - Image generation (Nano Banana)
- **Google Veo 3** - Video generation with native audio
- **Google Lyria 2** - Music generation with real-time streaming
- **Gemini Files API** - Large media handling and processing

### Database & Authentication
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Drizzle ORM** - Type-safe database operations with schema at `src/lib/db/schema.ts`
- **Neon Auth (Stack Framework)** - Authentication and user management

### UI & Styling
- **shadcn/ui** - Component library with "new-york" style variant
- **Tailwind CSS v4** - Utility-first styling with CSS variables
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Validation & Forms
- **Zod** - Schema validation in `src/lib/validations/`
- **React Hook Form** - Form management with `@hookform/resolvers`

## Development Commands

### Application
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Database
- `npm run db:generate` - Generate database migrations from schema changes
- `npm run db:migrate` - Apply pending migrations to the database
- `npm run db:studio` - Open Drizzle Studio for database management

### AI Development
- Test image generation at `/generate/image`
- Test video generation at `/generate/video` (requires paid tier)
- Test music generation at `/generate/music` (requires paid tier)
- Monitor API usage and costs at `/dashboard`

## Architecture

### AI Integration Layer
- **Gemini Client**: Centralized configuration in `src/lib/ai/gemini-client.ts`
- **Files API Protocol**: Automatic selection between inline base64 (<20MB) and Files API (>20MB)
- **Rate Limiting**: Implements free tier (5 req/min, 25/day) and paid tier quotas
- **Cost Tracking**: Real-time generation cost calculation and user billing
- **Error Handling**: Comprehensive error states with user-friendly messaging

### Authentication & User Management
- **Neon Auth Integration**: Stack framework handles auth flows at `/handler/[...stack]`
- **User Types**: Free tier (limited generations) and paid tier users
- **Usage Tracking**: Real-time tracking of generation quotas and costs in database
- **Session Management**: Secure session handling with database persistence

### Generation Features
- **Image Generation**: Gemini 2.5 Flash Image Preview with pre-processing and optimization
- **Video Generation**: Veo 3 with image-to-video support and aspect ratio handling
- **Music Generation**: Lyria 2 with real-time streaming and parameter control
- **Cross-Modal Workflows**: Image→Video generation pipelines

### Database Layer
- **ORM**: Drizzle ORM with Neon PostgreSQL serverless driver
- **Schema**: User management, generation tracking, usage analytics, and audit logs
- **Connection**: Database connection setup in `src/lib/db/index.ts`
- **Migrations**: Version-controlled schema changes with rollback support

### UI Components Architecture
- **shadcn/ui**: Base components in `src/components/ui/`
- **Feature Components**: Generation-specific components in `src/app/generate/[type]/_components/`
- **Layout Components**: Header, navigation in `src/components/layout/`
- **Path Aliases**: `@/components`, `@/lib`, `@/hooks`, `@/types` configured

## Project Structure

### Feature-Based Organization
```
src/
├── app/
│   ├── generate/
│   │   ├── image/
│   │   │   ├── _components/       # ImageGenerator, ImagePreview, ImagePromptInput
│   │   │   └── page.tsx
│   │   ├── video/
│   │   │   ├── _components/       # VideoGenerator, VideoPreview, VideoPromptInput
│   │   │   └── page.tsx
│   │   └── music/
│   │       ├── _components/       # MusicGenerator, AudioPlayer, MusicPromptInput
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── _components/           # GenerationStats, UsageChart
│   │   └── page.tsx
│   ├── api/generate/              # AI generation API routes
│   ├── handler/[...stack]/        # Neon Auth routes
│   └── layout.tsx
├── components/
│   ├── ui/                        # shadcn/ui components
│   └── layout/                    # Header, navigation components
├── lib/
│   ├── ai/                        # Gemini client and AI utilities
│   ├── db/                        # Database configuration and schema
│   ├── validations/               # Zod validation schemas
│   ├── constants.ts               # AI models, pricing, limits
│   └── utils.ts
├── types/
│   ├── generation.ts              # AI generation type definitions
│   └── index.ts
└── hooks/                         # Custom React hooks
```

## Development Protocols

### AI API Integration Best Practices
- **Media Handling**: Use Files API for payloads >20MB, inline base64 for smaller assets
- **Image Processing**: Pre-compress to 1024x1024, 85% quality, JPEG/WebP format
- **Video Processing**: Target 1280x720 or 720x1280, match aspect ratios (16:9, 9:16)
- **Music Parameters**: Default 30s duration, 120 BPM, configurable temperature
- **Error Recovery**: Implement retry logic with exponential backoff for network failures

### File & Media Management
- **Upload Limits**: 20MB maximum file size (see `FILE_LIMITS` in constants)
- **Supported Formats**: JPEG, PNG, WebP, GIF for images; MP4, WebM for video
- **Compression**: Client-side compression before upload to optimize API usage
- **Storage**: Media URLs stored in database, actual files handled by Google's CDN

### Security & Privacy Protocols
- **API Keys**: Store in environment variables, never expose in frontend code
- **User Data**: Encrypt sensitive fields, implement GDPR-compliant data retention
- **File Validation**: Strict MIME type, file size, and content validation
- **Rate Limiting**: Per-user quotas with abuse prevention and graceful degradation

### Error Handling & User Feedback
- **API Errors**: Comprehensive error mapping with actionable user messages
- **File Errors**: Clear feedback for size, format, and upload issues
- **Quota Management**: Proactive notifications before limits are reached
- **Loading States**: Progress indicators for long-running generation processes

## Environment Setup

### Required Environment Variables
Create `.env.local` with:

```bash
# Neon Database
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"

# Neon Auth (Stack Framework)
NEXT_PUBLIC_STACK_PROJECT_ID="your_neon_auth_project_id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your_neon_auth_publishable_key"
STACK_SECRET_SERVER_KEY="your_neon_auth_secret_key"

# Google AI APIs
GEMINI_API_KEY="your_gemini_api_key"
GOOGLE_CLOUD_PROJECT_ID="your_project_id"
GOOGLE_CLOUD_LOCATION="us-central1"

# Application URLs
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
```

See `.env.example` for the complete configuration template.

## Performance & Cost Management

### Generation Cost Tracking
- **Image Generation**: $0.039 per image (free tier: 5/day)
- **Video Generation**: $0.40 per second (paid tier only)
- **Music Generation**: ~$0.06 per 30 seconds (paid tier only)
- **Real-time Billing**: Cost calculation stored in generation metadata

### Optimization Strategies
- **Media Compression**: Client-side image/video compression before API calls
- **Caching**: Generated content URLs cached for 48 hours (Files API retention)
- **Batch Processing**: Queue management for multiple generations
- **Progressive Loading**: Streaming for music generation, polling for video

### Quota Management
- **Free Tier**: 5 requests/minute, 25 requests/day
- **Paid Tier**: 60 requests/minute, 1000 requests/day
- **Usage Monitoring**: Real-time tracking with dashboard analytics
- **Graceful Degradation**: Queue requests when limits approached

## Adding shadcn/ui Components

Use the shadcn/ui CLI to add new components:
```bash
npx shadcn@latest add [component-name]
```

Components will be installed to `src/components/ui/` with proper TypeScript support and Tailwind integration.

## Database Workflow

1. **Schema Changes**: Modify schema in `src/lib/db/schema.ts`
2. **Generate Migration**: Run `npm run db:generate`
3. **Apply Migration**: Run `npm run db:migrate`
4. **Inspect Data**: Use `npm run db:studio` for Drizzle Studio

### Key Database Tables
- **Users**: Authentication and plan management
- **Generations**: Track all AI generation requests and results
- **Usage**: User quota tracking and billing information
- **Audit Logs**: Security and usage monitoring

## Testing & Quality Assurance

### AI Generation Testing
- **Unit Tests**: Mock AI API responses for consistent testing
- **Integration Tests**: End-to-end generation workflows
- **Error Scenarios**: Network failures, quota exceeded, invalid inputs
- **Performance Tests**: Load testing for concurrent generations

### Code Quality
- **TypeScript**: Strict mode enabled, no `any` types allowed
- **ESLint**: Extended Next.js configuration with custom rules
- **Validation**: Zod schemas for all user inputs and API responses
- **Error Boundaries**: Comprehensive error handling for AI failures

## Additional Resources

### Documentation References
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Neon Database Docs](https://neon.tech/docs)
- [Stack Auth Docs](https://docs.stack-auth.com/)
- [shadcn/ui Docs](https://ui.shadcn.com/)

### Project Documentation
- `docs/PROTOCOLS.md` - API integration protocols and best practices
- `docs/RULES.md` - Code standards and development rules
- `docs/NEON.md` - Database management and security protocols
- `docs/ai-hub-implementation-plan.md` - Comprehensive implementation guide

## Important Notes

- **API Costs**: Monitor generation costs closely, especially for video and music
- **Rate Limits**: Respect both free and paid tier quotas to avoid service interruptions
- **File Sizes**: Always validate file sizes before upload to prevent API errors
- **Error Handling**: Provide clear user feedback for all failure scenarios
- **Security**: Never commit API keys or sensitive data to version control

---

*Last updated: 2025-09-19*

For questions about this setup or additional features, refer to the documentation in the `docs/` folder or the implementation examples in the codebase.