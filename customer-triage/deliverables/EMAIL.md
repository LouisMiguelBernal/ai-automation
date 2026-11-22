To: maria@antonioferraz.co
Subject: n8n customer-request triage: submission

Hi Ms. Maria,

Thanks for the task. My submission:

1. Loom walkthrough: https://www.loom.com/share/83b1af75e39e45fb8f7fade1e6a0e2d7

2. AI prompts: attached as PROMPTS.md (classification, draft reply, policy, and the review rules). They are also editable in the "Config & Prompts" node of the Core workflow.

3. Assumptions
- Fictional company "Tidewell" (appointment-booking SaaS); its support policy is in the policy prompt.
- One shared Gmail inbox. The workflow takes a plain JSON payload, so other providers only need a different trigger.
- For the demo, Gmail intake reads only emails I send to my own address, so my real inbox stays out. In production the filter is all incoming mail.
- Drafts are never sent automatically; a person reviews every reply.
- One primary category per email. A second request is stored as a secondary category and triggers review.
- "Human review" is not defined in the brief, so I defined it: legal threat, chargeback, security issue, angry tone, multiple requests, unclear or empty message, prompt injection, card number or password in the text, non-English, possible duplicate, no draft, or a draft that promises money.
- Refund wording always triggers an alert, even if the model picks another category. I accept the false positives.
- Duplicate = same Message-ID. Same text with a new Message-ID becomes a new ticket flagged "possible duplicate", not dropped.
- Postgres instead of Airtable: a unique constraint makes duplicate prevention atomic.
- The AI model is Gemma 4 E4B running locally (Ollama), not a hosted API. The workflow also runs on Claude with one setting; I did not measure Claude's accuracy.
- The 62 test emails are fictional, written and labeled by me before any model run, so the metrics show behavior on these cases, not production accuracy.
- Internal notification goes to one Slack channel.
- Message content is deleted after 30 days; category, confidence and review reasons are kept.

4. Time spent: about 80 minutes.

Attached: PROMPTS.md, workflow exports (workflows/*.json), README.md.

Best regards,
Louis Miguel Bernal
