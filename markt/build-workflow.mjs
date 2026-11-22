// Source of truth for the "Markt — BTC Brief" n8n workflow. Run: node build-workflow.mjs → workflows/markt.json
// Trigger → Binance candles + Nexus news/market sources → FinBERT (local) → Gemma 4 E4B (local) → Gmail brief + archive.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = import.meta.dirname;
const cfg = JSON.parse(fs.readFileSync(path.join(root, "config.json"), "utf8"));
const NAME = "Markt — BTC Brief";
const ID = "marketPulse00001"; // kept from the first version so the import replaces it (one schedule, not two)
const uuid = (s) => { const h = crypto.createHash("md5").update("markt:" + s).digest("hex"); return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`; };
const SERVICE = "http://host.docker.internal:8791";
const OLLAMA = "http://host.docker.internal:11434";
const GMAIL = { gmailOAuth2: { id: "triageGmail00001", name: "Triage Gmail" } }; // shared with customer-triage (same n8n)

const nodes = [];
const connections = {};
const node = (n) => { nodes.push({ id: uuid(n.name), typeVersion: 1, parameters: {}, ...n }); return n.name; };
const link = (from, to) => { connections[from] ??= { main: [[]] }; connections[from].main[0].push({ node: to, type: "main", index: 0 }); };
const chain = (...names) => names.slice(1).forEach((n, i) => link(names[i], n));
const note = (content, position, width, height, color) =>
  nodes.push({ id: uuid(content), name: content.split("\n")[0].replace(/^#+\s*/, ""), type: "n8n-nodes-base.stickyNote", typeVersion: 1, position, parameters: { content, width, height, color } });

// Every source call: retry once, never stop the run. A failed source becomes { error } and is named in the email footer.
const SOFT = { retryOnFail: true, maxTries: 2, waitBetweenTries: 3000, onError: "continueRegularOutput", executeOnce: true, alwaysOutputData: true };
// Responses are read as text and parsed in "Build snapshot" (Binance klines are arrays, which n8n would split into items).
const get = (name, position, url) => node({
  name, type: "n8n-nodes-base.httpRequest", typeVersion: 4.2, position, ...SOFT,
  parameters: { url, sendHeaders: true, headerParameters: { parameters: [{ name: "user-agent", value: "Mozilla/5.0 (markt)" }] },
    options: { timeout: 20000, response: { response: { responseFormat: "text" } } } },
});
const post = (name, position, url, timeout) => node({
  name, type: "n8n-nodes-base.httpRequest", typeVersion: 4.2, position, ...SOFT,
  parameters: { method: "POST", url, sendBody: true, specifyBody: "json", jsonBody: "={{ JSON.stringify($json.body) }}", options: { timeout } },
});
const code = (name, position, js) => node({
  name, type: "n8n-nodes-base.code", typeVersion: 2, position, parameters: { mode: "runOnceForAllItems", jsCode: js.trim() },
});

note("## 1. Trigger\n**Click Execute workflow** to run now (Click to run). Runs by itself every " + cfg.everyHours + " h. Scripts use the token-checked webhook (`node scripts/run.mjs`).", [-40, 60], 460, 620, 7);
note("## 2. Collect (Nexus sources, no API keys)\n**Binance** 1h candles (BTC price, 24h move, range) · **Fear & Greed** · **Yahoo** S&P / Nasdaq / gold · **News:** Binance announcements, CoinTelegraph, CoinDesk, Decrypt, Federal Reserve.\nEach call retries once; a dead source is skipped and named in the email.", [440, 60], 1780, 620, 4);
note("## 3. Analyse (all local)\nFinBERT labels every headline (Python :8791, GPU). Gemma 4 E4B picks the 3 biggest stories and writes a 3-sentence 'why' from the data only (JSON schema).", [2240, 60], 900, 620, 6);
note("## 4. Deliver\nProfessional HTML brief via Gmail + JSON/Markdown archive in `markt/digests/`. Prices come from Binance, never from the model.", [3160, 60], 1120, 620, 5);

const manual = node({ name: "Click to run", type: "n8n-nodes-base.manualTrigger", typeVersion: 1, position: [0, 220], parameters: {} });
const every = node({ name: `Every ${cfg.everyHours} hours`, type: "n8n-nodes-base.scheduleTrigger", typeVersion: 1.2, position: [0, 400],
  parameters: { rule: { interval: [{ field: "hours", hoursInterval: cfg.everyHours }] } } });
const hook = node({ name: "API call (webhook, scripts only)", type: "n8n-nodes-base.webhook", typeVersion: 2.1, position: [0, 580], webhookId: uuid("hook"),
  parameters: { httpMethod: "POST", path: "markt", responseMode: "lastNode", responseData: "firstEntryJson", options: {} } });

const start = code("Start", [240, 340], `
// Webhook runs need the shared token; scheduled runs have no headers.
const item = $input.first().json;
const crypto = require('crypto');
let trigger = Object.keys(item).length ? 'schedule' : 'manual';
if (item.headers) {
  const given = Buffer.from(String(item.headers['x-markt-token'] || ''));
  const expected = Buffer.from(String($env.TRIAGE_WEBHOOK_TOKEN || ''));
  if (!(expected.length && given.length === expected.length && crypto.timingSafeEqual(given, expected))) throw new Error('unauthorized');
  trigger = 'webhook';
}
return [{ json: { trigger, started_at: new Date().toISOString() } }];`);
link(manual, start); link(every, start); link(hook, start);

const FEEDS = [["CoinTelegraph RSS", "CoinTelegraph"], ["CoinDesk RSS", "CoinDesk"], ["Decrypt RSS", "Decrypt"], ["Federal Reserve RSS", "Federal Reserve"]];
const SRC = [
  get("Binance BTC candles", [480, 340], "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24"),
  get("Fear & Greed", [700, 340], "https://api.alternative.me/fng/?limit=2"),
  get("Yahoo markets", [920, 340], "https://query1.finance.yahoo.com/v7/finance/spark?symbols=%5EGSPC,%5EIXIC,GC%3DF&range=5d&interval=1d"),
  get("Binance announcements", [1140, 340], "https://www.binance.com/bapi/composite/v1/public/cms/article/list/query?type=1&pageNo=1&pageSize=10&catalogId=48"),
  get("CoinTelegraph RSS", [1360, 340], "https://cointelegraph.com/rss"),
  get("CoinDesk RSS", [1580, 340], "https://www.coindesk.com/arc/outboundfeeds/rss"),
  get("Decrypt RSS", [1800, 340], "https://decrypt.co/feed"),
  get("Federal Reserve RSS", [2020, 340], "https://www.federalreserve.gov/feeds/press_all.xml"),
];

const snapshot = code("Build snapshot", [2280, 340], `
const failed = [];
const text = (n) => { try { const j = $(n).first().json; if (!j || j.error || typeof j.data !== 'string') { failed.push(n); return null; } return j.data; } catch { failed.push(n); return null; } };
const json = (n) => { const t = text(n); if (t == null) return null; try { return JSON.parse(t); } catch { failed.push(n + ' (bad JSON)'); return null; } };
const num = (x, d = 2) => x == null || isNaN(x) ? null : Number(Number(x).toFixed(d));

// BTC from 24 one-hour candles: [openTime, open, high, low, close, volume, closeTime, quoteVolume, ...]
const k = json('Binance BTC candles');
let btc = null;
if (Array.isArray(k) && k.length) {
  const open = Number(k[0][1]), price = Number(k[k.length - 1][4]);
  const change = (price - open) / open * 100;
  btc = { price: num(price), open_24h: num(open), change_pct: num(change), change_usd: num(price - open, 0),
    high_24h: num(Math.max(...k.map(c => Number(c[2])))), low_24h: num(Math.min(...k.map(c => Number(c[3])))),
    volume_musd: num(k.reduce((a, c) => a + Number(c[7]), 0) / 1e6, 0),
    direction: Math.abs(change) < ${cfg.flatThresholdPct} ? 'flat' : change > 0 ? 'up' : 'down',
    candles_close: k.map(c => num(c[4], 0)), as_of: new Date(Number(k[k.length - 1][6]) + 1).toISOString() };
}
const fngData = ((json('Fear & Greed') || {}).data) || [];
const fear_greed = fngData.length ? { value: Number(fngData[0].value), label: fngData[0].value_classification, previous: fngData[1] ? Number(fngData[1].value) : null } : null;
const NAMES = { '^GSPC': 'S&P 500', '^IXIC': 'Nasdaq', 'GC=F': 'Gold' };
const spark = ((json('Yahoo markets') || {}).spark || {}).result || [];
const markets = spark.map(r => { const x = r.response[0]; const c = x.indicators.quote[0].close.filter(v => v != null);
  const last = x.meta.regularMarketPrice ?? c[c.length - 1], prev = c.length > 1 ? c[c.length - 2] : x.meta.chartPreviousClose;
  return { name: NAMES[r.symbol] || r.symbol, last: num(last), change_pct: num((last - prev) / prev * 100) }; });

// News: last ${cfg.maxHeadlineAgeHours} h, up to ${cfg.headlinesPerFeed} per source, deduped by title.
const MAX_AGE = ${cfg.maxHeadlineAgeHours} * 3600e3, PER = ${cfg.headlinesPerFeed};
const fresh = (d) => !d || isNaN(new Date(d)) || Date.now() - new Date(d).getTime() < MAX_AGE;
const decode = (s) => s.replace(/<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>/g, '$1').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;|&#8217;/g, "'").replace(/&#8216;/g, "'").replace(/&#822[01];/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\\s+/g, ' ').trim();
const tag = (x, t) => { const m = x.match(new RegExp('<' + t + '[^>]*>([\\\\s\\\\S]*?)</' + t + '>')); return m ? decode(m[1]) : ''; };
const news = [], seen = new Set();
const add = (h) => { const key = h.title.toLowerCase(); if (!h.title || seen.has(key) || !fresh(h.published)) return false; seen.add(key); news.push(h); return true; };
const bn = json('Binance announcements');
((((bn || {}).data || {}).catalogs || [])[0] || { articles: [] }).articles.slice(0, PER)
  .forEach(a => add({ source: 'Binance', title: a.title, link: 'https://www.binance.com/en/support/announcement/' + a.code, published: new Date(a.releaseDate).toISOString() }));
for (const [n, source] of ${JSON.stringify(FEEDS)}) {
  const xml = text(n); if (xml == null) continue;
  let c = 0;
  for (const x of xml.match(/<item[\\s>][\\s\\S]*?<\\/item>/g) || []) {
    if (c >= PER) break;
    if (add({ source, title: tag(x, 'title'), link: tag(x, 'link'), published: tag(x, 'pubDate') })) c++;
  }
}
news.forEach((h, i) => { h.id = i + 1; });
const snapshot = { taken_at: new Date().toISOString(), btc, fear_greed, markets, news, failed_sources: failed };
return [{ json: { snapshot, body: { texts: news.map(h => h.title) } } }];`);

const finbert = post("FinBERT sentiment", [2520, 340], `${SERVICE}/sentiment`, 60000);

const prompt = code("Build prompt", [2740, 340], `
const s = $('Build snapshot').first().json.snapshot;
const fb = $input.first().json;
const results = Array.isArray(fb.results) ? fb.results : null;
if (!results) s.failed_sources.push('FinBERT service');
s.news.forEach((h, i) => { if (results && results[i]) { h.sentiment = results[i].label; h.sentiment_score = results[i].score; } });
const counts = { positive: 0, neutral: 0, negative: 0 };
s.news.forEach(h => { if (h.sentiment) counts[h.sentiment]++; });
s.sentiment = results ? { model: fb.model, counts, n: s.news.filter(h => h.sentiment).length } : null;

const data = {
  btc_24h: s.btc && { price_usd: s.btc.price, change_pct: s.btc.change_pct, direction: s.btc.direction, high: s.btc.high_24h, low: s.btc.low_24h },
  fear_greed: s.fear_greed, markets_last_close: s.markets, headline_sentiment_counts: counts,
  headlines: s.news.map(h => h.id + '. [' + h.source + (h.sentiment ? ', ' + h.sentiment : '') + '] ' + h.title),
};
const system = [
  'You are a markets editor writing a short, professional Bitcoin brief. Use ONLY the data and numbered headlines given.',
  'Never invent numbers, events, quotes or causes. No price predictions and no investment advice. Neutral, factual tone.',
  'Return JSON:',
  '- headline: one sentence, max 22 words, stating that BTC is up, down or flat over 24h with its price and percent change.',
  '- top_stories: exactly 3 items, the most market-moving stories for Bitcoin and crypto today, chosen by id from the list; they must be 3 DIFFERENT events (never two headlines about the same event). Prefer market, macro, regulation and flows over routine listings. why_it_matters: one sentence each.',
  '- why: exactly 3 sentences that explain the likely reasons for the 24h move, each grounded in the chosen stories, Fear & Greed or market context. If the headlines do not explain the move, say so plainly.',
].join('\\n');
const S = { type: 'string' };
const format = { type: 'object', required: ['headline', 'top_stories', 'why'], properties: {
  headline: S,
  top_stories: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'object', required: ['id', 'why_it_matters'], properties: { id: { type: 'integer' }, why_it_matters: S } } },
  why: { type: 'array', minItems: 3, maxItems: 3, items: S } } };
const body = { model: '${cfg.model}', stream: false, think: false, format, options: { temperature: 0.2, num_ctx: 8192 },
  messages: [{ role: 'system', content: system }, { role: 'user', content: 'Data (' + s.taken_at + '):\\n' + JSON.stringify(data) }] };
return [{ json: { snapshot: s, body } }];`);

const gemma = post("Gemma brief", [2960, 340], `${OLLAMA}/api/chat`, 300000);

const compose = code("Compose email", [3180, 340], `
const s = $('Build prompt').first().json.snapshot;
const g = $input.first().json;
let out = null;
try { const raw = (g && g.message && g.message.content || '').replace(/<think>[\\s\\S]*?<\\/think>/g, ''); const m = raw.match(/\\{[\\s\\S]*\\}/); out = m ? JSON.parse(m[0]) : null; } catch {}
if (!out) s.failed_sources.push('Gemma (Ollama)');

// Validate the model's picks: ids must exist and be unique; fill gaps with the strongest non-neutral FinBERT headlines.
const byId = new Map(s.news.map(h => [h.id, h]));
// Two headlines about one event (same story, different outlet) count as one: >= 2 shared distinctive words.
const GENERIC = new Set(['bitcoin', 'crypto', 'market', 'markets', 'price', 'prices', 'shares', 'stock', 'stocks', 'says', 'after', 'amid', 'with', 'from', 'this', 'that', 'will', 'over', 'into', 'than', 'what', 'their', 'federal', 'reserve', 'board', 'announces', 'issues', 'adds', 'plans', 'billion', 'million', 'week', 'today']);
const words = (t) => new Set(t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter(w => w.length > 3 && !GENERIC.has(w)));
const same = (a, b) => { const x = words(a.title), y = words(b.title); let i = 0; x.forEach(w => { if (y.has(w)) i++; }); return i >= 2; };
const taken = (h) => picks.some(p => p.h === h || same(p.h, h));
const picks = [];
for (const t of (out && Array.isArray(out.top_stories) ? out.top_stories : [])) {
  const h = byId.get(Number(t.id)); if (h && !taken(h)) picks.push({ h, why: String(t.why_it_matters || '') });
}
const backup = [...s.news].sort((a, b) => (b.sentiment !== 'neutral') - (a.sentiment !== 'neutral') || (b.sentiment_score || 0) - (a.sentiment_score || 0));
for (const h of backup) { if (picks.length >= 3) break; if (!taken(h)) picks.push({ h, why: '' }); }
const why = out && Array.isArray(out.why) ? out.why.slice(0, 3).map(String) : [];

const tz = '${cfg.timezone}';
const when = new Date(s.taken_at).toLocaleString('en-US', { timeZone: tz, day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
const b = s.btc;
const fmt = (n, d = 2) => n == null ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const pct = (n) => n == null ? '—' : (n > 0 ? '+' : '') + n.toFixed(2) + '%';
const apct = (n) => n == null ? '—' : Math.abs(n).toFixed(2) + '%';
const arrow = !b ? '' : b.direction === 'up' ? '▲' : b.direction === 'down' ? '▼' : '►';
const tone = !b ? '#475569' : b.direction === 'up' ? '#047857' : b.direction === 'down' ? '#b91c1c' : '#475569';
const word = !b ? 'unavailable' : b.direction === 'up' ? 'UP' : b.direction === 'down' ? 'DOWN' : 'FLAT';
const subject = '${cfg.subjectPrefix} BTC ' + (b ? '$' + fmt(b.price, 0) + ' ' + arrow + ' ' + apct(b.change_pct) + ' (24h)' : 'price unavailable') + ' · ' + when;
const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const badgeColor = { positive: '#047857', negative: '#b91c1c', neutral: '#64748b' };
const ago = (d) => { const m = Math.round((Date.now() - new Date(d)) / 60000); return isNaN(m) ? '' : m < 60 ? m + ' min ago' : Math.round(m / 60) + ' h ago'; };

// Sparkline of the 24 hourly closes (inline SVG is stripped by Gmail, so bars are drawn with table cells).
const spark = b ? (() => { const c = b.candles_close, lo = Math.min(...c), hi = Math.max(...c), r = hi - lo || 1;
  return '<table role="presentation" cellpadding="0" cellspacing="1" style="margin-top:10px"><tr valign="bottom">' + c.map(v => '<td style="width:8px;background:' + tone + ';opacity:.8;height:' + Math.round(4 + (v - lo) / r * 32) + 'px;font-size:0;line-height:0">&nbsp;</td>').join('') + '</tr></table>'; })() : '';
const label = (t) => '<div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;font-weight:600;margin:0 0 8px">' + t + '</div>';
const section = (inner) => '<tr><td style="padding:20px 28px;border-top:1px solid #e2e8f0">' + inner + '</td></tr>';

const html = '<div style="background:#f1f5f9;padding:24px 0;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#0f172a">'
 + '<table role="presentation" align="center" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden">'
 + '<tr><td style="background:#0f172a;color:#ffffff;padding:18px 28px"><span style="font-size:20px;font-weight:700;letter-spacing:.02em">Markt</span><span style="color:#94a3b8;font-size:13px"> &nbsp;·&nbsp; Bitcoin brief &nbsp;·&nbsp; ' + esc(when) + '</span></td></tr>'
 + '<tr><td style="padding:24px 28px 20px">' + label('Bitcoin · 24 hours')
 +   '<div style="font-size:34px;font-weight:700;line-height:1.1">$' + fmt(b && b.price) + '</div>'
 +   '<div style="font-size:16px;font-weight:600;color:' + tone + ';margin-top:4px">' + arrow + ' ' + word + ' ' + apct(b && b.change_pct) + (b ? ' &nbsp;(' + (b.change_usd < 0 ? '−' : '+') + '$' + fmt(Math.abs(b.change_usd), 0) + ')' : '') + '</div>'
 +   '<div style="font-size:13px;color:#475569;margin-top:6px">24h range $' + fmt(b && b.low_24h, 0) + ' – $' + fmt(b && b.high_24h, 0) + ' &nbsp;·&nbsp; volume $' + fmt(b && b.volume_musd, 0) + 'M'
 +   (s.fear_greed ? ' &nbsp;·&nbsp; Fear &amp; Greed <b>' + s.fear_greed.value + '</b> (' + esc(s.fear_greed.label) + ')' : '') + '</div>' + spark
 +   (out && out.headline ? '<p style="font-size:15px;margin:16px 0 0;line-height:1.5"><b>' + esc(out.headline) + '</b></p>' : '') + '</td></tr>'
 + section(label('Top 3 stories today') + picks.map((p, i) => '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:' + (i ? '14px' : '0') + ' 0 0"><tr>'
     + '<td valign="top" style="width:28px;font-size:18px;font-weight:700;color:#94a3b8">' + (i + 1) + '</td><td>'
     + '<a href="' + esc(p.h.link) + '" style="color:#0f172a;font-weight:600;font-size:15px;text-decoration:none">' + esc(p.h.title) + '</a>'
     + '<div style="font-size:12px;color:#64748b;margin-top:3px">' + esc(p.h.source) + (p.h.published ? ' · ' + ago(p.h.published) : '')
     + (p.h.sentiment ? ' · <span style="color:' + badgeColor[p.h.sentiment] + ';font-weight:600">FinBERT ' + p.h.sentiment + '</span>' : '') + '</div>'
     + (p.why ? '<div style="font-size:14px;color:#334155;margin-top:4px;line-height:1.5">' + esc(p.why) + '</div>' : '') + '</td></tr></table>').join(''))
 + (why.length ? section(label('Why it moved') + '<p style="font-size:15px;line-height:1.6;margin:0;color:#1e293b">' + why.map(esc).join(' ') + '</p>') : '')
 + (s.markets.length ? section(label('Market context (last close)') + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' + s.markets.map(m =>
     '<td style="font-size:13px;color:#475569">' + esc(m.name) + '<br><b style="font-size:15px;color:#0f172a">' + fmt(m.last) + '</b> <span style="color:' + (m.change_pct >= 0 ? '#047857' : '#b91c1c') + '">' + pct(m.change_pct) + '</span></td>').join('') + '</tr></table>') : '')
 + '<tr><td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;line-height:1.6">'
 +   'Prices: Binance 1h candles. News: Binance, CoinTelegraph, CoinDesk, Decrypt, Federal Reserve (' + s.news.length + ' headlines, last ${cfg.maxHeadlineAgeHours} h). '
 +   (s.sentiment ? 'FinBERT: ' + s.sentiment.counts.positive + ' positive · ' + s.sentiment.counts.neutral + ' neutral · ' + s.sentiment.counts.negative + ' negative. ' : '')
 +   'Summary written by Gemma 4 E4B running locally.' + (s.failed_sources.length ? ' Unavailable this run: ' + esc(s.failed_sources.join(', ')) + '.' : '')
 +   '<br>Automated summary of public data. Not financial advice.</td></tr></table></div>';

const markdown = '**' + (out && out.headline || subject) + '**\\n\\n## Top 3 stories\\n'
  + picks.map((p, i) => (i + 1) + '. [' + p.h.title + '](' + p.h.link + ') — ' + p.h.source + (p.h.sentiment ? ' · FinBERT ' + p.h.sentiment : '') + (p.why ? '\\n   ' + p.why : '')).join('\\n')
  + '\\n\\n## Why it moved\\n' + (why.join(' ') || '_unavailable_') + '\\n\\n---\\nUnavailable sources: ' + (s.failed_sources.join(', ') || 'none');
const stamp = new Date(s.taken_at).toISOString().slice(0, 16).replace(/:/g, '');
return [{ json: { to: '${cfg.to}', subject, html, markdown, snapshot: { ...s, brief: out, top3: picks.map(p => ({ id: p.h.id, why: p.why })) }, stamp } }];`);

const send = node({
  name: "Send email (Gmail)", type: "n8n-nodes-base.gmail", typeVersion: 2.1, position: [3400, 340], credentials: GMAIL, ...SOFT,
  parameters: { resource: "message", operation: "send", sendTo: "={{ $json.to }}", subject: "={{ $json.subject }}", emailType: "html", message: "={{ $json.html }}", options: { appendAttribution: false } },
});

const pack = code("Prepare archive", [3620, 340], `
const c = $('Compose email').first().json;
const sent = $input.first().json;
const emailed = !!(sent && sent.id && !sent.error);
const email_error = sent && sent.error ? String(sent.error.message || sent.error).slice(0, 300) : null;
return [{ json: { emailed, body: { stamp: c.stamp, subject: c.subject, markdown: c.markdown, snapshot: c.snapshot, meta: { emailed, email_error, gmail_id: sent.id || null, model: '${cfg.model}', trigger: $('Start').first().json.trigger } } } }];`);
const archive = post("Archive brief", [3840, 340], `${SERVICE}/archive`, 20000);
const result = code("Result", [4060, 340], `
const p = $('Prepare archive').first().json;
const a = $input.first().json;
const s = p.body.snapshot;
return [{ json: { ok: true, subject: p.body.subject, emailed: p.emailed, email_error: p.body.meta.email_error, archived: a.path || null,
  headlines: s.news.length, top3: (s.top3 || []).map(t => s.news.find(h => h.id === t.id).title), why: s.brief && s.brief.why, failed_sources: s.failed_sources } }];`);

chain(start, ...SRC, snapshot, finbert, prompt, gemma, compose, send, pack, archive, result);

const wf = { id: ID, name: NAME, nodes, connections, active: false, settings: { executionOrder: "v1", timezone: cfg.timezone }, pinData: {} };
fs.mkdirSync(path.join(root, "workflows"), { recursive: true });
fs.rmSync(path.join(root, "workflows", "market-pulse.json"), { force: true });
fs.writeFileSync(path.join(root, "workflows", "markt.json"), JSON.stringify(wf, null, 2));
console.log(`workflows/markt.json — ${nodes.length} nodes`);
