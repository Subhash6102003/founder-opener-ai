# FounderOpener AI

> Autonomous B2B Founder Cold Outreach Engine for small software companies ($10K–$50K/mo MRR).

Takes any software company's website address, deterministically extracts its positioning and value propositions, and crafts a hyper-personalized, 3-line cold email opener targeted at its founder.

---

## Live Demo & Repository
- **GitHub Repository:** [https://github.com/Subhash6102003/founder-opener-ai](https://github.com/Subhash6102003/founder-opener-ai)
- **Local Application:** `http://localhost:3001`

---

## Quick Start (How to Run It)

```bash
# 1. Clone repository
git clone https://github.com/Subhash6102003/founder-opener-ai.git
cd founder-opener-ai

# 2. Install dependencies & build UI
npm install
npm run build

# 3. (Optional) Configure Gemini API Key
cp .env.example .env
# Add GEMINI_API_KEY=your_key in .env or pass it directly in the UI drawer

# 4. Start the application
npm start
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## Technical Analysis: Code vs. Model & 1,000 Runs/Day

| Pipeline Stage | Executed In | Implementation Details |
| :--- | :--- | :--- |
| **URL Validation & Normalization** | Code (Node.js) | Regex validation, protocol enforcement, hostname parsing. |
| **DOM Fetch & HTML Extraction** | Code (Cheerio + Fetch) | Timeout (8s), bot headers, removal of scripts/styles/navs/cookie modals. |
| **Hero & Value Prop Filtering** | Code (JavaScript) | Title, meta descriptions, `h1`/`h2` hero tags, key value sentences bounded to 1,200 chars. |
| **Context Synthesis & Founder Voice** | Model (Gemini 1.5/2.5 Flash) | Calibrated cold outreach prompt mapping company stage to operational friction. |
| **Output Constraint Enforcement** | Code + Model | Strict 3-line split, paragraph formatting, zero corporate fluff. |

### What Breaks at 1,000 Runs/Day & Unit Economics
- **Cost**: Gemini 1.5 Flash costs $0.075 / 1M input and $0.30 / 1M output tokens. At ~450 tokens/run, 1,000 runs consume ~450K tokens, costing **~$0.05/day ($1.50/month)**—well within Gemini's free tier.
- **Failure Points at 1,000 runs/day**:
  1. *Scraper IP Bans*: Cloudflare/Datadome blocks bare server IPs without rotating residential proxy pools.
  2. *Client-Rendered SPAs*: Pure Cheerio misses JavaScript-hydrated React/Vue apps (requires Playwright headless worker).
  3. *Free-Tier RPM Throttle*: Gemini free tier caps at 15 RPM; a burst of 1,000 runs requires an asynchronous queue (BullMQ/Redis) with exponential retry backoff.

---

## Strategic Playbooks (Part 2)

### Sell: How to Get the First 10 Paying Customers
Where to find them:
1. Acquire.com & MicroAcquire listings with public metrics ($10K–$50K ARR/MRR).
2. Open Startup directories (TrustMRR, Indie Hackers, built-in Stripe verified badges).
3. Founder communities: Bootstrapped.fm, Twitter/X "buildinpublic", and YC Startup School directory filtering for solo/duo founders.

Outreach Script (Direct 90s Loom Audit):
> *"Hey [Name], saw [Product] crossed ~$25K MRR. At this stage, your biggest operational tax is context-switching between shipping features and manually triaging churn, payment failures, and signup drops across Stripe and PostHog. Built an AI management system that ingests your Stripe + PostHog events daily, flags metric drift, and automatically drafts the exact triage actions for you to approve in Slack. Recorded a 90-second Loom showing what your morning briefing looks like on your actual numbers: [Link]. Can I set this up on a staging read-only key for you this Thursday?"*

### Raise: Seed Investor Thesis & Fatal Flaw
- **What a seed investor must believe:**
  1. *Autonomous execution beats passive dashboards:* Small founders don't want another chart; they want an executive agent that diagnoses metric anomalies and takes operational action autonomously.
  2. *Massive underserved TAM:* Millions of $10K–$50K/mo software businesses run by 1–3 people are too small for a COO/VP Finance ($180K+), but will gladly pay $200–$500/mo for an autonomous management layer.
  3. *Defensible agentic workflows:* Integrations and proprietary action loops (connecting Stripe, PostHog, GitHub, and email into verified actions) create high switching costs and data moats.
- **Strongest reason they'd say no:**
  - *Distribution & Churn Risk in Micro-SaaS:* Seed investors fear SMB churn (3–5% monthly) will outpace acquisition, and that small founders will resist trusting autonomous agents with live production data or business decisions without costly human handholding.

---

## Tech Stack & Architecture
- **Backend:** Node.js, Express 5, Cheerio, `@google/genai`
- **Frontend:** React 19, Vite, TypeScript, Lucide Icons
- **Design System:** OmniBrain Anti-Slop System (85/10/5 surface harmony, tabular-nums, 180ms physics curves)
- **License:** MIT
