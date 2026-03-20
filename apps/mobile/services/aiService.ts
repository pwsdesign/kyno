import type { Provider } from '../constants/services';

// Smart rule-based provider match scoring against Mango's profile (68 lb Golden Retriever).
export function computeMatchScore(provider: Provider): number {
  const tags = provider.tags.map(t => t.toLowerCase());
  let score = 74;

  if (tags.some(t => t.includes('large breed'))) score += 12;
  if (tags.some(t => t.includes('high energy') || t.includes('active breed'))) score += 8;
  if (tags.some(t => t.includes('gps') || t.includes('live route'))) score += 4;
  if (tags.some(t => t.includes('insured'))) score += 4;
  if (tags.some(t => t.includes('cpr'))) score += 3;
  if (tags.some(t => t.includes('photo') || t.includes('webcam'))) score += 2;
  if (tags.some(t => t.includes('small breed'))) score -= 10;

  return Math.min(99, Math.max(68, score));
}

const DEFAULT_INSIGHTS = [
  'Schedule a joint mobility check — Goldens are prone to hip dysplasia by age 4.',
  'At 68 lb, aim for 90+ min of daily activity. Swim sessions are easier on joints.',
  'Lyme vaccine not on record — Miami\'s green spaces carry year-round tick risk.',
];

export async function fetchCareInsights(): Promise<string[]> {
  // In production, this calls the Claude API.
  // For the prototype, return smart breed-aware defaults.
  await new Promise(r => setTimeout(r, 900));
  return DEFAULT_INSIGHTS;
}
