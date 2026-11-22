/**
 * Service to call Google Gemini API to generate a 3-line cold email opener
 * and business performance projections for $10K–$50K software companies.
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

/**
 * Computes deterministic business telemetry and year-end productivity estimations
 * tailored for software companies in the $10K-$50K MRR bracket.
 */
function computeBusinessTelemetry(scrapedData) {
  // Hash domain string to produce consistent, repeatable metrics for the same target
  let hash = 0;
  for (let i = 0; i < scrapedData.domain.length; i++) {
    hash = (hash << 5) - hash + scrapedData.domain.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // Baseline MRR between $18.5k and $34.5k
  const baseMRR = 18.5 + (positiveHash % 160) / 10;
  const growthRateBaseline = 0.025; // 2.5% monthly organic growth
  const growthRateAutonomous = 0.078; // 7.8% monthly with autonomous churn & conversion intervention

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'EOY'];
  const monthlyProjection = months.map((m, index) => {
    const baseline = +(baseMRR * Math.pow(1 + growthRateBaseline, index)).toFixed(1);
    const autonomous = +(baseMRR * Math.pow(1 + growthRateAutonomous, index)).toFixed(1);
    return {
      month: m,
      baseline,
      autonomous,
      delta: +(autonomous - baseline).toFixed(1),
    };
  });

  const currentMRRFormatted = `$${Math.round(baseMRR * 1000).toLocaleString()}`;
  const yearEndAutonomousMRR = monthlyProjection[monthlyProjection.length - 1].autonomous;
  const yearEndFormatted = `$${Math.round(yearEndAutonomousMRR * 1000).toLocaleString()}`;
  const liftPercentage = `+${Math.round(((yearEndAutonomousMRR - baseMRR) / baseMRR) * 100)}%`;

  return {
    currentMRR: currentMRRFormatted,
    projectedYearEndMRR: yearEndFormatted,
    projectedLift: liftPercentage,
    founderHoursSavedPerMonth: `${78 + (positiveHash % 18)} hrs/mo`,
    churnMitigationRate: `${32 + (positiveHash % 14)}% Churn Prevented`,
    
    // Time distribution (Pie / Donut chart)
    timeAllocation: [
      { category: 'Product & Code', beforePct: 38, afterPct: 76, color: '#688a65' },
      { category: 'Metric & Stripe Triage', beforePct: 36, afterPct: 8, color: '#f87171' },
      { category: 'Customer Churn Fires', beforePct: 26, afterPct: 16, color: '#eab308' },
    ],

    // Monthly Growth trajectory (Bar / Area Chart)
    monthlyProjection,

    // Simulated automated management actions triggered
    activeAgentAutomations: [
      {
        agent: 'Billing & Involuntary Churn Agent',
        status: 'Active',
        action: 'Stripe smart dunning & auto-retrying failed webhooks before customer cancellation.',
        impact: '+$1,420 MRR saved'
      },
      {
        agent: 'Activation Telemetry Agent',
        status: 'Active',
        action: 'Detects post-signup drop-offs within 48h and triggers personalized in-app nudge.',
        impact: '+18.4% trial conversion'
      },
      {
        agent: 'Executive Briefing Agent',
        status: 'Active',
        action: 'Daily 8:00 AM Slack digest consolidating Stripe, PostHog, and Sentry with one-click actions.',
        impact: '2.5 hrs saved daily'
      }
    ]
  };
}

async function generateOpenerWithGemini({ scrapedData, apiKey }) {
  const telemetry = computeBusinessTelemetry(scrapedData);
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
      telemetry,
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

  const lines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    opener: lines.join('\n\n'),
    telemetry,
    isMock: false,
    modelUsed: model,
    linesCount: lines.length
  };
}

module.exports = {
  generateOpenerWithGemini,
  computeBusinessTelemetry,
};
