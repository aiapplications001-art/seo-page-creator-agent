# Image Generation Workflow

V1 supports actual image generation when the active agent environment has image tooling and credentials. If image generation is unavailable or too slow, the agent generates a separate image prompt companion artifact.

## Default Output

For each page packet:

- generate top 3-5 in-page high-impact images by default
- generate one separate OG/social image as `IMG_OG`
- fetch external product/brand visuals only after approval
- provide prompts only for ungenerated suggested images

## Image Source Priority

1. Existing brand assets
2. Product screenshots or approved media
3. Generated images through available provider
4. Prompt-only briefs
5. Competitor/reference visuals for layout inspiration only

## Time Budget

Default generation time budget:

```text
5 minutes
```

If generation exceeds the time budget, ask the user:

```text
Image generation is taking longer than 5 minutes.

Choose one:
1. Continue generating image assets.
2. Use image prompts/briefs for now.
3. Generate only the highest-priority image and brief the rest.
```

If the user says actual images are required, continue generation.

## Required Image Metadata

Each image must include:

- image ID
- section ID
- purpose
- file path or URL
- SEO filename
- alt text
- caption where useful
- aspect ratio
- preferred format
- source URL if fetched
- rights note
- approval status when relevant

## Prompt Companion Artifact

Create `image-prompts.md` only when:

- some recommended images were not generated
- image generation timed out and user chose prompts
- user asked for prompts instead of images
- lower-priority suggested images are brief-only

Do not create it when all required images were generated/fetched.

## Official References

- Gemini image generation: https://ai.google.dev/gemini-api/docs/image-generation
- Imagen through Gemini API: https://ai.google.dev/gemini-api/docs/imagen
