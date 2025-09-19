Certainly! Here’s a **PROTOCOLS.md** file designed for your Next.js AI generation hub, covering Gemini API best practices, file/media handling, coding conventions, and core operational policies for your team.

***

# PROTOCOLS.md

## Project: AI Generation Hub

*Technologies: Next.js (App Router), Tailwind CSS, shadcn/ui, Gemini API, Vertex AI, Google Lyria, Veo 3*

***

## 1. **Purpose and Scope**

This document defines engineering protocols for managing code, file/media handling, and API integration in the context of an AI multimodal generation app (image, video, music) using Google’s latest models (Gemini 2.5, Nano Banana, Veo 3, Lyria 2).

***

## 2. **Project Structure**

- Use a `src/` directory with feature-based subfolders for each generation type (image, video, music).
- API routes go in `/src/app/api/`.
- UI components are split into `/src/components/ui/` (shadcn) and `/src/app/generate/[media]/_components/` (feature-specific).
- Media helpers, utilities and types live in `/src/lib/` and `/src/types/`.

**Sample layout:**

```
src/
  app/
    generate/image/...
    generate/video/...
    generate/music/...
    api/generate/image/route.ts
    api/generate/video/route.ts
    api/generate/music/route.ts
  components/
  lib/
  types/
```


***

## 3. **Gemini API Integration**

### 3.1 **API Key and Environment**

- Store all API keys and sensitive credentials in `.env.local`, never in code.
- Always read configuration from `process.env`.


### 3.2 **Media Upload Protocol**

- **Inline (base64):**
    - Use for small (under ~5 MB), one-off user images where the entire request with prompt will remain well under 20 MB.
    - Inline media is encoded as base64, which inflates size by ~33%. Always calculate final payload before sending.
- **Files API:**
    - Use for all large (over 5–7 MB) media, video, audio, PDFs, or any scenario where:
        - Total payload (media + prompt) may approach or exceed 20 MB.
        - Media is intended to be reused across multiple API calls.
        - Input is high-res, long, or not easily compressible.
    - Upload via `ai.files.upload` and pass the file URI to `generateContent`.
- **Default to Files API for:**
    - User uploads that might not be compressible to < 5 MB
    - Long audio, video, or high-res photos
    - Multi-part or multi-modal requests
    - Scenarios with chains or “few-shot” prompt examples
    - Anything approaching API’s stated limits
- **File API Best Practices:**
    - Always check post-upload metadata.
    - Remember files expire after 48 hours.
    - Don’t assume file download access; files are *internal* to Gemini API.


### 3.3 **Compression and Aspect Ratio**

- Pre-compress images on the client using canvas APIs (JPEG/WebP, 0.8+ quality).
- Maximum recommended:
    - Gemini image gen (“Nano Banana”): 1024x1024, quality 0.85, <7 MB for inline.
    - Veo 3 image-to-video: 1280x720 or 720x1280, match target aspect and keep <20 MB, prefer Files API for upload.
- Always validate final file size before upload.
- Never upload uncompressed, super high-res or RAW images as inline data.

***

## 4. **Folder/File Naming**

- Use kebab-case for folders and files.
- For feature-specific files, prefix shared items with the feature (`image-`, `video-`, etc).
- Use `.ts(x)` extensions for all React and logic files.

***

## 5. **API Rate Limits and Tiering**

- Free tier offers low daily/minute request allowance. Respect both client-side and server-side quotas.
- If a user might exceed limit (especially for video/music), display a clear warning and suggest tier upgrade.

***

## 6. **Error Handling**

- Catch and log API errors with friendly UX feedback and clear remediation advice.
- Check for and handle:
    - File too large (inline or File API)
    - Invalid MIME/type/format
    - File expired (File API, after 48 hours)
    - API quota exceeded (throttle, inform, queue, or degrade gracefully)
- Alert users to resizing/compression needs pre-upload.

***

## 7. **Security**

- Never store API keys or tokens in frontend code.
- Validate all inputs, especially files (size, type, aspect).
- Strip metadata from user-uploaded images for privacy.
- Use HTTPS for all API calls, including uploads to Files API endpoints.

***

## 8. **Prompt Engineering**

- For multimodal prompts:
    - Place a single image _before_ the instruction text.
    - When context matters, break instructions into step-wise tasks.
    - Use few-shot examples by combining multiple files via URIs in the `contents` array.
- Always specify output format (e.g., JSON, markdown) when predictable structure is required.

***

## 9. **Extensibility**

- All feature-specific logic (image gen, video gen, music gen) must be extendable by separate files for new models or providers.
- Use hooks and helper utilities so main components remain clean.
- For reuse scenarios, use the Files API and keep a file mapping in session state.

***

## 10. **References and Documentation**

- All team members must review:
    - [Gemini API Files API docs](https://ai.google.dev/gemini-api/docs/files)
    - [Gemini image gen guide](https://ai.google.dev/gemini-api/docs/image-generation)
    - [Gemini API rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
    - [Veo 3 and Lyria usage docs (Vertex AI)](https://console.cloud.google.com/vertex-ai/publishers/google/model-garden/lyria-002)
- More tips: Look up [Prompting Strategies](https://ai.google.dev/gemini-api/docs/files#prompt-design-fundamentals)

***

## 11. **Protocol Updates**

Change this file as new Google documentation, API features, or app requirements emerge. Every major protocol change must be versioned.

***

**End of PROTOCOLS.md**

