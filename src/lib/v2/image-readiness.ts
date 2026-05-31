export type V2ImageAssetType = "generated" | "fetched_external" | "brand_asset" | "prompt_only" | "reserved";

export interface V2ImageManifestItem {
  id: string;
  assetType: V2ImageAssetType;
  sectionId?: string;
  promptOnlyAcceptedByUser?: boolean;
}

export interface V2ImageReadinessInput {
  manifestGenerated: boolean;
  assets: V2ImageManifestItem[];
}

export interface V2ImageReadinessResult {
  manifestGenerated: boolean;
  requiredSlotsComplete: boolean;
  heroMappedToS1: boolean;
  inPageImageCount: number;
  inPageImageTargetMet: boolean;
  blockingIssues: string[];
  advisoryIssues: string[];
}

const REQUIRED_IMAGE_IDS = ["IMG_OG", "IMG_HERO"] as const;
const HERO_SECTION_ID = "S1_hero";
const MIN_IN_PAGE_IMAGES = 3;
const MAX_IN_PAGE_IMAGES = 5;

export function requiredImageIds(): string[] {
  return [...REQUIRED_IMAGE_IDS];
}

export function imageSlotComplete(item: V2ImageManifestItem): boolean {
  if (item.assetType === "prompt_only") return item.promptOnlyAcceptedByUser === true;
  return item.assetType === "generated" || item.assetType === "fetched_external" || item.assetType === "brand_asset";
}

export function requiredImagesComplete(items: V2ImageManifestItem[]): boolean {
  return REQUIRED_IMAGE_IDS.every((id) => {
    const item = items.find((candidate) => candidate.id === id);
    return Boolean(item && imageSlotComplete(item));
  });
}

export function evaluateV2ImageReadiness(input: V2ImageReadinessInput): V2ImageReadinessResult {
  const blockingIssues: string[] = [];
  const advisoryIssues: string[] = [];
  const requiredSlotsComplete = requiredImagesComplete(input.assets);
  const hero = input.assets.find((asset) => asset.id === "IMG_HERO");
  const heroMappedToS1 = hero?.sectionId === HERO_SECTION_ID;
  const inPageImageCount = input.assets.filter((asset) => asset.id !== "IMG_OG").length;
  const inPageImageTargetMet = inPageImageCount >= MIN_IN_PAGE_IMAGES && inPageImageCount <= MAX_IN_PAGE_IMAGES;

  if (!input.manifestGenerated) {
    blockingIssues.push("Image manifest must be generated before publish-ready status.");
  }

  for (const id of REQUIRED_IMAGE_IDS) {
    const item = input.assets.find((asset) => asset.id === id);
    if (!item) {
      blockingIssues.push(`${id} is required for publishing readiness.`);
    } else if (!imageSlotComplete(item)) {
      blockingIssues.push(`${id} must be generated, fetched, brand-provided, or prompt-only accepted by the user.`);
    }
  }

  if (!heroMappedToS1) {
    blockingIssues.push("IMG_HERO must map to S1_hero.");
  }

  if (!inPageImageTargetMet) {
    advisoryIssues.push(`Aim for 3-5 in-page images; OG image is tracked separately. Current in-page count: ${inPageImageCount}.`);
  }

  return {
    manifestGenerated: input.manifestGenerated,
    requiredSlotsComplete,
    heroMappedToS1,
    inPageImageCount,
    inPageImageTargetMet,
    blockingIssues,
    advisoryIssues
  };
}
