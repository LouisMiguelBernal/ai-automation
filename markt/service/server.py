"""Markt helper service (localhost only).

POST /sentiment  {"texts": [...]}                -> FinBERT label + scores per text
POST /archive    {"stamp", "subject", "markdown", "snapshot", ...} -> writes digests/<stamp>.json and .md
GET  /health
GET  /                     -> local Markt app (service/app/index.html)
GET  /api/runs             -> recent runs (stamp, subject, price, change)
GET  /api/runs/<stamp>     -> one archived run
POST /api/run              -> trigger the n8n workflow now (needs header X-Markt-App: 1)

Run: python service/server.py   (binds 127.0.0.1:8791; n8n reaches it via host.docker.internal)
"""
import json
import os
import re
import subprocess
import threading
import time
import urllib.error
import urllib.request
from pathlib import Path

import torch
import uvicorn
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from transformers import pipeline

ROOT = Path(__file__).resolve().parent.parent
DIGESTS = ROOT / "digests"
APP_HTML = Path(__file__).resolve().parent / "app" / "index.html"
N8N_CONTAINER = "ctriage-n8n-1"
WEBHOOK = "http://localhost:5680/webhook/markt"
STAMP_RE = re.compile(r"[0-9T_-]{8,20}")
run_lock = threading.Lock()
MODEL = "ProsusAI/finbert"
PORT = int(os.environ.get("PULSE_PORT", "8791"))

device = 0 if torch.cuda.is_available() else -1
clf = pipeline("text-classification", model=MODEL, top_k=None, device=device, truncation=True, max_length=256)
app = FastAPI(title="markt")


class SentimentIn(BaseModel):
    texts: list[str]


class ArchiveIn(BaseModel):
    stamp: str
    subject: str
    markdown: str
    snapshot: dict
    meta: dict = {}


@app.get("/health")
def health():
    return {"ok": True, "model": MODEL, "device": "cuda" if device == 0 else "cpu"}


@app.post("/sentiment")
def sentiment(body: SentimentIn):
    texts = [t.strip()[:500] for t in body.texts if t and t.strip()][:100]
    if not texts:
        return {"model": MODEL, "results": []}
    out = clf(texts, batch_size=16)
    results = []
    for text, scores in zip(texts, out):
        s = {d["label"].lower(): round(float(d["score"]), 4) for d in scores}
        label = max(s, key=s.get)
        results.append({"text": text, "label": label, "score": s[label], "scores": s})
    return {"model": MODEL, "results": results}


@app.post("/archive")
def archive(body: ArchiveIn):
    if not re.fullmatch(r"[0-9T_-]{8,20}", body.stamp):
        raise HTTPException(400, "bad stamp")
    DIGESTS.mkdir(exist_ok=True)
    (DIGESTS / f"{body.stamp}.json").write_text(json.dumps(body.model_dump(), indent=2, ensure_ascii=False), encoding="utf-8")
    (DIGESTS / f"{body.stamp}.md").write_text(f"# {body.subject}\n\n{body.markdown}\n", encoding="utf-8")
    return {"ok": True, "path": f"digests/{body.stamp}.json"}


@app.get("/")
def app_page():
    return FileResponse(APP_HTML, media_type="text/html")


def _summary(stamp: str):
    try:
        d = json.loads((DIGESTS / f"{stamp}.json").read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None
    btc = d.get("snapshot", {}).get("btc", {})
    return {"stamp": stamp, "subject": d.get("subject"), "price": btc.get("price"), "change_pct": btc.get("change_pct"),
            "direction": btc.get("direction"), "taken_at": d.get("snapshot", {}).get("taken_at"),
            "trigger": d.get("meta", {}).get("trigger"), "emailed": d.get("meta", {}).get("emailed")}


@app.get("/api/runs")
def runs():
    stamps = sorted((f.stem for f in DIGESTS.glob("*.json") if STAMP_RE.fullmatch(f.stem)), reverse=True)[:50]
    return [s for s in (_summary(x) for x in stamps) if s]


@app.get("/api/runs/{stamp}")
def run_detail(stamp: str):
    if not STAMP_RE.fullmatch(stamp) or not (DIGESTS / f"{stamp}.json").exists():
        raise HTTPException(404, "not found")
    return json.loads((DIGESTS / f"{stamp}.json").read_text(encoding="utf-8"))


@app.post("/api/run")
def run_now(x_markt_app: str = Header(default="")):
    # Custom header forces a CORS preflight, so other sites in the browser can't trigger runs.
    if x_markt_app != "1":
        raise HTTPException(403, "forbidden")
    if not run_lock.acquire(blocking=False):
        raise HTTPException(409, "a run is already in progress")
    try:
        token = subprocess.run(["docker", "exec", N8N_CONTAINER, "printenv", "TRIAGE_WEBHOOK_TOKEN"],
                               capture_output=True, text=True, timeout=20).stdout.strip()
        if not token:
            raise HTTPException(503, "n8n container not reachable (is Docker running?)")
        t0 = time.time()
        req = urllib.request.Request(WEBHOOK, method="POST", headers={"x-markt-token": token})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                body = json.loads(r.read().decode("utf-8") or "{}")
        except urllib.error.HTTPError as e:
            raise HTTPException(502, f"n8n returned {e.code}")
        except urllib.error.URLError as e:
            raise HTTPException(503, f"n8n not reachable: {e.reason}")
        stamp = Path(str(body.get("archived", ""))).stem
        return {"ok": bool(body.get("ok")), "seconds": round(time.time() - t0, 1), "stamp": stamp,
                "emailed": body.get("emailed"), "failed_sources": body.get("failed_sources", [])}
    finally:
        run_lock.release()


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=PORT, log_level="info")
