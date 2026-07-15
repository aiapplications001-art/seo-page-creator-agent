export interface V2GateValidationResult {
  status: "passed" | "passed_limited_confidence" | "failed";
  machineChecksPassed: boolean;
  judgmentChecksPassed: boolean;
  blockingIssues: string[];
  advisoryIssues: string[];
}

export interface SerpResearchGateInput {
  analyzedSources: Array<{
    url: string;
    sourceType: string;
    extractionStatus: string;
    bodySummary?: string;
    h2h3Outline?: string[];
  }>;
  contentGapSynthesis?: {
    gaps?: string[];
    differentiationOpportunities?: string[];
  };
  judgmentChecks?: JudgmentChecks;
}

export interface SocialVideoResearchGateInput {
  assets: Array<{
    id: string;
    accessStatus: "reviewed" | "inaccessible";
    failureReason?: string;
  }>;
  insights: string[];
  judgmentChecks?: JudgmentChecks;
}

export interface AudienceDefinitionGateInput {
  targetCohort?: string;
  awarenessStage?: string;
  readerTakeaway?: string;
  objections?: string[];
  ctaConnection?: string;
  judgmentChecks?: JudgmentChecks;
}

export interface NarrativeBriefGateInput {
  primaryStyle?: string;
  secondaryFlavor?: string;
  openingAngle?: string;
  brandPov?: string;
  pagePromise?: string;
  sectionDirections?: Array<{
    sectionId: string;
    direction: string;
  }>;
  judgmentChecks?: JudgmentChecks;
}

export interface CitationSetGateInput {
  claims: Array<{
    claim: string;
    strength: "low" | "medium" | "high" | "critical";
    sourceUrl?: string;
    approvalStatus?: "approved" | "not_required" | "missing";
  }>;
  judgmentChecks?: JudgmentChecks;
}

export interface ContentBriefGateInput {
  upstreamHashes: {
    step0AHash?: string;
    step0BHash?: string;
    pageJobHash?: string;
    searchIntentHash?: string;
    pageFormatHash?: string;
    nextActionHash?: string;
    serpCompetitorHash?: string;
    topicResearchHash?: string;
    uniqueAngleHash?: string;
  };
  contentBriefSummaryStatement?: string;
  readerOutcomePromise?: string;
  targetWordCountContract?: {
    minimumWordCount?: number;
    targetWordCountRange?: {
      min?: number;
      max?: number;
    };
    rangeBasis?: string;
    rangeFlexibility?: string;
  };
  depthRequirements?: {
    highDepthRequirements?: unknown[];
    supportingDepthRequirements?: unknown[];
    keepBriefOrExclude?: unknown[];
  };
  instructionRegistry?: Array<{
    instructionId?: string;
    priority?: "mandatory" | "conditional" | "supporting" | "prohibited";
    writerInstruction?: string;
    sourceRefs?: string[];
    deliveryTest?: string;
  }>;
  upstreamCoverageMatrix?: unknown[];
  sourceUseGuidance?: unknown[];
  assetBriefingContract?: unknown[];
  voiceAndQualityContract?: Record<string, unknown>;
  readabilityAndScanabilityRequirements?: unknown[];
  antiGenericContract?: {
    genericFailureRisks?: unknown[];
    pageSpecificityRequirements?: unknown[];
    genericPhrasesOrMovesToAvoid?: unknown[];
  };
  synthesisRequirement?: string;
  brandFitBoundaries?: Record<string, unknown>;
  recencySensitivityCheck?: {
    recencySensitive?: boolean;
    freshnessRequirements?: unknown[];
  };
  marketLocalizationRequirements?: {
    marketSensitive?: boolean;
    requirements?: unknown[];
  };
  readerObjectionHandling?: {
    required?: boolean;
    objections?: unknown[];
  };
  practicalDeviceRequirements?: {
    sharedBaselineConfigVersion?: string;
    pageSpecificMinimums?: unknown[];
  };
  minimumCompletenessStandard?: unknown[];
  draftRepairGuidance?: unknown[];
  batchBriefIsolationCheck?: {
    pageSpecificBrief?: boolean;
    reusedPriorBrief?: boolean;
    similarityToCurrentBatch?: "low" | "medium" | "high" | "unknown";
  };
  semanticBriefUniquenessCheck?: {
    currentBatchUnique?: boolean;
    historicalUniquenessChecked?: boolean;
  };
  contentBriefDeliveryProofRequirements?: {
    step9Required?: boolean;
    step10Required?: boolean;
    finalQaRequired?: boolean;
  };
  mustCarryForward?: unknown[];
  step8OutputMustNotContain?: string[];
  step8CompletenessChecklist?: Record<string, boolean>;
  markdownParityChecked?: boolean;
  judgmentChecks?: JudgmentChecks;
}

export interface PageOutlineGateInput {
  upstreamHashes: {
    step0AHash?: string;
    step0BHash?: string;
    pageJobHash?: string;
    searchIntentHash?: string;
    pageFormatHash?: string;
    nextActionHash?: string;
    serpCompetitorHash?: string;
    topicResearchHash?: string;
    uniqueAngleHash?: string;
    contentBriefHash?: string;
  };
  pageOutlineHash?: string;
  workingH1?: string;
  pageFlowType?: string;
  pageFlowReason?: string;
  pageFlowStep8Refs?: string[];
  readerJourneySummaryStatement?: string;
  sectionSequenceRationale?: string;
  h2CountException?: {
    justified?: boolean;
    reason?: string;
    sourceRefs?: string[];
  };
  mainIntentVisibilityCheck?: {
    visibleInFirstTwoH2s?: boolean;
    evidenceRefs?: string[];
  };
  outlineSections?: Array<{
    sectionId?: string;
    headingText?: string;
    sectionRole?: string;
    mappedStep8Refs?: string[];
    purpose?: string;
    depthLevel?: "low" | "medium" | "high";
    depthReason?: string;
    expectedTreatment?: string;
    mappedDepthRequirementRefs?: string[];
    contentObligations?: string[];
    h3s?: string[];
    h3Rationale?: string;
    assetPlacements?: string[];
    examplePlacements?: string[];
    internalLinkNotes?: string[];
    ctaNotes?: string[];
    claimEvidenceNotes?: string;
    scopeBoundaryRisk?: boolean;
    scopeBoundaryNotes?: string[];
    transitionFromPrevious?: string;
  }>;
  queryCoveragePlan?: {
    targetKeywordMapped?: boolean;
    supportingQueriesMapped?: boolean;
    doNotForceTerms?: string[];
  };
  assetPlacementPlan?: unknown[];
  internalLinkPlacementPlan?: unknown[];
  ctaPlacementPlan?: unknown[];
  faqPlan?: {
    decision?: "short" | "detailed" | "none";
    routedQuestions?: unknown[];
    noneExceptionReason?: string;
    evidenceRefs?: string[];
  };
  contentBriefDeliveryProof?: {
    allMandatoryInstructionsCovered?: boolean;
    missingMandatoryInstructions?: string[];
    returnedToStep8?: boolean;
  };
  step8RefinementPatch?: Array<{
    refinementType?: string;
    reason?: string;
    strategicChange?: boolean;
  }>;
  outlineOriginalityCheck?: {
    noCopiedCompetitorHeadings?: boolean;
    noCopiedCompetitorStructure?: boolean;
    noCopiedTableLogic?: boolean;
  };
  outlineScanabilityCheck?: {
    importantAnswerEarly?: boolean;
    noOverloadedH2s?: boolean;
    noBuriedSafetyOrDecisionInfo?: boolean;
    headingsScannable?: boolean;
  };
  headingHierarchyCheck?: {
    singleH1?: boolean;
    h2sNonOverlapping?: boolean;
    h3sUsefulOnly?: boolean;
    headingsScannable?: boolean;
  };
  batchOutlineIsolationCheck?: {
    pageSpecificOutline?: boolean;
    reusedPriorOutline?: boolean;
    currentBatchUnique?: boolean;
    similarityToCurrentBatch?: "low" | "medium" | "high" | "unknown";
  };
  outlineDeliveryProofRequirements?: {
    step10Required?: boolean;
    finalQaRequired?: boolean;
  };
  mustCarryForward?: unknown[];
  step9OutputMustNotContain?: string[];
  step9CompletenessChecklist?: Record<string, boolean>;
  markdownParityChecked?: boolean;
  pageOutlineVerdict?: {
    status?: "pass" | "pass_with_warnings" | "fail" | "ask_user";
    action?: string;
  };
  judgmentChecks?: JudgmentChecks;
}

export interface FirstDraftGateInput {
  upstreamHashes: {
    step0AHash?: string;
    step0BHash?: string;
    pageJobHash?: string;
    searchIntentHash?: string;
    pageFormatHash?: string;
    nextActionHash?: string;
    serpCompetitorHash?: string;
    topicResearchHash?: string;
    uniqueAngleHash?: string;
    contentBriefHash?: string;
    pageOutlineHash?: string;
  };
  firstDraftHash?: string;
  draftSummaryStatement?: string;
  h1?: string;
  wordCountContract?: {
    minimumWordCount?: number;
    actualWordCount?: number;
    targetWordCountRange?: {
      min?: number;
      max?: number;
    };
    noPaddingOrRepetition?: boolean;
  };
  draftSections?: Array<{
    sectionId?: string;
    heading?: string;
    draftCopy?: string;
    outlineRefs?: string[];
    evidenceRefs?: string[];
    evidenceRequirementLevel?: "brief_or_outline_only" | "evidence_required";
    noNewFactualClaims?: boolean;
    newFactualClaimsRouted?: boolean;
    depthProof?: {
      depthLevel?: "low" | "medium" | "high";
      complete?: boolean;
      includesDefinitionOrExplanation?: boolean;
      includesWhyItMatters?: boolean;
      includesHowToOrDecisionRule?: boolean;
      includesExampleOrScenario?: boolean;
      includesCautionMistakeOrCaveat?: boolean;
      includesTransition?: boolean;
      missingExpectedPartsReason?: string;
    };
    examplesUsed?: Array<{
      example?: string;
      sourceRefs?: string[];
      illustrativeOnly?: boolean;
      derivedFromEvidence?: boolean;
    }>;
    contentObligationsFulfilled?: string[];
    requiredAssetDelivered?: boolean;
    claimSafetyNotes?: string;
    ctaOrInternalLinkDelivered?: boolean;
    openIssues?: string[];
    genericProseDetected?: boolean;
    placeholderDetected?: boolean;
  }>;
  introductionQualityGate?: {
    startsWithReaderProblem?: boolean;
    confirmsIntent?: boolean;
    statesPagePromise?: boolean;
    setsScope?: boolean;
    avoidsGenericFiller?: boolean;
    leadsIntoPage?: boolean;
  };
  sectionExpansionGate?: {
    highDepthCoreSectionsPassed?: boolean;
    weakSectionIds?: string[];
  };
  draftCompletenessProof?: {
    pageJobSatisfied?: boolean;
    searchIntentSatisfied?: boolean;
    contentBriefSatisfied?: boolean;
    pageOutlineSatisfied?: boolean;
    satisfactionConditionMet?: boolean;
    wrongPageRisksAvoided?: boolean;
    exclusionsRespected?: boolean;
  };
  requiredAssetDelivery?: {
    allRequiredAssetsDelivered?: boolean;
    placeholderOnlyAssets?: string[];
  };
  draftClaimSafetyCheck?: {
    riskyClaimsHandled?: boolean;
    audienceLanguageNotUsedAsFactualProof?: boolean;
    sensitiveBoundariesRespected?: boolean;
    newFactualClaimsRoutedToStep6?: boolean;
    unsupportedRiskyClaims?: string[];
  };
  naturalQueryCoverageCheck?: {
    targetKeywordMeaningCovered?: boolean;
    supportingQueryNeedsCovered?: boolean;
    noKeywordStuffing?: boolean;
    noDensityTargets?: boolean;
    scopeBoundariesRespected?: boolean;
  };
  draftReadabilityScanabilityGate?: {
    shortParagraphs?: boolean;
    noWallsOfText?: boolean;
    usefulListsOrTables?: boolean;
    clearTransitions?: boolean;
    visibleWarningsDecisionsNextActions?: boolean;
    noBuriedPrimaryAnswer?: boolean;
    sectionFlowMatchesStep9?: boolean;
  };
  faqDraftDelivery?: {
    requiredByStep9?: boolean;
    draftedWhenPlanned?: boolean;
    placeholderOnly?: boolean;
  };
  ctaInternalLinkDelivery?: {
    draftedWherePlanned?: boolean;
    nonFinalWordingMarked?: boolean;
    placeholdersOnly?: boolean;
    followsBoundaries?: boolean;
  };
  voiceAndBrandFitCheck?: {
    followsVoiceAndQualityContract?: boolean;
    avoidsGenericAiProse?: boolean;
    readerFirst?: boolean;
    naturalBrandConnection?: boolean;
    respectsBrandFitBoundaries?: boolean;
  };
  draftUniquenessCheck?: {
    currentBatchUnique?: boolean;
    historicalCheckedOrWarning?: boolean;
    repeatedIntro?: boolean;
    repeatedSectionBodyPattern?: boolean;
    repeatedExamples?: boolean;
    repeatedAssetsOrFaqOrCta?: boolean;
  };
  antiGenericDraftGate?: {
    passed?: boolean;
    bannedPhrasesFound?: string[];
    placeholdersFound?: string[];
  };
  firstDraftDeliveryProofRequirements?: {
    step11Required?: boolean;
    finalQaRequired?: boolean;
  };
  mustCarryForward?: unknown[];
  step10OutputMustNotContain?: string[];
  step10CompletenessChecklist?: Record<string, boolean>;
  markdownParityChecked?: boolean;
  firstDraftVerdict?: {
    status?: "pass" | "pass_with_warnings" | "fail" | "ask_user";
    action?: string;
    confidence?: "low" | "medium" | "high";
  };
  repairAttemptsUsed?: number;
  judgmentChecks?: JudgmentChecks;
}

export interface OnPageSeoGateInput {
  upstreamHashes: {
    step0AHash?: string;
    step0BHash?: string;
    pageJobHash?: string;
    searchIntentHash?: string;
    pageFormatHash?: string;
    nextActionHash?: string;
    serpCompetitorHash?: string;
    topicResearchHash?: string;
    uniqueAngleHash?: string;
    contentBriefHash?: string;
    pageOutlineHash?: string;
    firstDraftHash?: string;
  };
  onPageSeoHash?: string;
  onPageSeoSummaryStatement?: string;
  optimizedDraft?: {
    optimizedH1?: string;
    sections?: Array<{
      sectionId?: string;
      optimizedHeading?: string;
      optimizedCopy?: string;
      firstDraftRefs?: string[];
      pageOutlineRefs?: string[];
      changeRefs?: string[];
      requiredDepthPreserved?: boolean;
      answerPlacementImprovedOrPreserved?: boolean;
      naturalQueryCoverageImprovedOrPreserved?: boolean;
      genericOptimizationDetected?: boolean;
      keywordStuffingDetected?: boolean;
      unsupportedNewClaims?: string[];
    }>;
  };
  seoChangeLog?: Array<{
    changeType?: "increase" | "move" | "remove" | "heading_edit" | "intro_edit" | "keyword_adjustment" | "internal_link" | "asset_alt" | "readability" | "metadata_candidate" | "other";
    description?: string;
    whyItImprovesIntentOrFocus?: string;
    protectedUpstreamRefs?: string[];
  }>;
  unresolvedOwnerStepItems?: Array<{
    issue?: string;
    ownerStep?: "step5" | "step6" | "step8" | "step9" | "step10" | "step12" | "metadata" | "asset_execution" | "technical_qa" | "publishing" | "ask_user";
    action?: string;
    reason?: string;
  }>;
  intentAlignmentCheck?: {
    stillMatchesSearchIntent?: boolean;
    pageJobStillSatisfied?: boolean;
    expectedDepthPreserved?: boolean;
    pageTypeFormatPreserved?: boolean;
    noIntentDrift?: boolean;
  };
  h1OptimizationCheck?: {
    clearSpecificH1?: boolean;
    naturalKeywordOrVariation?: boolean;
    matchesPageJobIntentAndScope?: boolean;
    avoidsVagueCleverWording?: boolean;
  };
  introOptimizationGate?: {
    startsCloseToReaderProblem?: boolean;
    confirmsQueryIntent?: boolean;
    naturalTopicOrKeywordMention?: boolean;
    setsScope?: boolean;
    previewsUsefulOutcome?: boolean;
    avoidsGenericFiller?: boolean;
    leadsIntoFirstSection?: boolean;
  };
  headingOptimizationCheck?: {
    h1H2H3WordingOptimized?: boolean;
    step9SectionSetPreserved?: boolean;
    hierarchyPreserved?: boolean;
    headingsScannable?: boolean;
    noKeywordOnlyHeadings?: boolean;
    returnToStep9Required?: boolean;
  };
  topicalCompletenessMap?: Array<{
    requiredTopicOrReaderNeed?: string;
    currentCoverage?: string;
    depthNeeded?: "brief" | "moderate" | "high";
    status?: "complete" | "partial" | "missing" | "overcovered" | "off_intent";
    action?: "add" | "expand" | "increase" | "move" | "remove" | "link" | "keep" | "return_to_step6" | "return_to_step8" | "return_to_step9";
    upstreamRefs?: string[];
    evidenceRefs?: string[];
    deliveryProof?: string;
  }>;
  naturalQueryCoverageContract?: {
    targetKeywordRepresentedNaturally?: boolean;
    supportingQueriesMappedToReaderNeeds?: boolean;
    highSignalPlacementAppropriate?: boolean;
    noKeywordDensityTargets?: boolean;
    noAwkwardExactMatchRepetition?: boolean;
    noForcedSynonyms?: boolean;
    noScopeExpansionForKeywords?: boolean;
  };
  sectionRelevanceCheck?: {
    allSectionsSupportPageJob?: boolean;
    noGenericSections?: boolean;
    noOffIntentSections?: boolean;
    weakSectionsFixedOrRouted?: boolean;
  };
  contentFocusChangeLog?: {
    increasesLogged?: boolean;
    movesLogged?: boolean;
    removalsLogged?: boolean;
    requiredDepthNotReduced?: boolean;
    offIntentRepetitionAndOvercoverageHandled?: boolean;
  };
  internalLinkOptimization?: {
    validatedDestinationsOnly?: boolean;
    destinationStatusPreserved?: boolean;
    anchorContextRelevant?: boolean;
    noInventedUrls?: boolean;
    missingDestinationsRouted?: boolean;
  };
  assetOptimization?: {
    assetsSupportReaderNeed?: boolean;
    altTextOrFallbackChecked?: boolean;
    textFallbackPreserved?: boolean;
    noImagePromptOrAssetGeneration?: boolean;
  };
  readabilityScanabilityCheck?: {
    paragraphsNotDense?: boolean;
    importantAnswersVisible?: boolean;
    functionalListsTablesSummaries?: boolean;
    clearTransitions?: boolean;
    warningsAndDecisionPointsVisible?: boolean;
    formattingNotDecorativeOnly?: boolean;
  };
  answerPlacementCheck?: {
    mainAnswerNearTop?: boolean;
    importantHeadingsAnsweredDirectly?: boolean;
    definitionsBeforeAdvancedDiscussion?: boolean;
    safetyDecisionAnswersNotBuried?: boolean;
  };
  naturalLanguageOptimizationGate?: {
    noKeywordStuffing?: boolean;
    noForcedSynonyms?: boolean;
    noRoboticSeoLanguage?: boolean;
    noRepeatedSentencePatterns?: boolean;
    noHeadingsWrittenOnlyForKeywords?: boolean;
    preservesReaderFirstVoice?: boolean;
  };
  lightClaimSourceUseCheck?: {
    noUnsupportedNewClaims?: boolean;
    caveatsPreserved?: boolean;
    audienceLanguageNotUsedAsFactualProof?: boolean;
    riskyClaimsNotMadeMoreAbsolute?: boolean;
    trustCitationWorkRoutedToStep12?: boolean;
  };
  metadataCandidates?: {
    slugCandidate?: string;
    seoTitleCandidate?: string;
    metaDescriptionCandidate?: string;
    labeledNonFinal?: boolean;
  };
  onPageSeoUniquenessCheck?: {
    currentBatchUnique?: boolean;
    historicalCheckedOrWarning?: boolean;
    repeatedOptimizedIntro?: boolean;
    repeatedHeadingPattern?: boolean;
    repeatedTopicalFixes?: boolean;
    repeatedInternalLinkPath?: boolean;
    repeatedAssetAltOrFaqOrSummaryPattern?: boolean;
  };
  onPageSeoDeliveryProofRequirements?: {
    step12Required?: boolean;
    finalQaRequired?: boolean;
  };
  mustCarryForward?: unknown[];
  step11OutputMustNotContain?: string[];
  step11CompletenessChecklist?: Record<string, boolean>;
  markdownParityChecked?: boolean;
  onPageSeoVerdict?: {
    status?: "pass" | "pass_with_warnings" | "fail" | "ask_user";
    action?: string;
    confidence?: "low" | "medium" | "high";
  };
  repairAttemptsUsed?: number;
  judgmentChecks?: JudgmentChecks;
}

interface JudgmentChecks {
  passed: boolean;
  notes?: string;
}

export function validateSerpResearchGate(ledger: SerpResearchGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];
  const meaningful = ledger.analyzedSources.filter(isMeaningfullyExtractedSerpSource);
  const cappedCount = meaningful.filter((source) => cappedSourceTypes.has(source.sourceType)).length;

  if (meaningful.length < 10) machineIssues.push("SERP research requires 10 meaningful webpage extractions.");
  if (cappedCount > 2) machineIssues.push("At most 2 analyzed SERP sources can be capped source types.");
  if (!ledger.contentGapSynthesis?.gaps?.length) machineIssues.push("Content gap synthesis must include gaps.");
  if (!ledger.contentGapSynthesis?.differentiationOpportunities?.length) {
    machineIssues.push("Content gap synthesis must include differentiation opportunities.");
  }

  return buildGateResult(machineIssues, ledger.judgmentChecks);
}

export function validateSocialVideoResearchGate(research: SocialVideoResearchGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];
  const advisoryIssues: string[] = [];
  const reviewed = research.assets.filter((asset) => asset.accessStatus === "reviewed");
  const inaccessible = research.assets.filter((asset) => asset.accessStatus === "inaccessible");
  const inaccessibleWithoutReason = inaccessible.filter((asset) => !hasText(asset.failureReason));

  if (research.assets.length < 7) machineIssues.push("Social/video research requires at least 7 attempted assets.");
  if (inaccessibleWithoutReason.length > 0) machineIssues.push("Inaccessible social/video assets must include failure reasons.");
  if (research.insights.length === 0) machineIssues.push("Social/video research must include at least one usable insight.");

  let limitedConfidence = false;
  if (reviewed.length < 5) {
    if (research.assets.length >= 7 && inaccessible.length > 0 && inaccessibleWithoutReason.length === 0) {
      limitedConfidence = true;
      advisoryIssues.push("Social/video research passed with limited confidence.");
    } else {
      machineIssues.push("Social/video research requires 5 reviewed assets when accessible.");
    }
  }

  return buildGateResult(machineIssues, research.judgmentChecks, advisoryIssues, limitedConfidence);
}

export function validateAudienceDefinitionGate(audience: AudienceDefinitionGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];

  if (!hasText(audience.targetCohort)) machineIssues.push("Audience definition must include a target cohort.");
  if (!hasText(audience.awarenessStage)) machineIssues.push("Audience definition must include reader awareness stage.");
  if (!hasText(audience.readerTakeaway)) machineIssues.push("Audience definition must include reader takeaway.");
  if (!audience.objections?.length) machineIssues.push("Audience definition must include at least one objection or trust barrier.");
  if (!hasText(audience.ctaConnection)) machineIssues.push("Audience definition must connect the reader to the CTA.");

  return buildGateResult(machineIssues, audience.judgmentChecks);
}

export function validateNarrativeBriefGate(brief: NarrativeBriefGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];

  if (!hasText(brief.primaryStyle)) machineIssues.push("Narrative brief must include a selected primary style.");
  if (!hasText(brief.openingAngle)) machineIssues.push("Narrative brief must include an opening angle.");
  if (!hasText(brief.brandPov)) machineIssues.push("Narrative brief must include brand POV.");
  if (!hasText(brief.pagePromise)) machineIssues.push("Narrative brief must include page promise.");
  if (!brief.sectionDirections?.some((section) => hasText(section.sectionId) && hasText(section.direction))) {
    machineIssues.push("Narrative brief must include section-level direction.");
  }

  return buildGateResult(machineIssues, brief.judgmentChecks);
}

export function validateCitationSetGate(citationSet: CitationSetGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];
  const highClaimWithoutSource = citationSet.claims.some((claim) => claim.strength === "high" && !hasText(claim.sourceUrl));
  const criticalClaimWithoutApprovalAndSource = citationSet.claims.some((claim) =>
    claim.strength === "critical" && (!hasText(claim.sourceUrl) || claim.approvalStatus !== "approved")
  );

  if (citationSet.claims.length === 0) machineIssues.push("Citation set must include claim mappings.");
  if (highClaimWithoutSource) machineIssues.push("High-strength claims require source support.");
  if (criticalClaimWithoutApprovalAndSource) machineIssues.push("Critical claims require explicit approval and source support.");

  return buildGateResult(machineIssues, citationSet.judgmentChecks);
}

export function validateContentBriefGate(brief: ContentBriefGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];
  const requiredHashes: Array<keyof ContentBriefGateInput["upstreamHashes"]> = [
    "step0AHash",
    "step0BHash",
    "pageJobHash",
    "searchIntentHash",
    "pageFormatHash",
    "nextActionHash",
    "serpCompetitorHash",
    "topicResearchHash",
    "uniqueAngleHash"
  ];
  const missingHashes = requiredHashes.filter((hashName) => !hasText(brief.upstreamHashes?.[hashName]));

  if (missingHashes.length > 0) {
    machineIssues.push(`Content brief requires all upstream hashes before Step 9: ${missingHashes.join(", ")}.`);
  }
  if (!hasText(brief.contentBriefSummaryStatement)) {
    machineIssues.push("Content brief must include contentBriefSummaryStatement.");
  }
  if (!hasText(brief.readerOutcomePromise)) {
    machineIssues.push("Content brief must include readerOutcomePromise.");
  }
  if (!brief.targetWordCountContract?.minimumWordCount || brief.targetWordCountContract.minimumWordCount <= 0) {
    machineIssues.push("Content brief must include a positive minimumWordCount.");
  }
  if (!brief.targetWordCountContract?.targetWordCountRange?.min || !brief.targetWordCountContract.targetWordCountRange.max) {
    machineIssues.push("Content brief must include targetWordCountRange.");
  }
  if (!hasText(brief.targetWordCountContract?.rangeBasis)) {
    machineIssues.push("Content brief must justify the word-count range basis.");
  }
  if ((brief.depthRequirements?.highDepthRequirements?.length ?? 0) < 3) {
    machineIssues.push("Content brief requires at least 3 highDepthRequirements.");
  }
  if ((brief.depthRequirements?.supportingDepthRequirements?.length ?? 0) < 2) {
    machineIssues.push("Content brief requires at least 2 supportingDepthRequirements.");
  }
  if ((brief.depthRequirements?.keepBriefOrExclude?.length ?? 0) < 2) {
    machineIssues.push("Content brief requires at least 2 keepBriefOrExclude depth boundaries.");
  }
  if (!brief.instructionRegistry?.length) {
    machineIssues.push("Content brief must include instructionRegistry.");
  } else {
    const mandatoryInstruction = brief.instructionRegistry.some((instruction) => instruction.priority === "mandatory");
    const prohibitedInstruction = brief.instructionRegistry.some((instruction) => instruction.priority === "prohibited");
    const incompleteInstruction = brief.instructionRegistry.some((instruction) =>
      !hasText(instruction.instructionId) ||
      !hasText(instruction.writerInstruction) ||
      !instruction.sourceRefs?.length ||
      !hasText(instruction.deliveryTest)
    );
    if (!mandatoryInstruction) machineIssues.push("Content brief instructionRegistry must include at least one mandatory instruction.");
    if (!prohibitedInstruction) machineIssues.push("Content brief instructionRegistry must include at least one prohibited instruction.");
    if (incompleteInstruction) machineIssues.push("Content brief instructions must include id, instruction, source refs, and delivery test.");
  }
  if (!brief.upstreamCoverageMatrix?.length) {
    machineIssues.push("Content brief must include upstreamCoverageMatrix.");
  }
  if (!brief.sourceUseGuidance?.length) {
    machineIssues.push("Content brief must include sourceUseGuidance.");
  }
  if (!brief.assetBriefingContract?.length) {
    machineIssues.push("Content brief must include assetBriefingContract.");
  }
  if (!brief.voiceAndQualityContract || Object.keys(brief.voiceAndQualityContract).length === 0) {
    machineIssues.push("Content brief must include voiceAndQualityContract.");
  }
  if (!brief.readabilityAndScanabilityRequirements?.length) {
    machineIssues.push("Content brief must include readabilityAndScanabilityRequirements.");
  }
  if (!brief.antiGenericContract?.genericFailureRisks?.length ||
    !brief.antiGenericContract.pageSpecificityRequirements?.length ||
    !brief.antiGenericContract.genericPhrasesOrMovesToAvoid?.length) {
    machineIssues.push("Content brief must include a complete antiGenericContract.");
  }
  if (!hasText(brief.synthesisRequirement)) {
    machineIssues.push("Content brief must include synthesisRequirement.");
  }
  if (!brief.brandFitBoundaries || Object.keys(brief.brandFitBoundaries).length === 0) {
    machineIssues.push("Content brief must include brandFitBoundaries.");
  }
  if (!brief.recencySensitivityCheck) {
    machineIssues.push("Content brief must include recencySensitivityCheck.");
  }
  if (brief.recencySensitivityCheck?.recencySensitive && !brief.recencySensitivityCheck.freshnessRequirements?.length) {
    machineIssues.push("Recency-sensitive briefs require freshnessRequirements.");
  }
  if (brief.marketLocalizationRequirements?.marketSensitive && !brief.marketLocalizationRequirements.requirements?.length) {
    machineIssues.push("Market-sensitive briefs require marketLocalizationRequirements.");
  }
  if (brief.readerObjectionHandling?.required && !brief.readerObjectionHandling.objections?.length) {
    machineIssues.push("Briefs with reader objections require readerObjectionHandling objections.");
  }
  if (!hasText(brief.practicalDeviceRequirements?.sharedBaselineConfigVersion)) {
    machineIssues.push("Content brief must reference the shared practical-device baseline config version.");
  }
  if (!brief.practicalDeviceRequirements?.pageSpecificMinimums?.length) {
    machineIssues.push("Content brief must include page-specific practical device minimums.");
  }
  if (!brief.minimumCompletenessStandard?.length) {
    machineIssues.push("Content brief must include minimumCompletenessStandard.");
  }
  if (!brief.draftRepairGuidance?.length) {
    machineIssues.push("Content brief must include draftRepairGuidance.");
  }
  if (brief.batchBriefIsolationCheck?.pageSpecificBrief !== true || brief.batchBriefIsolationCheck.reusedPriorBrief === true) {
    machineIssues.push("Content brief must pass batchBriefIsolationCheck.");
  }
  if (brief.semanticBriefUniquenessCheck?.currentBatchUnique !== true) {
    machineIssues.push("Content brief must pass current-batch semantic uniqueness.");
  }
  if (!brief.contentBriefDeliveryProofRequirements?.step9Required ||
    !brief.contentBriefDeliveryProofRequirements.step10Required ||
    !brief.contentBriefDeliveryProofRequirements.finalQaRequired) {
    machineIssues.push("Content brief must require Step 9, Step 10, and final QA delivery proof.");
  }
  if (!brief.mustCarryForward?.length) {
    machineIssues.push("Content brief must include mustCarryForward.");
  }
  if (!brief.step8OutputMustNotContain?.length) {
    machineIssues.push("Content brief must include step8OutputMustNotContain.");
  }
  if (!brief.step8CompletenessChecklist || Object.keys(brief.step8CompletenessChecklist).length === 0) {
    machineIssues.push("Content brief must include step8CompletenessChecklist.");
  } else {
    const failedChecklistItems = Object.entries(brief.step8CompletenessChecklist)
      .filter(([, passed]) => passed !== true)
      .map(([key]) => key);
    if (failedChecklistItems.length > 0) {
      machineIssues.push(`Content brief completeness checklist failed: ${failedChecklistItems.join(", ")}.`);
    }
  }
  if (brief.markdownParityChecked !== true) {
    machineIssues.push("Content brief Markdown parity must be checked.");
  }

  return buildGateResult(machineIssues, brief.judgmentChecks);
}

export function validatePageOutlineGate(outline: PageOutlineGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];
  const requiredHashes: Array<keyof PageOutlineGateInput["upstreamHashes"]> = [
    "step0AHash",
    "step0BHash",
    "pageJobHash",
    "searchIntentHash",
    "pageFormatHash",
    "nextActionHash",
    "serpCompetitorHash",
    "topicResearchHash",
    "uniqueAngleHash",
    "contentBriefHash"
  ];
  const missingHashes = requiredHashes.filter((hashName) => !hasText(outline.upstreamHashes?.[hashName]));

  if (missingHashes.length > 0) {
    machineIssues.push(`Page outline requires all upstream hashes before Step 10: ${missingHashes.join(", ")}.`);
  }
  if (!hasText(outline.pageOutlineHash)) machineIssues.push("Page outline must include pageOutlineHash.");
  if (!hasText(outline.workingH1)) machineIssues.push("Page outline must include one workingH1.");
  if (!hasText(outline.pageFlowType)) machineIssues.push("Page outline must include pageFlowType.");
  if (!hasText(outline.pageFlowReason) || !outline.pageFlowStep8Refs?.length) {
    machineIssues.push("Page outline must justify pageFlowType with Step 8 refs.");
  }
  if (!hasText(outline.readerJourneySummaryStatement)) {
    machineIssues.push("Page outline must include readerJourneySummaryStatement.");
  }
  if (!hasText(outline.sectionSequenceRationale)) {
    machineIssues.push("Page outline must include sectionSequenceRationale.");
  }
  if (outline.mainIntentVisibilityCheck?.visibleInFirstTwoH2s !== true) {
    machineIssues.push("Page outline must address the main search intent within the first 1-2 H2 sections.");
  }

  const sections = outline.outlineSections ?? [];
  const h2CountExceptionValid = outline.h2CountException?.justified === true &&
    hasText(outline.h2CountException.reason) &&
    Boolean(outline.h2CountException.sourceRefs?.length);
  if ((sections.length < 8 || sections.length > 14) && !h2CountExceptionValid) {
    machineIssues.push("Page outline must include 8-14 H2 sections unless a justified exception is recorded.");
  }
  if (sections.length === 0) {
    machineIssues.push("Page outline must include outlineSections.");
  }

  sections.forEach((section, index) => {
    const sectionLabel = section.sectionId || `section-${index + 1}`;
    if (!hasText(section.sectionId)) machineIssues.push(`Outline section ${sectionLabel} must include sectionId.`);
    if (!hasText(section.headingText)) machineIssues.push(`Outline section ${sectionLabel} must include headingText.`);
    if (!hasText(section.sectionRole)) machineIssues.push(`Outline section ${sectionLabel} must include sectionRole.`);
    if (!section.mappedStep8Refs?.length) machineIssues.push(`Outline section ${sectionLabel} must map to Step 8 refs.`);
    if (!hasText(section.purpose)) machineIssues.push(`Outline section ${sectionLabel} must include purpose.`);
    if (!section.depthLevel) machineIssues.push(`Outline section ${sectionLabel} must include depthLevel.`);
    if (!hasText(section.depthReason)) machineIssues.push(`Outline section ${sectionLabel} must include depthReason.`);
    if (!hasText(section.expectedTreatment)) machineIssues.push(`Outline section ${sectionLabel} must include expectedTreatment.`);
    if (!section.mappedDepthRequirementRefs?.length) {
      machineIssues.push(`Outline section ${sectionLabel} must map depth to Step 8 requirements.`);
    }
    if (!section.contentObligations?.length) {
      machineIssues.push(`Outline section ${sectionLabel} must include contentObligations.`);
    }
    if (section.depthLevel === "high" && !section.h3s?.length && !hasText(section.h3Rationale)) {
      machineIssues.push(`High-depth outline section ${sectionLabel} without H3s must explain h3Rationale.`);
    }
    if (index > 0 && !hasText(section.transitionFromPrevious)) {
      machineIssues.push(`Outline section ${sectionLabel} must include transitionFromPrevious.`);
    }
    if (!hasText(section.claimEvidenceNotes)) {
      machineIssues.push(`Outline section ${sectionLabel} must include claimEvidenceNotes.`);
    }
    if (section.scopeBoundaryRisk && !section.scopeBoundaryNotes?.length) {
      machineIssues.push(`Outline section ${sectionLabel} with scope risk must include scopeBoundaryNotes.`);
    }
  });

  if (outline.queryCoveragePlan?.targetKeywordMapped !== true || outline.queryCoveragePlan.supportingQueriesMapped !== true) {
    machineIssues.push("Page outline must map target keyword and supporting queries to natural sections.");
  }
  if (!outline.queryCoveragePlan?.doNotForceTerms?.length) {
    machineIssues.push("Page outline must include doNotForceTerms in queryCoveragePlan.");
  }
  if (!outline.assetPlacementPlan?.length) machineIssues.push("Page outline must include assetPlacementPlan.");
  if (!outline.internalLinkPlacementPlan?.length) machineIssues.push("Page outline must include internalLinkPlacementPlan.");
  if (!outline.ctaPlacementPlan?.length) machineIssues.push("Page outline must include ctaPlacementPlan.");

  if (!outline.faqPlan?.decision) {
    machineIssues.push("Page outline must include faqPlan.");
  } else if (outline.faqPlan.decision === "none") {
    if (!hasText(outline.faqPlan.noneExceptionReason) || !outline.faqPlan.evidenceRefs?.length) {
      machineIssues.push("FAQ none decision requires strong exception reason and evidence refs.");
    }
  } else if (!outline.faqPlan.routedQuestions?.length) {
    machineIssues.push("FAQ short or detailed decision requires routedQuestions.");
  }

  if (outline.contentBriefDeliveryProof?.allMandatoryInstructionsCovered !== true ||
    outline.contentBriefDeliveryProof.returnedToStep8 === true ||
    (outline.contentBriefDeliveryProof?.missingMandatoryInstructions?.length ?? 0) > 0) {
    machineIssues.push("Page outline must prove all mandatory Step 8 instructions are represented or properly routed.");
  }
  if (outline.step8RefinementPatch?.some((refinement) => refinement.strategicChange === true)) {
    machineIssues.push("Step 9 may not make strategic Step 8 refinements.");
  }
  if (outline.outlineOriginalityCheck?.noCopiedCompetitorHeadings !== true ||
    outline.outlineOriginalityCheck.noCopiedCompetitorStructure !== true ||
    outline.outlineOriginalityCheck.noCopiedTableLogic !== true) {
    machineIssues.push("Page outline must pass competitor originality checks.");
  }
  if (outline.outlineScanabilityCheck?.importantAnswerEarly !== true ||
    outline.outlineScanabilityCheck.noOverloadedH2s !== true ||
    outline.outlineScanabilityCheck.noBuriedSafetyOrDecisionInfo !== true ||
    outline.outlineScanabilityCheck.headingsScannable !== true) {
    machineIssues.push("Page outline must pass outlineScanabilityCheck.");
  }
  if (outline.headingHierarchyCheck?.singleH1 !== true ||
    outline.headingHierarchyCheck.h2sNonOverlapping !== true ||
    outline.headingHierarchyCheck.h3sUsefulOnly !== true ||
    outline.headingHierarchyCheck.headingsScannable !== true) {
    machineIssues.push("Page outline must pass headingHierarchyCheck.");
  }
  if (outline.batchOutlineIsolationCheck?.pageSpecificOutline !== true ||
    outline.batchOutlineIsolationCheck.reusedPriorOutline === true ||
    outline.batchOutlineIsolationCheck.currentBatchUnique !== true ||
    outline.batchOutlineIsolationCheck.similarityToCurrentBatch === "high") {
    machineIssues.push("Page outline must pass batchOutlineIsolationCheck.");
  }
  if (!outline.outlineDeliveryProofRequirements?.step10Required ||
    !outline.outlineDeliveryProofRequirements.finalQaRequired) {
    machineIssues.push("Page outline must require Step 10 and final QA delivery proof.");
  }
  if (!outline.mustCarryForward?.length) machineIssues.push("Page outline must include mustCarryForward.");
  if (!outline.step9OutputMustNotContain?.length) machineIssues.push("Page outline must include step9OutputMustNotContain.");
  if (!outline.step9CompletenessChecklist || Object.keys(outline.step9CompletenessChecklist).length === 0) {
    machineIssues.push("Page outline must include step9CompletenessChecklist.");
  } else {
    const failedChecklistItems = Object.entries(outline.step9CompletenessChecklist)
      .filter(([, passed]) => passed !== true)
      .map(([key]) => key);
    if (failedChecklistItems.length > 0) {
      machineIssues.push(`Page outline completeness checklist failed: ${failedChecklistItems.join(", ")}.`);
    }
  }
  if (outline.markdownParityChecked !== true) {
    machineIssues.push("Page outline Markdown parity must be checked.");
  }
  if (outline.pageOutlineVerdict?.status !== "pass" && outline.pageOutlineVerdict?.status !== "pass_with_warnings") {
    machineIssues.push("Page outline verdict must be pass or pass_with_warnings before Step 10.");
  }
  if (outline.pageOutlineVerdict?.action !== "continue_to_step10") {
    machineIssues.push("Page outline verdict action must be continue_to_step10 before drafting.");
  }

  return buildGateResult(machineIssues, outline.judgmentChecks);
}

export function validateFirstDraftGate(draft: FirstDraftGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];
  const requiredHashes: Array<keyof FirstDraftGateInput["upstreamHashes"]> = [
    "step0AHash",
    "step0BHash",
    "pageJobHash",
    "searchIntentHash",
    "pageFormatHash",
    "nextActionHash",
    "serpCompetitorHash",
    "topicResearchHash",
    "uniqueAngleHash",
    "contentBriefHash",
    "pageOutlineHash"
  ];
  const missingHashes = requiredHashes.filter((hashName) => !hasText(draft.upstreamHashes?.[hashName]));

  if (missingHashes.length > 0) {
    machineIssues.push(`First draft requires all upstream hashes before Step 11: ${missingHashes.join(", ")}.`);
  }
  if (!hasText(draft.firstDraftHash)) machineIssues.push("First draft must include firstDraftHash.");
  if (!hasText(draft.draftSummaryStatement)) machineIssues.push("First draft must include draftSummaryStatement.");
  if (!hasText(draft.h1)) machineIssues.push("First draft must include the working H1 used for drafting.");

  const minimumWordCount = draft.wordCountContract?.minimumWordCount ?? 0;
  const actualWordCount = draft.wordCountContract?.actualWordCount ?? 0;
  if (minimumWordCount <= 0) machineIssues.push("First draft must inherit a positive minimumWordCount.");
  if (actualWordCount < minimumWordCount) {
    machineIssues.push("First draft actualWordCount must meet or exceed the Step 8 minimumWordCount.");
  }
  if (draft.wordCountContract?.noPaddingOrRepetition !== true) {
    machineIssues.push("First draft must prove the word-count floor was met without padding or repetition.");
  }

  const sections = draft.draftSections ?? [];
  if (sections.length === 0) machineIssues.push("First draft must include draftSections.");
  sections.forEach((section, index) => {
    const sectionLabel = section.sectionId || `section-${index + 1}`;
    if (!hasText(section.sectionId)) machineIssues.push(`Draft section ${sectionLabel} must include sectionId.`);
    if (!hasText(section.heading)) machineIssues.push(`Draft section ${sectionLabel} must include heading.`);
    if (!hasText(section.draftCopy)) machineIssues.push(`Draft section ${sectionLabel} must include draftCopy.`);
    if (!section.outlineRefs?.length) machineIssues.push(`Draft section ${sectionLabel} must reference the Step 9 outline.`);
    if (!section.contentObligationsFulfilled?.length) {
      machineIssues.push(`Draft section ${sectionLabel} must list contentObligationsFulfilled.`);
    }
    if (section.evidenceRequirementLevel === "evidence_required" && !section.evidenceRefs?.length) {
      machineIssues.push(`Draft section ${sectionLabel} requires evidenceRefs.`);
    }
    if (section.noNewFactualClaims !== true && section.newFactualClaimsRouted !== true) {
      machineIssues.push(`Draft section ${sectionLabel} must avoid new factual claims or route them to Step 6.`);
    }
    if (section.depthProof?.depthLevel === "high") {
      const highDepthComplete = section.depthProof.complete === true &&
        section.depthProof.includesDefinitionOrExplanation === true &&
        section.depthProof.includesWhyItMatters === true &&
        section.depthProof.includesHowToOrDecisionRule === true &&
        section.depthProof.includesExampleOrScenario === true &&
        section.depthProof.includesCautionMistakeOrCaveat === true &&
        section.depthProof.includesTransition === true;
      if (!highDepthComplete && !hasText(section.depthProof.missingExpectedPartsReason)) {
        machineIssues.push(`High-depth draft section ${sectionLabel} must pass expansion proof or explain missing expected parts.`);
      }
    }
    if (section.examplesUsed?.some((example) =>
      !hasText(example.example) ||
      (example.illustrativeOnly !== true && example.derivedFromEvidence !== true && !example.sourceRefs?.length)
    )) {
      machineIssues.push(`Draft section ${sectionLabel} examples must be evidence-derived or marked illustrative_only.`);
    }
    if (section.genericProseDetected === true || section.placeholderDetected === true) {
      machineIssues.push(`Draft section ${sectionLabel} must not contain generic or placeholder prose.`);
    }
  });

  const intro = draft.introductionQualityGate;
  if (intro?.startsWithReaderProblem !== true ||
    intro?.confirmsIntent !== true ||
    intro?.statesPagePromise !== true ||
    intro?.setsScope !== true ||
    intro?.avoidsGenericFiller !== true ||
    intro?.leadsIntoPage !== true) {
    machineIssues.push("First draft introductionQualityGate must pass.");
  }
  if (draft.sectionExpansionGate?.highDepthCoreSectionsPassed !== true ||
    (draft.sectionExpansionGate?.weakSectionIds?.length ?? 0) > 0) {
    machineIssues.push("First draft must pass sectionExpansionGate for high-depth/core sections.");
  }
  if (draft.draftCompletenessProof?.pageJobSatisfied !== true ||
    draft.draftCompletenessProof.searchIntentSatisfied !== true ||
    draft.draftCompletenessProof.contentBriefSatisfied !== true ||
    draft.draftCompletenessProof.pageOutlineSatisfied !== true ||
    draft.draftCompletenessProof.satisfactionConditionMet !== true ||
    draft.draftCompletenessProof.wrongPageRisksAvoided !== true ||
    draft.draftCompletenessProof.exclusionsRespected !== true) {
    machineIssues.push("First draft must prove page job, intent, brief, outline, satisfaction, and exclusions are satisfied.");
  }
  if (draft.requiredAssetDelivery?.allRequiredAssetsDelivered !== true ||
    (draft.requiredAssetDelivery?.placeholderOnlyAssets?.length ?? 0) > 0) {
    machineIssues.push("First draft must deliver all required assets as usable text/table/checklist/flow content.");
  }
  if (draft.draftClaimSafetyCheck?.riskyClaimsHandled !== true ||
    draft.draftClaimSafetyCheck.audienceLanguageNotUsedAsFactualProof !== true ||
    draft.draftClaimSafetyCheck.sensitiveBoundariesRespected !== true ||
    draft.draftClaimSafetyCheck.newFactualClaimsRoutedToStep6 !== true ||
    (draft.draftClaimSafetyCheck?.unsupportedRiskyClaims?.length ?? 0) > 0) {
    machineIssues.push("First draft must pass draftClaimSafetyCheck.");
  }
  if (draft.naturalQueryCoverageCheck?.targetKeywordMeaningCovered !== true ||
    draft.naturalQueryCoverageCheck.supportingQueryNeedsCovered !== true ||
    draft.naturalQueryCoverageCheck.noKeywordStuffing !== true ||
    draft.naturalQueryCoverageCheck.noDensityTargets !== true ||
    draft.naturalQueryCoverageCheck.scopeBoundariesRespected !== true) {
    machineIssues.push("First draft must pass naturalQueryCoverageCheck.");
  }
  if (draft.draftReadabilityScanabilityGate?.shortParagraphs !== true ||
    draft.draftReadabilityScanabilityGate.noWallsOfText !== true ||
    draft.draftReadabilityScanabilityGate.usefulListsOrTables !== true ||
    draft.draftReadabilityScanabilityGate.clearTransitions !== true ||
    draft.draftReadabilityScanabilityGate.visibleWarningsDecisionsNextActions !== true ||
    draft.draftReadabilityScanabilityGate.noBuriedPrimaryAnswer !== true ||
    draft.draftReadabilityScanabilityGate.sectionFlowMatchesStep9 !== true) {
    machineIssues.push("First draft must pass draftReadabilityScanabilityGate.");
  }
  if (draft.faqDraftDelivery?.requiredByStep9 === true &&
    (draft.faqDraftDelivery.draftedWhenPlanned !== true || draft.faqDraftDelivery.placeholderOnly === true)) {
    machineIssues.push("First draft must write usable FAQ answers when Step 9 planned FAQ.");
  }
  if (draft.ctaInternalLinkDelivery?.draftedWherePlanned !== true ||
    draft.ctaInternalLinkDelivery.nonFinalWordingMarked !== true ||
    draft.ctaInternalLinkDelivery.placeholdersOnly === true ||
    draft.ctaInternalLinkDelivery.followsBoundaries !== true) {
    machineIssues.push("First draft must deliver draft CTA/internal-link copy where planned without violating boundaries.");
  }
  if (draft.voiceAndBrandFitCheck?.followsVoiceAndQualityContract !== true ||
    draft.voiceAndBrandFitCheck.avoidsGenericAiProse !== true ||
    draft.voiceAndBrandFitCheck.readerFirst !== true ||
    draft.voiceAndBrandFitCheck.naturalBrandConnection !== true ||
    draft.voiceAndBrandFitCheck.respectsBrandFitBoundaries !== true) {
    machineIssues.push("First draft must pass voiceAndBrandFitCheck.");
  }
  if (draft.draftUniquenessCheck?.currentBatchUnique !== true ||
    draft.draftUniquenessCheck.historicalCheckedOrWarning !== true ||
    draft.draftUniquenessCheck.repeatedIntro === true ||
    draft.draftUniquenessCheck.repeatedSectionBodyPattern === true ||
    draft.draftUniquenessCheck.repeatedExamples === true ||
    draft.draftUniquenessCheck.repeatedAssetsOrFaqOrCta === true) {
    machineIssues.push("First draft must pass draftUniquenessCheck.");
  }
  if (draft.antiGenericDraftGate?.passed !== true ||
    (draft.antiGenericDraftGate?.bannedPhrasesFound?.length ?? 0) > 0 ||
    (draft.antiGenericDraftGate?.placeholdersFound?.length ?? 0) > 0) {
    machineIssues.push("First draft must pass antiGenericDraftGate.");
  }
  if (!draft.firstDraftDeliveryProofRequirements?.step11Required ||
    !draft.firstDraftDeliveryProofRequirements.finalQaRequired) {
    machineIssues.push("First draft must require Step 11 and final QA delivery proof.");
  }
  if (!draft.mustCarryForward?.length) machineIssues.push("First draft must include mustCarryForward.");
  if (!draft.step10OutputMustNotContain?.length) machineIssues.push("First draft must include step10OutputMustNotContain.");
  if (!draft.step10CompletenessChecklist || Object.keys(draft.step10CompletenessChecklist).length === 0) {
    machineIssues.push("First draft must include step10CompletenessChecklist.");
  } else {
    const failedChecklistItems = Object.entries(draft.step10CompletenessChecklist)
      .filter(([, passed]) => passed !== true)
      .map(([key]) => key);
    if (failedChecklistItems.length > 0) {
      machineIssues.push(`First draft completeness checklist failed: ${failedChecklistItems.join(", ")}.`);
    }
  }
  if (draft.markdownParityChecked !== true) machineIssues.push("First draft Markdown parity must be checked.");
  if (draft.firstDraftVerdict?.status !== "pass" && draft.firstDraftVerdict?.status !== "pass_with_warnings") {
    machineIssues.push("First draft verdict must be pass or pass_with_warnings before Step 11.");
  }
  if (draft.firstDraftVerdict?.action !== "continue_to_step11") {
    machineIssues.push("First draft verdict action must be continue_to_step11 before SEO optimization.");
  }
  if (!draft.firstDraftVerdict?.confidence) machineIssues.push("First draft verdict must include confidence.");
  if ((draft.repairAttemptsUsed ?? 0) > 3) machineIssues.push("Step 10 repairs are limited to 3 attempts.");

  return buildGateResult(machineIssues, draft.judgmentChecks);
}

export function validateOnPageSeoGate(seo: OnPageSeoGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];
  const requiredHashes: Array<keyof OnPageSeoGateInput["upstreamHashes"]> = [
    "step0AHash",
    "step0BHash",
    "pageJobHash",
    "searchIntentHash",
    "pageFormatHash",
    "nextActionHash",
    "serpCompetitorHash",
    "topicResearchHash",
    "uniqueAngleHash",
    "contentBriefHash",
    "pageOutlineHash",
    "firstDraftHash"
  ];
  const missingHashes = requiredHashes.filter((hashName) => !hasText(seo.upstreamHashes?.[hashName]));

  if (missingHashes.length > 0) {
    machineIssues.push(`On-page SEO requires all upstream hashes before Step 12: ${missingHashes.join(", ")}.`);
  }
  if (!hasText(seo.onPageSeoHash)) machineIssues.push("On-page SEO must include onPageSeoHash.");
  if (!hasText(seo.onPageSeoSummaryStatement)) {
    machineIssues.push("On-page SEO must include onPageSeoSummaryStatement.");
  }
  if (!hasText(seo.optimizedDraft?.optimizedH1)) machineIssues.push("On-page SEO must include optimizedDraft.optimizedH1.");

  const optimizedSections = seo.optimizedDraft?.sections ?? [];
  if (optimizedSections.length === 0) machineIssues.push("On-page SEO must include optimized draft sections.");
  optimizedSections.forEach((section, index) => {
    const sectionLabel = section.sectionId || `section-${index + 1}`;
    if (!hasText(section.sectionId)) machineIssues.push(`Optimized section ${sectionLabel} must include sectionId.`);
    if (!hasText(section.optimizedHeading)) machineIssues.push(`Optimized section ${sectionLabel} must include optimizedHeading.`);
    if (!hasText(section.optimizedCopy)) machineIssues.push(`Optimized section ${sectionLabel} must include optimizedCopy.`);
    if (!section.firstDraftRefs?.length) machineIssues.push(`Optimized section ${sectionLabel} must reference the Step 10 draft.`);
    if (!section.pageOutlineRefs?.length) machineIssues.push(`Optimized section ${sectionLabel} must reference the Step 9 outline.`);
    if (section.requiredDepthPreserved !== true) {
      machineIssues.push(`Optimized section ${sectionLabel} must preserve required depth.`);
    }
    if (section.answerPlacementImprovedOrPreserved !== true) {
      machineIssues.push(`Optimized section ${sectionLabel} must prove answer placement was improved or preserved.`);
    }
    if (section.naturalQueryCoverageImprovedOrPreserved !== true) {
      machineIssues.push(`Optimized section ${sectionLabel} must prove natural query coverage was improved or preserved.`);
    }
    if (section.genericOptimizationDetected === true) {
      machineIssues.push(`Optimized section ${sectionLabel} must not contain generic optimization.`);
    }
    if (section.keywordStuffingDetected === true) {
      machineIssues.push(`Optimized section ${sectionLabel} must not contain keyword stuffing.`);
    }
    if ((section.unsupportedNewClaims?.length ?? 0) > 0) {
      machineIssues.push(`Optimized section ${sectionLabel} must not introduce unsupported new claims.`);
    }
  });

  if (!seo.seoChangeLog?.length) {
    machineIssues.push("On-page SEO must include seoChangeLog.");
  } else {
    const incompleteChange = seo.seoChangeLog.some((change) =>
      !change.changeType ||
      !hasText(change.description) ||
      !hasText(change.whyItImprovesIntentOrFocus) ||
      !change.protectedUpstreamRefs?.length
    );
    if (incompleteChange) {
      machineIssues.push("Every on-page SEO change must include type, description, intent/focus reason, and protected upstream refs.");
    }
  }

  if (seo.intentAlignmentCheck?.stillMatchesSearchIntent !== true ||
    seo.intentAlignmentCheck.pageJobStillSatisfied !== true ||
    seo.intentAlignmentCheck.expectedDepthPreserved !== true ||
    seo.intentAlignmentCheck.pageTypeFormatPreserved !== true ||
    seo.intentAlignmentCheck.noIntentDrift !== true) {
    machineIssues.push("On-page SEO must pass intentAlignmentCheck.");
  }
  if (seo.h1OptimizationCheck?.clearSpecificH1 !== true ||
    seo.h1OptimizationCheck.naturalKeywordOrVariation !== true ||
    seo.h1OptimizationCheck.matchesPageJobIntentAndScope !== true ||
    seo.h1OptimizationCheck.avoidsVagueCleverWording !== true) {
    machineIssues.push("On-page SEO must pass h1OptimizationCheck.");
  }
  if (seo.introOptimizationGate?.startsCloseToReaderProblem !== true ||
    seo.introOptimizationGate.confirmsQueryIntent !== true ||
    seo.introOptimizationGate.naturalTopicOrKeywordMention !== true ||
    seo.introOptimizationGate.setsScope !== true ||
    seo.introOptimizationGate.previewsUsefulOutcome !== true ||
    seo.introOptimizationGate.avoidsGenericFiller !== true ||
    seo.introOptimizationGate.leadsIntoFirstSection !== true) {
    machineIssues.push("On-page SEO must pass introOptimizationGate.");
  }
  if (seo.headingOptimizationCheck?.h1H2H3WordingOptimized !== true ||
    seo.headingOptimizationCheck.step9SectionSetPreserved !== true ||
    seo.headingOptimizationCheck.hierarchyPreserved !== true ||
    seo.headingOptimizationCheck.headingsScannable !== true ||
    seo.headingOptimizationCheck.noKeywordOnlyHeadings !== true ||
    seo.headingOptimizationCheck.returnToStep9Required === true) {
    machineIssues.push("On-page SEO must optimize headings without changing the Step 9 section set or hierarchy.");
  }

  const topicalMap = seo.topicalCompletenessMap ?? [];
  if (topicalMap.length === 0) {
    machineIssues.push("On-page SEO must include topicalCompletenessMap.");
  }
  topicalMap.forEach((item, index) => {
    const itemLabel = item.requiredTopicOrReaderNeed || `topical-item-${index + 1}`;
    if (!hasText(item.requiredTopicOrReaderNeed)) {
      machineIssues.push(`Topical completeness item ${itemLabel} must include requiredTopicOrReaderNeed.`);
    }
    if (!hasText(item.currentCoverage)) machineIssues.push(`Topical completeness item ${itemLabel} must include currentCoverage.`);
    if (!item.depthNeeded) machineIssues.push(`Topical completeness item ${itemLabel} must include depthNeeded.`);
    if (!item.status) machineIssues.push(`Topical completeness item ${itemLabel} must include status.`);
    if (!item.action) machineIssues.push(`Topical completeness item ${itemLabel} must include action.`);
    if (!item.upstreamRefs?.length) machineIssues.push(`Topical completeness item ${itemLabel} must include upstreamRefs.`);
    if (!hasText(item.deliveryProof)) machineIssues.push(`Topical completeness item ${itemLabel} must include deliveryProof.`);
    if (item.status !== "complete" && item.action === "keep") {
      machineIssues.push(`Topical completeness item ${itemLabel} cannot keep incomplete or off-intent coverage without action.`);
    }
  });

  if (seo.naturalQueryCoverageContract?.targetKeywordRepresentedNaturally !== true ||
    seo.naturalQueryCoverageContract.supportingQueriesMappedToReaderNeeds !== true ||
    seo.naturalQueryCoverageContract.highSignalPlacementAppropriate !== true ||
    seo.naturalQueryCoverageContract.noKeywordDensityTargets !== true ||
    seo.naturalQueryCoverageContract.noAwkwardExactMatchRepetition !== true ||
    seo.naturalQueryCoverageContract.noForcedSynonyms !== true ||
    seo.naturalQueryCoverageContract.noScopeExpansionForKeywords !== true) {
    machineIssues.push("On-page SEO must pass naturalQueryCoverageContract.");
  }
  if (seo.sectionRelevanceCheck?.allSectionsSupportPageJob !== true ||
    seo.sectionRelevanceCheck.noGenericSections !== true ||
    seo.sectionRelevanceCheck.noOffIntentSections !== true ||
    seo.sectionRelevanceCheck.weakSectionsFixedOrRouted !== true) {
    machineIssues.push("On-page SEO must pass sectionRelevanceCheck.");
  }
  if (seo.contentFocusChangeLog?.increasesLogged !== true ||
    seo.contentFocusChangeLog.movesLogged !== true ||
    seo.contentFocusChangeLog.removalsLogged !== true ||
    seo.contentFocusChangeLog.requiredDepthNotReduced !== true ||
    seo.contentFocusChangeLog.offIntentRepetitionAndOvercoverageHandled !== true) {
    machineIssues.push("On-page SEO must log increases, moves, removals, and prove required depth was not reduced.");
  }
  if (seo.internalLinkOptimization?.validatedDestinationsOnly !== true ||
    seo.internalLinkOptimization.destinationStatusPreserved !== true ||
    seo.internalLinkOptimization.anchorContextRelevant !== true ||
    seo.internalLinkOptimization.noInventedUrls !== true ||
    seo.internalLinkOptimization.missingDestinationsRouted !== true) {
    machineIssues.push("On-page SEO must pass internalLinkOptimization.");
  }
  if (seo.assetOptimization?.assetsSupportReaderNeed !== true ||
    seo.assetOptimization.altTextOrFallbackChecked !== true ||
    seo.assetOptimization.textFallbackPreserved !== true ||
    seo.assetOptimization.noImagePromptOrAssetGeneration !== true) {
    machineIssues.push("On-page SEO must pass assetOptimization.");
  }
  if (seo.readabilityScanabilityCheck?.paragraphsNotDense !== true ||
    seo.readabilityScanabilityCheck.importantAnswersVisible !== true ||
    seo.readabilityScanabilityCheck.functionalListsTablesSummaries !== true ||
    seo.readabilityScanabilityCheck.clearTransitions !== true ||
    seo.readabilityScanabilityCheck.warningsAndDecisionPointsVisible !== true ||
    seo.readabilityScanabilityCheck.formattingNotDecorativeOnly !== true) {
    machineIssues.push("On-page SEO must pass readabilityScanabilityCheck.");
  }
  if (seo.answerPlacementCheck?.mainAnswerNearTop !== true ||
    seo.answerPlacementCheck.importantHeadingsAnsweredDirectly !== true ||
    seo.answerPlacementCheck.definitionsBeforeAdvancedDiscussion !== true ||
    seo.answerPlacementCheck.safetyDecisionAnswersNotBuried !== true) {
    machineIssues.push("On-page SEO must pass answerPlacementCheck.");
  }
  if (seo.naturalLanguageOptimizationGate?.noKeywordStuffing !== true ||
    seo.naturalLanguageOptimizationGate.noForcedSynonyms !== true ||
    seo.naturalLanguageOptimizationGate.noRoboticSeoLanguage !== true ||
    seo.naturalLanguageOptimizationGate.noRepeatedSentencePatterns !== true ||
    seo.naturalLanguageOptimizationGate.noHeadingsWrittenOnlyForKeywords !== true ||
    seo.naturalLanguageOptimizationGate.preservesReaderFirstVoice !== true) {
    machineIssues.push("On-page SEO must pass naturalLanguageOptimizationGate.");
  }
  if (seo.lightClaimSourceUseCheck?.noUnsupportedNewClaims !== true ||
    seo.lightClaimSourceUseCheck.caveatsPreserved !== true ||
    seo.lightClaimSourceUseCheck.audienceLanguageNotUsedAsFactualProof !== true ||
    seo.lightClaimSourceUseCheck.riskyClaimsNotMadeMoreAbsolute !== true ||
    seo.lightClaimSourceUseCheck.trustCitationWorkRoutedToStep12 !== true) {
    machineIssues.push("On-page SEO must pass lightClaimSourceUseCheck.");
  }
  if ((hasText(seo.metadataCandidates?.slugCandidate) ||
    hasText(seo.metadataCandidates?.seoTitleCandidate) ||
    hasText(seo.metadataCandidates?.metaDescriptionCandidate)) &&
    seo.metadataCandidates?.labeledNonFinal !== true) {
    machineIssues.push("On-page SEO metadata candidates must be labeled non-final.");
  }
  if (seo.onPageSeoUniquenessCheck?.currentBatchUnique !== true ||
    seo.onPageSeoUniquenessCheck.historicalCheckedOrWarning !== true ||
    seo.onPageSeoUniquenessCheck.repeatedOptimizedIntro === true ||
    seo.onPageSeoUniquenessCheck.repeatedHeadingPattern === true ||
    seo.onPageSeoUniquenessCheck.repeatedTopicalFixes === true ||
    seo.onPageSeoUniquenessCheck.repeatedInternalLinkPath === true ||
    seo.onPageSeoUniquenessCheck.repeatedAssetAltOrFaqOrSummaryPattern === true) {
    machineIssues.push("On-page SEO must pass onPageSeoUniquenessCheck.");
  }
  if (!seo.onPageSeoDeliveryProofRequirements?.step12Required ||
    !seo.onPageSeoDeliveryProofRequirements.finalQaRequired) {
    machineIssues.push("On-page SEO must require Step 12 and final QA delivery proof.");
  }
  if (!seo.mustCarryForward?.length) machineIssues.push("On-page SEO must include mustCarryForward.");
  if (!seo.step11OutputMustNotContain?.length) machineIssues.push("On-page SEO must include step11OutputMustNotContain.");
  if (!seo.step11CompletenessChecklist || Object.keys(seo.step11CompletenessChecklist).length === 0) {
    machineIssues.push("On-page SEO must include step11CompletenessChecklist.");
  } else {
    const failedChecklistItems = Object.entries(seo.step11CompletenessChecklist)
      .filter(([, passed]) => passed !== true)
      .map(([key]) => key);
    if (failedChecklistItems.length > 0) {
      machineIssues.push(`On-page SEO completeness checklist failed: ${failedChecklistItems.join(", ")}.`);
    }
  }
  if (seo.markdownParityChecked !== true) machineIssues.push("On-page SEO Markdown parity must be checked.");
  if (seo.onPageSeoVerdict?.status !== "pass" && seo.onPageSeoVerdict?.status !== "pass_with_warnings") {
    machineIssues.push("On-page SEO verdict must be pass or pass_with_warnings before Step 12.");
  }
  if (seo.onPageSeoVerdict?.action !== "continue_to_step12") {
    machineIssues.push("On-page SEO verdict action must be continue_to_step12 before Step 12.");
  }
  if (!seo.onPageSeoVerdict?.confidence) machineIssues.push("On-page SEO verdict must include confidence.");
  if ((seo.repairAttemptsUsed ?? 0) > 2) machineIssues.push("Step 11 repairs are limited to 2 attempts.");

  return buildGateResult(machineIssues, seo.judgmentChecks);
}

export function allMandatoryGatesPassed(results: V2GateValidationResult[]): boolean {
  return results.every((result) =>
    (result.status === "passed" || result.status === "passed_limited_confidence") &&
    result.machineChecksPassed &&
    result.judgmentChecksPassed &&
    result.blockingIssues.length === 0
  );
}

const cappedSourceTypes = new Set(["forum", "directory", "marketplace", "community", "aggregator", "reddit", "quora"]);

function isMeaningfullyExtractedSerpSource(source: SerpResearchGateInput["analyzedSources"][number]): boolean {
  return hasText(source.url) &&
    source.extractionStatus === "success" &&
    Boolean(source.bodySummary && source.bodySummary.trim().length >= 80) &&
    Array.isArray(source.h2h3Outline) &&
    source.h2h3Outline.length > 0;
}

function buildGateResult(
  machineIssues: string[],
  judgmentChecks?: JudgmentChecks,
  advisoryIssues: string[] = [],
  limitedConfidence = false
): V2GateValidationResult {
  const judgmentChecksPassed = Boolean(judgmentChecks?.passed);
  const blockingIssues = [...machineIssues];
  if (!judgmentChecksPassed) blockingIssues.push("Host-agent judgment checks must pass.");

  return {
    status: blockingIssues.length === 0 ? (limitedConfidence ? "passed_limited_confidence" : "passed") : "failed",
    machineChecksPassed: machineIssues.length === 0,
    judgmentChecksPassed,
    blockingIssues,
    advisoryIssues
  };
}

function hasText(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}
