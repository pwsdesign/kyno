// ── AI SERVICE ──────────────────────────────────────────────────────────────
// Provides two AI capabilities:
//   1. computeMatchScore(provider)  — instant, rule-based provider-to-dog fit score
//   2. fetchCareInsights()          — real Claude API call (falls back to smart defaults)
//
// To enable live AI insights, set VITE_ANTHROPIC_API_KEY in a .env.local file.

const MANGO = {
  name: 'Mango',
  breed: 'Golden Retriever',
  dob: 'May 14, 2022',
  weightLbs: 68,
  personality: 'Friendly, playful, social, food-motivated',
  vaccines: ['Rabies', 'DHPP', 'Bordetella', 'Leptospirosis'],
  food: "The Farmer's Dog — Turkey Recipe",
};

// ── Match Scoring ────────────────────────────────────────────────────────────
// Scores a provider against Mango's profile (68 lb, playful Golden Retriever).
// Returns an integer 68–99.
export function computeMatchScore(provider) {
  const tags = (provider.tags || []).map(t => t.toLowerCase());

  let score = 74;

  // Large-breed match
  if (tags.some(t => t.includes('large breed'))) score += 12;
  // High-energy / active breed match
  if (tags.some(t => t.includes('high energy') || t.includes('active breed'))) score += 8;
  // Safety and tracking bonuses
  if (tags.some(t => t.includes('gps') || t.includes('live route'))) score += 4;
  if (tags.some(t => t.includes('insured'))) score += 4;
  if (tags.some(t => t.includes('cpr'))) score += 3;
  if (tags.some(t => t.includes('photo') || t.includes('webcam'))) score += 2;
  // Small-breed mismatch penalty
  if (tags.some(t => t.includes('small breed'))) score -= 10;

  return Math.min(99, Math.max(68, score));
}

// ── Care Insights ────────────────────────────────────────────────────────────
// Smart, breed-aware defaults — shown instantly when no API key is present.
const DEFAULT_INSIGHTS = [
  'Schedule a joint mobility check — Goldens are prone to hip dysplasia by age 4.',
  'At 68 lb, aim for 90+ min of daily activity. Swim sessions are easier on joints than pavement.',
  'Lyme vaccine not on record — Miami\'s green spaces carry year-round tick risk.',
];

// Returns 3 personalized care tips for Mango.
// If VITE_ANTHROPIC_API_KEY is set, calls Claude Haiku for real-time insights.
export async function fetchCareInsights() {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    await new Promise(r => setTimeout(r, 900)); // simulate latency for realism
    return DEFAULT_INSIGHTS;
  }

  const ageMs = Date.now() - new Date(MANGO.dob).getTime();
  const ageYr = Math.floor(ageMs / (365.25 * 86400000));
  const ageMo = Math.floor((ageMs % (365.25 * 86400000)) / (30.44 * 86400000));

  const prompt =
    `You are Kyno's AI care advisor. Return ONLY a JSON array of exactly 3 strings — ` +
    `no explanation, no markdown. Each is a short (≤18 words), actionable, breed-specific tip.\n` +
    `Dog: ${MANGO.name}, ${MANGO.breed}, ${ageYr}yr ${ageMo}mo, ${MANGO.weightLbs} lb, ` +
    `${MANGO.personality}. Vaccines: ${MANGO.vaccines.join(', ')}. Location: Miami, FL.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length >= 1) return parsed.slice(0, 3);
  } catch {
    // fall through to defaults
  }

  return DEFAULT_INSIGHTS;
}
