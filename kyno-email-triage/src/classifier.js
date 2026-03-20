// ─── AI Email Classifier ──────────────────────────────────────
// Uses Claude to classify inbound emails by intent and extract
// key data (sender name, urgency, summary).

/**
 * Classify an email using Claude API
 *
 * @param {object} email       - Parsed email { from, to, subject, body }
 * @param {object} domainConfig - Domain config from config.js
 * @param {string} apiKey      - Anthropic API key
 * @returns {object} Classification result
 */
export async function classifyEmail(email, domainConfig, apiKey) {
  const categoryList = Object.entries(domainConfig.categories)
    .map(([id, cat]) => `- "${id}": ${cat.description || cat.label}`)
    .join("\n");

  const prompt = `You are an email triage agent for ${domainConfig.brand} (${domainConfig.tagline}).

${domainConfig.context}

Classify this inbound email into exactly ONE of these categories:
${categoryList}

Also extract:
- The sender's first name (from the email body signature, or from the "From" name, or "there" if unknown)
- A 1-sentence summary of what they want
- Urgency: "critical" | "high" | "medium" | "low"
- Sentiment: "positive" | "neutral" | "negative" | "urgent"
- Whether this needs a human response beyond the auto-reply: true/false

EMAIL:
From: ${email.from}
To: ${email.to}
Subject: ${email.subject}
Body:
${email.body?.substring(0, 3000) || "(no body)"}

Respond ONLY with valid JSON, no markdown fences:
{
  "category": "<category_id>",
  "firstName": "<extracted first name>",
  "summary": "<1-sentence summary>",
  "urgency": "<critical|high|medium|low>",
  "sentiment": "<positive|neutral|negative|urgent>",
  "needsHumanReply": <true|false>,
  "confidence": <0.0 to 1.0>
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);
      return fallbackClassification(email);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    // Parse the JSON response
    const cleaned = text.replace(/```json\s*|```\s*/g, "").trim();
    const result = JSON.parse(cleaned);

    // Validate the category exists in the domain config
    if (!domainConfig.categories[result.category]) {
      result.category = "general";
    }

    return {
      ...result,
      model: "claude-sonnet-4-20250514",
      classifiedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Classification error:", error);
    return fallbackClassification(email);
  }
}

/**
 * Fallback classification when the AI is unavailable
 */
function fallbackClassification(email) {
  const subject = (email.subject || "").toLowerCase();
  const body = (email.body || "").toLowerCase();
  const text = subject + " " + body;

  // Simple keyword-based fallback
  let category = "general";

  if (
    text.includes("unsubscribe") ||
    text.includes("seo") ||
    text.includes("marketing agency") ||
    text.includes("crypto") ||
    text.includes("viagra")
  ) {
    category = "spam";
  } else if (
    text.includes("emergency") ||
    text.includes("urgent") ||
    text.includes("lost dog") ||
    text.includes("injured")
  ) {
    category = "emergency";
  } else if (
    text.includes("walk") ||
    text.includes("groom") ||
    text.includes("board") ||
    text.includes("booking") ||
    text.includes("appointment")
  ) {
    category = "owner_inquiry";
  } else if (
    text.includes("join") ||
    text.includes("provider") ||
    text.includes("apply") ||
    text.includes("walker")
  ) {
    category = "provider_application";
  } else if (
    text.includes("partner") ||
    text.includes("collaborate") ||
    text.includes("sponsor")
  ) {
    category = "partnership";
  } else if (
    text.includes("press") ||
    text.includes("journalist") ||
    text.includes("interview") ||
    text.includes("media")
  ) {
    category = "press";
  }

  // Extract first name from "From" header
  const fromName = email.fromName || "";
  const firstName = fromName.split(" ")[0] || "there";

  return {
    category,
    firstName,
    summary: "Fallback classification — AI was unavailable",
    urgency: category === "emergency" ? "critical" : "medium",
    sentiment: "neutral",
    needsHumanReply: true,
    confidence: 0.3,
    model: "fallback-keywords",
    classifiedAt: new Date().toISOString(),
  };
}
