# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an AI Generation Hub built with Next.js 15, TypeScript, shadcn/ui, Tailwind CSS, and Neon PostgreSQL. The application integrates with Google's AI models (Gemini for image generation, Lyria 2 for music, and Veo 3 for video) to provide a unified platform for AI content generation.

## Essential Commands

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Database Operations
```bash
# Generate database migrations (after schema changes)
npm run db:generate

# Run database migrations
npm run db:migrate

# Open Drizzle Studio for database management
npm run db:studio
```

### Adding shadcn/ui Components
```bash
# Add specific components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
npx shadcn@latest add tabs
npx shadcn@latest add textarea
```

## Architecture and Key Patterns

### Database Architecture
- **ORM**: Drizzle ORM with Neon PostgreSQL serverless database
- **Schema Location**: `src/lib/db/schema.ts` - contains all table definitions
- **Connection**: `src/lib/db/index.ts` - database connection and configuration
- **Configuration**: `drizzle.config.ts` - Drizzle Kit configuration for migrations

The database uses a relational model with `users` and `posts` tables demonstrating foreign key relationships. All timestamps use `defaultNow()` for automatic tracking.

### Application Structure
```
src/
├── app/                    # Next.js App Router (filesystem-based routing)
│   ├── api/               # API routes for AI model integrations
│   ├── layout.tsx         # Root layout with font configuration
│   └── page.tsx           # Home page
├── components/
│   └── ui/                # shadcn/ui components (auto-generated)
├── lib/
│   ├── db/                # Database configuration and schema
│   └── utils.ts           # Utility functions (includes cn helper)
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

### shadcn/ui Configuration
- **Style**: "new-york" variant
- **Base Color**: neutral
- **CSS Variables**: enabled for theme customization
- **Icon Library**: Lucide React
- **Aliases**: Configured for clean imports (@/components, @/lib, etc.)

### AI Integration Patterns

Based on the implementation plan, the application follows these patterns:

#### API Route Structure
- Image generation: `/api/generate-image` (Gemini 2.5 Flash Image Preview)
- Video generation: `/api/generate-video` (Veo 3)
- Music generation: `/api/generate-music` (Lyria 2)

#### File Handling Strategy
- Use Gemini Files API when total payload (prompt + files) approaches 20 MB
- Use inline base64 encoding only for small, single-use assets under 20 MB
- Implement proper error handling for 413 (payload too large) errors

#### Rate Limiting Considerations
- Gemini Free Tier: 5 requests per minute, 25 requests per day
- Implement client-side rate limiting and user feedback
- Consider caching strategies to reduce API costs

### TypeScript Configuration
- **Strict Mode**: Enabled with strict null checks
- **Path Mapping**: `@/*` maps to `./src/*`
- **Target**: ES2017 for broad compatibility
- **Module Resolution**: bundler (Next.js optimized)

## Environment Configuration

Required environment variables (create `.env.local`):
```bash
# Database
DATABASE_URL="postgresql://..."

# AI Model APIs (from implementation plan)
GEMINI_API_KEY="your_gemini_api_key"
GOOGLE_CLOUD_PROJECT_ID="your_project_id"
GOOGLE_CLOUD_LOCATION="us-central1"

# Optional: For Replicate alternative
REPLICATE_API_TOKEN="your_replicate_token"
```

## Development Guidelines

### Code Standards (from docs/rules.md)
- Use TypeScript for all code - avoid `any` type except for third-party interop
- Prefer `interface` for extensible objects, `type` for others
- Use App Router (`src/app/`) with filesystem-based routing
- Default to Server Components; use Client Components (`"use client"`) only when state/effects needed
- File naming: `kebab-case` for files/folders, `PascalCase` for React components

### Component Organization
- Shared UI: `src/components/ui/` (shadcn/ui components)
- Feature-specific: `src/app/generate/[feature]/_components/`
- Custom hooks: `src/hooks/` (prefix with `use`)
- Types: `src/types/[feature].ts`

### Styling Patterns
- Use Tailwind CSS utility classes for all styling
- Avoid custom CSS unless impossible with Tailwind
- Use responsive variants and Tailwind's variant system
- Extract reusable layouts as UI components
- Components should compose shadcn/ui primitives rather than modify them

### Database Development
- Schema changes require running `npm run db:generate` then `npm run db:migrate`
- Use Drizzle Studio (`npm run db:studio`) for database inspection
- Follow the existing pattern of timestamp fields with `defaultNow()`
- Maintain referential integrity with proper foreign key constraints

### AI Integration Patterns
- Always read API keys from environment variables, never hardcode
- Implement proper error handling with user-friendly messages
- Show loading states for long-running AI operations
- Handle quota exceeded and file size errors gracefully
- Consider using WebSocket connections for real-time music generation (Lyria 2)

## Testing Approach

The codebase currently uses:
- ESLint for code quality (Next.js + TypeScript rules)
- TypeScript compiler for type checking

For AI features, focus testing on:
- API route error handling
- File upload size validation
- Rate limiting behavior
- User feedback during generation processes

## Deployment Notes

- Built for deployment on Vercel, Netlify, or similar Next.js-compatible platforms
- Requires environment variables to be configured in deployment platform
- Database migrations need to run in production environment
- Consider implementing user authentication (OAuth with Google) for production use
- Monitor API usage and costs, especially for video generation ($0.40/second) and music generation