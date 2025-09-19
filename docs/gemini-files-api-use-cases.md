Short answer: Use the Files API whenever media is large or reused, or when the total request (media + text) could approach 20 MB; keep inline base64 only for small, single‑use assets that clearly keep the request well under 20 MB.[^1][^2]

### Size and limits

- Switch to the Files API if the total request size would exceed 20 MB, which is Google’s explicit threshold for moving off inline media.[^1]
- Files API supports much larger uploads (up to about 2 GB per file with 48‑hour retention and per‑project storage), making it the right choice for high‑resolution images, long audio, or video.[^1]


### Reuse and workflows

- Prefer the Files API when the same image, audio, or document will be referenced across multiple prompts or multi‑step chains; file URIs let requests reuse the upload without resending bytes.[^2][^1]
- When mixing multiple images in a single prompt, combine a file URI for bigger assets with inline parts for tiny ones to keep payloads efficient.[^2]


### Media type scenarios

- Video, audio, PDFs, multi‑image context packs, or any asset collections that would bloat an inline request are best passed via file uploads.[^2][^1]
- For image understanding and generation, use Files API for high‑res or many images; inline is fine for a small single image and short text.[^2]


### Latency and reliability

- Files API avoids base64 overhead and 413 errors on big payloads, improving reliability for large inputs or unstable networks.[^1][^2]
- Inline is simplest and can be lower‑latency for tiny, one‑off images when the request is far below 20 MB.[^2]


### Practical rule of thumb

- If the asset is bigger than a few MB, will be reused, or the total request might near 20 MB, use Files API; otherwise inline base64 is acceptable for small, single‑use inputs.[^1][^2]

<div style="text-align: center">⁂</div>

[^1]: https://ai.google.dev/gemini-api/docs/files

[^2]: https://ai.google.dev/gemini-api/docs/image-understanding

