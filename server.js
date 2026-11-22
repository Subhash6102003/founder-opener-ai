require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { scrapeCompanySite, normalizeUrl } = require('./scraper');
const { generateOpenerWithGemini } = require('./geminiService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend build if it exists
app.use(express.static(path.join(__dirname, 'client/dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Scrape-only endpoint (useful for debugging and transparency)
app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required.' });
    }
    const scraped = await scrapeCompanySite(url);
    res.json({ success: true, data: scraped });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
});

// Full pipeline: Scrape + Generate 3-line opener
app.post('/api/generate', async (req, res) => {
  const startTime = Date.now();
  try {
    const { url, apiKey } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required.' });
    }

    // Step 1: Scrape in code
    const scrapedData = await scrapeCompanySite(url);
    const scrapeDuration = Date.now() - startTime;

    // Step 2: Synthesis in Model
    const modelStartTime = Date.now();
    const result = await generateOpenerWithGemini({
      scrapedData,
      apiKey: apiKey || process.env.GEMINI_API_KEY,
    });
    const modelDuration = Date.now() - modelStartTime;

    res.json({
      success: true,
      data: {
        url: scrapedData.url,
        domain: scrapedData.domain,
        siteTitle: scrapedData.title,
        extractedSummary: scrapedData.heroSummary,
        opener: result.opener,
        telemetry: result.telemetry,
        isMock: result.isMock || false,
        message: result.message,
        metrics: {
          scrapeDurationMs: scrapeDuration,
          modelDurationMs: modelDuration,
          totalDurationMs: Date.now() - startTime
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred during processing.'
    });
  }
});

// Fallback to client SPA for any other routes
app.use((req, res) => {
  const indexPath = path.join(__dirname, 'client/dist/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Founder Opener AI API</title></head>
          <body style="font-family: monospace; padding: 2rem; background: #0a0a0c; color: #ececed;">
            <h2>Founder Opener AI - Backend Engine Running</h2>
            <p>API Endpoint: <code>POST /api/generate</code></p>
            <p>Health: <a href="/api/health" style="color: #6366f1;">/api/health</a></p>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`[FounderOpenerAI] Server running on http://localhost:${PORT}`);
});
