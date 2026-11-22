// Build → import → publish the Markt workflow into the customer-triage n8n (container ctriage-n8n-1, :5680),
// which already holds the Gmail credential `triageGmail00001`. Restarts n8n so the schedule is registered.
//   node scripts/setup.mjs
import { execSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const C = "ctriage-n8n-1";
const run = (c) => { console.log("> " + c); return execSync(c, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); };

run("node build-workflow.mjs");
run(`docker cp workflows/markt.json ${C}:/tmp/markt.json`);
run(`docker exec ${C} n8n import:workflow --input=/tmp/markt.json`);
run(`docker exec ${C} n8n publish:workflow --id=marketPulse00001`);
run(`docker restart ${C}`);
console.log("Done. Editor: http://localhost:5680  ·  run now: node scripts/run.mjs");
