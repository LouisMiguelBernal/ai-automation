# CampusLink — concept

Interview concept for 806 Technologies (UX/UI Designer). A multilingual campus–family portal where every check-in, signature and survey becomes Title I evidence. All data is fictional; not an 806 product.

## Run
```bash
npm install
npm run dev -- --port 3040
```
| Route | View |
|---|---|
| `/` | Concept overview: problem, flow, law, business model, risks |
| `/parent` | Parent app (mobile; phone frame on desktop). EN/ES working |
| `/campus` | Teacher workspace: translated inbox, events + QR, conferences |
| `/district` | Director dashboard: status by campus, evidence feed, languages |

## Figma
No direct Figma connection from this machine, so the handoff is two files:
1. **Tokens:** import `figma/tokens.json` with the *Tokens Studio* plugin (or create Variables from it by hand: colors, radius, spacing).
2. **Screens:** install the *html.to.design* plugin + its Chrome extension, open each route at 1440 px and at 390 px, import → editable Figma layers. Then build components (Button, StatusChip, Card, Tab bar) from the imported layers and add a user-flow page.

## Design decisions
- Brand colors sampled from 806technologies.com; Figtree replaces licensed Soleil. Square corners to match 806.
- Green CTA uses navy text — white on `#8AC343` fails WCAG AA.
- Status = color **+ icon + label**, never color alone.
- 44 px minimum tap targets; visible focus ring; reduced-motion respected.
- Sky blue is background-only (fails AA as text).

## Source for the law
20 U.S.C. § 6318(a)(3) — https://www.law.cornell.edu/uscode/text/20/6318
