# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a fully-functional AI Generation Hub built with Next.js 15, featuring a modern landing page with embedded navigation, Google's latest AI models for multimodal content generation, and comprehensive UI components. The application now includes a complete landing page with responsive design, smooth scrolling navigation, mobile hamburger menu, and dark theme. It's designed to enable users to generate images (Gemini 2.5 Flash), videos (Veo 3), and music (Lyria 2) through an intuitive interface built with shadcn/ui components, Tailwind CSS v4, and Neon PostgreSQL with authentication via Neon Auth (Stack framework). The project follows modern React patterns with server components and implements comprehensive AI generation workflows with proper authentication, cost tracking, and user management.

## Technology Stack

### Core Framework
- **Next.js 15** - App Router with TypeScript and React 19
- **TypeScript 5** - Strict type checking enabled
- **React 19** - Latest React features and server components

### AI Integration
- **Google Gemini 2.5 Flash Image Preview** - Image generation (Nano Banana)
- **Google Veo 3** - Video generation with native audio
- **Google Lyria 2** - Music generation with real-time streaming
- **Gemini Files API** - Large media handling and processing

### Database & Authentication
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Drizzle ORM** - Type-safe database operations with schema at `src/lib/db/schema.ts`
- **Neon Auth (Stack Framework)** - Authentication and user management

### UI & Styling
- **shadcn/ui** - Component library with "new-york" style variant
- **Tailwind CSS v4** - Latest utility-first styling with CSS variables and modern features
- **Geist Font** - Modern font family (Sans & Mono) from Vercel
- **Framer Motion** - Advanced animations and transitions
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **MagicUI** - Additional UI components (Marquee, Globe, etc.)
- **COBE** - 3D globe component
- **tw-animate-css** - Extended animations for Tailwind

## Landing Page Features

The application now includes a complete, professional landing page with:

### Navigation & Layout
- **Embedded Navigation**: Sticky header with smooth scrolling navigation
- **Mobile Responsive**: Hamburger menu with overlay for mobile devices
- **Dynamic Header**: Responsive header that adapts on scroll
- **Dark Theme**: Professional dark theme with pearl mist background effect

### Page Sections
- **Hero Section**: Animated hero with call-to-action and visual elements
- **Features Section**: Showcase of key application features
- **Pricing Section**: Tiered pricing plans with feature comparisons
- **Testimonials**: Customer testimonials with marquee animations
- **FAQ Section**: Collapsible accordion with common questions
- **Release Promo**: New release announcement with shiny text animation
- **Sticky Footer**: Bottom navigation with additional links

### Animations & Interactions
- **Smooth Scrolling**: Native smooth scrolling between sections
- **Marquee Effects**: Animated testimonials and feature highlights
- **Hover Effects**: Interactive buttons and cards
- **Mobile Transitions**: Smooth mobile menu open/close animations
- **Custom Animations**: Shiny text, following pointer, and scramble effects

### Technical Implementation
- **Tailwind CSS v4**: Latest utility framework with CSS variables
- **Geist Fonts**: Modern typography from Vercel
- **Framer Motion**: Advanced animations and transitions
- **Custom CSS**: Keyframe animations for marquee and text effects
- **Responsive Design**: Mobile-first approach with breakpoints

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
│   ├── layout.tsx                 # Root layout with Geist fonts
│   ├── globals.css                # Tailwind CSS v4 configuration with animations
│   └── page.tsx                   # Landing page with embedded navbar and sections
├── components/
│   ├── ui/                        # shadcn/ui components (50+ components)
│   ├── layout/                    # Header, navigation components
│   ├── common/                    # ProtectedRoute, shared utilities
│   ├── providers/                 # Context providers (theme-provider)
│   ├── home/                      # Landing page specific components (hero)
│   ├── magicui/                   # Extended UI components (marquee, globe)
│   ├── forms/                     # Form components
│   ├── media/                     # Media display components
│   ├── faq-section.tsx            # FAQ accordion component
│   ├── features.tsx               # Feature showcase section
│   ├── pricing-section.tsx        # Pricing plans component
│   ├── testimonials.tsx           # Customer testimonials with marquee
│   ├── new-release-promo.tsx      # Release announcement banner
│   └── sticky-footer.tsx          # Bottom navigation footer
├── lib/
│   ├── ai/                        # Gemini client and AI utilities
│   ├── db/                        # Database configuration and schema
│   ├── validations/               # Input validation utilities
│   ├── constants.ts               # AI models, pricing, limits
│   ├── fonts.ts                   # Geist font exports
│   ├── stack.ts                   # Neon Auth utilities
│   └── utils.ts                   # General utilities
├── types/
│   ├── generation.ts              # AI generation type definitions
│   └── index.ts                   # General type definitions
├── hooks/
│   └── use-mobile.ts              # Mobile detection hook
├── store/                         # State management
└── stack.tsx                      # Stack Auth configuration
```

### shadcn/ui Configuration
- **Style**: "new-york" variant
- **Base Color**: neutral
- **CSS Variables**: enabled for theme customization
- **Icon Library**: Lucide React
- **Aliases**: Configured for clean imports (@/components, @/lib, etc.)

### AI Integration Architecture

#### Current Implementation Status
- **✅ Project Structure**: Complete feature-based organization
- **✅ Landing Page**: Complete responsive landing page with embedded navigation
- **✅ UI Framework**: Tailwind CSS v4 with advanced animations and Geist fonts
- **✅ Component Library**: 50+ shadcn/ui components + custom landing page components
- **✅ Authentication**: Neon Auth (Stack) fully configured
- **✅ UI Components**: All generation interfaces built with shadcn/ui
- **✅ Protected Routes**: Authentication required for generation features
- **⌟ AI APIs**: Client placeholders created, ready for API key integration
- **⌟ Database Schema**: Drizzle ORM ready for user/generation tracking

#### API Route Structure
- Image generation: `/api/generate/image` (Gemini 2.5 Flash Image Preview)
- Video generation: `/api/generate/video` (Veo 3)
- Music generation: `/api/generate/music` (Lyria 2)
- User management: `/api/user/{profile,usage}`

#### Generation Components (Ready to Use)
- **Image**: `ImageGenerator`, `ImagePreview`, `ImagePromptInput`
- **Video**: `VideoGenerator`, `VideoPreview`, `VideoPromptInput`
- **Music**: `MusicGenerator`, `AudioPlayer`, `MusicPromptInput`
- **Dashboard**: `GenerationStats`, `UsageChart`
- **Landing Page**: `Hero`, `Features`, `PricingSection`, `TestimonialsSection`, `FAQSection`, `NewReleasePromo`, `StickyFooter`
- **UI Extensions**: `Marquee`, `Globe`, `Scramble`, `FollowingPointer` (MagicUI components)

#### File Handling Strategy
- **Files API**: Automatic selection for payloads >20MB
- **Inline Base64**: Used for small assets <20MB
- **Client Compression**: Pre-processing before API calls
- **Error Handling**: Comprehensive validation and user feedback

#### Authentication & Access Control
- **Stack Auth**: Seamless sign-up/in at `/handler/sign-{up,in}`
- **Protected Routes**: `ProtectedRoute` component wraps sensitive features
- **User State**: Real-time authentication state in Header component
- **Session Management**: Secure session handling via Stack framework

#### Cost & Usage Tracking
- **Pricing Constants**: Defined in `src/lib/constants.ts`
- **Generation Limits**: Free tier (5 req/min) and paid tier quotas
- **Dashboard Analytics**: Usage visualization and cost monitoring
- **Real-time Tracking**: Per-user generation counts and billing

### TypeScript Configuration
- **Strict Mode**: Enabled with strict null checks
- **Path Mapping**: `@/*` maps to `./src/*`
- **Target**: ES2017 for broad compatibility
- **Module Resolution**: bundler (Next.js optimized)

## Environment Configuration

Required environment variables (create `.env.local`):
```bash
# Neon Database
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"

# Neon Auth (Stack Framework) - Get from https://app.stack-auth.com
NEXT_PUBLIC_STACK_PROJECT_ID="your_stack_project_id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your_stack_publishable_client_key"
STACK_SECRET_SERVER_KEY="your_stack_secret_server_key"

# Google AI APIs
GEMINI_API_KEY="your_gemini_api_key"
GOOGLE_CLOUD_PROJECT_ID="your_project_id"
GOOGLE_CLOUD_LOCATION="us-central1"
GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"

# Optional: For Replicate alternative
REPLICATE_API_TOKEN="your_replicate_token"

# App Configuration
NODE_ENV="development"
```

**Important**: To complete the Neon Auth setup:
1. Visit [https://app.stack-auth.com](https://app.stack-auth.com)
2. Create a new project
3. Copy the API keys to your `.env.local` file
4. Test authentication at `/handler/sign-up`

## Development Guidelines

### Quick Start for New Features
1. **Authentication**: All generation pages are protected by default
2. **Components**: Use existing patterns in `_components` folders
3. **API Routes**: Follow structure in `/api/generate/{type}/route.ts`
4. **Types**: Add to `src/types/generation.ts` for AI features
5. **Constants**: Update `src/lib/constants.ts` for new models/pricing

### Code Standards (from docs/RULES.md)
- **TypeScript**: Strict mode enabled, no `any` types allowed
- **Components**: Use App Router with Server Components by default
- **Client Components**: Only when hooks/state needed (`"use client"`)
- **File Naming**: `kebab-case` files/folders, `PascalCase` components
- **Imports**: Use path aliases (`@/components`, `@/lib`, etc.)

### Component Architecture
- **shadcn/ui**: Base components in `src/components/ui/`
- **Feature Components**: Generation-specific in `_components/`
- **Layout Components**: Header, navigation in `src/components/layout/`
- **Common Components**: Shared utilities in `src/components/common/`
- **Protected Routes**: Wrap sensitive content with `<ProtectedRoute>`

### Styling Patterns
- **Tailwind CSS v4**: Uses modern `@import "tailwindcss"` syntax in globals.css
- **CSS Variables**: Extensive use of CSS custom properties for theming
- **Animations**: Custom keyframes defined in globals.css (marquee, shiny-text)
- **Dark Theme**: Default dark theme with comprehensive color scheme
- **Geist Fonts**: Modern typography using Geist Sans and Mono
- **Responsive Design**: Mobile-first approach with embedded navigation
- **Utility Classes**: Prefer Tailwind utilities over custom CSS
- **Component Composition**: Build on shadcn/ui primitives rather than modifying them

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

## Testing & Quality Assurance

### Current Build Status
- **✅ Build Success**: Project compiles without errors
- **✅ Landing Page**: Complete responsive landing page with animations
- **✅ Type Safety**: Full TypeScript validation passes
- **✅ Component Rendering**: All pages and components load correctly
- **✅ Route Navigation**: All routes accessible and functional
- **✅ Mobile Responsive**: Fully responsive with mobile hamburger menu
- **✅ Dark Theme**: Comprehensive dark theme implementation
- **⚠️ Warnings**: Minor ESLint warnings (unused placeholder variables)

### Key Testing Routes
- **Home**: `/` - Complete landing page with embedded navbar and smooth scrolling
- **Sections**: Features, Pricing, Testimonials, FAQ sections with animations
- **Generation**: `/generate/{image,video,music}` - AI generation interfaces
- **Dashboard**: `/dashboard` - Analytics and usage tracking
- **Auth**: `/handler/{sign-up,sign-in}` - Authentication flows
- **Mobile**: All routes fully responsive with hamburger menu

## Performance & Cost Management

### Generation Pricing (from constants.ts)
- **Image Generation**: $0.039 per image (free tier: 5/day)
- **Video Generation**: $0.40 per second (8-second videos = $3.20 each)
- **Music Generation**: ~$0.06 per 30 seconds

### Optimization Features
- **Client Compression**: Pre-process media before upload
- **Smart API Selection**: Files API vs inline based on payload size
- **Usage Tracking**: Real-time quota monitoring in dashboard
- **Protected Routes**: Authentication prevents unauthorized usage

## Available Documentation

### Project Documentation
- `docs/PROTOCOLS.md` - API integration protocols and best practices
- `docs/RULES.md` - Code standards and development rules  
- `docs/NEON.md` - Database management and security protocols
- `docs/ai-hub-implementation-plan.md` - Complete implementation guide
- `docs/gemini-files-api-*.md` - Files API usage guidelines
- `NEON_AUTH_SETUP.md` - Authentication setup instructions

### External References
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Neon Database Docs](https://neon.tech/docs)
- [Stack Auth Docs](https://docs.stack-auth.com/)
- [shadcn/ui Docs](https://ui.shadcn.com/)

## Deployment Notes

### Production Readiness
- **✅ Landing Page**: Professional landing page with animations and responsive design
- **✅ Authentication**: Neon Auth configured and functional
- **✅ Database**: Neon PostgreSQL with Drizzle ORM ready
- **✅ UI Framework**: Complete interface with Tailwind CSS v4 and Geist fonts
- **✅ Component Library**: 50+ shadcn/ui components + custom components
- **✅ Type Safety**: Full TypeScript coverage
- **✅ Mobile Ready**: Fully responsive with hamburger menu and touch interactions
- **⌟ AI APIs**: Ready for API key integration
- **⌟ Database Schema**: User/generation tables need implementation

### Deployment Checklist
1. **Environment Variables**: Configure all required API keys
2. **Database**: Run migrations with `npm run db:migrate`
3. **Authentication**: Verify Stack Auth project settings
4. **API Limits**: Set up monitoring for generation quotas
5. **Cost Tracking**: Implement billing and usage alerts

### Platform Compatibility
- **Vercel**: Is being used. 

---

*Last updated: 2025-09-20*

**Current Status**: Complete landing page with responsive design, professional animations, Tailwind CSS v4, Geist fonts, and 50+ UI components. Authentication functional, ready for AI API integration.
