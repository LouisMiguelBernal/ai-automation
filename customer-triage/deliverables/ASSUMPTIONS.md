# Assumptions

**Business**
1. The company is a fictional SaaS ("Tidewell", appointment booking for clinics and salons). Its support policy is in `prompts/policy.md`. With a real client, I would use their actual policy and macros.
2. The shared inbox is one Gmail / Google Workspace mailbox. Other providers would need a different trigger node; the rest of the workflow takes a plain JSON payload.
3. Drafts are **never sent automatically**. A person reviews every reply. The automation decides who has to look first, not what goes out.
4. Each email gets **one primary category**. When an email contains two requests, the second one is stored as `secondary_category` and triggers review.
5. "Requires human review" is not defined in the brief, so I defined it: legal threat, chargeback, security or account takeover, angry tone, multiple requests, unclear or empty message, prompt injection, sensitive data, non-English, possible duplicate, a missing draft, or a draft that promises money. The full list is in `PROMPTS.md` §4.
6. Refund alerts must have close to 100% recall, so refund wording triggers an alert even when the model chose another category. I accept the false positives this causes (for example, "what is your refund policy?" from a prospect).
7. The internal notification goes to one Slack channel (live in the demo). Without a Slack webhook, the `review_queue` view is the alert list. Routing by category to different channels or people is a later step.

**Technical**
8. "Duplicate" means the same RFC 5322 `Message-ID`, which is how Gmail sync, retries and replays repeat a message. The same text resent with a new Message-ID becomes a new ticket flagged `possible_duplicate`: it is not dropped, because it could be a real follow-up.
9. Replies inside an existing thread become new tickets linked to the earlier one (`prior_ticket_id`), not merged into it.
10. Auto-replies, bounces, bulk or list mail and our own outgoing mail are stored as `skipped`, without any AI call.
11. The model's confidence score is treated as a signal, not a probability. The local model reports ≥ 0.9 on almost every email, so a keyword cross-check caps confidence at 0.6 when strong keywords point only to other categories. The 80% threshold comes from the brief; the eval report's calibration table shows both the raw and the capped score.
12. Postgres replaces Airtable. A unique constraint makes duplicate prevention atomic, which Airtable's search-then-create cannot guarantee when two triggers fire at once.
13. Model: the demo and eval run on local `gemma4:e4b` through Ollama (free, offline). The workflow also runs on the Claude API (`claude-opus-5-5`, classify at low effort): `TRIAGE_AI_MODE=anthropic` plus an API key. Any model change should only ship after the eval shows no quality loss.
14. Volume is small to moderate (hundreds of emails a day). A single n8n instance is enough; higher volume would need n8n queue mode.
15. The labeled test corpus (62 emails) was written for this exercise and labeled before any model run. It is not real customer data, so the metrics show the behavior on these cases, not production accuracy.
16. Message content (sender, subject, body, draft) is kept for 30 days, then purged; category, confidence and review reasons are kept for statistics.
