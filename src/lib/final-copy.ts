import type { PagePacket } from "./page-packet.js";

export function expandPagePacketCopy(packet: PagePacket): PagePacket {
  const sections = packet.sections.map((section) => ({
    ...section,
    markdown: expandSection(packet, section.id, section.heading)
  }));

  return {
    ...packet,
    metadata: {
      ...packet.metadata,
      copyStatus: "expanded_review_ready"
    },
    sections,
    machineReadable: {
      ...packet.machineReadable,
      sections
    }
  };
}

function expandSection(packet: PagePacket, sectionId: string, heading: string): string {
  const keyword = packet.seo.primaryKeyword ?? packet.seo.h1.toLowerCase();
  const destination = packet.cta.primary.destination;

  if (sectionId === "S1_hero") {
    return `# ${packet.seo.h1}

If you are trying to understand ${keyword}, start with the visible signals you can act on today. ${packet.metadata.companyName} helps you move from concern to a clearer next step with one focused path: ${packet.cta.primary.label}.

**${packet.cta.primary.label}**

${packet.cta.primary.microcopy}`;
  }

  if (sectionId === "S2_quick_answer") {
    return `${packet.seo.h1} is designed for readers who want a practical, source-aware answer on ${keyword}. The page should explain what the concern means, what signals matter, and when the reader should move toward the recommended action${destination ? ` at ${destination}` : ""}.`;
  }

  if (sectionId === "S3_context") {
    return `This section should frame the reader's situation in plain language before moving into detail. Keep the tone aligned with the page packet, avoid inflated claims, and connect the problem to the reader's likely decision moment.`;
  }

  if (sectionId === "S4_main_content") {
    return `Use this section to explain the main topic with clear subpoints, practical examples, and natural use of ${keyword}. Keep paragraphs compact, use reference-backed claims, and avoid copying competitor wording.`;
  }

  if (sectionId === "S5_decision_support") {
    return `Help the reader compare options using qualitative labels, decision criteria, or a compact checklist. The goal is to reduce uncertainty without creating a second competing CTA.`;
  }

  if (sectionId === "S6_product_or_solution_block") {
    return `Connect the reader's problem to the recommended internal path. Preserve the primary destination${destination ? ` (${destination})` : ""} unless an editor changes the strategy.`;
  }

  if (sectionId === "S7_trust_proof") {
    return `Show why this page can be trusted: include the author, creation or update date, review method where relevant, and a short methodology note. Keep reviewer visibility hidden unless the editor explicitly chooses otherwise.`;
  }

  if (sectionId === "S8_faq") {
    return `### Frequently Asked Questions

**What should I know before choosing ${keyword}?**

Start with visible signals, your goal, and whether you need education, comparison, or direct product guidance.

**Can this page include FAQ schema?**

Yes, if these questions remain visible on the page and are reviewed with the final copy.`;
  }

  if (sectionId === "S9_final_cta") {
    return `Ready for the next step? ${packet.cta.primary.label}.

${packet.cta.primary.microcopy}`;
  }

  if (sectionId === "S10_references") {
    return "Reference URLs still need live source review. Add official, brand, competitor, or citation URLs here only after checking relevance, source quality, and external-link purpose.";
  }

  return `Expanded review-ready draft copy for ${heading}. Replace this with adapter-written final prose when live source review and editorial approval are complete.`;
}
