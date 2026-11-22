// Trigger one Markt run now and print the result (takes ~1-2 min: 9 sources + FinBERT + Gemma + Gmail).
//   node scripts/run.mjs
import { execSync } from "node:child_process";

const token = execSync("docker exec ctriage-n8n-1 printenv TRIAGE_WEBHOOK_TOKEN", { encoding: "utf8" }).trim();
const t0 = Date.now();
const res = await fetch("http://localhost:5680/webhook/markt", { method: "POST", headers: { "x-markt-token": token } });
console.log(`HTTP ${res.status} in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
console.log(await res.text());
