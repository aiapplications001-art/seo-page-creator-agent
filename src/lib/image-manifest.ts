import { buildSectionImageFilename } from "./image-filenames.js";
import type { PagePacket } from "./page-packet.js";

export interface ImageManifest {
  schemaVersion: "image-manifest.v1";
  page: {
    slug: string;
    h1: string;
    pageId: string;
    companyName: string;
  };
  promptCompanionRequired: boolean;
  assets: ImageAssetRecord[];
}

export interface ImageAssetRecord {
  id: string;
  sectionId?: string;
  purpose: string;
  recommendedFilename: string;
  preferredFormat: "webp";
  aspectRatio: string;
  altText: string;
  status: "reserved" | "brief_needed" | "generated";
  filePath?: string;
  publicUrl?: string;
  licensing: {
    status: "pending_review" | "approved";
    note: string;
  };
  promptBrief?: ImagePromptBrief;
}

export interface ImagePromptBrief {
  imageId: string;
  sectionId?: string;
  imagePurpose: string;
  recommendedAspectRatio: string;
  preferredFormat: "webp";
  brandStyle: string;
  logoUsage: string;
  prompt: string;
  negativeConstraints: string;
  altText: string;
  caption: string;
  designerNotes: string;
}

export function buildImageManifest(packet: PagePacket): ImageManifest {
  const assets = packet.images.map((image) => {
    const recommendedFilename = buildSectionImageFilename(packet.seo.slug, image.purpose, "webp");
    const needsPrompt = image.status !== "generated";
    const promptBrief = needsPrompt ? buildPromptBrief(packet, image) : undefined;

    return {
      id: image.id,
      sectionId: image.sectionId,
      purpose: image.purpose,
      recommendedFilename,
      preferredFormat: "webp" as const,
      aspectRatio: image.aspectRatio,
      altText: image.altText,
      status: image.status,
      licensing: {
        status: image.status === "generated" ? "approved" as const : "pending_review" as const,
        note: image.status === "generated"
          ? "Generated or fetched image must retain source/licensing approval metadata."
          : "Rights and licensing approval should be reviewed before publishing."
      },
      promptBrief
    };
  });

  return {
    schemaVersion: "image-manifest.v1",
    page: {
      slug: packet.seo.slug,
      h1: packet.seo.h1,
      pageId: packet.metadata.sourcePrewritingPageId,
      companyName: packet.metadata.companyName
    },
    promptCompanionRequired: assets.some((asset) => asset.promptBrief),
    assets
  };
}

export function renderImagePromptBriefs(manifest: ImageManifest): string {
  const briefs = manifest.assets
    .map((asset) => asset.promptBrief)
    .filter((brief): brief is ImagePromptBrief => Boolean(brief));

  if (briefs.length === 0) return "";

  const blocks = briefs.map((brief, index) => `## IMG_PROMPT_${String(index + 1).padStart(2, "0")}

\`\`\`yaml
image_id: ${brief.imageId}
section_id: ${brief.sectionId ?? ""}
image_purpose: ${brief.imagePurpose}
recommended_aspect_ratio: ${brief.recommendedAspectRatio}
preferred_format: ${brief.preferredFormat}
brand_style: ${brief.brandStyle}
logo_usage: ${brief.logoUsage}
prompt: ${brief.prompt}
negative_constraints: ${brief.negativeConstraints}
alt_text: ${brief.altText}
caption: ${brief.caption}
designer_notes: ${brief.designerNotes}
\`\`\``).join("\n\n");

  return `# Image Prompt Briefs

Page: ${manifest.page.h1}
Page ID: ${manifest.page.pageId}
Generated: no

Use this companion artifact only for images that were not generated or fetched.

${blocks}
`;
}

function buildPromptBrief(packet: PagePacket, image: PagePacket["images"][number]): ImagePromptBrief {
  return {
    imageId: image.id,
    sectionId: image.sectionId,
    imagePurpose: image.purpose,
    recommendedAspectRatio: image.aspectRatio,
    preferredFormat: "webp",
    brandStyle: `${packet.metadata.companyName} brand guidelines, clean editorial layout, mobile-first readability.`,
    logoUsage: image.id === "IMG_OG" ? "Use brand logo if approved and visually appropriate." : "Use logo only when the brand guideline allows it.",
    prompt: `Create a brand-aligned image for ${packet.seo.h1}: ${image.purpose}. The image should support ${packet.seo.primaryKeyword ?? packet.seo.h1} without making unsupported medical or product claims.`,
    negativeConstraints: "Do not copy competitor visuals, do not use external brand marks without approval, avoid exaggerated before-after claims.",
    altText: image.altText,
    caption: `${packet.seo.h1} visual support`,
    designerNotes: "Prefer WebP output. Keep subject clear on mobile and leave safe space for cropping where needed."
  };
}
