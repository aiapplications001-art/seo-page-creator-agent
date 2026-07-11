# Step 0A Foundation Design

Status: Approved design proposal
Scope: Local replica only
Date: 2026-07-05

## Purpose

Step 0A defines the search opportunity before keyword targeting begins. It is the first hard gate in cluster strategy and must run before keyword targeting, SERP research, competitor analysis, query clustering, page opportunities, page structure, copy, images, batch creation, or publishing.

The agent must begin by answering:

- What broad subject are we in?
- What real problem is the user trying to solve?
- How would the user naturally describe that problem?

Step 0A is made of:

- 0A.1 Define the topic
- 0A.2 Define the search problem
- 0A.3 Define the problem-language
- 0A.4 Check the relationship between topic, search problem, and problem-language
- 0A.5 Produce the compact Step 0A output
- 0A.6 Follow the completed example pattern
- 0A.7 Enforce the final rule before downstream SEO work

## 0A.1 Define The Topic

The topic is the broad subject area the cluster belongs to. It is not yet the target keyword. This step is part of cluster strategy and should not be repeated independently for every page unless the cluster itself is being redefined.

The agent may infer the topic from messy user input, but it must use guardrails. If the input is broad, ambiguous, or contains multiple possible directions, the agent must create 2-4 candidate topics, score them, and select one only when the winner is clear.

### Candidate Topic Scoring

Use these weighted signals:

- User-stated fit: 20
- Business-side relevance: 20
- Site inventory fit: 15
- Cluster usefulness: 15
- Specificity: 10
- Audience problem clarity: 10
- Risk/manageability: 5
- Strategic value: 5

The agent must ask the user instead of choosing automatically when:

- Top candidates are within 10 points.
- Business or site fit conflicts with user intent.
- Risk changes the topic boundary.
- A candidate cannot be routed cleanly.

### Required Topic Outputs

The topic artifact must include:

- `selectedTopic`
- `topicBoundarySummary`
- `includedSubareas`
- `excludedSubareas`
- `candidateTopics`
- `businessSideRelevance`
- `deferredKeywordCandidates`
- `deferredIntentSignals`
- `notAcceptedAsTopicExamples`

### Routing Rejected Or Non-Topic Inputs

Rejected phrases must not be discarded. Each must be routed into one of:

- `deferredKeywordCandidates`
- `deferredPageOpportunities`
- `deferredIntentSignals`
- `excludedSubareas`
- `parentCategory`
- `adjacentTopic`
- `needsUserClarification`

Use these reason codes:

- `keyword_or_query`
- `page_title`
- `page_opportunity_or_asset`
- `too_broad`
- `too_narrow`
- `adjacent_but_excluded`
- `commercial_tool_query`
- `market_or_audience_modifier`
- `format_modifier`

### Business-Side Relevance Sub-Gate

Search demand can suggest an opportunity, but business-side relevance decides whether the agent may pursue the topic.

The agent must check these signals in order:

- Explicit user/project input
- Company or product profile
- Existing site inventory
- Existing conversion destinations
- Existing content authority
- Audience fit
- Expertise/risk fit
- Commercial or strategic fit

The status values are:

- `supported`
- `partially_supported`
- `not_supported`
- `unknown`

LLM judgment is allowed for audience fit, expertise/risk fit, and commercial or strategic fit, but it cannot invent evidence. Each check needs evidence references, reasoning, and confidence.

## 0A.2 Define The Search Problem

The search problem is the real need, difficulty, task, or goal behind the search. It converts the approved topic into the human problem the cluster must solve.

Rules:

- Exactly one primary search problem is allowed.
- Secondary problems may exist only as support.
- If two problems are equally primary, the agent must ask the user or split the cluster.
- 0A.2 may be inferred from the approved topic.
- 0A.3 must validate 0A.2 with audience/search language.
- If 0A.3 contradicts 0A.2, the agent must revise 0A.2.
- If the repair fails, the agent must revisit 0A.1 or ask the user.

### Required Search Problem Outputs

The search problem artifact must include:

- `primarySearchProblem`
- `secondaryProblems`
- `searchProblemBoundarySummary`
- `wrongPageRisk`
- `desiredOutcome`
- `readerState`

`readerState` must include:

- `likelyKnows`
- `likelyDoesNotKnow`
- `likelyFeels`
- `likelyFears`
- `likelyMisunderstands`
- `needsReassuranceAbout`

### Search Problem Failure Conditions

Fail 0A.2 if:

- The search problem is only the keyword repeated in sentence form.
- The search problem is only the topic repeated in sentence form.
- The problem is generic.
- The user task, pain, or confusion is missing.
- The desired outcome is missing.
- The wrong-page risk is missing.
- Reader state is missing.

The search problem boundary summary must clearly say what the problem is and is not. The wrong-page risk is required because it prevents generic pages. The desired outcome must be separate from the problem. Reader state is required so later pages feel written for real people instead of generic SEO templates.

## 0A.3 Define Problem-Language

Problem-language is the natural wording users may use when they are confused, stuck, trying to get help, or trying to reach a practical outcome. It is different from polished keyword-tool phrasing.

The agent must collect 8 cleaned natural user phrases.

Minimum evidence requirements:

- At least 5-6 phrases must be evidence-backed.
- Preferred: all 8 phrases are evidence-backed when sources are available.
- Allowed: 2-3 inferred phrases only if they are clearly labeled and derived from 0A.2.

The final phrase should be cleaned into readable language. The source wording must be preserved separately.

### Required Evidence Fields

Each evidence-backed phrase must include:

- `cleanedPhrase`
- `sourceOriginalExcerpt`
- `sourceRef`
- `sourceType`
- `sourceClass`

Use these source classes:

- `search_surface`: People Also Ask, autocomplete, related searches, Search Console, site search, query exports
- `audience_language`: Reddit, Quora, forums, YouTube/video comments, reviews, support chats, emails, community/social comments

Competitor pages do not count as audience-language evidence. They may inform SERP context later, but they cannot be used to pass 0A.3.

At least one audience-language source is mandatory when available.

### Meaning Diversity Requirements

The 8 phrases must not all say the same thing. They must include:

- At least 2 confusion/friction phrases
- At least 2 desired-format phrases
- At least 2 desired-outcome phrases
- At least 1 risk/objection phrase when relevant
- At least 1 comparison/decision phrase when relevant

Each phrase must map to:

- One primary implied content need
- Optional secondary content needs
- `readerStateSignals`
- `supportsPrimarySearchProblem`
- `supportStrength`
- `supportReason`

Allowed support strengths:

- `strong`
- `partial`
- `adjacent`
- `contradicts`

### Validation Against 0A.2

Minimum alignment:

- At least 6/8 phrases must support the primary search problem.
- At most 2/8 phrases may be adjacent.
- 0 contradictions are allowed.

If 0A.3 reveals reader states missing from 0A.2, the agent must update 0A.2. If 0A.3 fails, the agent must revise 0A.2. If the revision still fails, the agent must revisit 0A.1 or ask the user.

## 0A.4 Relationship Check

The topic, search problem, and problem-language must connect clearly.

- The topic gives the broad subject area.
- The search problem gives the actual need behind the search.
- The problem-language shows how that need appears in real search behavior.

This relationship check does not need a numeric score. Structured pass/fail with reasons is enough.

Example shape:

```json
{
  "relationshipCheck": {
    "status": "pass",
    "topicToSearchProblem": {
      "status": "pass",
      "reason": "The search problem sits clearly inside the selected topic boundary."
    },
    "searchProblemToProblemLanguage": {
      "status": "pass",
      "reason": "The collected phrases mostly express the same underlying need."
    },
    "problemLanguageToTopic": {
      "status": "pass",
      "reason": "The phrase set stays inside the topic boundary and does not drift into another cluster."
    },
    "blockingIssues": []
  }
}
```

Fail the relationship check if:

- The search problem does not sit inside the selected topic.
- The problem-language mostly points to a different problem.
- The problem-language drifts outside the topic boundary.
- The explanation is vague.
- The final Step 0A output cannot be written clearly.

## 0A.5 Output Of Step 0A

By the end of Step 0A, the agent must be able to write these three things clearly:

- Topic: what broad subject area this cluster belongs to.
- Search problem: what the user is actually trying to solve.
- Problem-language: how the user may naturally express that problem in search or audience spaces.

The compact output must be easy for later agents and humans to read in under 30 seconds. It should use cleaned language only. Detailed evidence stays in the full artifact.

Example shape:

```json
{
  "step0AOutput": {
    "topic": "SEO page writing",
    "searchProblem": "The user wants to create an SEO page properly and needs clear, structured guidance on process, structure, examples, and quality standards.",
    "problemLanguage": [
      "Guide me on how to create an SEO page like a professional.",
      "Show me a step-by-step example of creating an SEO page.",
      "How do I structure an SEO page properly?"
    ]
  }
}
```

If the agent cannot define topic, search problem, and problem-language clearly, Step 0A is not complete.

## 0A.6 Completed Example Pattern

Use this as a reference pattern for clarity, not as copy to reuse in live outputs.

```text
Topic:
SEO page writing

Search problem:
The user wants to create an SEO page properly and is looking for clear, structured guidance on how to do it.

Problem-language:
guide me on how to create an seo page like a professional
step by step example of creating an seo page
how do i structure an seo page properly
```

This is a strong Step 0A because it identifies:

- The subject area
- The real need
- The user's likely language

For every real cluster, the agent must generate a cluster-specific version and explain why it is strong.

## 0A.7 Final Rule

Do not begin by asking:

```text
What keyword should I target?
```

Begin by asking:

```text
What broad subject are we in?
What real problem is the user trying to solve?
How would the user naturally describe that problem?
```

Only after that should the workflow move to keyword targeting and query cluster construction.

### Blocked Before Step 0A Passes

The following must not begin until Step 0A has passed:

- Keyword targeting
- SERP research
- Competitor analysis
- Query clustering
- Page opportunity generation
- Page structure planning
- Copy generation
- Image planning
- Batch page creation
- Publishing

### Allowed Before Step 0A Passes

The following are allowed before Step 0A passes:

- Reading user/project input
- Reading company/product profile
- Reading site inventory
- Checking business-side relevance
- Collecting 0A.3 audience/search language evidence
- Repairing 0A.1-0A.3
- Asking the user for clarification

Only after Step 0A returns `pass` or `pass_with_warnings` may downstream SEO work begin.

## Foundation Verdict

Before leaving Step 0A, the agent must output a foundation verdict:

- `status`: `pass`, `pass_with_warnings`, `fail`, or `ask_user`
- `confidence`: `high`, `medium`, or `low`
- `reason`
- `mustCarryForward`
- `warnings`
- `blockingIssues`

`pass_with_warnings` may continue automatically, but each warning must have a carry-forward requirement checked later.

Non-critical warning examples:

- Only 2 source types were found instead of 3, but one strong audience-language source and one strong search-surface source were available.
- 2 phrases were inferred, clearly labeled, and derived from 0A.2.
- Site inventory is partial, but user/project input and product profile strongly support the topic.

Critical blockers:

- Business relevance is unclear.
- The search problem is a keyword restatement.
- Fewer than 6/8 phrases support the primary search problem.
- Any contradiction exists.
- No audience-language source was found when one was available.
- Rejected candidates were not routed.
- Wrong-page risk is missing.
- Reader state is missing.

Example shape:

```json
{
  "foundationVerdict": {
    "status": "pass_with_warnings",
    "confidence": "medium",
    "reason": "The topic, search problem, and problem-language connect clearly, with one non-critical evidence limitation.",
    "mustCarryForward": [
      "Later keyword selection must preserve the primary search problem and reader state."
    ],
    "warnings": [
      {
        "warning": "Only 2 source types found instead of 3.",
        "severity": "non_critical",
        "carryForwardRequirement": "Validate language again during SERP and audience research.",
        "mustResolveBy": "pre-draft quality brief"
      }
    ],
    "blockingIssues": []
  }
}
```

## Implementation Notes

This design should be implemented as the first gate in the cluster strategy flow. It should be visible to all adapters and treated as mandatory by Codex, Gemini, Antigravity, and any batch runner.

The compact Step 0A output should be carried forward into downstream artifacts so later agents cannot drift into generic keyword-first page generation.
