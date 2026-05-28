export function normalizeImageFilename(input: string, extension = "webp"): string {
  const cleanExtension = extension.replace(/^\./, "").toLowerCase() || "webp";
  const base = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  const safeBase = base || "seo-image";
  return `${safeBase}.${cleanExtension}`;
}

export function buildSectionImageFilename(pageSlug: string, imagePurpose: string, extension = "webp"): string {
  return normalizeImageFilename(`${pageSlug}-${imagePurpose}`, extension);
}
