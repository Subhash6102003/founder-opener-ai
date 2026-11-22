/**
 * Service to call Google Gemini API to generate a 3-line cold email opener.
 */

const SYSTEM_INSTRUCTION = `You are an elite B2B founder outreach strategist.
You write hyper-targeted, 3-line cold email openers to founders/CEOs of software companies making $10K–$50K/month MRR.

CONTEXT:
Our product is an AI management system for small software companies ($10K–$50K/mo MRR) that tracks the numbers that run the business and has AI agents act on them (like an executive team for a company too small to hire one).

STRICT RULES:
1. Output EXACTLY 3 lines of prose. No subject line. No bullet points. No sign-off ("Best,", "Cheers,"). No markdown bolding on whole lines.
2. Line 1: An ultra-specific observation of what their software does or solves, derived strictly from their actual website content (proves you actually looked at their product, without generic praise like "Loved your product").
3. Line 2: A sharp, stage-specific pain point for a $10K–$50K MRR software company (e.g. founder stuck manually watching churn/conversion anomalies instead of shipping code, or metrics living in dashboards without anyone acting on them).
4. Line 3: A low-friction, provocative tie-in question asking if they run into this bottleneck.
5. Tone: Builder-to-builder, direct, punchy, zero corporate fluff, zero sycophancy.`;

async function generateOpenerWithGemini({ scrapedData, apiKey }) {
  const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

  if (!effectiveApiKey) {
    // Deterministic mock generation when API key is not yet provided
    const brand = scrapedData.domain.split('.')[0];
    const capitalizedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);
    const valuePoint = scrapedData.h1s[0] || scrapedData.description || 'streamlining software workflows';
    
    return {
      opener: [
        `Saw how ${capitalizedBrand} is focusing on ${valuePoint.toLowerCase().replace(/\.$/, '')}.`,
        `At the $15K–$40K MRR stage, the real tax isn't tracking Stripe and customer metrics—it's having zero bandwidth to act on churn anomalies while writing code.`,
        `Are you currently having to manually triage between shipping product and operational fires?`
      ].join('\n\n'),
      isMock: true,
      message: 'Generated using deterministic template. Provide GEMINI_API_KEY in .env or via the API key input to run live Gemini models.'
    };
  }

  const prompt = `Target Company Website Analysis:
- Domain: ${scrapedData.domain}
- Page Title: ${scrapedData.title}
- Meta Description: ${scrapedData.description}
- Hero Headlines: ${scrapedData.h1s.join(' | ')}
- Subheadings: ${scrapedData.h2s.join(' | ')}
- Core Value Propositions & Copy:
${scrapedData.heroSummary}

Write the 3-line opener now following the strict rules. Return ONLY the 3 lines, separated by single blank lines.`;

  // Use Gemini 2.5 Flash / 1.5 Flash via Generative Language API
  const model = 'gemini-1.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveApiKey}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${SYSTEM_INSTRUCTION}\n\n${prompt}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 256,
      topP: 0.95
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!rawText) {
    throw new Error('Gemini returned an empty response.');
  }

  // Ensure lines are cleanly formatted into 3 distinct lines
  const lines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    opener: lines.join('\n\n'),
    isMock: false,
    modelUsed: model,
    linesCount: lines.length
  };
}

module.exports = {
  generateOpenerWithGemini,
};
