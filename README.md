# FounderOpener AI

> Autonomous B2B Founder Cold Outreach Engine for small software companies ($10K–$50K/mo MRR).

Takes any software company's website address, deterministically extracts its positioning and value propositions, and crafts a hyper-personalized, 3-line cold email opener targeted at its founder.

---

## Quick Start (How to Run It)

```bash
# 1. Install dependencies
npm install
npm run build

# 2. (Optional) Configure Gemini API Key
cp .env.example .env
# Add GEMINI_API_KEY=your_key in .env or pass it directly in the UI drawer

# 3. Start the application
npm start
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## Architecture: Code vs. Model

| Pipeline Stage | Executed In | Implementation Details |
| :--- | :--- | :--- |
| **URL Validation & Normalization** | Code (Node.js) | Regex validation, protocol enforcement, hostname parsing. |
| **DOM Fetch & HTML Extraction** | Code (Cheerio + Fetch) | Timeout (8s), bot headers, removal of scripts/styles/navs/cookie modals. |
| **Hero & Value Prop Filtering** | Code (JavaScript) | Title, meta descriptions, `h1`/`h2` hero tags, key value sentences bounded to 1,200 chars. |
| **Context Synthesis & Founder Voice** | Model (Gemini 1.5/2.5 Flash) | Calibrated cold outreach prompt mapping company stage to operational friction. |
| **Output Constraint Enforcement** | Code + Model | Strict 3-line split, paragraph formatting, zero corporate fluff. |

---

## 1,000 Runs/Day Scaling & Cost Analysis

* **Cost**: Gemini 1.5 Flash input is $0.075 / 1M tokens; output is $0.30 / 1M tokens. At ~400 input tokens and ~80 output tokens per run, 1,000 runs consume ~480K tokens costing **~$0.05/day ($1.62/month)**, well within Gemini's free tier.
* **Failure Points at 1,000 runs/day**:
  1. *Scraper IP Blocks / Cloudflare Captchas*: Direct scraping gets throttled (403/429) by anti-bot CDNs. Needs proxy rotation (e.g. ZenRows/BrightData) or headless browser workers (Playwright).
  2. *Single-Page Apps (Client-Side Rendering)*: Pure Cheerio cannot render React/Vue client-only DOMs where content loads via JavaScript.
  3. *Rate Limits & Timeouts*: Free tier Gemini RPM caps (15 RPM) queue backlog during burst usage; requires Redis queue (BullMQ) with exponential backoff.

---

## Tech Stack
- **Backend:** Node.js, Express 5, Cheerio, `@google/genai`
- **Frontend:** React 19, Vite, TypeScript, Lucide Icons
- **Design:** OmniBrain Anti-Slop System (85/10/5 surface harmony, tabular-nums, 180ms curves)
