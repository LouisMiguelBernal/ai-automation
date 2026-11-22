# Reply to Mario Moosbauer (Growald Agency): Markt

Mario asks for ONE automation running today: **what it replaced, tools + code, result in time/money, link or demo**.
This file has (A) a 2-minute video script that answers those questions in order, and (B) the email reply.
Workflow click-by-click is in `LOOM-TALK-TRACK.md`. This script is about the *answers*, not the canvas.

Facts below are measured (markt/STATS.md, digests/). Lines marked **[fill in]** need your own number.

---

## A. Video script (~2:00)

| Time | Show | Say |
|---|---|---|
| 0:00–0:15 | Gmail: the latest `[Markt] BTC …` email, open | "Hi Mario, Louis here. You asked for one automation I built that's running today. This is it: Markt. Every 4 hours it emails me a Bitcoin brief like this one. Nobody touches it." |
| 0:15–0:40 | Scroll the email: price ▲/▼, top 3, "Why it moved" | **What it replaced:** "Before, I did this by hand: open Binance for the price, check Fear & Greed, then read CoinTelegraph, CoinDesk, Decrypt, Binance announcements and the Fed, decide which stories actually matter, and work out why the price moved. Several times a day. Now that routine runs on its own and lands here." |
| 0:40–1:10 | n8n canvas, zoomed out (4 sections) | **Tools and code:** "It runs on n8n in Docker. Binance candles and seven free sources come in, 33 headlines on the last run. FinBERT, a finance model on my own GPU in a small Python FastAPI service, labels each headline positive, neutral or negative. Gemma 4, running locally through Ollama, picks the 3 biggest stories and writes 3 sentences on why. Then Gmail sends it and every run is archived as JSON." |
| 1:10–1:35 | Compose email node (code) or Executions tab | **How I turned the know-how into rules** (this is the part that matches your role): "The judgment I used to apply by hand is now code. Numbers come only from the APIs, never from the model, so it can't misquote a price. The model must answer in a fixed JSON schema. Two outlets covering the same event count once. That rule came from a real run where it picked the same story twice. And if a source is down, the brief still goes out and says which one." |
| 1:35–1:55 | Executions tab (green runs) + `digests/` folder | **Result:** "Each run takes 15 to 50 seconds. It costs zero per run: free keyless APIs, models on my machine, no per-token bill. It replaced about **[fill in: X min]** of checking, **[fill in: N]** times a day, roughly **[fill in: hours]** a week. And the briefs are consistent and auditable, because every run is saved." |
| 1:55–2:10 | 1nonly.me/markt | "The case study and a short film are at 1nonly.me/markt. The same approach is what I'd do with your Ads manager or support lead: sit with them, write down how they decide, encode the numbers and rules in code, and let the model only do the reading and writing. My CV is attached. Thanks, Mario." |

Delivery notes:
- Say the four answers in his order: replaced → tools/code → result → link. He'll be listening for them.
- Show one real email first; the canvas second. The result matters more to him than the diagram.
- Don't read the table. Glance at it, then talk.
- Before recording: do one warm-up run (`node scripts/run.mjs`) so a fresh email is in the inbox and Gemma is loaded.

---

## B. Email reply

**Subject:** Re: AI automation role · Markt, an automation running today

Hi Mario,

Thanks for reaching out. Growald and Natureich sound like the right kind of work for me: taking an expert's routine and making it run on its own.

**The automation: Markt**, a Bitcoin market brief that writes and sends itself every 4 hours.

- **What it replaced:** my manual routine of checking the BTC price, the Fear & Greed index and five news sources (CoinTelegraph, CoinDesk, Decrypt, Binance announcements, Federal Reserve), picking the stories that matter, and working out why the price moved. I did this several times a day.
- **Tools and code:** n8n (24 nodes, Docker) for orchestration; Binance candlestick API plus 7 free sources; FinBERT on my GPU via a Python FastAPI service for headline sentiment; Gemma 4 E4B, running locally through Ollama, to pick the top 3 stories and write a 3-sentence "why", constrained to a JSON schema; Gmail for delivery; every run archived as JSON/Markdown.
- **How the know-how became rules:** prices come only from the APIs, never from the model; one news event counts once even if several outlets cover it; failed sources are named in the brief instead of stopping it. These rules came from mistakes I caught in real runs.
- **Result:** each brief takes 15–50 seconds and costs $0 per run (local models, keyless APIs). It replaces about **[fill in]** hours a week of manual checking, with a consistent, archived output every time.

**Demo:** [Loom link], plus the case study and film at https://1nonly.me/markt

That is the same process I'd bring to your team: sit with the Ads manager or support lead, write down how they decide, put the numbers and rules in code, and use the model only where judgment on text is needed.

My CV is attached. Happy to walk through the code on a call.

Best regards,
Louis Miguel Bernal
https://1nonly.me

---

## Before sending
- [ ] Replace every **[fill in]** with your real numbers (minutes per check × checks per day). Keep them honest; he may ask.
- [ ] Record the video and paste the Loom link.
- [ ] Attach the latest CV.
- [ ] Optional line if you want a second example: Synch (customer-email triage, n8n + Gemma) maps directly to his "support lead" use case. He asked for ONE, so keep it to one sentence or leave it out.
