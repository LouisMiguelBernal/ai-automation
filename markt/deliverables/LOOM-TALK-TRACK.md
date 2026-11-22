# Markt — Loom talk track (target 4–5 minutes)

## Before recording (2 min)
1. Docker Desktop running; `ctriage` stack up (`docker compose up -d` in `customer-triage/`); Ollama running.
2. FinBERT service: `powershell -ExecutionPolicy Bypass -File scripts\start-service.ps1` (check http://127.0.0.1:8791/health shows `"device":"cuda"`).
3. Warm-up so Gemma is loaded (first call ~70 s, then ~15–20 s): `node scripts/run.mjs`. This sends one email.
4. Browser tab 1: http://localhost:5680/workflow/marketPulse00001 (sign in). Tab 2: Gmail inbox. Close tabs that show keys or `.env`.

## How to run it on camera
| Click | What happens |
|---|---|
| **Execute workflow** button (bottom centre of the canvas). It starts from **Click to run**; no choice needed | Runs the whole pipeline now. Nodes turn green one by one, left to right. Takes ~15–25 s and sends a real email |
| *or* hover **Every 4 hours** node → its ▶ play button | Same thing |
| Click any green node → **Output** panel | The data at that step (raw API response, parsed snapshot, FinBERT labels, Gemma JSON, final HTML) |
| **Executions** tab (top) | Every past run, scheduled ones included; green = success |

Do **not** pick **API call (webhook, scripts only)** in the editor: it only waits for an outside call. The terminal alternative is `node scripts/run.mjs`.

Does it run by itself? Yes. The workflow is **published**, so the schedule fires every 4 hours (Asia/Manila timezone) as long as Docker, n8n, Ollama and the FinBERT service are running. Each scheduled run shows up in **Executions** and sends an email.

## Talk track
| Time | Show | Say (in your own words) |
|---|---|---|
| 0:00–0:30 | Canvas zoomed out, 4 coloured sections | "Markt is a Bitcoin brief that writes itself every 4 hours: is BTC up or down, the 3 biggest stories today, and 3 sentences on why. All the AI runs locally." |
| 0:30–1:30 | Section 2, the 8 source nodes | "Binance 1h candles give the price and 24h move. Then Fear & Greed, Yahoo for S&P/Nasdaq/gold, and five news feeds: the same sources my Nexus trading app uses. No API keys. Each call retries once; if a source is down, the brief still goes out and names it." |
| 1:30–2:00 | Click **Execute workflow** | Let the nodes turn green while you talk |
| 2:00–2:45 | Open **FinBERT sentiment** output, then **Gemma brief** output | "FinBERT, a finance-tuned BERT on my GPU, labels every headline positive/neutral/negative. Gemma 4 gets only the numbers and numbered headlines and must answer in a JSON schema: a headline, 3 story ids, and exactly 3 'why' sentences." |
| 2:45–3:15 | **Compose email** code | "Numbers in the email come from Binance, never from the model. The model's picks are validated: ids must exist, and two outlets covering the same event count once. I found that in a real run and fixed it." |
| 3:15–4:15 | Gmail: open the new email | Walk through: price block ▲/▼, sparkline, top 3 with FinBERT badges, "Why it moved", market context, sources footer |
| 4:15–4:45 | **Executions** tab + `digests/` folder | "Every run is archived as JSON and Markdown, so the history is auditable. It replaced me checking charts, news sites and sentiment by hand several times a day." |

Things worth saying because they show judgment:
- "Words from the model, numbers from code: the model can't misquote a price."
- "A small local model ignored free-form formatting, so I gave it a JSON schema and render the email myself."
- "It's hosted next to my customer-triage system and shares its Gmail credential; the triage inbox filter excludes these briefs so they never become support tickets."
