/**
 * Ortheon MVP Cut v3.1 - Portfolio Composer API Route
 *
 * AI Call 4:
 * PortfolioComposerInputV31 -> FinalDirectionPortfolioV31
 *
 * Scope:
 * - Isolated API route only.
 * - No UI integration.
 * - No Firestore reads/writes.
 * - No ResultsStep / report integration.
 */

import { PORTFOLIO_COMPOSER_PROMPT_SPEC_V31 } from "../src/v31/prompts/portfolioComposerPromptSpecV31.js";
import { normalizeFinalPortfolioOutputV31 } from "../src/v31/normalizers/finalPortfolioOutputNormalizerV31.js";

const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [0, 1500, 3000];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientStatus(status) {
  return [500, 502, 503, 504, 529].includes(status);
}

function isNonRetryableStatus(status) {
  return [400, 401, 403, 404].includes(status);
}

function isOverloadedBody(body) {
  return JSON.stringify(body || "").toLowerCase().includes("overloaded");
}

function sanitizeErrorText(body) {
  const msg =
    body?.error?.message ||
    body?.error?.type ||
    (typeof body?.error === "string" ? body.error : null) ||
    "Unknown error";

  return String(msg).slice(0, 200);
}

function cleanClaudeJsonText(rawText) {
  return String(rawText || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

async function callAnthropicWithRetry(apiKey, model, prompt) {
  let lastStatus = null;
  let lastBody = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 1) {
      const delay = RETRY_DELAYS_MS[attempt - 1];
      console.log(
        `[portfolio-composer-v31] attempt ${attempt}/${MAX_ATTEMPTS} - waiting ${delay}ms before retry`
      );
      await sleep(delay);
    }

    let response;
    let body;

    try {
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 2500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      body = await response.json().catch(() => ({}));
    } catch (networkError) {
      console.log(
        `[portfolio-composer-v31] attempt ${attempt}/${MAX_ATTEMPTS} - network error: ${networkError.message}`
      );

      lastBody = {};
      lastStatus = 0;
      continue;
    }

    lastStatus = response.status;
    lastBody = body;

    if (response.ok) {
      console.log(
        `[portfolio-composer-v31] attempt ${attempt}/${MAX_ATTEMPTS} - status ${lastStatus} - success`
      );

      return { ok: true, data: body };
    }

    const safeError = sanitizeErrorText(body);

    console.log(
      `[portfolio-composer-v31] attempt ${attempt}/${MAX_ATTEMPTS} - status ${lastStatus} - ${safeError}`
    );

    if (isNonRetryableStatus(lastStatus)) {
      return { ok: false, status: lastStatus, body, retryable: false };
    }

    if (!isTransientStatus(lastStatus) && !isOverloadedBody(body)) {
      return { ok: false, status: lastStatus, body, retryable: false };
    }
  }

  return {
    ok: false,
    status: lastStatus,
    body: lastBody,
    overloaded: true,
  };
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasAssessmentIdMismatch(value, assessmentId) {
  return Boolean(value?.assessmentId && value.assessmentId !== assessmentId);
}

function validateInput(body) {
  const input = body?.portfolioComposerInput || body;

  if (!isObject(input)) {
    return {
      ok: false,
      error: "PortfolioComposerInputV31 object is required.",
    };
  }

  if (input.stage !== "portfolio_composer_v31") {
    return {
      ok: false,
      error: "Input stage must be portfolio_composer_v31.",
    };
  }

  if (!input.instructionsVersion || typeof input.instructionsVersion !== "string") {
    return {
      ok: false,
      error: "instructionsVersion is required.",
    };
  }

  if (
    !isObject(input.assessmentSnapshot) ||
    input.assessmentSnapshot.version !== "v3.1"
  ) {
    return {
      ok: false,
      error: "assessmentSnapshot.version must be v3.1.",
    };
  }

  if (
    !isObject(input.synthesizedProfile) ||
    input.synthesizedProfile.version !== "v3.1" ||
    input.synthesizedProfile.stage !== "profile_synthesis"
  ) {
    return {
      ok: false,
      error:
        "synthesizedProfile.version must be v3.1 and synthesizedProfile.stage must be profile_synthesis.",
    };
  }

  if (
    !isObject(input.transferabilityMap) ||
    input.transferabilityMap.version !== "v3.1" ||
    input.transferabilityMap.stage !== "transferability_mapping"
  ) {
    return {
      ok: false,
      error:
        "transferabilityMap.version must be v3.1 and transferabilityMap.stage must be transferability_mapping.",
    };
  }

  if (!Array.isArray(input.directionHypotheses)) {
    return {
      ok: false,
      error: "directionHypotheses must be an array.",
    };
  }

  const assessmentId = input.assessmentSnapshot.assessmentId;

  if (input.synthesizedProfile.assessmentId !== assessmentId) {
    return {
      ok: false,
      error:
        "synthesizedProfile.assessmentId must match assessmentSnapshot.assessmentId.",
    };
  }

  if (input.transferabilityMap.assessmentId !== assessmentId) {
    return {
      ok: false,
      error:
        "transferabilityMap.assessmentId must match assessmentSnapshot.assessmentId.",
    };
  }

  const hypothesisMismatch = input.directionHypotheses.some(
    (hypothesis) => isObject(hypothesis) && hasAssessmentIdMismatch(hypothesis, assessmentId)
  );

  if (hypothesisMismatch) {
    return {
      ok: false,
      error:
        "Each directionHypothesis.assessmentId must match assessmentSnapshot.assessmentId when present.",
    };
  }

  if (hasAssessmentIdMismatch(input.financialModel, assessmentId)) {
    return {
      ok: false,
      error:
        "financialModel.assessmentId must match assessmentSnapshot.assessmentId when present.",
    };
  }

  if (hasAssessmentIdMismatch(input.hardConstraints, assessmentId)) {
    return {
      ok: false,
      error:
        "hardConstraints.assessmentId must match assessmentSnapshot.assessmentId when present.",
    };
  }

  if (hasAssessmentIdMismatch(input.guardrailValidation, assessmentId)) {
    return {
      ok: false,
      error:
        "guardrailValidation.assessmentId must match assessmentSnapshot.assessmentId when present.",
    };
  }

  return {
    ok: true,
    input,
  };
}

function buildPrompt(portfolioComposerInput) {
  const {
    assessmentSnapshot,
    synthesizedProfile,
    transferabilityMap,
    directionHypotheses,
    financialModel,
    hardConstraints,
    guardrailValidation,
    qualityOverDiversityValidation,
  } = portfolioComposerInput;
  const promptSpec = PORTFOLIO_COMPOSER_PROMPT_SPEC_V31;
  const cleanAssessmentSnapshot = { ...assessmentSnapshot };
  delete cleanAssessmentSnapshot.rawAssessment;
  delete cleanAssessmentSnapshot.legacyPriorityWeights;

  // Strip raw CV competency signals — same as transferability and hypothesis stages.
  // Already distilled into synthesizedProfile and transferabilityMap.transferableAssets.
  if (cleanAssessmentSnapshot.cvProfile) {
    const { competencySignals: _cv, ...restCvProfile } =
      cleanAssessmentSnapshot.cvProfile;
    cleanAssessmentSnapshot.cvProfile = restCvProfile;
  }

  // Strip synthesizedProfile.competencySignals for the prompt only.
  // Already expressed as named, evidenced assets in transferabilityMap.transferableAssets
  // and reflected in directionHypotheses. Removing saves ~1,348 input tokens.
  const cleanSynthesizedProfile = { ...synthesizedProfile };
  delete cleanSynthesizedProfile.competencySignals;

  // Strip possibleDirectionArenas from transferabilityMap — already encoded in
  // directionHypotheses.directionArena by stage 4. Cap all list fields at 3.
  const cleanTransferabilityMap = Object.fromEntries(
    Object.entries(transferabilityMap)
      .filter(([k]) => k !== "possibleDirectionArenas")
      .map(([k, v]) => [k, Array.isArray(v) ? v.slice(0, 3) : v])
  );

  // Compact directionHypotheses: cap at 3, keep only Alpha-relevant fields,
  // cap list fields at 2 items. sourceTransferableAssets capped at 2.
  const HYPOTHESIS_KEEP = new Set([
    "directionArena", "directionStatement", "recommendationType", "routeType",
    "confidence", "whyThisCouldWork", "mainRisks", "evidence",
    "validationQuestions", "firstProofSteps", "financialSignal",
    "constraintSignal", "sourceTransferableAssets",
  ]);
  const cleanDirectionHypotheses = (Array.isArray(directionHypotheses) ? directionHypotheses : [])
    .slice(0, 3)
    .map((h) => {
      const out = {};
      for (const [k, v] of Object.entries(h)) {
        if (!HYPOTHESIS_KEEP.has(k)) continue;
        out[k] = Array.isArray(v) ? v.slice(0, 2) : v;
      }
      return out;
    });

  return `You are executing Ortheon MVP Cut v3.1 AI Call 4: Portfolio Composer.

SYSTEM ROLE:
${promptSpec.systemRole}

PURPOSE:
${promptSpec.purpose}

CORE INSTRUCTIONS:
${promptSpec.coreInstructions.map((item) => `- ${item}`).join("\n")}

PROHIBITED BEHAVIOR:
${promptSpec.prohibitedBehavior.map((item) => `- ${item}`).join("\n")}

EVIDENCE DISCIPLINE:
${promptSpec.evidenceDiscipline.map((item) => `- ${item}`).join("\n")}

GUARDRAIL RULES:
${promptSpec.guardrailRules.map((item) => `- ${item}`).join("\n")}

PORTFOLIO COMPOSITION RULES:
${promptSpec.portfolioCompositionRules.map((item) => `- ${item}`).join("\n")}

DIRECTION CONSOLIDATION RULES:
${promptSpec.directionConsolidationRules.map((item) => `- ${item}`).join("\n")}

PRIORITIZATION RULES:
${promptSpec.prioritizationRules.map((item) => `- ${item}`).join("\n")}

ENTERPRISE HR HANDLING:
${promptSpec.enterpriseHrHandling.map((item) => `- ${item}`).join("\n")}

AI DURABILITY SCALE:
${Object.entries(promptSpec.aiDurabilityScale).map(([k, v]) => `- ${k}: ${v.label} — ${v.description}`).join("\n")}

OUTPUT REQUIREMENTS:
${JSON.stringify(promptSpec.outputRequirements, null, 2)}

OUTPUT FORMAT:
- Return ONLY valid JSON.
- No prose.
- No markdown.
- No code fences.
- Must match FinalDirectionPortfolioV31.
- Do not use rank.
- Do not use numeric fit scores or percentages.

COMPACT ALPHA OUTPUT DISCIPLINE:
- Return compact JSON only.
- Keep up to 3 final directions.
- Do not force only 2 directions.
- Use 3 directions when the third is clearly distinct, useful, and not repetitive.
- If the third direction is weak or repetitive, return 2 directions.
- Each direction should be useful but short.
- Maximum 2 targetRoleExamples per direction.
- Maximum 2 evidence items per direction.
- Maximum 2 whyItFits items per direction.
- Maximum 2 whyItIsCredible items per direction.
- Maximum 2 whatMakesItRisky items per direction.
- Maximum 1 notRecommendedIf item per direction.
- Maximum 1 constraintsAndWarnings item per direction.
- Maximum 1 firstValidationStep per direction.
- Maximum 2 sentences per narrative field.
- Maximum 10 words per evidence string.
- Maximum 1 rejectedDirection.
- Maximum 1 qualityNotes item.
- Maximum 2 missingInputsAffectingConfidence items.
- Do not write long paragraphs.
- Do not repeat the same evidence across directions.
- If unsure, omit extra detail rather than expanding.

FINAL PORTFOLIO RULES:
- The final portfolio must only use directions that trace back to existing DirectionHypothesisV31 objects.
- Do not invent new direction arenas.
- Do not include blocked directions as active primary final directions.
- If canShowAsCredibleNow is false, do not label the direction as credible_now.
- Bridge_required directions must be shown as bridge/longer-path directions.
- Use displayOrder only as presentation order. It is not a score, fit metric, or ranking.
- Maximum 3 primary/final directions.
- Maximum 2 adjacent/secondary directions if the contract supports them.
- Prefer fewer credible directions over many weak ones.
- Keep JSON compact and concise.
- Do not include long narrative paragraphs.
- Evidence strings should be short.
- Avoid repeating the same evidence.

EXPECTED OUTPUT SHAPE:
${JSON.stringify(promptSpec.outputShape, null, 2)}

QUALITY CHECKLIST:
${promptSpec.qualityChecklist.map((item) => `- ${item}`).join("\n")}

ASSESSMENT SNAPSHOT:
${JSON.stringify(cleanAssessmentSnapshot, null, 2)}

SYNTHESIZED PROFILE:
${JSON.stringify(cleanSynthesizedProfile, null, 2)}

TRANSFERABILITY MAP:
${JSON.stringify(cleanTransferabilityMap, null, 2)}

DIRECTION HYPOTHESES:
${JSON.stringify(cleanDirectionHypotheses, null, 2)}

FINANCIAL MODEL:
${JSON.stringify(financialModel, null, 2)}

HARD CONSTRAINTS:
${JSON.stringify(hardConstraints, null, 2)}

GUARDRAIL VALIDATION:
${JSON.stringify(guardrailValidation, null, 2)}

QUALITY OVER DIVERSITY VALIDATION:
${JSON.stringify(qualityOverDiversityValidation, null, 2)}
`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const inputValidation = validateInput(req.body || {});

  if (!inputValidation.ok) {
    return res.status(400).json({ error: inputValidation.error });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: "ANTHROPIC_API_KEY is not configured on the server.",
    });
  }

  const portfolioComposerInput = inputValidation.input;
  const assessmentId =
    portfolioComposerInput.assessmentSnapshot?.assessmentId || "";

  const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-5-20250929";
  const prompt = buildPrompt(portfolioComposerInput);

  const promptChars = prompt.length;
  const approxPromptTokens = Math.round(promptChars / 4);
  console.log("[portfolio-composer-v31]", JSON.stringify({
    stage: "portfolio-composer-v31",
    promptChars,
    approxPromptTokens,
    maxTokens: 2500,
  }));

  try {
    const result = await callAnthropicWithRetry(
      process.env.ANTHROPIC_API_KEY,
      model,
      prompt
    );

    if (!result.ok) {
      if (result.overloaded) {
        return res.status(503).json({
          error:
            "AI portfolio composition service is temporarily busy. Please try again in a minute.",
          details: "Overloaded",
        });
      }

      console.error(
        "[portfolio-composer-v31] Claude API error:",
        sanitizeErrorText(result.body)
      );

      return res.status(500).json({
        error: "Claude API call failed.",
        details: result.body?.error?.message || "Unknown Claude API error.",
      });
    }

    const data = result.data;

    const usage = data?.usage || {};
    const inputTokens = Number(usage.input_tokens) || 0;
    const outputTokens = Number(usage.output_tokens) || 0;

    const inputCostPerMTok = Number(process.env.CLAUDE_INPUT_COST_PER_MTOK || 3);
    const outputCostPerMTok = Number(
      process.env.CLAUDE_OUTPUT_COST_PER_MTOK || 15
    );

    const estimatedCostUsd =
      (inputTokens / 1_000_000) * inputCostPerMTok +
      (outputTokens / 1_000_000) * outputCostPerMTok;

    const apiUsage = {
      provider: "anthropic",
      model,
      inputTokens,
      outputTokens,
      inputCostPerMTok,
      outputCostPerMTok,
      estimatedCostUsd: Number(estimatedCostUsd.toFixed(6)),
      calculatedAt: new Date().toISOString(),
    };

    console.log("[portfolio-composer-v31] usage:", apiUsage);

    const rawText = data?.content?.[0]?.text;

    if (!rawText || typeof rawText !== "string") {
      return res.status(500).json({
        error: "Claude returned an empty response.",
      });
    }

    const cleanText = cleanClaudeJsonText(rawText);

    const normalizedResult = normalizeFinalPortfolioOutputV31(cleanText, {
      fallbackAssessmentId: assessmentId,
    });

    if (normalizedResult.errors.length > 0) {
      console.error(
        "[portfolio-composer-v31] output normalization error:",
        normalizedResult.errors[0]?.message || normalizedResult.errors[0]?.type
      );

      return res.status(500).json({
        error: "Portfolio composition returned invalid JSON.",
        details: normalizedResult.errors,
      });
    }

    if (!normalizedResult.validation.passed) {
      console.error("[portfolio-composer-v31] validation failed:", {
        issueCount: normalizedResult.validation.issueCount,
        issues: normalizedResult.validation.issues,
      });

      return res.status(500).json({
        error: "Portfolio composition returned incomplete data.",
        validation: normalizedResult.validation,
      });
    }

    return res.status(200).json({
      finalPortfolio: normalizedResult.finalPortfolio,
      validation: normalizedResult.validation,
      apiUsage,
      rawOutputMetadata: {
        parsedFromString: normalizedResult.parsedFromString,
        rawTextLength: rawText.length,
        cleanTextLength: cleanText.length,
      },
    });
  } catch (error) {
    console.error("[portfolio-composer-v31] unexpected error:", error.message);

    return res.status(500).json({
      error: "Portfolio composition failed. Please try again.",
      details: error.message,
    });
  }
}
