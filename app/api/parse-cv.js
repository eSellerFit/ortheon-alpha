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
      error: "CV text is too short. Please upload a more complete CV or paste more text.",
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

CRITICAL RULES:
- Return ONLY valid JSON. Nothing else.
- No prose, no markdown, no explanation, no preamble, no code blocks.
- Do not invent or infer beyond what is directly evidenced in the CV text.
- Evidence must be actual words or phrases from the CV text.
- Never fabricate evidence.
- If uncertain, default to weak or absent.

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
        error: "CV parsing returned the wrong number of competency signals. Please try again.",
      });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("CV parse function error:", error);

    return res.status(500).json({
      error: "CV parsing failed. Please try again.",
      details: error.message,
    });
  }
}
