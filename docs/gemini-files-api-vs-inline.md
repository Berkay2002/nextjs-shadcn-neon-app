Short answer: Use the Files API whenever the media or the total request could approach 20 MB, when the file is large or reused, or for videos/audio/documents; use inline base64 only for small, one‑off images that keep the whole request comfortably under 20 MB.[^1][^2][^3]

### Use Files API when

- The entire request (inline bytes + prompt + system text) might exceed 20 MB; Google explicitly says to switch to Files API in that case.[^2][^3]
- Media is larger than a few megabytes or high‑resolution, where base64 overhead would risk hitting the 20 MB cap.[^4][^2]
- The same media will be referenced across multiple prompts or steps; Files API gives a URI usable for 48 hours.[^5][^1]
- You need higher limits: Files API supports up to 2 GB per file and about 20 GB project storage.[^1][^5]
- You’re uploading video/audio/PDFs or multi‑image inputs that would otherwise bloat inline payloads.[^3][^6]


### Use inline base64 when

- The image is small and single‑use, and the entire request clearly stays well below 20 MB.[^2][^4]
- You want the simplest single‑call flow and don’t need to reuse the media beyond this request.[^5][^2]


### Veo 3 specifics

- For image‑to‑video, keep the reference image within Veo’s documented max input size (20 MB), and match the output aspect ratio (16:9 or 9:16) by pre‑crop/resize to avoid server cropping.[^7][^8]
- If the reference image is large or reused across multiple Veo generations, prefer Files API and pass the file URI in the request.[^7][^1]


### Quick decision checklist

- Will inline prompt + media stay under 20 MB? If not sure, use Files API.[^3][^2]
- Is the file > a few MB, high‑res, or reused? Use Files API.[^1][^5]
- Is it a tiny, single‑shot reference image? Inline base64 is fine.[^4][^2]
- Working with Veo 3 image‑to‑video and large inputs? Use Files API and ensure correct aspect ratio.[^8][^7]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^9]</span>

<div style="text-align: center">⁂</div>

[^1]: https://ai.google.dev/gemini-api/docs/files

[^2]: https://ai.google.dev/gemini-api/docs/image-understanding

[^3]: https://ai.google.dev/gemini-api/docs/document-processing

[^4]: https://firebase.google.com/docs/ai-logic/input-file-requirements

[^5]: https://ai.google.dev/gemini-api/docs/files

[^6]: https://ai.google.dev/gemini-api/docs/video-understanding

[^7]: https://ai.google.dev/gemini-api/docs/video

[^8]: https://cloud.google.com/vertex-ai/generative-ai/docs/models/veo/3-0-generate-preview

[^9]: https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference

[^10]: https://github.com/BerriAI/litellm/issues/7338

[^11]: https://reference-server.pipecat.ai/en/stable/api/pipecat.services.gemini_multimodal_live.file_api.html

[^12]: https://www.byteplus.com/en/topic/516709

[^13]: https://www.natashatherobot.com/p/pdf-data-extraction-ai-swift-gemini

[^14]: https://fal.ai/models/fal-ai/veo3/image-to-video/api

[^15]: https://discuss.ai.google.dev/t/uploaded-files-missing-after-a-few-days/50428

[^16]: https://aistudio.google.com/models/veo-3

[^17]: https://gemini-api.apidog.io/doc-965860

[^18]: https://gemini-api.apidog.io/doc-965859

[^19]: https://support.google.com/gemini/thread/347721301/gb-size-of-video-gemini-2-5-can-handle?hl=en

[^20]: https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/File_API.ipynb

[^21]: https://www.architjn.com/blog/how-to-use-veo-3-affordable-ai-video-generation

