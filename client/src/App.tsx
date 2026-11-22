import React, { useState } from 'react';
import { 
  Globe, 
  Send, 
  Copy, 
  Check, 
  Cpu, 
  ExternalLink, 
  Key, 
  Clock, 
  Code2, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  GitFork, 
  Star 
} from 'lucide-react';

interface ApiResponse {
  url: string;
  domain: string;
  siteTitle: string;
  extractedSummary: string;
  opener: string;
  isMock: boolean;
  message?: string;
  metrics: {
    scrapeDurationMs: number;
    modelDurationMs: number;
    totalDurationMs: number;
  };
}

export const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleSites = ['resend.com', 'cal.com', 'dub.co', 'posthog.com'];

  const handleSubmit = async (targetUrl?: string) => {
    const finalUrl = (targetUrl || url).trim();
    if (!finalUrl) {
      setError('Please enter a company website address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: finalUrl,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || `Request failed (${response.status})`);
      }

      setResult(json.data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate cold email opener.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.opener) return;
    navigator.clipboard.writeText(result.opener);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = result?.opener ? result.opener.split('\n\n') : [];

  return (
    <div>
      {/* Top Announcement Bar */}
      <div className="top-ribbon">
        <span className="ribbon-badge">SYSTEM v1.0 READY</span>
        <span>HLD & LLD • Cheerio Scraper • Gemini 1.5 Flash • Zero-Cost Stack •</span>
        <a 
          href="https://github.com/Subhash6102003/founder-opener-ai" 
          target="_blank" 
          rel="noreferrer" 
          className="ribbon-link"
        >
          View on GitHub ↗
        </a>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-title">FounderOpener AI</span>
          <span className="brand-badge">10K–50K MRR SUITE</span>
        </div>

        <div className="nav-links">
          <a href="#generator" className="nav-link">Live Generator</a>
          <a href="#blueprints" className="nav-link">Visual Blueprints</a>
          <a href="#scale" className="nav-link">Scale & Costs</a>
          <a href="#gtm" className="nav-link">GTM Playbook</a>
          <a href="#thesis" className="nav-link">Seed Thesis</a>
          <a 
            href="https://github.com/Subhash6102003/founder-opener-ai" 
            target="_blank" 
            rel="noreferrer" 
            className="nav-link"
          >
            GitHub ↗
          </a>
        </div>

        <a 
          href="https://github.com/Subhash6102003/founder-opener-ai" 
          target="_blank" 
          rel="noreferrer" 
          className="nav-btn-star"
        >
          <Star size={14} />
          <span>Star on GitHub</span>
        </a>
      </nav>

      {/* Page Body Container */}
      <div className="page-container">
        
        {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-eyebrow">
            <span className="dot-green"></span>
            <span>ENGINEERING KNOWLEDGE BASE & OUTREACH ENGINE</span>
          </div>

          <h1 className="hero-headline">
            Autonomous outreach engine for $10K–$50K/mo software companies.
          </h1>

          <p className="hero-subtext">
            From low-level DOM extraction and header normalization to operational friction mapping, PostgreSQL & Stripe metrics synthesis, and sub-second 3-line founder openers that convert without corporate fluff.
          </p>

          <div className="pill-row">
            <span className="tag-pill">Zero-Cost Stack</span>
            <span className="tag-pill">Cheerio Scraper</span>
            <span className="tag-pill">1,200 Char Ceiling</span>
            <span className="tag-pill">Gemini 1.5 Flash</span>
            <span className="tag-pill">MIT License</span>
          </div>

          <div className="hero-actions">
            <a href="#generator" className="btn-primary-olive">
              Try Live Generator →
            </a>
            <a href="#blueprints" className="btn-outline">
              Explore Blueprints
            </a>
          </div>
        </header>

        {/* Live Interactive Generator Studio */}
        <section id="generator" className="generator-wrapper">
          <div className="generator-header">
            <h2 className="generator-title">Interactive Cold Opener Studio</h2>
            <p className="generator-sub">
              Input any software company domain. Our scraper extracts value propositions and synthesizes an authentic 3-line founder opener.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="input-row">
              <div className="url-input-wrapper">
                <Globe size={18} className="url-icon" />
                <input
                  type="text"
                  className="url-input"
                  placeholder="Target company site (e.g. resend.com, cal.com, dub.co)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="btn-generate"
                disabled={loading}
              >
                <Send size={15} />
                <span>{loading ? 'Synthesizing...' : 'Draft Opener'}</span>
              </button>
            </div>
          </form>

          <div className="quick-chips">
            <span>Quick-test targets:</span>
            {sampleSites.map((site) => (
              <button
                key={site}
                type="button"
                className="chip-btn"
                onClick={() => {
                  setUrl(site);
                  handleSubmit(site);
                }}
              >
                {site}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              type="button"
              className="btn-outline" 
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              onClick={() => setShowConfig(!showConfig)}
            >
              <Key size={13} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
              <span>{showConfig ? 'Hide API Config' : 'Configure Gemini API Key (Optional)'}</span>
            </button>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Deterministic Fallback Active
            </span>
          </div>

          {showConfig && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <input
                type="password"
                className="url-input"
                style={{ height: '38px', fontSize: '0.8125rem' }}
                placeholder="Paste GEMINI_API_KEY (leave empty to use default env key or demo mode)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          )}

          {error && (
            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--error-bg)', color: '#fca5a5', borderRadius: '6px', fontSize: '0.8125rem' }}>
              {error}
            </div>
          )}

          {/* Result Box */}
          {(result || loading) && (
            <div className="output-box">
              <div className="output-header">
                <div className="output-label">
                  <Cpu size={14} />
                  <span>Synthesized 3-Line Founder Opener</span>
                </div>
                {result && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="font-mono tabular" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Scrape: {result.metrics.scrapeDurationMs}ms | Model: {result.metrics.modelDurationMs}ms
                    </span>
                    <button type="button" className="btn-copy" onClick={handleCopy}>
                      {copied ? <Check size={13} color="#4ade80" /> : <Copy size={13} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>

              {loading ? (
                <div>
                  <div style={{ height: '18px', background: 'var(--bg-input)', borderRadius: '4px', marginBottom: '0.75rem', opacity: 0.6 }}></div>
                  <div style={{ height: '18px', background: 'var(--bg-input)', borderRadius: '4px', marginBottom: '0.75rem', width: '80%', opacity: 0.6 }}></div>
                  <div style={{ height: '18px', background: 'var(--bg-input)', borderRadius: '4px', width: '60%', opacity: 0.6 }}></div>
                </div>
              ) : (
                <div className="opener-lines-list">
                  {lines.map((line, idx) => (
                    <article key={idx} className="opener-line-item">
                      <div className="line-role">
                        {idx === 0 && 'Line 1: Real Product Observation'}
                        {idx === 1 && 'Line 2: $10K–$50K MRR Founder Bottleneck'}
                        {idx === 2 && 'Line 3: Low-Friction Hook Question'}
                      </div>
                      <p className="line-text">{line}</p>
                    </article>
                  ))}

                  {result?.isMock && (
                    <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ℹ️ {result.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* 01 • SYSTEM BLUEPRINTS */}
        <section id="blueprints" className="content-section">
          <div className="section-eyebrow">01 • SYSTEM BLUEPRINTS</div>
          <h2 className="section-heading">Visual System Topologies & Request Lifecycles</h2>
          <p className="section-subtext">
            Structured architectural components and request lifecycles crafted for high-signal founder outreach and zero corporate slop.
          </p>

          <div className="card-grid-3">
            {/* Blueprint Card 1 */}
            <article className="blueprint-card">
              <div className="card-top">
                <div className="card-tag-row">
                  <span className="card-category">HLD TOPOLOGY</span>
                  <span className="card-file-id">Section H</span>
                </div>
                <h3 className="card-heading">Deterministic DOM Ingestion</h3>
                <p className="card-desc">
                  Custom User-Agent fetch, automatic TLS chain normalization, Cheerio AST parsing, stripping scripts, styles, cookie modals, and extracting meta descriptions and hero H1/H2 tags.
                </p>
              </div>
              <footer className="card-footer-meta">
                <span className="meta-label">Engine</span>
                <span className="meta-val">Cheerio 1.2</span>
              </footer>
            </article>

            {/* Blueprint Card 2 */}
            <article className="blueprint-card">
              <div className="card-top">
                <div className="card-tag-row">
                  <span className="card-category">LLD PIPELINE</span>
                  <span className="card-file-id">Section D & 6</span>
                </div>
                <h3 className="card-heading">Context Bounding & Sanitization</h3>
                <p className="card-desc">
                  Token bounding window strictly capped at 1,200 characters. Strips cookie notices and marketing fluff to maximize prompt signal-to-noise ratio and prevent model hallucinations.
                </p>
              </div>
              <footer className="card-footer-meta">
                <span className="meta-label">Ceiling</span>
                <span className="meta-val">1,200 Chars</span>
              </footer>
            </article>

            {/* Blueprint Card 3 */}
            <article className="blueprint-card">
              <div className="card-top">
                <div className="card-tag-row">
                  <span className="card-category">INTERVIEW BLUEPRINT</span>
                  <span className="card-file-id">File 098B</span>
                </div>
                <h3 className="card-heading">Founder Voice Synthesis</h3>
                <p className="card-desc">
                  Gemini 1.5 Flash calibrated system prompt. Maps extracted value proposition against specific operational friction of solo/duo founders making $10K–$50K MRR.
                </p>
              </div>
              <footer className="card-footer-meta">
                <span className="meta-label">Model</span>
                <span className="meta-val">Gemini 1.5 Flash</span>
              </footer>
            </article>
          </div>
        </section>

        {/* 02 • SCALE & BOTTLENECK ANALYSIS */}
        <section id="scale" className="content-section">
          <div className="section-eyebrow">02 • SCALE & BOTTLENECK ANALYSIS</div>
          <h2 className="section-heading">What Breaks at 1,000 Runs a Day + Unit Economics</h2>
          <p className="section-subtext">
            Deterministic failure modes, exact token cost math, and production hardening strategies.
          </p>

          <div className="card-grid-3">
            {/* Scale Card 1 */}
            <article className="blueprint-card">
              <div className="card-top">
                <div className="card-tag-row">
                  <span className="card-category">BOTTLENECK 01</span>
                  <span className="card-file-id">Network Layer</span>
                </div>
                <h3 className="card-heading">Scraper IP Bans & CDN Shielding</h3>
                <p className="card-desc">
                  Cloudflare and Datadome rate-limit bare server IPs under burst traffic with HTTP 403/429. Mitigation requires rotating residential proxy pools (ZenRows/BrightData) with session hashing.
                </p>
              </div>
              <footer className="card-footer-meta">
                <span className="meta-label">Failure Mode</span>
                <span className="meta-val">HTTP 403 / 429</span>
              </footer>
            </article>

            {/* Scale Card 2 */}
            <article className="blueprint-card">
              <div className="card-top">
                <div className="card-tag-row">
                  <span className="card-category">BOTTLENECK 02</span>
                  <span className="card-file-id">Rendering Engine</span>
                </div>
                <h3 className="card-heading">Client-Side Single-Page Apps</h3>
                <p className="card-desc">
                  Pure Cheerio misses JavaScript-hydrated React/Vue apps where content renders client-side. Mitigation: Asynchronous fallback to lightweight headless browser workers (Playwright).
                </p>
              </div>
              <footer className="card-footer-meta">
                <span className="meta-label">Mitigation</span>
                <span className="meta-val">Playwright Worker</span>
              </footer>
            </article>

            {/* Scale Card 3 */}
            <article className="blueprint-card">
              <div className="card-top">
                <div className="card-tag-row">
                  <span className="card-category">UNIT ECONOMICS</span>
                  <span className="card-file-id">Cost Model</span>
                </div>
                <h3 className="card-heading">Gemini Token Math & Pricing</h3>
                <p className="card-desc">
                  At ~450 tokens per run, 1,000 runs consume ~450K tokens. Gemini 1.5 Flash costs $0.075/1M input and $0.30/1M output, totaling ~$0.05/day ($1.50/month)—well within free tier bounds.
                </p>
              </div>
              <footer className="card-footer-meta">
                <span className="meta-label">Daily Cost</span>
                <span className="meta-val tabular">~$0.05 / 1k runs</span>
              </footer>
            </article>
          </div>
        </section>

        {/* 03 • STRATEGIC PLAYBOOK (Sell & Raise) */}
        <section id="gtm" className="content-section">
          <div className="section-eyebrow">03 • STRATEGIC PLAYBOOK</div>
          <h2 className="section-heading">Customer Acquisition & Seed Investment Thesis</h2>
          <p className="section-subtext">
            Actionable B2B playbooks for securing the first 10 paying customers and navigating seed investor diligence.
          </p>

          <div className="card-grid-2">
            {/* Sell Card */}
            <article className="deep-card">
              <div className="card-tag-row">
                <span className="card-category">PART 2: SELL</span>
                <span className="card-file-id">139 Words</span>
              </div>
              <h3 className="deep-card-title">
                <TrendingUp size={18} color="#a3c99f" />
                <span>How to Get the First 10 Paying Customers</span>
              </h3>
              <p className="card-desc" style={{ marginBottom: '1rem' }}>
                Target sourcing: Acquire.com & MicroAcquire listings with public metrics ($10K–$50K ARR/MRR), Open Startup directories (TrustMRR, Indie Hackers, built-in Stripe verified badges), and founder communities (Bootstrapped.fm, Twitter/X "buildinpublic", YC Startup School directory).
              </p>
              <div className="quote-block">
                "Hey [Name], saw [Product] crossed ~$25K MRR. At this stage, your biggest operational tax is context-switching between shipping features and manually triaging churn, payment failures, and signup drops across Stripe and PostHog.<br /><br />
                Built an AI management system that ingests your Stripe + PostHog events daily, flags metric drift, and automatically drafts the exact triage actions for you to approve in Slack.<br /><br />
                Recorded a 90-second Loom showing what your morning briefing looks like on your actual numbers: [Link]. Can I set this up on a staging read-only key for you this Thursday?"
              </div>
            </article>

            {/* Raise Card */}
            <article id="thesis" className="deep-card">
              <div className="card-tag-row">
                <span className="card-category">PART 2: RAISE</span>
                <span className="card-file-id">132 Words</span>
              </div>
              <h3 className="deep-card-title">
                <ShieldCheck size={18} color="#a3c99f" />
                <span>Seed Investment Thesis & Fatal Objection</span>
              </h3>
              <p className="card-desc" style={{ marginBottom: '0.75rem' }}>
                <strong>What a seed investor must believe:</strong>
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                <li><strong>Autonomous execution beats passive dashboards:</strong> Small founders don't want another chart; they want an executive agent that diagnoses metric anomalies and takes operational action autonomously.</li>
                <li><strong>Massive underserved TAM:</strong> Millions of $10K–$50K/mo software businesses run by 1–3 people cannot afford a COO/VP Finance ($180K+), but will gladly pay $200–$500/mo for an autonomous management layer.</li>
                <li><strong>Defensible agentic workflows:</strong> Proprietary action loops across Stripe, PostHog, GitHub, and email create high switching costs.</li>
              </ul>
              <div className="quote-block" style={{ borderLeftColor: '#f87171' }}>
                <strong>Strongest reason they'd say no:</strong> Seed investors fear SMB churn (3–5% monthly) will outpace acquisition, and that small founders will resist trusting autonomous agents with live production data or business decisions without costly human handholding.
              </div>
            </article>
          </div>
        </section>

        {/* 04 • FOUNDING MINDSET & REFLECTIONS */}
        <section className="content-section">
          <div className="section-eyebrow">04 • FOUNDING MINDSET & REFLECTIONS</div>
          <h2 className="section-heading">2-Year Trajectory, Trade-offs & Intentional Omissions</h2>
          <p className="section-subtext">
            Personal positioning, builder ownership, and architectural scoping decisions.
          </p>

          <div className="card-grid-3">
            <article className="blueprint-card">
              <div className="card-top">
                <div className="card-tag-row">
                  <span className="card-category">TRAJECTORY</span>
                  <span className="card-file-id">2-Year Goal</span>
                </div>
                <h3 className="card-heading">Founding Engineer Vision</h3>
                <p className="card-desc">
                  In two years, I want to be an early-stage founding engineer launching agentic systems from 0 to 1. This internship immerses me directly into autonomous agent architectures, real B2B customer feedback loops, and high-velocity founder execution.
                </p>
              </div>
            </article>

            <article className="blueprint-card">
              <div className="card-top">
                <div className="card-tag-row">
                  <span className="card-category">COMMITMENT</span>
                  <span className="card-file-id">Trade-offs</span>
                </div>
                <h3 className="card-heading">What I Am Giving Up</h3>
                <p className="card-desc">
                  A comfortable, structured corporate rotation with predictable hours to take on high-ownership, ambiguous problem-solving where output directly determines survival.
                </p>
              </div>
            </article>

            <article className="blueprint-card">
              <div className="card-top">
                <div className="card-tag-row">
                  <span className="card-category">SCOPE DISCIPLINE</span>
                  <span className="card-file-id">Part 1 Omissions</span>
                </div>
                <h3 className="card-heading">Intentional Omissions</h3>
                <p className="card-desc">
                  Left out heavy Chromium/Playwright binaries to keep setup zero-dependency and sub-second fast. Left out external paid Apollo/Hunter email enrichment APIs to keep the tool 100% free and focused on core positioning quality.
                </p>
              </div>
            </article>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div>
          <span>FounderOpener AI • Autonomous Management Suite for B2B Software</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>MIT License</span>
          <a 
            href="https://github.com/Subhash6102003/founder-opener-ai" 
            target="_blank" 
            rel="noreferrer" 
            style={{ color: 'var(--text-secondary)' }}
          >
            GitHub Repository
          </a>
        </div>
      </footer>
    </div>
  );
};
