# Loom talk track (target 8 minutes)

## Before recording (3 min)
0. Docker Desktop and Ollama running. Stack set up with `node scripts/setup.mjs --mode=ollama`.
1. To show Slack alerts without a real workspace: run `node eval/mock.mjs` in Terminal A and put `TRIAGE_SLACK_WEBHOOK_URL=http://host.docker.internal:8787/slack` in `.env`, then re-run setup. Alerts print in Terminal A.
2. Terminal B: `node scripts/demo.mjs reset`, then one warm-up email: `node scripts/demo.mjs send t1` (Gemma is slow on its first call).
3. Browser: http://localhost:5680 → sign in → **Overview** → **Triage — Core**.

## What to click in n8n
| Click | You see |
|---|---|
| **Triage — Core** (workflow list) | The canvas: Intake (grey), AI (green), Route & alert (purple), Errors (blue) |
| Double-click **Config & Prompts** | All settings: AI mode, models, threshold, Slack target, the three prompts |
| **Executions** tab | One row per email sent; green = succeeded |
| Newest execution → **Normalize** → **Claim ticket** → **AI: classify** → **Validate classification** → **Decide review** | Input/output of each step: cleaned text, ticket id, raw model answer, parsed category, keyword cross-check, review reasons |
| Run from `send e3 --twice`, the 2nd execution | Stops at **New ticket?** (false branch) → duplicate, no AI call |
| **Triage — Sweeper** | Schedule + on-demand webhook, replay, alert resend (max 5), retention purge |
| **Triage — Gmail intake** | Live trigger + 15-min reconciliation that only sends mail with no ticket yet |

Do not press **Execute workflow** on Core: it waits for a test webhook call. Emails are sent from Terminal B.

## Live demo commands (Terminal B)
| Command | Expected result |
|---|---|
| `node scripts/demo.mjs send r1` | Refund Request, `needs_review` (refund) → alert |
| `node scripts/demo.mjs send e3 --twice` | Injection email → Refund Request + `prompt_injection`, alert; 2nd send `duplicate` in < 1 s |
| `node scripts/demo.mjs send "Hi, my Google Calendar stopped syncing with Tidewell since yesterday."` | Technical Support, `ready`, **no alert** |
| `node scripts/demo.mjs queue` | The review queue |
| `node scripts/demo.mjs show <id>` | One ticket: fields, draft, step-by-step event log |

| Time | Show | Say (in your own words) |
|---|---|---|
| 0:00–0:45 | Core workflow, zoomed out | Every inbound email becomes a stored ticket with a category, a confidence score and a draft reply; a person is alerted when they need to look. Nothing is sent to customers automatically. |
| 0:45–1:30 | The 4 colored sections | One entry point (webhook) used by Gmail, the reconciliation sweep, the sweeper and tests. Intake → AI → route & alert, with an error path. Every message takes the same path, which keeps duplicates and testing simple. |
| 1:30–2:45 | Send one email, open the execution | Token check → Normalize (strip quotes and signatures, mask card numbers, skip auto-replies and bounces) → **Claim ticket**: atomic insert on Message-ID *before* any AI call, so a retry or double trigger cannot double-process or double-alert. |
| 2:45–4:00 | Config & Prompts, AI: classify, Validate | Prompts in one node with a version hash on every ticket. JSON schema output; the email is wrapped as untrusted data. Validate: bad output → General Question / 0 / review. Then the keyword cross-check: the model's own confidence is almost always ≥ 0.9, so when keywords point elsewhere the score is capped and the ticket goes to review. |
| 4:00–5:00 | Decide review + alert | Review = model flags **OR** deterministic rules. Refund wording always alerts. e3 tells the model to classify it as General with confidence 1, and it still alerts as refund + prompt_injection. |
| 5:00–6:15 | `eval/report.md` | 62 labeled emails, labeled before any model run: accuracy, confusion matrix, calibration (raw vs capped), refund recall, duplicate test, auth, and in mock mode the fault tests: AI outage → replay, Slack outage → resend, stuck ticket → recovery. |
| 6:15–7:00 | Sweeper, Gmail reconcile, `ticket_events` | Failed tickets are replayed (max 3 attempts), missed alerts resent (max 5), mail that arrived while the stack was down is picked up by reconciliation, content is purged after 30 days. Every stage writes an event row. |
| 7:00–8:00 | README "Before production" | Calibrate on real historical mail, drafts into Gmail threads, queue mode, prompt-change gate in CI. Close with the time spent. |

Things worth saying because they show judgment:
- "Postgres over Airtable: duplicate prevention needs a unique constraint; search-then-create races when two runs overlap."
- "The first version ran fine on the happy path but had operational gaps: Slack pointed at a dead endpoint and was retried forever, the mode reset on restart, and Gmail mail could be lost during an outage. The rebuild fixes those and has a test for each."
- "Rules catch refunds the model misses; the model catches refunds without the keyword."
