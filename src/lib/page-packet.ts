import type { PreWritingStrategy } from "./prewriting-strategy.js";

export interface GeneratePagePacketInput {
  prewritingStrategy: PreWritingStrategy;
  author?: PersonCredit;
  reviewer?: PersonCredit;
  createdDate?: string;
  updatedDate?: string;
}

export interface PersonCredit {
  name: string;
  descriptor?: string;
}

export interface PagePacket {
  metadata: {
    schemaVersion: "page-packet.v1";
    sourcePrewritingPageId: string;
    companyName: string;
    market: string;
    pageType: string;
    createdDate: string;
    updatedDate: string;
    copyStatus?: "scaffold" | "expanded_review_ready";
  };
  seo: {
    title: string;
    description: string;
    slug: string;
    h1: string;
    primaryKeyword?: string;
    secondaryKeywords: string[];
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
  };
  authorship: {
    author: PersonCredit;
    reviewer?: PersonCredit;
    reviewedByVisible: false;
  };
  cta: {
    primary: {
      label: string;
      microcopy: string;
      destination?: string;
    };
    mobileSticky: {
      label: string;
      destination?: string;
    };
  };
  rendering: {
    mobileFirst: true;
    desktopNotes: string[];
    mobileNotes: string[];
  };
  sections: Array<{
    id: string;
    heading: string;
    role: string;
    markdown: string;
  }>;
  links: {
    internal: Array<{
      url: string;
      anchorText: string;
      placement: string;
    }>;
    external: Array<{
      url: string;
      label: string;
      opensInNewTab: true;
      purpose: "citation" | "destination";
    }>;
  };
  images: Array<{
    id: string;
    sectionId?: string;
    purpose: string;
    aspectRatio: string;
    altText: string;
    status: "reserved" | "brief_needed" | "generated";
  }>;
  schemaDrafts: Array<{
    type: "WebPage" | "BreadcrumbList" | "FAQPage";
    jsonLd: Record<string, unknown>;
  }>;
  machineReadable: {
    sections: PagePacket["sections"];
    images: PagePacket["images"];
    links: PagePacket["links"];
  };
}

export function generatePagePacket(input: GeneratePagePacketInput): PagePacket {
  const strategy = input.prewritingStrategy;
  if (!strategy.tone.selected) {
    throw new Error("Selected tone is required before generating a page packet.");
  }

  const createdDate = input.createdDate ?? new Date().toISOString().slice(0, 10);
  const updatedDate = input.updatedDate ?? createdDate;
  const title = `${strategy.selectedPage.title} | ${strategy.companyName}`;
  const description = buildDescription(strategy);
  const h1 = strategy.selectedPage.title;
  const author = input.author ?? {
    name: `${strategy.companyName} Editorial Team`,
    descriptor: "Brand editorial team"
  };
  const reviewer = input.reviewer;
  const sections = strategy.pageStructure.sections.map((section) => ({
    id: section.id,
    heading: headingFromSectionId(section.id),
    role: section.contentRole,
    markdown: sectionMarkdown(strategy, section.id, headingFromSectionId(section.id))
  }));
  const images = buildImages(strategy);
  const links = buildLinks(strategy);

  return {
    metadata: {
      schemaVersion: "page-packet.v1",
      sourcePrewritingPageId: strategy.selectedPage.id,
      companyName: strategy.companyName,
      market: strategy.market,
      pageType: strategy.selectedPage.pageType,
      createdDate,
      updatedDate
    },
    seo: {
      title,
      description,
      slug: strategy.selectedPage.suggestedUrlSlug,
      h1,
      primaryKeyword: strategy.keywords.primary,
      secondaryKeywords: strategy.keywords.secondary,
      ogTitle: title,
      ogDescription: description,
      twitterTitle: title,
      twitterDescription: description
    },
    authorship: {
      author,
      reviewer,
      reviewedByVisible: false
    },
    cta: {
      primary: {
        label: "Start your free skin analysis now",
        microcopy: "Scan your face to understand visible acne, oiliness, marks, texture, and skin signals in about 60 seconds.",
        destination: strategy.cta.recommendedDestination
      },
      mobileSticky: {
        label: "Start analysis",
        destination: strategy.cta.recommendedDestination
      }
    },
    rendering: {
      mobileFirst: true,
      desktopNotes: [
        "Keep the primary CTA visible in the first fold.",
        "Use section blocks as editable units."
      ],
      mobileNotes: [
        "Use a sticky shortened CTA where appropriate.",
        "Prioritize short paragraphs and visible section hierarchy."
      ]
    },
    sections,
    links,
    images,
    schemaDrafts: buildSchemaDrafts(strategy, h1, description),
    machineReadable: {
      sections,
      images,
      links
    }
  };
}

export function renderPagePacketMarkdown(packet: PagePacket): string {
  const sectionMarkdownBlocks = packet.sections.map((section) => `<!-- SECTION_ID: ${section.id} -->
## ${section.heading}

${section.markdown}
`).join("\n");

  const internalLinks = packet.links.internal.map((link) => `- [${link.anchorText}](${link.url}) — ${link.placement}`).join("\n") || "- None";
  const externalLinks = packet.links.external.map((link) => `- ${link.label}: ${link.url} (${link.purpose}, opens in new tab)`).join("\n") || "- Add cited reference URLs after live research.";
  const imageRows = packet.images.map((image) => `| ${image.id} | ${image.sectionId ?? "reserved"} | ${image.purpose} | ${image.aspectRatio} | ${image.status} |`).join("\n");

  return `# Page Packet: ${packet.seo.h1}

## Meta Requirements

- Title: ${packet.seo.title}
- Description: ${packet.seo.description}
- Slug: ${packet.seo.slug}
- H1: ${packet.seo.h1}
- Primary keyword: ${packet.seo.primaryKeyword ?? "Not provided"}
- Secondary keywords: ${packet.seo.secondaryKeywords.length > 0 ? packet.seo.secondaryKeywords.join(", ") : "None provided"}
- OG title: ${packet.seo.ogTitle}
- OG description: ${packet.seo.ogDescription}
- Twitter title: ${packet.seo.twitterTitle}
- Twitter description: ${packet.seo.twitterDescription}

## Authorship

- Authored by: ${packet.authorship.author.name}${packet.authorship.author.descriptor ? `, ${packet.authorship.author.descriptor}` : ""}
- Reviewed by visibility: hidden
- Created: ${packet.metadata.createdDate}
- Updated: ${packet.metadata.updatedDate}

## CTA

- Primary CTA: ${packet.cta.primary.label}
- CTA microcopy: ${packet.cta.primary.microcopy}
- Destination: ${packet.cta.primary.destination ?? "Not provided"}
- Mobile sticky CTA: ${packet.cta.mobileSticky.label}

${sectionMarkdownBlocks}

## Internal Links

${internalLinks}

## External References

${externalLinks}

## Image Slots

| ID | Section | Purpose | Aspect ratio | Status |
| --- | --- | --- | --- | --- |
${imageRows}

## JSON-LD Drafts

\`\`\`json
${JSON.stringify(packet.schemaDrafts, null, 2)}
\`\`\`

## Machine-Readable JSON

\`\`\`json
${JSON.stringify(packet, null, 2)}
\`\`\`
`;
}

function buildDescription(strategy: PreWritingStrategy): string {
  return `${strategy.selectedPage.title} for ${strategy.audience.cohort}, with clear guidance, references, and one primary action path.`;
}

function headingFromSectionId(id: string): string {
  return id
    .replace(/^S[0-9]+_/, "")
    .split("_")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function sectionMarkdown(strategy: PreWritingStrategy, sectionId: string, heading: string): string {
  if (sectionId === "S1_hero") {
    return `# ${strategy.selectedPage.title}

${strategy.selectedPage.targetIntent}

**${"Start your free skin analysis now"}**

Scan your face to understand visible acne, oiliness, marks, texture, and skin signals in about 60 seconds.`;
  }

  if (sectionId === "S8_faq") {
    return `### FAQ draft

**Question:** What should a reader understand before choosing ${strategy.category.name.toLowerCase()}?

**Answer:** The page should answer this with source-backed, brand-appropriate guidance after live reference review.`;
  }

  if (sectionId === "S10_references") {
    return "Add reference URLs, source labels, and access dates after live search and editorial review.";
  }

  return `Editable section scaffold for ${heading}. Preserve the section purpose from the Pre-Writing Strategy and replace this scaffold with final reviewed copy.`;
}

function buildLinks(strategy: PreWritingStrategy): PagePacket["links"] {
  return {
    internal: strategy.cta.recommendedDestination
      ? [{
        url: strategy.cta.recommendedDestination,
        anchorText: strategy.category.name,
        placement: "primary CTA and contextual body link"
      }]
      : [],
    external: []
  };
}

function buildImages(strategy: PreWritingStrategy): PagePacket["images"] {
  const supportingSections = strategy.pageStructure.sections
    .filter((section) => section.id !== "S1_hero")
    .slice(0, 3);

  return [
    {
      id: "IMG_OG",
      purpose: "Open Graph image for social and search previews.",
      aspectRatio: "1.91:1",
      altText: `${strategy.selectedPage.title} preview image`,
      status: "reserved"
    },
    {
      id: "IMG_HERO",
      sectionId: "S1_hero",
      purpose: "Mandatory hero visual for the first fold.",
      aspectRatio: "16:9",
      altText: `${strategy.category.name} hero visual`,
      status: "brief_needed" as const
    },
    ...supportingSections.map((section, index) => ({
      id: `IMG_${String(index + 2).padStart(2, "0")}`,
      sectionId: section.id,
      purpose: `High-impact visual support for ${section.id}.`,
      aspectRatio: "4:3",
      altText: `${strategy.category.name} ${headingFromSectionId(section.id).toLowerCase()} visual`,
      status: "brief_needed" as const
    }))
  ];
}

function buildSchemaDrafts(strategy: PreWritingStrategy, h1: string, description: string): PagePacket["schemaDrafts"] {
  const drafts: PagePacket["schemaDrafts"] = [
    {
      type: "WebPage",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: h1,
        description
      }
    },
    {
      type: "BreadcrumbList",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "/" },
          { "@type": "ListItem", position: 2, name: strategy.category.name, item: `/${strategy.category.slug}` }
        ]
      }
    }
  ];

  if (strategy.pageStructure.sections.some((section) => section.id === "S8_faq")) {
    drafts.push({
      type: "FAQPage",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: []
      }
    });
  }

  return drafts;
}
