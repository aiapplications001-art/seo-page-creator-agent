# Step 0B Page Scope Contract Design

Status: Approved design proposal
Scope: Local replica only
Date: 2026-07-05

## Purpose

Step 0B turns the approved Step 0A foundation into one frozen page opportunity.

Step 0A defines:

- The topic
- The search problem
- The problem-language
- Business-side relevance
- Reader state

Step 0B must then answer:

- What is the main keyword for this page?
- What related searches belong with it?
- Should this be one page or split into separate pages?

By the end of Step 0B, the workflow must know:

- `targetKeyword`
- `targetQueryIntent`
- `queryCluster`
- `pageScope`
- `selectedOpportunity`
- `contractHash`

Step 0B is not a writing step and not a deep SERP superiority step. It is a keyword, clustering, and page-boundary decision gate.

## Core Rule

Step 0B is complete only when one exact target keyword, one tight query cluster, and one page scope all serve the same approved Step 0A search problem.

If the keyword, query cluster, page type, reader stage, or page scope points to a different search problem, Step 0B must fail, repair, split the opportunity, or ask the user.

## 0B.1 Define The Job

The agent must begin Step 0B by carrying forward Step 0A.

Required fields:

```json
{
  "inputStep0AStatus": "pass",
  "topic": "...",
  "primarySearchProblem": "...",
  "problemLanguageCarriedForward": ["..."],
  "businessSideRelevance": "...",
  "readerStateCarriedForward": {
    "likelyKnows": ["..."],
    "likelyDoesNotKnow": ["..."],
    "likelyFeels": ["..."],
    "likelyFears": ["..."],
    "likelyMisunderstands": ["..."],
    "needsReassuranceAbout": ["..."]
  },
  "step0BJobStatement": "Turn the approved Step 0A search problem into one selected page opportunity.",
  "nonGoals": [
    "Do not write page copy.",
    "Do not generate a full page structure.",
    "Do not perform deep competitor-quality analysis.",
    "Do not create title/meta final copy."
  ]
}
```

Step 0B must not silently change Step 0A. If live keyword/search evidence contradicts Step 0A, the agent must route back to repair Step 0A or ask the user.

## 0B.2 Collect Candidate Keyword Phrases

Before choosing the target keyword, the agent must collect candidate phrases that may represent the same or closely related search opportunity.

The agent must not choose:

- The first phrase that comes to mind
- The shortest phrase
- The phrase that sounds best
- The highest-volume phrase by default
- The easiest keyword by difficulty alone

### Live Evidence Requirement

Step 0B requires live keyword/search evidence to pass.

User-provided or inferred phrases may seed the process, but cannot produce a full pass without validation from live sources.

Approved evidence source types:

- `google_serp_manual_search`
- `people_also_ask`
- `autocomplete`
- `related_searches`
- `search_console`
- `internal_site_search`
- `keyword_planner`
- `ahrefs_semrush_or_similar`
- `youtube_search_suggestions`
- `audience_language`

Reddit, forums, video comments, reviews, and social discussions can support audience-language fit, but they cannot prove keyword demand by themselves.

### Minimum Evidence Sources

To pass, Step 0B requires at least two approved source types.

At least one must be a true search-demand source:

- Google SERP/manual search
- People Also Ask
- Autocomplete
- Related searches
- Search Console
- Keyword Planner
- Ahrefs/Semrush or similar
- Internal site search

If fewer than two source types are available:

- `pass` is not allowed.
- `pass_with_warnings` is allowed only if one strong demand source exists and the missing second source is genuinely inaccessible.
- If no true demand source exists, Step 0B fails.

### Candidate Phrase Fields

Every collected phrase must be retained and routed.

```json
{
  "phrase": "...",
  "normalizedPhrase": "...",
  "sourceType": "google_serp_manual_search",
  "sourceClass": "search_demand",
  "sourceRef": "...",
  "intentClass": "...",
  "pageTypeFit": "...",
  "problemAlignment": "strong | partial | adjacent | contradicts",
  "businessFit": "strong | partial | weak | unknown",
  "route": "target_candidate | supporting_query | close_variant | question_query | modifier_query | future_page_opportunity | separate_page_opportunity | refresh_existing_page | merge_with_existing_page | excluded_for_current_page | needs_user_clarification",
  "routeReason": "...",
  "sameSearchProblem": true,
  "sameIntent": true,
  "samePageType": true,
  "samePageFocus": true,
  "evidenceRefs": ["..."],
  "metrics": {
    "volume": null,
    "impressions": null,
    "clicks": null,
    "position": null,
    "cpc": null,
    "difficulty": null
  }
}
```

If any collected candidate phrase is unrouted, Step 0B fails.

## 0B.3 Define The Target Keyword

Every SEO page requires one exact `targetKeyword`.

The target keyword is the single main search phrase the page is primarily built around. It is the page's search anchor.

The agent must also define `targetQueryIntent`, which explains the human meaning behind the keyword so later stages write for the reader rather than mechanically repeating the phrase.

Example:

```json
{
  "targetKeyword": "double cleansing for oily acne prone skin",
  "targetQueryIntent": "The reader wants to know whether double cleansing is safe and useful for oily acne-prone skin, what products to use, what mistakes to avoid, and how to adapt it for Indian weather and routines."
}
```

### Target Keyword Scorecard

The agent must use structured pass/fail reasoning plus a small scorecard. The score guides the decision, but hard blockers override the score.

Recommended scorecard:

```text
Search problem fit: 30
Page-anchor strength: 20
Business relevance: 20
Live demand evidence: 15
SERP/page-type fit: 10
Difficulty/practicality: 5
Total: 100
```

Hard blockers override a high score:

- The keyword contradicts Step 0A.
- The keyword has no live evidence.
- The keyword implies the wrong page type.
- The keyword mixes primary intent.
- The keyword creates clear existing-page cannibalization.
- The keyword cannot support one clear page opportunity.

### Required Target Keyword Fields

```json
{
  "targetKeyword": "...",
  "normalizedTargetKeyword": "...",
  "targetQueryIntent": "...",
  "whyThisKeyword": "...",
  "searcherTask": "...",
  "primaryIntent": "...",
  "primaryReaderStage": "...",
  "pageType": "...",
  "alignmentTo0A": "...",
  "businessJustification": "...",
  "scorecard": {
    "searchProblemFit": 0,
    "pageAnchorStrength": 0,
    "businessRelevance": 0,
    "liveDemandEvidence": 0,
    "serpPageTypeFit": 0,
    "difficultyPracticality": 0,
    "total": 0
  },
  "confidence": "high | medium | low",
  "tradeoffs": ["..."],
  "rejectedAlternatives": [
    {
      "keyword": "...",
      "reasonRejected": "..."
    }
  ]
}
```

## 0B.4 Define The Query Cluster

Once the target keyword is chosen, the agent must define the query cluster.

A query cluster is the group of closely related search phrases that reflect the same or nearly the same user need and can be satisfied by the same page.

A query cluster is not:

- Every keyword related to the topic
- Every phrase with one similar word
- Every suggestion from a keyword tool
- A random list of semantically related terms

A query cluster is:

- A tightly related set of phrases
- Built around the same search task
- Suitable to be covered by one page without losing focus

### Supporting Query Count

Normal SEO pages require 3-8 supporting queries.

Fewer than 3 supporting queries means the cluster may be under-researched, unless the agent proves the page is intentionally narrow and live evidence supports that narrowness.

More than 8 supporting queries fails by default unless the extras are clearly:

- Close variants
- Question queries
- Low-risk modifier variants
- Not changing intent
- Not changing page type
- Not changing page scope

Extra queries must be routed into:

- `futurePageOpportunity`
- `separatePageOpportunity`
- `faqCandidate`
- `excludedForCurrentPage`

### Query Cluster Fields

```json
{
  "clusterName": "...",
  "primaryQuery": "...",
  "closeVariants": ["..."],
  "supportingQueries": ["..."],
  "questionQueries": ["..."],
  "modifierQueries": ["..."],
  "comparisonQueries": ["..."],
  "commercialQueries": ["..."],
  "informationalQueries": ["..."],
  "includedIntentSummary": "...",
  "excludedIntentSummary": "..."
}
```

## 0B.5 Separate Close Variants From Different Opportunities

Not every related phrase belongs in the same cluster.

The agent must separate:

- Close variants of the same search task
- Different opportunities that need separate pages

The simplest test:

```text
Can one page fully satisfy all of these searches without becoming unfocused or mixing different user goals?
```

If no, split them.

### Four Split Tests

Each related phrase must pass these tests to stay in the current page scope:

1. Search problem test: Does this phrase represent the same real-world problem?
2. Intent test: Does this phrase have the same primary intent?
3. Page type test: Can the same page type satisfy both phrases?
4. Focus test: Would adding this phrase keep the page clear and focused?

If any of these fail meaningfully, route the phrase out.

### Light SERP Overlap Check

Step 0B includes a light SERP overlap check for clustering and splitting only.

This check answers:

- Do the phrases show similar ranking page types?
- Do the phrases appear to satisfy the same search task?
- Do top results overlap enough to suggest one page can serve both?

Step 0B must not perform full competitor-quality analysis. That belongs to the SERP Superiority Gate.

Practical rule:

- Strong SERP/page-type overlap supports clustering.
- Different page types, different intent, or low overlap supports splitting.
- Mixed SERPs must still resolve to one dominant primary intent for the selected page.

### Variant Separation Fields

```json
{
  "closeVariantsKeptOnPage": [
    {
      "phrase": "...",
      "whyKept": "...",
      "evidenceRefs": ["..."]
    }
  ],
  "differentOpportunitiesSplitOut": [
    {
      "phrase": "...",
      "reasonForSplit": "...",
      "differentIntent": "...",
      "differentPageType": "...",
      "differentAudienceOrStage": "...",
      "recommendedFuturePageScope": "..."
    }
  ]
}
```

## 0B.6 Define The Page Scope

After the target keyword and query cluster are clear, the agent must freeze the selected page scope.

The selected opportunity becomes the current page's `PageScopeContract`.

### Ranked Opportunities

Step 0B may output a ranked list of possible page opportunities, but exactly one must be marked as `selectedOpportunity`.

Only the selected opportunity is allowed to flow downstream.

All other opportunities must be routed as:

- `futurePageOpportunity`
- `separateClusterOpportunity`
- `refreshExistingPage`
- `excludedForNow`
- `needsUserClarification`

Downstream stages must not pull keywords, sections, CTAs, or intent from deferred opportunities.

### Page Type Enum

`pageType` must use a fixed enum plus optional explanation.

Allowed initial values:

```text
informational_guide
how_to_tutorial
comparison
alternatives
best_list
pricing_or_cost
product_or_service_page
category_page
local_page
template_or_tool
checklist
case_study
faq_page
troubleshooting
definition_or_explainer
review
```

If no enum fits, Step 0B must use `ask_user` or route the opportunity for taxonomy expansion.

### Primary Intent Enum

Every selected opportunity requires exactly one `primaryIntent`.

Allowed initial values:

```text
informational
instructional
comparison
commercial_evaluation
transactional
local
navigational
troubleshooting
definition
template_or_tool_seeking
pricing_or_cost
safety_or_risk
```

Mixed SERPs may be recorded as context, but they cannot become the primary intent. Secondary intents may be acknowledged only if they support the primary intent and do not change page scope.

### Primary Reader Stage Enum

Every selected opportunity requires exactly one `primaryReaderStage`.

Allowed initial values:

```text
unaware
problem_aware
solution_aware
option_comparing
decision_ready
post_purchase_or_usage
troubleshooting
validation_or_reassurance
local_action
```

Secondary reader stages may be acknowledged only if they support the primary reader stage.

### Existing URL Action

The selected opportunity must include `existingUrlAction`.

Allowed values:

```text
create_new_page
refresh_existing_page
merge_with_existing_page
skip_duplicate
ask_user
```

If accessible site, repo, sitemap, or URL inventory exists, the agent must check it.

If accessible inventory exists but is not checked, Step 0B fails.

If no inventory is accessible, Step 0B may return `pass_with_warnings`, and the cannibalization warning must be carried forward into SERP research, page packet, and final QA.

### Business Goal

Every selected opportunity requires a light `businessGoal`.

The goal can be soft and must serve the reader first.

Allowed examples:

- Internal link to diagnostic/tool
- Build topical authority
- Route to category page
- Route to product/service education
- Newsletter signup
- Consultation booking
- Comparison assistance
- Product fit education
- Trust-building
- Demand creation
- Support/retention

Fail if:

- No business goal exists.
- The business goal contradicts user intent.
- The page forces a hard CTA on a purely informational or safety query.
- The goal is generic, such as "get traffic" or "rank higher."

### Slug Candidate

Step 0B may generate a rough `slugCandidate`.

The slug candidate is used only for:

- Page identity
- Existing URL checks
- Cannibalization checks

Step 0B must not finalize:

- Final URL
- H1
- Meta title
- Meta description

Those belong later after SERP, structure, superiority components, and final page angle are clearer.

## Must Cover And Must Not Cover

The Page Scope Contract must include specific `mustCover` and `mustNotCover` lists.

Recommended minimums:

```text
mustCover: 5-12 items
mustNotCover: 3-10 items
```

### Must Cover

`mustCover` defines what the selected page must address.

Each `mustCover` item must include a light evidence ref explaining why it belongs in scope.

Evidence can come from:

- Target keyword
- Supporting query
- PAA/autocomplete
- Light SERP/page-type check
- Search Console/internal search
- Keyword tool output
- Audience-language source

Deep claim evidence, citations, competitor gap detail, and section-level mapping wait until SERP/depth research.

Example:

```json
{
  "item": "How to start double cleansing without worsening acne",
  "whyInScope": "Appears in supporting queries and audience-language concerns around acne breakouts after cleansing.",
  "evidenceRefs": ["paa_02", "reddit_04", "supporting_query_03"]
}
```

### Must Not Cover

`mustNotCover` defines what must be excluded, lightly mentioned, or routed elsewhere.

Every `mustNotCover` item requires a route destination.

Allowed routes:

```text
futurePageOpportunity
separatePageOpportunity
internalLinkOut
refreshExistingPage
mergeWithExistingPage
lightMentionOnly
excludeEntirely
ask_user
```

Example:

```json
{
  "item": "Ranking the best double-cleansing products in India",
  "whyExcluded": "This changes the page from an instructional safety routine into a commercial product-list page.",
  "route": "futurePageOpportunity",
  "routeReason": "Create a separate product-fit or best-list page if evidence supports it.",
  "evidenceRefs": ["serp_overlap_03", "supporting_query_08"]
}
```

## Page Scope Summary

Every selected opportunity requires a one-sentence `pageScopeSummary`.

It must state:

- What page is being created
- Who it is for
- What primary search task it solves
- What it will not try to do

Example:

```text
Create an instructional guide for Indian users with oily acne-prone skin who want to know how to double cleanse safely, while excluding product ranking, dermatologist treatment advice, and full acne medication routines.
```

Fail if the summary:

- Does not mention the reader
- Does not mention the search task
- Does not define a boundary or exclusion
- Could apply to many pages in the batch
- Is generic, such as "a detailed guide about double cleansing"

## Unique Contribution

Every selected opportunity requires an evidence-linked, specific `uniqueContribution`.

It must explain why this page deserves to exist separately from other pages in the batch or cluster.

It must be tied to:

- The selected target keyword
- The target query intent
- The query cluster
- The reader stage
- Live evidence
- The selected page scope

It cannot be generic.

Bad:

```text
A comprehensive guide for Indian users.
```

Good:

```text
This page deserves to exist because live SERP and PAA evidence show users are specifically trying to understand whether double cleansing worsens oily acne-prone skin, while adjacent pages focus on generic cleansing routines or product lists. This page will focus on a safe decision flow and mistake-prevention checklist for Indian weather and acne-prone skin.
```

Required fields:

```json
{
  "uniqueContribution": "...",
  "whySeparateFromOtherPages": "...",
  "evidenceRefs": ["..."],
  "batchSimilarityRisk": "low | medium | high",
  "antiTemplateInstruction": "..."
}
```

## Optional Component Opportunity Hint

Step 0B may define an optional early `componentOpportunityHint` only when the keyword/query cluster obviously implies a useful reader aid.

Examples:

- Decision matrix
- Symptom-to-action table
- Routine builder
- Comparison checklist
- Cost calculator
- Mistake-prevention checklist
- Product-fit filter

This hint is not the final required superiority component.

The required superiority component belongs to the SERP Superiority Gate after deeper competitor, audience, PAA, video, Reddit/forum, and AI Overview research.

Fail if:

- Step 0B invents a generic component with no link to query intent.
- Later stages treat the hint as final without superiority research.
- The component is conversion-first instead of reader-first.

## Batch Duplicate Check

In batch mode, Step 0B must run a batch-level duplicate check before page generation starts.

Compare each selected opportunity against other planned pages by:

- `targetKeyword`
- `targetQueryIntent`
- `primaryIntent`
- `primaryReaderStage`
- `pageType`
- `pageScopeSummary`
- `uniqueContribution`
- `mustCover`
- `mustNotCover`
- `componentOpportunityHint`

If two pages are too similar, the runner must:

- Merge them
- Split them more clearly
- Reroute one as a future opportunity
- Ask the user
- Repair the opportunity

Fail if:

- Two pages only differ by keyword wording.
- Two pages have the same page-body promise.
- Two pages share the same unique contribution.
- Two pages would naturally use the same section plan and decision content.
- One page's `mustCover` heavily overlaps another page's `mustCover`.

## Page Scope Contract

The selected opportunity becomes the frozen Page Scope Contract.

Suggested shape:

```json
{
  "contractHash": "...",
  "selectedOpportunityId": "...",
  "targetKeyword": "...",
  "targetQueryIntent": "...",
  "queryCluster": {
    "primaryQuery": "...",
    "supportingQueries": ["..."]
  },
  "pageScope": {
    "pageType": "how_to_tutorial",
    "pageTypeExplanation": "...",
    "primaryIntent": "instructional",
    "primaryIntentExplanation": "...",
    "primaryReaderStage": "problem_aware",
    "readerStageExplanation": "...",
    "pageScopeSummary": "...",
    "businessGoal": "...",
    "slugCandidate": "...",
    "existingUrlAction": "create_new_page",
    "mustCover": [],
    "mustNotCover": [],
    "uniqueContribution": {},
    "componentOpportunityHint": null
  },
  "evidenceSummary": {
    "sourceTypesUsed": ["google_serp_manual_search", "people_also_ask"],
    "trueDemandSourcePresent": true,
    "lightSerpOverlapChecked": true,
    "inventoryChecked": true
  },
  "warnings": [],
  "blockingIssues": [],
  "verdict": "pass"
}
```

Once Step 0B passes, downstream artifacts must reference the same `contractHash`.

Required downstream references:

- SERP research
- SERP Superiority Gate
- Research-derived structure plan
- Pre-draft quality brief
- Final copy
- Image plan
- Page packet
- Editorial QA
- Batch report

If a downstream stage changes target keyword, query cluster, selected opportunity, or page scope, Step 0B must be regenerated and revalidated.

## Pass, Warning, Fail, Ask User

Step 0B verdict values:

- `pass`
- `pass_with_warnings`
- `fail`
- `ask_user`

`pass_with_warnings` is allowed only for non-critical issues and may continue automatically.

Critical issues are blockers.

### Pass Conditions

Step 0B passes only if:

- Step 0A status is `pass` or `pass_with_warnings`.
- Live keyword/search evidence exists.
- At least two approved source types are used.
- At least one true search-demand source is present.
- Exactly one selected opportunity is frozen.
- Exactly one `targetKeyword` is selected.
- `targetKeyword` strongly supports the approved Step 0A search problem.
- `targetQueryIntent` is clear and human-readable.
- Query cluster contains only queries that can be satisfied by one coherent page.
- Supporting query count is valid or justified.
- Every collected candidate phrase is routed.
- A light SERP overlap/page-type check has been performed.
- One dominant `primaryIntent` is selected.
- `pageType`, `primaryIntent`, and `primaryReaderStage` use fixed enums.
- Page scope includes specific `mustCover` and `mustNotCover` lists.
- Each `mustCover` item has light evidence refs.
- Each `mustNotCover` item has a route destination.
- `pageScopeSummary` is specific and one sentence.
- `uniqueContribution` is specific and evidence-linked.
- `businessGoal` exists and fits intent.
- `existingUrlAction` is explicit.
- Accessible inventory is checked when available.
- Batch duplicate check passes when in batch mode.
- The selected page can be explained in one sentence.

### Non-Critical Warning Examples

Warnings may continue automatically if they are non-critical.

Examples:

- No accessible site inventory exists, but live keyword/SERP evidence exists.
- More than 8 supporting queries were found, but extras were routed out cleanly.
- One optional metric is missing, but live search evidence and intent fit are strong.
- SERP overlap is moderate, but page-type fit and intent fit are clear.
- Only one strong demand source exists and a second source is genuinely inaccessible.

Every warning must include a carry-forward requirement.

### Critical Blockers

Step 0B fails or asks the user if:

- No live keyword/search evidence exists.
- No exact `targetKeyword` exists.
- Target keyword contradicts Step 0A.
- Target keyword was selected mainly because of volume.
- Target keyword implies the wrong page type.
- Mixed primary intents are not resolved.
- No light SERP overlap/page-type check was performed.
- Accessible inventory exists but was not checked.
- Likely duplicate existing page was found but not routed.
- Business relevance is unclear.
- Fewer than 3 supporting queries exist without strong justification.
- Candidate phrases are discarded without routing.
- `mustCover` is generic.
- `mustNotCover` is empty or unrouted.
- `pageScopeSummary` is generic.
- `uniqueContribution` is generic.
- Two batch pages are too similar.
- The selected opportunity is not frozen.
- The output cannot state what page should be created, for whom, and what it excludes.

## Repair Loop

Step 0B allows up to two automatic repair attempts.

Repair rules:

- Run validation after the initial Page Scope Contract.
- If failures are repairable, repair automatically.
- Maximum automatic repair attempts: 2.
- Repairs must target failed fields only.
- The agent may narrow scope, reroute phrases, improve evidence refs, or select a cleaner opportunity.
- The agent may not delete constraints just to pass.
- The agent may not silently change Step 0A.
- After two failed repairs, return `ask_user` with exact blockers.

Repairable examples:

- Missing route for one candidate phrase
- Vague `pageScopeSummary`
- Generic `uniqueContribution`
- Too many supporting queries
- Missing `mustNotCover` route
- Weak but fixable `mustCover` evidence ref

Non-repairable examples:

- No live keyword/search evidence
- No accessible evidence source works
- Business relevance unclear
- Two opportunities are tied and selection would be arbitrary
- Existing URL conflict requires human decision

## 0B Output

The compact Step 0B output should be readable by later agents and humans in under 30 seconds.

```json
{
  "targetKeyword": "...",
  "targetQueryIntent": "...",
  "queryCluster": ["...", "..."],
  "selectedOpportunity": {
    "pageType": "...",
    "primaryIntent": "...",
    "primaryReaderStage": "...",
    "pageScopeSummary": "...",
    "uniqueContribution": "..."
  },
  "pageScope": {
    "decision": "one_page",
    "includedSearchTask": "...",
    "excludedSearchTasks": ["..."],
    "reason": "..."
  },
  "separatePageOpportunities": [],
  "existingUrlAction": "create_new_page",
  "contractHash": "...",
  "verdict": "pass | pass_with_warnings | fail | ask_user"
}
```

If `targetKeyword`, `queryCluster`, and `pageScope` cannot be clearly defined, Step 0B is not complete.

## Completed Example Pattern

Reference pattern:

```text
Target keyword:
how to write an seo page

Target query intent:
The reader wants a practical, professional process for creating an SEO page, including structure, examples, and quality standards.

Query cluster:
how to create an seo page
how to structure an seo page
seo page writing example
step by step seo page writing

Page scope:
One instructional guide for people trying to create an SEO page properly, excluding SEO content writing services, tool comparisons, and standalone template downloads.

Separate opportunities:
seo content writing services -> service page
best seo writing tools -> comparison page
seo page template -> future template/tool page
```

## Final Rule

Do not choose the target keyword first and force everything else around it.

Correct order:

1. Start from approved Step 0A.
2. Gather candidate phrases with live evidence.
3. Identify the clearest main phrase.
4. Score and validate target keyword candidates.
5. Group only phrases with the same search task.
6. Use light SERP overlap to cluster or split.
7. Route every candidate phrase.
8. Define page scope with inclusions and exclusions.
9. Freeze exactly one selected opportunity.
10. Carry the contract hash into downstream artifacts.

This makes keyword targeting strategic instead of arbitrary and prevents generic, bloated, repetitive batch pages.
