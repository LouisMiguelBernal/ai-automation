# Markt

A Bitcoin brief that lands in your inbox every 4 hours. It answers three questions: is BTC up or down, what are today's 3 biggest stories, and why did it move. Built with n8n, local AI (FinBERT + Gemma 4 E4B) and free public APIs.

```
Schedule (4 h) ─┐
Webhook (now) ──┴─► Binance 1h candles ► Fear & Greed ► Yahoo (S&P, Nasdaq, gold)
                    ► News: Binance · CoinTelegraph · CoinDesk · Decrypt · Federal Reserve
                    ► FinBERT labels every headline (local GPU)
                    ► Gemma 4 E4B picks the top 3 and writes "why it moved" (local, JSON schema)
                    ► Gmail HTML brief ► JSON/MD archive
```

**The email:**
- Subject: `[Markt] BTC $70,959 ▼ 3.74% (24h) · Nov 13, 2026, 9:21 AM`
- Price block: price, ▲/▼ with the 24h move, 24h range, volume, Fear & Greed, and a 24-hour sparkline
- **Top 3 stories:** link, source, age, FinBERT label, and one sentence on why each matters
- **Why it moved:** exactly 3 sentences, grounded in the stories and data
- Market context (S&P 500, Nasdaq, gold), plus a footer with sources, counts and any missing source

**Guardrails:**
- Every number comes from the APIs, never from the model.
- The model's picks are checked: ids must exist, and two outlets covering the same event count once.
- A dead source, or a FinBERT or Gemma failure, degrades the brief instead of stopping it.

Not financial advice: this is a summary of public data only, and it places no orders.

## Run
```bash
powershell -ExecutionPolicy Bypass -File scripts\start-service.ps1
```
```bash
node scripts/setup.mjs
```
```bash
node scripts/run.mjs
```
Needs Docker (n8n), Ollama with `gemma4:e4b`, Python 3 with `torch`, `transformers`, `fastapi` and `uvicorn`, and a Gmail OAuth credential in n8n.
