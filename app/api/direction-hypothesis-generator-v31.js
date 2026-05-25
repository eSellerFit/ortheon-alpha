/**
 * Ortheon MVP Cut v3.1 — Direction Hypothesis Generator API Route
 *
 * AI Call 3:
 * DirectionHypothesisInputV31 → DirectionHypothesisV31[]
 *
 * Scope:
 * - Isolated API route only.
 * - No UI integration.
 * - No Firestore reads/writes.
 * - No ResultsStep / report integration.
 */

import { DIRECTION_HYPOTHESIS_GENERATOR_PROMPT_SPEC_V31 } from "../src/v31/prompts/directionHypothesisGeneratorPromptSpecV31.js";
import { normalizeDirectionHypothesisOutputV31 } from "../src/v31/normalizers/directionHypothesisOutputNormalizerV31.js";

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
        `[direction-hypothesis-generator-v31] attempt ${attempt}/${MAX_ATTEMPTS} — waiting ${delay}ms before retry`
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
          max_tokens: 5000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      body = await response.json().catch(() => ({}));
    } catch (networkError) {
      console.log(
        `[direction-hypothesis-generator-v31] attempt ${attempt}/${MAX_ATTEMPTS} — network error: ${networkError.message}`
      );

      lastBody = {};
      lastStatus = 0;
      continue;
    }

    lastStatus = response.status;
    lastBody = body;

    if (response.ok) {
      console.log(
        `[direction-hypothesis-generator-v31] attempt ${attempt}/${MAX_ATTEMPTS} — status ${lastStatus} — success`
      );

      return { ok: true, data: body };
    }

    const safeError = sanitizeErrorText(body);

    console.log(
      `[direction-hypothesis-generator-v31] attempt ${attempt}/${MAX_ATTEMPTS} — status ${lastStatus} — ${safeError}`
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

function validateInput(body) {
  const input = body?.directionHypothesisInput || body;

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      ok: false,
      error: "DirectionHypothesisInputV31 object is required.",
    };
  }

  if (input.stage !== "direction_hypothesis_generator_v31") {
    return {
      ok: false,
      error: "Input stage must be direction_hypothesis_generator_v31.",
    };
  }

  if (!input.instructionsVersion || typeof input.instructionsVersion !== "string") {
    return {
      ok: false,
      error: "instructionsVersion is required.",
    };
  }

  if (
    !input.assessmentSnapshot ||
    typeof input.assessmentSnapshot !== "object" ||
    input.assessmentSnapshot.version !== "v3.1"
  ) {
    return {
      ok: false,
      error: "assessmentSnapshot.version must be v3.1.",
    };
  }

  if (
    !input.synthesizedProfile ||
    typeof input.synthesizedProfile !== "object" ||
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
    !input.transferabilityMap ||
    typeof input.transferabilityMap !== "object" ||
    input.transferabilityMap.version !== "v3.1" ||
    input.transferabilityMap.stage !== "transferability_mapping"
  ) {
    return {
      ok: false,
      error:
        "transferabilityMap.version must be v3.1 and transferabilityMap.stage must be transferability_mapping.",
    };
  }

  if (
    input.synthesizedProfile.assessmentId !==
    input.assessmentSnapshot.assessmentId
  ) {
    return {
      ok: false,
      error:
        "synthesizedProfile.assessmentId must match assessmentSnapshot.assessmentId.",
    };
  }

  if (
    input.transferabilityMap.assessmentId !==
    input.assessmentSnapshot.assessmentId
  ) {
    return {
      ok: false,
      error:
        "transferabilityMap.assessmentId must match assessmentSnapshot.assessmentId.",
    };
  }

  return {
    ok: true,
    input,
  };
}

function buildPrompt(directionHypothesisInput) {
  const { assessmentSnapshot, synthesizedProfile, transferabilityMap } =
    directionHypothesisInput;
  const promptSpec = DIRECTION_HYPOTHESIS_GENERATOR_PROMPT_SPEC_V31;
  const cleanAssessmentSnapshot = { ...assessmentSnapshot };
  delete cleanAssessmentSnapshot.rawAssessment;
  delete cleanAssessmentSnapshot.legacyPriorityWeights;

  return `You are executing Ortheon MVP Cut v3.1 AI Call 3: Direction Hypothesis Generator.

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

HYPOTHESIS RULES:
${promptSpec.hypothesisRules.map((item) => `- ${item}`).join("\n")}

SOURCE ASSET RULES:
${promptSpec.sourceAssetRules.map((item) => `- ${item}`).join("\n")}

OUTPUT REQUIREMENTS:
${JSON.stringify(promptSpec.outputRequirements, null, 2)}

OUTPUT FORMAT:
- Return ONLY valid JSON.
- No prose.
- No markdown.
- No code fences.
- JSON object must have top-level field: directionHypotheses.
- Do not create final recommendations.
- Do not rank final directions.
- Do not use numeric fit scores or percentages.
- Return maximum 5 hypotheses.
- Prefer fewer credible hypotheses over many weak ones.
- Keep JSON compact and concise.
- Do not include long narrative paragraphs.
- Evidence strings should be short.
- Do not repeat the same evidence unnecessarily.
- Every hypothesis must include sourceTransferableAssets, and every value in sourceTransferableAssets must exactly match an assetName from transferabilityMap.transferableAssets.

EXPECTED OUTPUT SHAPE:
${JSON.stringify(promptSpec.outputShape, null, 2)}

QUALITY CHECKLIST:
${promptSpec.qualityChecklist.map((item) => `- ${item}`).join("\n")}

ASSESSMENT SNAPSHOT:
${JSON.stringify(cleanAssessmentSnapshot, null, 2)}

SYNTHESIZED PROFILE:
${JSON.stringify(synthesizedProfile, null, 2)}

TRANSFERABILITY MAP:
${JSON.stringify(transferabilityMap, null, 2)}
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

  const directionHypothesisInput = inputValidation.input;
  const assessmentId =
    directionHypothesisInput.assessmentSnapshot?.assessmentId || "";

  const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-5-20250929";
  const prompt = buildPrompt(directionHypothesisInput);

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
            "AI direction hypothesis generation service is temporarily busy. Please try again in a minute.",
          details: "Overloaded",
        });
      }

      console.error(
        "[direction-hypothesis-generator-v31] Claude API error:",
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

    console.log("[direction-hypothesis-generator-v31] usage:", apiUsage);

    const rawText = data?.content?.[0]?.text;

    if (!rawText || typeof rawText !== "string") {
      return res.status(500).json({
        error: "Claude returned an empty response.",
      });
    }

    const cleanText = cleanClaudeJsonText(rawText);

    const normalizedResult = normalizeDirectionHypothesisOutputV31(cleanText, {
      fallbackAssessmentId: assessmentId,
    });

    if (normalizedResult.errors.length > 0) {
      console.error(
        "[direction-hypothesis-generator-v31] output normalization error:",
        normalizedResult.errors[0]?.message || normalizedResult.errors[0]?.type
      );

      return res.status(500).json({
        error: "Direction hypothesis generation returned invalid JSON.",
        details: normalizedResult.errors,
      });
    }

    if (!normalizedResult.validation.passed) {
      console.error("[direction-hypothesis-generator-v31] validation failed:", {
        issueCount: normalizedResult.validation.issueCount,
        issues: normalizedResult.validation.issues,
      });

      return res.status(500).json({
        error: "Direction hypothesis generation returned incomplete data.",
        validation: normalizedResult.validation,
      });
    }

    return res.status(200).json({
      directionHypotheses: normalizedResult.directionHypotheses,
      validation: normalizedResult.validation,
      apiUsage,
      rawOutputMetadata: {
        parsedFromString: normalizedResult.parsedFromString,
        rawTextLength: rawText.length,
        cleanTextLength: cleanText.length,
      },
    });
  } catch (error) {
    console.error(
      "[direction-hypothesis-generator-v31] unexpected error:",
      error.message
    );

    return res.status(500).json({
      error: "Direction hypothesis generation failed. Please try again.",
      details: error.message,
    });
  }
}
