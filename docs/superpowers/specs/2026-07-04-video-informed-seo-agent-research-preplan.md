# Video-Informed SEO Agent Research Pre-Plan

Date: 2026-07-04
Status: research draft, not implemented
Scope: use three requested YouTube videos and linked official resources to identify future improvements for the local SEO page creator agent.

## Source Access Note

I verified the three requested YouTube videos through YouTube metadata and page descriptions. Full caption bodies were not retrievable from this environment: YouTube exposed caption tracks for at least one video, but the timedtext endpoint returned zero-length content, and a transcript mirror reported that YouTube was blocking subtitle fetching.

This draft therefore uses:

- verified video title, author/channel, publish date, duration, and YouTube description
- official Google resources linked from the Google Search Central video
- implementation implications inferred from those verified materials

Before implementation, a human or an agent with transcript/video access should review the full videos and fill a `videoTranscriptNotes` artifact with exact timestamped claims.

## Requested Videos

### 1. Neil Patel: "You're Doing SEO Wrong"

URL: https://www.youtube.com/watch?v=H7m6myWuwII
Channel: Neil Patel
Published: 2026-07-01
Duration: 624 seconds

Verified description themes:

- Google ranking and AI visibility are now separate surfaces.
- Ranking well in classic Google results does not guarantee being cited in AI answers.
- Search should be interpreted through the "moment behind the search," not just keyword matching.
- AI citation visibility depends partly on the brand/page itself and partly on third-party sources such as Reddit, review sites, trust sites, and roundup lists.
- The video frames Google Micro-Moments as a useful lens for understanding real user intent.

Agent implications:

- Add an `aiCitationReadiness` layer separate from classic SERP superiority.
- Treat keyword targeting as insufficient unless the agent identifies the user moment: "know", "go", "do", "buy", or a domain-specific variant.
- Add off-page citation/source presence checks to research, especially Reddit, review sites, listicles, comparison pages, forum discussions, and trusted aggregators.
- Require the page packet to include "answer blocks" that are extractable for AI Overviews/AI Mode without being generic.
- Add a warning when the page is optimized only for ranking but lacks off-page corroboration or third-party language.

### 2. Google Search Central: "Google Search Gen AI Reports, Search Profiles & more (Q2 '26)"

URL: https://www.youtube.com/watch?v=sq55KB5icQ4
Channel: Google Search Central
Published: 2026-06-18
Duration: 388 seconds

Verified description themes:

- Google launched Generative AI Performance Reporting in Search Console for a subset of websites.
- Reports give dedicated views of visibility in AI Overviews, AI Mode, and generative AI features in Discover.
- Google introduced a control for how site content grounds responses in generative AI Search features.
- The episode links to Google's updated guidance on optimizing for generative AI search.
- Search Profiles and Preferred Sources matter for creators/publishers and brand visibility.

Official-resource takeaways:

- Google says its new generative AI reports show impressions, pages, countries, devices, and dates for URLs appearing in generative AI features.
- Google says website owners can choose whether their content appears in, links from, and helps ground certain generative AI Search features.
- Google says generative AI features create new query behavior and opportunities; its guidance emphasizes unique, non-commodity content, page experience, and high-quality images/video.

Agent implications:

- The agent should not only optimize pages; it should prepare measurement hooks for AI visibility.
- Add optional artifact fields for `searchConsoleGenerativeAiPlan`: target pages, expected AI answer blocks, countries/devices to monitor, and reporting caveats.
- Add `generativeAiControlPolicy` as an onboarding/project setting, especially for brands that may choose to opt in/out.
- Add Search Profiles / Preferred Sources notes when a brand is publisher-like, creator-led, or has named experts.
- Add image/video quality requirements to page packets because Google explicitly ties generative AI visibility guidance to richer media and page experience.

### 3. Ahrefs: "How I'd Get Traffic to a New Website if I Had to Start Over (2026)"

URL: https://www.youtube.com/watch?v=Qs_p21vLp1A
Channel: Ahrefs
Published: 2026-01-07
Duration: 577 seconds

Verified description themes:

- New sites should first improve discovery and trust through relevant directories and citations.
- Competitor citation mining can reveal where a brand should be listed.
- Free tools are a strong early traffic asset because tool queries may still earn clicks.
- Tool ideation can use modifiers like calculator, checker, converter.
- Email capture and lead magnets should convert attention into owned traffic.
- Reddit/forum participation should be thoughtful and targeted at threads that already rank.
- Partnerships, co-branded tools, and experience-driven content compound visibility.

Agent implications:

- Add page-opportunity types beyond informational pages: tools, calculators, checkers, converters, directory/citation pages, comparison assets, and partnership/linkable assets.
- For new/low-authority brands, the agent should not blindly generate 50 blog pages; it should recommend a mixed traffic plan with citations, tools, community answers, and owned audience capture.
- Add `linkableAssetOpportunity` scoring to cluster planning.
- Add `ownedTrafficCapture` requirements when page intent can support a lead magnet, email capture, quiz, checklist, or downloadable calculator.
- Add `communityThreadTargeting`: identify Reddit/forum threads already ranking and require helpful, non-spammy answer guidance.

## Proposed Future Agent Artifacts

### `ai-citation-readiness.json`

Purpose: prove the page has a chance to be cited in AI Overviews/AI Mode, not only classic organic results.

Fields:

- `targetMoment`: know, go, do, buy, compare, troubleshoot, validate, local, or custom
- `classicSerpRankability`: current SERP competitiveness and page superiority summary
- `aiCitationOpportunity`: likely AI answer shape and gaps
- `thirdPartyCorroboration`: Reddit/forum/review/listicle/trusted-source evidence
- `offPagePresenceGaps`: directories, review sites, listicles, and communities where brand/category presence is missing
- `extractableAnswerBlocks`: concise answer blocks planned for AI retrieval
- `citationRisk`: claims that should not be phrased as definitive without trust sources

Hard gate idea:

- Fail if the page has no target moment.
- Fail if AI answer blocks are generic or unsupported.
- Fail if high-trust claims rely on Reddit/community sources as medical or safety evidence.
- Warn if third-party corroboration is weak.

### `new-site-traffic-playbook.json`

Purpose: stop the agent from over-producing blog pages for a new or low-authority brand when a mixed asset strategy is better.

Fields:

- `brandAuthorityStage`: new, emerging, established
- `citationOpportunities`: directories, maps, review profiles, niche hubs
- `toolOpportunities`: calculators, checkers, converters, scorecards, generators
- `communityOpportunities`: ranking Reddit/forum threads, answer angles, risks
- `ownedTrafficCapture`: lead magnet, email capture, checklist, quiz, downloadable guide
- `partnershipOpportunities`: co-branded tools, guest assets, expert quotes
- `pageMixRecommendation`: pages vs tools vs directory/citation work

Hard gate idea:

- If brand is new/emerging, require at least one non-blog linkable asset or citation plan per cluster.
- If a tool opportunity exists with clear search demand and low AI Overview risk, flag it as a priority asset.
- If page intent is high-effort but low authority, require a distribution plan, not just publish.

### `generative-ai-measurement-plan.json`

Purpose: align page generation with Search Console generative AI reporting and Google controls.

Fields:

- `searchConsoleProperty`
- `generativeAiControlState`
- `targetPages`
- `expectedAiFeatureSurfaces`: AI Overviews, AI Mode, Discover generative AI
- `monitoringDimensions`: pages, countries, devices, dates
- `reportingLimitations`
- `successSignals`: impressions, page appearances, query/topic clusters where available

Hard gate idea:

- Warn if the project has no Search Console property or no policy for generative AI inclusion.
- For brands that opt out of generative AI Search features, avoid claiming AI citation goals.

## How This Should Influence Existing Gates

### Cluster Planning

Current cluster planning should expand beyond "which pages can we create?" to "which assets can earn attention?"

Add scoring dimensions:

- classic SEO page opportunity
- AI citation opportunity
- linkable asset opportunity
- community demand
- tool/calculator/checker fit
- directory/citation gap
- owned traffic capture fit
- authority-stage fit

### Page Research

Every page should capture:

- the searcher's moment behind the keyword
- third-party corroboration sources
- AI Overview/AI Mode answer shape when available
- whether the topic is better served by a page, tool, checklist, calculator, comparison matrix, or community answer

### Page Structure

The Research-Derived Structure Gate should add:

- `targetMoment`
- `aiAnswerBlockPlacement`
- `offPageCorroborationRefs`
- `linkableAssetOrToolDecision`
- `ownedTrafficCaptureFit`

### Final Copy

Final copy should visibly include:

- answer blocks for the target moment
- a standout asset, table, tool flow, checklist, or calculator concept when research supports it
- experience-driven content that competitors cannot easily copy
- clear citation/source handling for high-trust claims
- natural CTA or owned-traffic capture only when it serves the reader

## Open Questions Before Implementation

1. Should `ai-citation-readiness.json` be a separate artifact, or folded into `pre-draft-quality-brief.json` to avoid artifact sprawl?
2. Should `new-site-traffic-playbook.json` run at cluster level only, or also per page?
3. For brands without Search Console access, should `generative-ai-measurement-plan.json` be optional with warnings, or a hard blocker for batch publishing?
4. Should the agent create tool/calculator page packets, or only recommend them until a UI/tool builder exists?
5. How should we score off-page corroboration for brands that are new and naturally have weak third-party mentions?

## Recommended Next Step

Do not implement immediately. First, manually review the full videos or provide transcripts. Then convert this draft into a design proposal with exact schema changes and gates.

The likely implementation direction is:

1. Extend existing `pre-draft-quality-brief.json` with `targetMoment`, `aiCitationReadiness`, and `linkableAssetDecision`.
2. Add cluster-level `newSiteTrafficPlaybook` rather than a per-page artifact first.
3. Add optional `generativeAiMeasurementPlan` for projects with Search Console access.
4. Update adapters so they do not create page-only batches when a tool/citation/community asset is strategically better.
