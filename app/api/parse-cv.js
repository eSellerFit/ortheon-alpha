const ALLOWED_SIGNAL_STRENGTHS = ["strong", "moderate", "weak", "absent"];
const ALLOWED_SENIORITY = ["junior", "mid", "senior", "executive"];
const ALLOWED_TENURE_PATTERNS = [
  "stable",
  "progressive",
  "frequent_moves",
  "career_gap",
  "portfolio",
];
const ALLOWED_LEADERSHIP_SCOPE = [
  "none",
  "team",
  "department",
  "organization",
  "cross_organization",
];
const ALLOWED_CONFIDENCE = ["high", "medium", "low"];

function normalizeSignal(signal) {
  const normalized = { ...signal };

  if (!ALLOWED_SIGNAL_STRENGTHS.includes(normalized.signalStrength)) {
    normalized.signalStrength = "absent";
  }

  if (
    normalized.signalStrength === "weak" ||
    normalized.signalStrength === "absent"
  ) {
    delete normalized.evidence;
  }

  if (
    (normalized.signalStrength === "strong" ||
      normalized.signalStrength === "moderate") &&
    (!normalized.evidence || typeof normalized.evidence !== "string")
  ) {
    normalized.signalStrength = "weak";
    delete normalized.evidence;
  }

  return normalized;
}

function normalizeParsedResponse(parsed) {
  const normalized = { ...parsed };

  normalized.competencySignals = parsed.competencySignals.map(normalizeSignal);

  if (!ALLOWED_SENIORITY.includes(normalized.senioritySignal)) {
    normalized.senioritySignal = "unknown";
  }

  if (!ALLOWED_TENURE_PATTERNS.includes(normalized.tenurePattern)) {
    normalized.tenurePattern = "stable";
  }

  if (!ALLOWED_LEADERSHIP_SCOPE.includes(normalized.leadershipScope)) {
    normalized.leadershipScope = "none";
  }

  if (!normalized.confidence || typeof normalized.confidence !== "object") {
    normalized.confidence = {
      overall: "low",
      competencies: "low",
    };
  }

  if (!ALLOWED_CONFIDENCE.includes(normalized.confidence.overall)) {
    normalized.confidence.overall = "low";
  }

  if (!ALLOWED_CONFIDENCE.includes(normalized.confidence.competencies)) {
    normalized.confidence.competencies = "low";
  }

  return normalized;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cvText } = req.body || {};

  if (!cvText || typeof cvText !== "string") {
    return res.status(400).json({ error: "CV text is required." });
  }

  const cleanedCvText = cvText.trim();

  if (cleanedCvText.length < 100) {
    return res.status(400).json({
      error:
        "CV text is too short. Please upload a more complete CV or paste more text.",
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: "ANTHROPIC_API_KEY is not configured on the server.",
    });
  }

  const trimmedText = cleanedCvText.slice(0, 12000);

  const prompt = `You are a career assessment data extraction assistant for Ortheon, a career direction tool.

Your task: extract structured career data from the CV text provided below.

Claude's role is ONLY extraction and structuring.
Claude never scores fit, never recommends roles, and never gives career advice.

CRITICAL RULES:
- Return ONLY valid JSON. Nothing else.
- No prose, no markdown, no explanation, no preamble, no code blocks.
- Do not invent or infer beyond what is directly evidenced in the CV text.
- Evidence must be actual words or phrases from the CV text.
- Never fabricate evidence.
- If uncertain, default to weak or absent.
- Be conservative. Do not overstate signals.
- A strong CV does NOT mean every competency should be strong.
- Most real CVs should have a mix of strong, moderate, weak, and absent signals.

SIGNAL STRENGTH RULES:

strong:
- Multiple direct examples in the CV.
- Clear repeated pattern across roles or repeated responsibility.
- Evidence must be directly quoted or closely excerpted from the CV text.
- Do NOT assign strong based only on title, seniority, or general career level.

moderate:
- One clear direct example OR repeated indirect but credible evidence.
- Evidence must be directly quoted or closely excerpted from the CV text.

weak:
- Implied signal only.
- Suggested by role title, industry, seniority, or adjacent responsibility, but not directly demonstrated.
- No evidence field should be included.

absent:
- No meaningful signal found.
- No evidence field should be included.

IMPORTANT EVIDENCE RULE:
- Evidence is ONLY allowed for strong and moderate.
- Evidence must be a phrase that appears in the CV text.
- Evidence must be max 20 words.
- For weak and absent, omit the evidence field entirely.

TRADE / CRAFT COMPETENCY RULES:
Competencies 16, 17, 18, and 19 are trade/craft/technical-system competencies.
Be especially conservative with these.

For competencies 16-19, assign strong or moderate ONLY if the CV clearly shows one of:
- skilled trade work
- physical craft mastery
- hands-on technical system work
- engineering, repair, installation, maintenance, diagnostics
- manufacturing or construction
- working from technical specifications, blueprints, schematics, or physical systems

Do NOT assign strong or moderate to competencies 16-19 merely because the person built:
- business models
- analytics models
- workforce models
- dashboards
- strategies
- operating frameworks
- HR systems
- recruiting systems
- planning processes

For knowledge work, consulting, HR, workforce planning, or business operations CVs, competencies 16-19 are usually weak or absent unless direct technical/craft evidence exists.

SENIORITY RULES:

junior:
- 0-3 years total experience
- no management responsibility
- entry or associate level titles

mid:
- 3-8 years total experience
- may have project or small team leadership
- manager, specialist, or senior individual contributor titles

senior:
- 8-15 years total experience
- clear leadership, ownership, or domain authority
- senior manager, director, principal, lead titles

executive:
- 15+ years of experience OR C-suite / VP / Partner / Founder / Owner titles
- organizational scope or strategic responsibility
- board, partner, founder, CEO, owner, or equivalent evidence

If the CV shows 15+ years plus founder/CEO/director/organization-level leadership, classify as executive unless the evidence clearly points lower.

DOMAIN SIGNAL RULES:
- Return no more than 5 domains.
- Use only domains clearly evidenced in the CV.
- Prefer specific domains over generic ones.
- Do not include a domain only because it appears once without meaningful context.

CONFIDENCE RULES:
high:
- CV is detailed and structured.
- Many signals have direct evidence.
- The extraction is reliable.

medium:
- CV has useful detail but some gaps.
- Some signals rely on indirect evidence.

low:
- CV is sparse, short, poorly structured, or ambiguous.
- Most signals are weak or absent.

EXTRACT THE FOLLOWING:

1. competencySignals
For each of the 23 competencies below, provide:
- competencyId (1-23)
- competencyName (exact name as listed)
- signalStrength: strong, moderate, weak, or absent
- evidence: only for strong and moderate (max 20 words from CV text)

Competencies:
1. Understanding and managing competing interests
2. Being Resilient - bouncing back and adapting under pressure
3. Generating new ideas and turning them into reality
4. Seeing the bigger picture and positioning for long-term advantage
5. Picking up new skills and knowledge quickly under real conditions
6. Delivering outcomes fast with whatever is available
7. Making sure commitments are kept by self and others
8. Finding better, faster, smarter ways to get work done
9. Understanding how money flows and decisions affect financial outcomes
10. Aligning people through clear direction and meaningful purpose
11. Inspiring and persuading people to grow and take action
12. Navigating complexity to get things done within any structure
13. Adjusting approach to fit what each moment actually needs
14. Building and maintaining relationships that create future opportunities
15. Selling ideas, services or products without institutional backing
16. Mastering a specific craft, tool or physical system to a high standard
17. Maintaining precision, quality and safety standards consistently
18. Diagnosing and fixing problems in physical or technical systems
19. Reading and working from technical specifications or blueprints
20. Working effectively with AI tools to amplify personal output
21. Thinking critically about information, data and AI-generated content
22. Creating original content, ideas or solutions that AI cannot replicate
23. Orchestrating AI, automation and human workflows to deliver outcomes at scale

2. careerSummary
2-3 sentence plain language summary of this person's career background.
Write for a career advisor reading this for the first time.
Do not mention the person's name.
Do not copy sentences from the CV.
Write in your own words based on the CV content.

3. domainSignals
Array of up to 5 domain strings from this list:
technology, software_engineering, data_science, finance, banking, investment,
marketing, sales, healthcare, pharma, education, consulting, operations,
human_resources, legal, real_estate, manufacturing, retail, media,
non_profit, government, startup, entrepreneurship, trades, construction
Only include domains clearly evidenced in the CV.

4. senioritySignal
One of: junior, mid, senior, executive

5. entrepreneurialSignals
true or false

6. tradeSignals
true or false

7. tenurePattern
One of: stable, progressive, frequent_moves, career_gap, portfolio

8. leadershipScope
One of: none, team, department, organization, cross_organization

9. confidence
Object with:
- overall: high, medium, or low
- competencies: high, medium, or low

RETURN THIS EXACT JSON STRUCTURE:
{
  "competencySignals": [
    {
      "competencyId": 1,
      "competencyName": "Understanding and managing competing interests",
      "signalStrength": "strong",
      "evidence": "actual phrase from CV"
    },
    {
      "competencyId": 2,
      "competencyName": "Being Resilient - bouncing back and adapting under pressure",
      "signalStrength": "absent"
    }
  ],
  "careerSummary": "string",
  "domainSignals": ["string"],
  "senioritySignal": "senior",
  "entrepreneurialSignals": false,
  "tradeSignals": false,
  "tenurePattern": "progressive",
  "leadershipScope": "department",
  "confidence": {
    "overall": "high",
    "competencies": "medium"
  }
}

CV TEXT:
${trimmedText}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || "claude-sonnet-4-5-20250929",
        max_tokens: 3000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Claude API error:", errorData);

      return res.status(500).json({
        error: "Claude API call failed.",
        details: errorData?.error?.message || "Unknown Claude API error.",
      });
    }

    const data = await response.json();

    const usage = data?.usage || {};
    const inputTokens = Number(usage.input_tokens) || 0;
    const outputTokens = Number(usage.output_tokens) || 0;

    const inputCostPerMTok = Number(process.env.CLAUDE_INPUT_COST_PER_MTOK || 3);
    const outputCostPerMTok = Number(process.env.CLAUDE_OUTPUT_COST_PER_MTOK || 15);

    const estimatedCostUsd =
      (inputTokens / 1_000_000) * inputCostPerMTok +
      (outputTokens / 1_000_000) * outputCostPerMTok;

    const apiUsage = {
      provider: "anthropic",
      model: process.env.CLAUDE_MODEL || "claude-sonnet-4-5-20250929",
      inputTokens,
      outputTokens,
      inputCostPerMTok,
      outputCostPerMTok,
      estimatedCostUsd: Number(estimatedCostUsd.toFixed(6)),
      calculatedAt: new Date().toISOString(),
    };

    console.log("Claude CV parse usage:", apiUsage);

    const rawText = data?.content?.[0]?.text;

    if (!rawText || typeof rawText !== "string") {
      return res.status(500).json({
        error: "Claude returned an empty response.",
      });
    }

    const cleanText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw Claude response:", rawText);

      return res.status(500).json({
        error: "CV parsing returned invalid JSON. Please try again.",
      });
    }

    if (!parsed.competencySignals || !Array.isArray(parsed.competencySignals)) {
      return res.status(500).json({
        error: "CV parsing returned incomplete data. Please try again.",
      });
    }

    if (parsed.competencySignals.length !== 23) {
      return res.status(500).json({
        error:
          "CV parsing returned the wrong number of competency signals. Please try again.",
      });
    }

    const normalizedParsed = normalizeParsedResponse(parsed);

    return res.status(200).json({
      ...normalizedParsed,
      apiUsage,
    });
  } catch (error) {
    console.error("CV parse function error:", error);

    return res.status(500).json({
      error: "CV parsing failed. Please try again.",
      details: error.message,
    });
  }
}
