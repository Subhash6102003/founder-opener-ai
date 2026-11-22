const answers = {
  howToRun: `Clone repo, run npm install, then npm run build and npm start. App runs at http://localhost:3001. Add GEMINI_API_KEY to .env or paste it in the UI drawer for live Gemini generation; if omitted, an instant deterministic mock pipeline runs automatically.`,

  codeModelCostBreaks: `Code handles URL normalization, HTTP fetching, HTML cleanup (stripping scripts/navs/cookies), and Cheerio parsing of titles, meta tags, and hero copy bounded to 1,200 characters.

The model (Gemini 1.5 Flash) handles semantic reasoning: mapping scraped positioning to operational bottlenecks for a $10K–$50K MRR founder and synthesizing a strict 3-line opener.

Cost: Gemini 1.5 Flash costs $0.075/1M input and $0.30/1M output tokens. At ~450 tokens/run, 1,000 runs consume ~450K tokens, costing ~$0.05/day ($1.50/month)—effectively free.

What breaks at 1,000 runs/day:
1. Scraper IP bans: Cloudflare/Datadome blocks bare server IPs; requires rotating residential proxies.
2. Client-side SPAs: Cheerio misses JavaScript-rendered React/Vue sites; needs a headless browser worker (Playwright).
3. Free-tier rate limits: Gemini caps at 15 RPM; handling 1,000 runs requires an asynchronous queue (BullMQ/Redis) with exponential retry backoff.`,

  sell: `Where to find them:
1. Acquire.com & MicroAcquire listings with public metrics ($10K–$50K ARR/MRR).
2. Open Startup directories (TrustMRR, Indie Hackers, built-in Stripe verified badges).
3. Founder communities: Bootstrapped.fm, Twitter/X "buildinpublic", and YC Startup School directory filtering for solo/duo founders.

What I would say (direct Loom + audit):
"Hey [Name], saw [Product] crossed ~$25K MRR. At this stage, your biggest operational tax is context-switching between shipping features and manually triaging churn, payment failures, and signup drops across Stripe and PostHog.

Built an AI management system that ingests your Stripe + PostHog events daily, flags metric drift, and automatically drafts the exact triage actions for you to approve in Slack.

Recorded a 90-second Loom showing what your morning briefing looks like on your actual numbers: [Link].

Can I set this up on a staging read-only key for you this Thursday?"`,

  raise: `What a seed investor must believe:
1. Autonomous execution beats passive dashboards: Small founders don't want another Datadog or chart; they want an executive agent that diagnoses metric anomalies and takes operational action autonomously.
2. Massive underserved TAM: The millions of $10K–$50K/mo software businesses run by 1–3 people are too small for a COO/VP Finance ($180K+), but will gladly pay $200–$500/mo for an autonomous management layer.
3. Defensible agentic workflows: Integrations and proprietary action loops (connecting Stripe, PostHog, GitHub, and email into verified actions) create high switching costs and data moats.

Strongest reason they'd say no:
Distribution & Churn Risk in Micro-SaaS: Seed investors fear SMB churn (3–5% monthly) will outpace acquisition, and that small founders will resist trusting autonomous agents with live production data or business decisions without costly human handholding.`,

  part3: `In two years, I want to be an early-stage founding engineer or product builder launching agentic systems from 0 to 1. This internship immerses me directly into autonomous agent architectures, real B2B customer feedback loops, and high-velocity founder execution.

What I am giving up:
A comfortable, structured corporate rotation with predictable hours to take on high-ownership, ambiguous problem-solving where output directly determines survival.

What I left out in Part 1 and why:
1. Headless browser rendering (Playwright/Puppeteer): Left out to keep setup zero-dependency, sub-second fast, and free of heavy Chromium binary footprints.
2. Automated founder email lookup (Hunter/Apollo API): Avoided external paid API requirements and focused entirely on the core positioning intelligence and opener quality.
3. Multi-page recursive crawling: Restricted to hero/meta context to prevent token bloat, ensuring sub-second inference and zero model hallucination.`,

  toolsUsed: `Node.js, Express 5, React 19, Vite, TypeScript, Cheerio, Google Gemini API, Lucide Icons, and Postman.`,

  anythingElse: `Beyond the 3-line opener, I extended the build into a fullstack app with dynamic business telemetry and SVG charts—modeling year-end MRR trajectory, churn mitigation, and founder time-savings calibrated to the scraped company profile.

Since public sites don't expose private Stripe numbers, our engine computes a realistic stage model for this $10K–$50K bracket. It includes an instant fallback mode, running out of the box with zero setup hurdles.`
};

const limits = {
  howToRun: 50,
  codeModelCostBreaks: 150,
  sell: 150,
  raise: 150,
  part3: 150,
  toolsUsed: 40,
  anythingElse: 100
};

console.log('=== WORD COUNT AUDIT ===\n');
for (const [key, text] of Object.entries(answers)) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const count = words.length;
  const limit = limits[key];
  const passed = count <= limit;
  console.log(`${key}: ${count} / ${limit} words -> ${passed ? 'PASSED ✅' : 'FAILED ❌ (' + (count - limit) + ' over)'}`);
}
