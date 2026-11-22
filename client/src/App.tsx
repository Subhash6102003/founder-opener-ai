import React, { useState } from 'react';
import { 
  Globe, 
  Send, 
  Copy, 
  Check, 
  Code2, 
  Cpu, 
  Key, 
  AlertCircle, 
  Clock, 
  ExternalLink 
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
    <div className="container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-block">
          <div className="brand-icon">
            <Cpu size={18} />
          </div>
          <div>
            <h1 className="brand-title">FounderOpener AI</h1>
            <p className="brand-sub">Autonomous B2B Founder Cold Outreach Engine</p>
          </div>
        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          <span>Engine Active</span>
        </div>
      </header>

      {/* Input Panel */}
      <section className="input-panel">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="input-row">
            <div className="url-input-wrapper">
              <Globe size={18} className="url-icon" />
              <input
                type="text"
                className="url-input"
                placeholder="Target company site (e.g. resend.com, cal.com)"
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
              <span>{loading ? 'Analyzing...' : 'Draft Opener'}</span>
            </button>
          </div>
        </form>

        <div className="quick-chips">
          <span>Try quick target:</span>
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

        <div className="config-toggle">
          <button 
            type="button"
            className="btn-secondary" 
            style={{ fontSize: '0.75rem', height: '28px' }}
            onClick={() => setShowConfig(!showConfig)}
          >
            <Key size={13} />
            <span>{showConfig ? 'Hide API Config' : 'Configure Gemini API Key (Optional)'}</span>
          </button>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Free Tier / Mock Mode supported
          </span>
        </div>

        {showConfig && (
          <div className="api-drawer">
            <input
              type="password"
              className="key-input"
              placeholder="Paste GEMINI_API_KEY (leave empty to use default env key or demo mode)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        )}
      </section>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <main className="layout-grid">
        {/* Left Column: 3-line opener */}
        <section className="result-card">
          <div className="card-header">
            <div className="card-title">
              <Cpu size={15} color="#818cf8" />
              <span>Generated 3-Line Founder Opener</span>
            </div>
            {result && (
              <div className="card-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={handleCopy}
                >
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy Opener'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="opener-content">
            {loading ? (
              <div>
                <div className="skeleton-bar" style={{ width: '92%' }}></div>
                <div className="skeleton-bar" style={{ width: '84%' }}></div>
                <div className="skeleton-bar" style={{ width: '70%' }}></div>
              </div>
            ) : result ? (
              <div>
                {lines.map((line, idx) => (
                  <article key={idx} className="opener-line">
                    <span className="line-label">
                      {idx === 0 && 'Line 1: Real Product Observation'}
                      {idx === 1 && 'Line 2: $10K–$50K MRR Founder Bottleneck'}
                      {idx === 2 && 'Line 3: Low-Friction Hook Question'}
                    </span>
                    <p>{line}</p>
                  </article>
                ))}

                {result.isMock && (
                  <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ℹ️ {result.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="empty-placeholder">
                <p>Enter any software company URL above to extract their core value proposition and generate an authentic 3-line cold email opener.</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Code vs Model Inspection Pane */}
        <aside className="inspector-card">
          <div className="inspector-section">
            <div className="inspector-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Code2 size={13} />
              <span>What Ran in Code (Deterministic)</span>
            </div>
            <p className="inspector-text">
              Cheerio DOM parsing, SSL bypass, stripping scripts/nav/cookie banners, extracting meta tags, H1/H2 hero tags, and token bounded payload window.
            </p>
          </div>

          <div className="inspector-section">
            <div className="inspector-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Cpu size={13} />
              <span>What Ran in Model (Gemini)</span>
            </div>
            <p className="inspector-text">
              Context synthesis, founder voice calibration, mapping customer proposition against small software company operations, generating exactly 3 lines.
            </p>
          </div>

          {result && (
            <div className="inspector-section">
              <div className="inspector-heading">Scraped Metadata</div>
              <p className="inspector-text" style={{ marginBottom: '0.5rem' }}>
                <strong>Domain:</strong> {result.domain}
              </p>
              <p className="inspector-text" style={{ marginBottom: '0.5rem' }}>
                <strong>Title:</strong> {result.siteTitle || 'N/A'}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="metric-badge tabular">
                  <Clock size={12} /> Scrape: {result.metrics.scrapeDurationMs}ms
                </span>
                <span className="metric-badge tabular">
                  <Clock size={12} /> Model: {result.metrics.modelDurationMs}ms
                </span>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};
