import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import run from "./data/run.json";
import marktWf from "./data/markt.json";
import { WorkflowCanvas } from "./Workflow";
import { C, Chip, ease, FlowBg, GridBg, Label, Logo, MONO, pop, Rise, SANS, SceneFade, Title, useUnit } from "./theme";

// Real output of the 2026-11-13 09:21 (Asia/Manila) run — markt/digests/2026-11-13T0121.json
const R = run as unknown as {
  btc: { price: number; change_pct: number; change_usd: number; high_24h: number; low_24h: number; volume_musd: number; candles_close: number[] };
  fear_greed: { value: number; label: string };
  markets: { name: string; last: number; change_pct: number }[];
  sentiment: { counts: { positive: number; neutral: number; negative: number }; n: number };
  headlines: { id: number; source: string; title: string; sentiment: "positive" | "neutral" | "negative" }[];
  top3: { id: number; why: string }[];
  brief: { headline: string; why: string[] };
  n: number;
};
const H = (id: number) => R.headlines.find((h) => h.id === id)!;
const usd = (n: number, d = 0) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const SENT = { positive: C.emerald, neutral: C.muted, negative: C.red } as const;

const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", ...style }}>{children}</AbsoluteFill>
);
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const { u } = useUnit();
  return <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18 * u, padding: 32 * u, boxShadow: "0 30px 90px rgba(0,0,0,0.45)", ...style }}>{children}</div>;
};

/* 1 — Intro: abstract ribbons, the mark draws itself, the name settles */
export const Intro: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useUnit();
  const s = pop(frame, fps, 6);
  const draw = ease(frame, 14, 26);
  const pulse = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spread = interpolate(ease(frame, 20, 34), [0, 1], [70, 22]);
  const blur = interpolate(ease(frame, 20, 30), [0, 1], [14, 0]);
  return (
    <SceneFade dur={dur}>
      <FlowBg intensity={ease(frame, 0, 30)} />
      <Center>
        <div style={{ transform: `scale(${s}) rotate(${(1 - s) * -18}deg)`, filter: `drop-shadow(0 0 ${60 * u}px rgba(242,241,239,0.55))` }}>
          <Logo id="intro" size={170 * u} draw={draw} pulse={pulse} />
        </div>
        <div style={{ marginTop: 34 * u, opacity: ease(frame, 20, 20), filter: `blur(${blur * u}px)` }}>
          <Title size={150} style={{ fontWeight: 600, letterSpacing: spread * u, marginRight: -spread * u }}>MARKT</Title>
        </div>
        <Rise at={40} style={{ marginTop: 16 * u }}><Label color={C.muted}>A Bitcoin brief that writes itself · every 4 hours</Label></Rise>
        <Rise at={52} style={{ marginTop: 30 * u, display: "flex", gap: 14 * u, flexWrap: "wrap", justifyContent: "center", maxWidth: 1500 * u }}>
          {["n8n", "Binance API", "FinBERT · local", "Gemma 4 · local", "Gmail"].map((t) => <Chip key={t}>{t}</Chip>)}
        </Rise>
      </Center>
    </SceneFade>
  );
};

/* 2 — Hook: the manual routine */
const TABS = [
  ["Binance", "BTC chart, 24h move"],
  ["CoinTelegraph · CoinDesk · Decrypt", "crypto headlines"],
  ["Federal Reserve", "press releases"],
  ["Fear & Greed", "market mood"],
  ["S&P 500 · Nasdaq · Gold", "macro context"],
];
export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, square } = useUnit();
  return (
    <SceneFade dur={dur}>
      <GridBg glow="rgba(96,165,250,0.10)" />
      <Center style={{ flexDirection: square ? "column" : "row", gap: (square ? 50 : 100) * u, padding: 100 * u }}>
        <div style={{ maxWidth: 760 * u, width: square ? 760 * u : undefined }}>
          <Rise at={0}><Label>01 — The routine</Label></Rise>
          <Rise at={6} style={{ marginTop: 22 * u }}><Title size={80}>Is Bitcoin up or down?<br /><span style={{ color: C.muted }}>And why?</span></Title></Rise>
          <Rise at={16} style={{ marginTop: 26 * u }}><div style={{ fontFamily: SANS, fontSize: 28 * u, color: C.muted }}>Five tabs, checked by hand, several times a day.</div></Rise>
        </div>
        <div style={{ width: (square ? 760 : 600) * u }}>
          {TABS.map(([t, d], i) => {
            const p = pop(frame, fps, 8 + i * 6);
            return (
              <div key={t} style={{
                display: "flex", alignItems: "center", gap: 18 * u, padding: `${18 * u}px ${22 * u}px`, marginBottom: 14 * u, borderRadius: 14 * u,
                background: C.panel, border: `1px solid ${C.line}`, opacity: p, transform: `translateX(${(1 - p) * 120 * u}px)`,
              }}>
                <div style={{ width: 12 * u, height: 12 * u, borderRadius: 3 * u, background: C.blue, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 26 * u, color: C.ink }}>{t}</div>
                  <div style={{ fontFamily: MONO, fontSize: 15 * u, color: C.muted, marginTop: 4 * u }}>{d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Center>
    </SceneFade>
  );
};

/* 3 — Price from Binance candles */
export const Price: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  const c = R.btc.candles_close;
  const lo = Math.min(...c), hi = Math.max(...c);
  const t = ease(frame, 14, 50);
  const shown = Math.max(1, Math.ceil(t * c.length));
  const price = c[0] + (R.btc.price - c[0]) * t;
  const chartW = (square ? 1500 : 1000) * u, chartH = 460 * u, bw = chartW / c.length;
  return (
    <SceneFade dur={dur}>
      <GridBg glow="rgba(251,113,133,0.10)" />
      <AbsoluteFill style={{ padding: `${70 * u}px ${90 * u}px`, justifyContent: "center" }}>
        <Rise at={0}><Label>02 — Binance 1h candles</Label></Rise>
        <Rise at={6} style={{ marginTop: 16 * u }}><Title size={64}>The last 24 hours, every run.</Title></Rise>
        <div style={{ display: "flex", flexDirection: square ? "column" : "row", gap: 60 * u, marginTop: 50 * u, alignItems: square ? "flex-start" : "flex-end" }}>
          <div style={{ minWidth: 560 * u }}>
            <Label color={C.muted}>BTC / USDT</Label>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 120 * u, color: C.ink, letterSpacing: -3 * u, marginTop: 8 * u }}>{usd(price)}</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44 * u, color: C.red, opacity: ease(frame, 60, 14) }}>▼ DOWN {Math.abs(R.btc.change_pct).toFixed(2)}%  <span style={{ fontSize: 30 * u, color: C.muted, fontWeight: 400 }}>(−{usd(Math.abs(R.btc.change_usd))})</span></div>
            <div style={{ display: "flex", gap: 12 * u, marginTop: 24 * u, opacity: ease(frame, 70, 14), flexWrap: "wrap" }}>
              <Chip>range {usd(R.btc.low_24h)} – {usd(R.btc.high_24h)}</Chip>
              <Chip on color={C.red}>Fear &amp; Greed {R.fear_greed.value} · {R.fear_greed.label}</Chip>
            </div>
          </div>
          <svg width={chartW} height={chartH} style={{ overflow: "visible" }}>
            {c.slice(0, shown).map((v, i) => {
              const prev = i ? c[i - 1] : v;
              const y = (x: number) => chartH - ((x - lo) / (hi - lo || 1)) * (chartH - 20 * u) - 10 * u;
              const top = Math.min(y(v), y(prev)), h = Math.max(3 * u, Math.abs(y(v) - y(prev)));
              return <rect key={i} x={i * bw + bw * 0.18} y={top} width={bw * 0.64} height={h} rx={2 * u} fill={v >= prev ? C.emerald : C.red} />;
            })}
          </svg>
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};

/* 4 — FinBERT labels every headline, Gemma picks 3 different events */
const LIST = [10, 9, 11, 6, 1, 12, 8, 5];
export const Analyse: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  const top = R.top3.map((t) => t.id);
  const dup = 9; // same event as #10 (Huang leaves Nvidia) — filtered by the same-event check
  const pickAt = 92;
  const counts = R.sentiment.counts;
  return (
    <SceneFade dur={dur}>
      <GridBg />
      <AbsoluteFill style={{ padding: `${60 * u}px ${90 * u}px`, justifyContent: square ? "center" : undefined }}>
        <Rise at={0}><Label>03 — Local AI</Label></Rise>
        <Rise at={6} style={{ marginTop: 16 * u }}><Title size={60}>FinBERT reads {R.n} headlines. Gemma picks the 3 that matter.</Title></Rise>
        <div style={{ display: "flex", flexDirection: square ? "column" : "row", gap: 40 * u, marginTop: 40 * u }}>
          <div style={{ flex: 1.6 }}>
            {LIST.slice(0, square ? 6 : 8).map((id, i) => {
              const h = H(id);
              const labeled = frame >= 24 + i * 6;
              const picked = frame >= pickAt && top.includes(id);
              const isDup = frame >= pickAt + 14 && id === dup;
              const dim = frame >= pickAt && !picked;
              return (
                <Rise key={id} at={10 + i * 3}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 16 * u, padding: `${11 * u}px ${18 * u}px`, marginBottom: 9 * u, borderRadius: 12 * u,
                    background: picked ? "rgba(242,241,239,0.10)" : C.panel, border: `1px solid ${picked ? C.accent : C.line}`, opacity: dim ? 0.38 : 1,
                  }}>
                    <div style={{ fontFamily: MONO, fontSize: 15 * u, width: 100 * u, flexShrink: 0, color: labeled ? SENT[h.sentiment] : "transparent", fontWeight: 600 }}>{h.sentiment}</div>
                    <div style={{ fontFamily: SANS, fontSize: 21 * u, color: C.ink, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textDecoration: isDup ? "line-through" : "none" }}>{h.title}</div>
                    {isDup && <div style={{ fontFamily: MONO, fontSize: 14 * u, color: C.amber, whiteSpace: "nowrap" }}>same event</div>}
                    {picked && <div style={{ fontFamily: MONO, fontSize: 16 * u, color: C.accent, fontWeight: 600 }}>#{top.indexOf(id) + 1}</div>}
                  </div>
                </Rise>
              );
            })}
          </div>
          <div style={{ flex: 1, display: square ? "flex" : "block", gap: 22 * u }}>
            <Rise at={40} style={{ flex: 1 }}>
              <Card>
                <Label color={C.muted}>FinBERT · ProsusAI · GPU</Label>
                {(["negative", "neutral", "positive"] as const).map((k, i) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 16 * u }}>
                    <div style={{ fontFamily: SANS, fontSize: 28 * u, color: SENT[k] }}>{k}</div>
                    <div style={{ fontFamily: SANS, fontSize: 52 * u, color: C.ink, fontWeight: 500 }}>{Math.round(counts[k] * ease(frame, 46 + i * 6, 30))}</div>
                  </div>
                ))}
              </Card>
            </Rise>
            <Rise at={pickAt} style={{ marginTop: square ? 0 : 22 * u, flex: 1 }}>
              <Card style={{ borderLeft: `3px solid ${C.accent}` }}>
                <Label>Gemma 4 E4B · JSON schema</Label>
                <div style={{ fontFamily: MONO, fontSize: 19 * u, color: C.ink, marginTop: 12 * u, lineHeight: 1.6 }}>
                  top_stories: [{top.join(", ")}]<br />why: 3 sentences
                </div>
              </Card>
            </Rise>
          </div>
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};

/* 5 — The real n8n workflow */
export const Workflow: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u, width, height, square } = useUnit();
  const wide = square ? 2.2 : 1;
  const pan = square ? interpolate(frame, [30, 135], [0, -(wide - 1) * (width - 80 * u)], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) }) : 0;
  const wf = marktWf as unknown as { nodes: { type: string }[] };
  const nodes = { ...marktWf, nodes: wf.nodes.filter((n) => !/stickyNote/.test(n.type)) };
  return (
    <SceneFade dur={dur}>
      <GridBg glow="rgba(234,75,113,0.10)" />
      <AbsoluteFill style={{ padding: `${70 * u}px ${90 * u}px` }}>
        <Rise at={0}><Label color={C.n8n}>04 — n8n orchestration</Label></Rise>
        <Rise at={6} style={{ marginTop: 16 * u }}><Title size={64}>Schedule in. Brief out.</Title></Rise>
        <Rise at={12} style={{ marginTop: 14 * u }}>
          <div style={{ fontFamily: SANS, fontSize: 26 * u, color: C.muted }}>8 sources · FinBERT · Gemma · Gmail · archive. Every 4 hours, on its own.</div>
        </Rise>
      </AbsoluteFill>
      <AbsoluteFill style={{ top: 300 * u, left: 40 * u, transform: `translateX(${pan}px)` }}>
        <WorkflowCanvas wf={nodes as never} width={(width - 80 * u) * wide} height={height - 330 * u} start={14} stepFrames={4} />
      </AbsoluteFill>
    </SceneFade>
  );
};

/* 6 — The email */
export const Email: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, square } = useUnit();
  const p = pop(frame, fps, 6);
  const scroll = 0;
  const lab = (t: string) => <div style={{ fontFamily: SANS, fontSize: 13 * u, letterSpacing: 1.5 * u, textTransform: "uppercase", color: "#64748b", fontWeight: 600, margin: `0 0 ${8 * u}px` }}>{t}</div>;
  return (
    <SceneFade dur={dur}>
      <GridBg glow="rgba(242,241,239,0.12)" />
      <AbsoluteFill style={{ padding: `${(square ? 40 : 60) * u}px ${90 * u}px`, flexDirection: square ? "column" : "row", gap: (square ? 24 : 60) * u, alignItems: square ? "stretch" : "center", justifyContent: "center" }}>
        <div style={{ flex: square ? "none" : 0.7 }}>
          <Rise at={0}><Label>05 — In your inbox</Label></Rise>
          <Rise at={6} style={{ marginTop: 16 * u }}><Title size={62}>Up or down. Top 3. Why.</Title></Rise>
          <Rise at={14} style={{ marginTop: 22 * u, display: square ? "none" : "block" }}>
            <div style={{ fontFamily: MONO, fontSize: 19 * u, color: C.muted, lineHeight: 1.6, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12 * u, padding: `${14 * u}px ${18 * u}px` }}>
              [Markt] BTC {usd(R.btc.price)} ▼ {Math.abs(R.btc.change_pct).toFixed(2)}% (24h)
            </div>
          </Rise>
        </div>
        <div style={{ flex: square ? "none" : 1, overflow: "hidden", borderRadius: 14 * u, opacity: p, transform: `translateY(${(1 - p) * 80 * u}px)`, maxHeight: (square ? 1000 : 960) * u }}>
          <div style={{ transform: `translateY(${scroll}px)`, background: "#ffffff", color: "#0f172a", fontFamily: SANS, boxShadow: "0 40px 120px rgba(0,0,0,0.6)" }}>
            <div style={{ background: "#0f172a", color: "#fff", padding: `${16 * u}px ${26 * u}px`, fontSize: 22 * u }}><b>Markt</b><span style={{ color: "#94a3b8", fontSize: 15 * u }}> · Bitcoin brief · Nov 13, 2026, 9:21 AM</span></div>
            <div style={{ padding: `${20 * u}px ${26 * u}px` }}>
              {lab("Bitcoin · 24 hours")}
              <div style={{ fontSize: 44 * u, fontWeight: 700 }}>{usd(R.btc.price, 2)}</div>
              <div style={{ fontSize: 20 * u, fontWeight: 600, color: "#b91c1c" }}>▼ DOWN {Math.abs(R.btc.change_pct).toFixed(2)}% (−{usd(Math.abs(R.btc.change_usd))})</div>
              <div style={{ fontSize: 15 * u, color: "#475569", marginTop: 4 * u }}>24h range {usd(R.btc.low_24h)} – {usd(R.btc.high_24h)} · Fear &amp; Greed <b>{R.fear_greed.value}</b> ({R.fear_greed.label})</div>
              <div style={{ fontSize: 17 * u, fontWeight: 700, marginTop: 12 * u, lineHeight: 1.4 }}>{R.brief.headline}</div>
            </div>
            <div style={{ padding: `${16 * u}px ${26 * u}px`, borderTop: "1px solid #e2e8f0" }}>
              {lab("Top 3 stories today")}
              {R.top3.map((t, i) => (
                <div key={t.id} style={{ display: "flex", gap: 14 * u, marginTop: i ? 12 * u : 0, opacity: ease(frame, 30 + i * 10, 14) }}>
                  <div style={{ fontSize: 22 * u, fontWeight: 700, color: "#94a3b8", width: 20 * u }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: 17 * u, fontWeight: 600 }}>{H(t.id).title}</div>
                    <div style={{ fontSize: 13 * u, color: "#64748b" }}>{H(t.id).source} · <span style={{ color: "#b91c1c", fontWeight: 600 }}>FinBERT {H(t.id).sentiment}</span></div>
                    <div style={{ fontSize: 15 * u, color: "#334155", marginTop: 2 * u, lineHeight: 1.4 }}>{t.why}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: `${16 * u}px ${26 * u}px ${22 * u}px`, borderTop: "1px solid #e2e8f0", opacity: ease(frame, 64, 16) }}>
              {lab("Why it moved")}
              <div style={{ fontSize: 16 * u, lineHeight: 1.55, color: "#1e293b" }}>{R.brief.why.join(" ")}</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};

/* 7 — Guardrails */
const SAFE = [
  ["Numbers from code", "price & % from Binance, never from the model"],
  ["Validated picks", "ids must exist · one event counts once"],
  ["Degrades, never stops", "a dead source is skipped and named"],
  ["Private", "FinBERT + Gemma run locally · no API keys"],
];
export const Guardrails: React.FC<{ dur: number }> = ({ dur }) => {
  const { u, square } = useUnit();
  return (
    <SceneFade dur={dur}>
      <GridBg />
      <AbsoluteFill style={{ padding: `${70 * u}px ${(square ? 90 : 150) * u}px`, justifyContent: "center" }}>
        <Rise at={0}><Label>06 — Built to be trusted</Label></Rise>
        <Rise at={3} style={{ marginTop: 18 * u }}><Title size={64}>Words from the model. Facts from the data.</Title></Rise>
        <div style={{ display: "grid", gridTemplateColumns: square ? "1fr" : "1fr 1fr", gap: (square ? 18 : 26) * u, marginTop: (square ? 36 : 50) * u }}>
          {SAFE.map(([t, d], i) => (
            <Rise key={t} at={6 + i * 7}>
              <Card style={{ borderLeft: `3px solid ${C.accent}` }}>
                <div style={{ fontFamily: SANS, fontSize: 42 * u, color: C.ink, fontWeight: 500 }}>{t}</div>
                <div style={{ fontFamily: MONO, fontSize: 21 * u, color: C.muted, marginTop: 12 * u }}>{d}</div>
              </Card>
            </Rise>
          ))}
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};

/* 8 — Numbers from the real runs (markt/STATS.md) */
const STATS: { v: number; fmt: (n: number) => string; label: string }[] = [
  { v: 8, fmt: (n) => `${Math.round(n)}/8`, label: "sources every run" },
  { v: R.n, fmt: (n) => `${Math.round(n)}`, label: "headlines scored" },
  { v: 18, fmt: (n) => `${Math.round(n)} s`, label: "per run (warm)" },
  { v: 6, fmt: (n) => `${Math.round(n)}`, label: "briefs a day" },
];
export const Stats: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  return (
    <SceneFade dur={dur}>
      <GridBg />
      <Center>
        <Rise at={0}><Label>07 — Measured on real runs</Label></Rise>
        <div style={{ display: "grid", gridTemplateColumns: square ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: (square ? 60 : 40) * u, marginTop: 50 * u, padding: `0 ${90 * u}px` }}>
          {STATS.map((s, i) => {
            const t = ease(frame, 8 + i * 6, 34);
            return (
              <div key={s.label} style={{ opacity: ease(frame, 4 + i * 6, 12), borderLeft: `2px solid ${C.accent}`, paddingLeft: 24 * u, minWidth: 300 * u }}>
                <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 100 * u, color: C.ink, letterSpacing: -2 * u }}>{s.fmt(s.v * t)}</div>
                <div style={{ fontFamily: MONO, fontSize: 18 * u, color: C.muted, textTransform: "uppercase", letterSpacing: 2 * u }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </Center>
    </SceneFade>
  );
};

/* 9 — Outro */
export const Outro: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  return (
    <SceneFade dur={dur}>
      <FlowBg intensity={0.85} />
      <Center>
        <Rise at={0} style={{ display: "flex", alignItems: "center", gap: 34 * u }}>
          <div style={{ filter: `drop-shadow(0 0 ${44 * u}px rgba(242,241,239,0.5))` }}>
            <Logo id="outro" size={120 * u} draw={ease(frame, 2, 22)} pulse={interpolate(frame, [26, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          </div>
          <Title size={120} style={{ fontWeight: 600, letterSpacing: 16 * u }}>MARKT</Title>
        </Rise>
        <Rise at={10} style={{ marginTop: 26 * u }}><Title size={40} style={{ color: C.muted, textAlign: "center" }}>Price, the 3 stories that matter, and why. Every 4 hours.</Title></Rise>
        <Rise at={20} style={{ marginTop: 44 * u, display: "flex", gap: 14 * u, flexWrap: "wrap", justifyContent: "center" }}>
          {["n8n", "Binance", "FinBERT", "Gemma 4 E4B", "Python"].map((t) => <Chip key={t}>{t}</Chip>)}
        </Rise>
        <Rise at={30} style={{ marginTop: 32 * u }}><Label color={C.muted}>Louis Miguel Bernal · 1nonly.me</Label></Rise>
      </Center>
    </SceneFade>
  );
};

void MONO;
