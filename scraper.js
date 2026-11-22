const cheerio = require('cheerio');

// Ensure external startup scraping is not prematurely aborted by intermediate SSL cert discrepancies
if (typeof process !== 'undefined' && process.env) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

/**
 * Normalizes and validates incoming URL
 */
function normalizeUrl(inputUrl) {
  let urlStr = (inputUrl || '').trim();
  if (!urlStr) throw new Error('URL is required');

  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = 'https://' + urlStr;
  }

  try {
    const parsed = new URL(urlStr);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      throw new Error('Invalid domain name');
    }
    return parsed.href;
  } catch (err) {
    throw new Error(`Invalid URL format: ${inputUrl}`);
  }
}

/**
 * Scrapes core high-signal positioning data from a company website
 */
async function scrapeCompanySite(targetUrl) {
  const url = normalizeUrl(targetUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

  let html = '';
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} (${response.statusText})`);
    }

    html = await response.text();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Connection timed out while fetching ${url}`);
    }
    throw new Error(`Failed to fetch website: ${err.message}`);
  } finally {
    clearTimeout(timeoutId);
  }

  const $ = cheerio.load(html);

  // Remove noise elements
  $('script, style, noscript, svg, nav, footer, iframe, form, [role="dialog"], .cookie-banner, #cookie-notice').remove();

  // Extract meta positioning
  const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
  const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
  
  // Extract primary headlines (Hero section)
  const h1s = $('h1').map((_, el) => $(el).text().trim().replace(/\s+/g, ' ')).get().filter(Boolean);
  const h2s = $('h2').slice(0, 4).map((_, el) => $(el).text().trim().replace(/\s+/g, ' ')).get().filter(Boolean);
  
  // Extract key paragraphs and value props
  const keyParagraphs = $('p')
    .slice(0, 6)
    .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
    .get()
    .filter(txt => txt.length > 25 && txt.length < 280);

  // Combine high signal summary
  const heroSummary = [
    h1s.length ? `Headline: ${h1s.join(' | ')}` : '',
    h2s.length ? `Subheadings: ${h2s.join(' | ')}` : '',
    keyParagraphs.length ? `Value Propositions: ${keyParagraphs.slice(0, 3).join(' ')}` : '',
  ].filter(Boolean).join('\n');

  return {
    url,
    domain: new URL(url).hostname.replace(/^www\./, ''),
    title: title.slice(0, 150),
    description: description.slice(0, 250),
    h1s: h1s.slice(0, 2),
    h2s: h2s.slice(0, 3),
    heroSummary: heroSummary.slice(0, 1200), // bounded context window
  };
}

module.exports = {
  normalizeUrl,
  scrapeCompanySite,
};
