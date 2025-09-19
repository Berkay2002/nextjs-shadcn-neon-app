Certainly! Here’s a **RULES.md** for your Next.js + TypeScript project, with explicit standards for TypeScript, Gemini API usage, shadcn/ui, and Tailwind CSS integration. This file is intended to enforce code quality, consistency, and maintainability across your team and future contributors.

***

# RULES.md

## Project: AI Generation Hub

*(Stack: Next.js / TypeScript / Gemini API / shadcn-ui / Tailwind CSS)*

***

### 1. **General Coding Standards**

- **Use TypeScript for all application and API code.**
- Strict null checks (`"strictNullChecks": true`) required in `tsconfig.json`.
- Do **not** use the `any` type except for third-party library interop (with clear TODO comments).
- Prefer `interface` for objects intended for extension, otherwise use `type`.
- Always define types for function arguments and return values.
- Use `export type` and `export interface` for all types/models in `/src/types/`.

***

### 2. **Next.js Application Rules**

- Use the App Router (`/src/app`) and filesystem-based routing.
- Group feature routes under `/src/app/generate/[feature]/`.
- All API routes must reside in `/src/app/api/`.
- Use [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components) (`"use client";`) only when state or effects are required; otherwise, default to Server Components.
- Lazy load heavy/rarely used components.
- Never commit `.env`, `.env.local`, or API keys to git.
- Use environment variable access only via `process.env`, not directly in UI code.

***

### 3. **Gemini API Usage Rules**

- Always read `GEMINI_API_KEY` from environment variables.
- For file/media handling, follow this protocol:
    - If the media is likely to cause the **total payload** (prompt + files) to exceed **20 MB**, use the Gemini **Files API**.
    - Use inline base64 encoding for lightweight, one-time assets *only* when the entire request is well below **20 MB**.
- Preprocess images on client before upload:
    - Image generation: max 1024x1024px, .jpeg or .webp, ~85% quality.
    - Video (Veo 3): match aspect (1280x720), compress for upload, use File API for large/refined usage.
- Never upload files larger than allowed per Gemini’s official docs.
- Always handle and inform user on Gemini API errors (`413 too large`, quota exceeded, bad filetype).

***

### 4. **Tailwind CSS Rules**

- Use [Tailwind CSS](https://tailwindcss.com/) utility classes for nearly all UI styling; never write custom CSS unless impossible with Tailwind (put exceptions in `/src/styles/`).
- Use `@apply` for grouping common utility classes in custom `.css` as needed (rare).
- Prefer utility classes and responsive variants; avoid fixed px for dimensions except in icons/avatars.
- Use Tailwind’s variant system for hover, focus, dark mode, etc.
- Extract reusable layout structures (grids, flex, containers) as UI components.
- Do not override global body styles unless required for accessibility/brand.

***

### 5. **shadcn/ui Standards**

- Use [shadcn/ui](https://ui.shadcn.com/) for all core interactive and input elements: Button, Card, Tabs, Dialog, etc.
- Never modify shadcn/ui code in `node_modules`; always use the `components/` copy.
- Prefer composition: wrap base shadcn UI primitives in feature-specific components in `/app/generate/[feature]/_components/`.
- Do not mix shadcn UI with third-party unstyled HTML in shared UI areas.
- Use variant props on shadcn components to control visual intent (e.g., `variant="destructive"` on `Button`).

***

### 6. **Component \& File Organization**

- File/folder naming: use `kebab-case` for files and folders, and `PascalCase` for React components.
- Place all type and interface definitions for a feature in `/src/types/[feature].ts`.
- All custom hooks go in `/src/hooks/`, prefixed with `use`.
- Shared UI elements: `/src/components/ui/`.
- Feature-specific: `/src/app/generate/[feature]/_components/`.
- Lib/helper code: `/src/lib/`.
- No single file to exceed 250 lines; split large logic/views into smaller units.

***

### 7. **Error Handling and UX**

- Show clear, actionable error state for:
    - Media/media type/size errors
    - Gemini API/network/server errors
    - Quota and authentication issues
    - General app errors (`/src/components/common/ErrorBoundary.tsx`)
- Provide progress/loading for all long requests or uploads.
- All errors must be logged to console with enough context for debugging; never silently ignore API errors.

***

### 8. **Accessibility \& i18n**

- All input elements, buttons, and forms must have accessible labels.
- Use semantic HTML as much as practical.
- Use Tailwind’s focus and ARIA-safe utilities for keyboard navigation.
- Text content displayed to user should go through i18n utility if localization is needed in the future.

***

### 9. **Version Control \& Review**

- All PRs must be reviewed by at least one team member before merge.
- PRs must describe:
    - Feature being implemented or bug being fixed
    - Any Gemini API protocol or prompt structure changes
    - Any new dependencies or breaking changes

***

### 10. **Testing**

- Prefer **React Testing Library** + **Jest** for components and logic.
- Integration tests for main workflows (file upload, generate, feedback).
- Do not merge code that breaks any existing tests.

***

### 11. **Continuous Improvement**

- Review Gemini and shadcn/ui documentation monthly for breaking changes or new best practices.
- Discuss protocol/rules changes in team syncs before editing this file.

***

_Last updated: 2025-09-19_

---
