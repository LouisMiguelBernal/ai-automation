import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CandleField, GoldStage, GridBg, Label, MONO, PixelN, Rise, SANS, Title, ease, pop, useUnit } from "./theme";
import { Chip, DemoClip, Laptop, Monitor, Shot } from "./Devices";

type S = React.FC<{ dur: number }>;

const Center: React.FC<{ children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({ children, gap = 24, style }) => {
  const { u } = useUnit();
  return <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: gap * u, textAlign: "center", ...style }}>{children}</AbsoluteFill>;
};

/** Device + copy layout: side by side in 16:9, stacked in 1:1. */
const Split: React.FC<{ device: React.ReactNode; copy: React.ReactNode; flip?: boolean }> = ({ device, copy, flip }) => {
  const { u, square } = useUnit();
  return (
    <AbsoluteFill style={{
      flexDirection: square ? "column" : flip ? "row-reverse" : "row", alignItems: "center", justifyContent: "center",
      gap: (square ? 36 : 80) * u, padding: `0 ${square ? 40 : 110}px`,
    }}>
      <div style={{ flexShrink: 0 }}>{device}</div>
      <div style={{ flex: square ? "none" : 1, display: "flex", flexDirection: "column", gap: 20 * u, alignItems: square ? "center" : "flex-start", textAlign: square ? "center" : "left" }}>{copy}</div>
    </AbsoluteFill>
  );
};

/** Slow push-in on a device so footage never sits still. */
const Push: React.FC<{ dur: number; children: React.ReactNode; from?: number; to?: number }> = ({ dur, children, from = 0.96, to = 1.02 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = interpolate(frame, [0, dur], [from, to]);
  const p = pop(frame, fps, 0, 90);
  return <div style={{ transform: `scale(${s}) translateY(${(1 - p) * 60}px) perspective(2000px) rotateX(${(1 - p) * 12}deg)`, opacity: p }}>{children}</div>;
};

/* 1 ─ Cold open */
export const ColdOpen: S = () => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  const out = interpolate(frame, [120, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(34,197,94,0.06)" />
      <CandleField opacity={0.28 * ease(frame, 0, 40)} speed={1.6} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 45% 35% at 50% 50%, rgba(10,10,10,0.92), transparent 80%)" }} />
      <Center gap={18} style={{ opacity: out }}>
        <Rise at={8}><Label color={C.muted}>BTC-USDT · ETH-USDT · SOL-USDT</Label></Rise>
        <Rise at={22}><Title size={120}>Markets don&apos;t wait.</Title></Rise>
        <Rise at={62}><Title size={64} style={{ color: C.muted }}>Your desk shouldn&apos;t either.</Title></Rise>
      </Center>
      <div style={{ position: "absolute", bottom: 60 * u, width: "100%", textAlign: "center", fontFamily: MONO, fontSize: 18 * u, color: C.green, opacity: out }}>
        ▲ {(64210 + Math.round(Math.sin(frame / 5) * 40 + frame * 1.3)).toLocaleString("en-US")}.{String(frame % 100).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

/* 2 ─ Logo reveal (lands on the first drum hit) */
export const Logo: S = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useUnit();
  const t = pop(frame, fps, 70, 80);
  return (
    <AbsoluteFill>
      <GridBg />
      <Center gap={30}>
        <PixelN size={150 * u} at={6} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 150 * u, letterSpacing: 26 * u * t + 4 * u, color: C.ink, opacity: t, marginRight: -26 * u * t }}>NEXUS</div>
        <Rise at={110}><Label>Institutional crypto terminal</Label></Rise>
        <div style={{ display: "flex", gap: 14 * u, opacity: ease(frame, 140, 20) }}>
          <Chip u={u} color={C.goldHi}>Gemma 4 + FinBERT</Chip>
          <Chip u={u}>7-layer architecture</Chip>
          <Chip u={u} color={C.fi}>Float Infinity</Chip>
        </div>
      </Center>
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [dur - 6, dur], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
    </AbsoluteFill>
  );
};

/* 3 ─ Venues streaming into one book */
const VENUES = [
  { n: "Binance", ms: "100 ms" },
  { n: "OKX", ms: "250 ms" },
  { n: "MEXC", ms: "2 s" },
];
export const Venues: S = () => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  const fuse = ease(frame, 70, 30);
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(201,163,90,0.10)" />
      <Center gap={40}>
        <Rise at={0}><Label>L01 · Data ingestion</Label></Rise>
        <Rise at={6}><Title size={square ? 72 : 88}>Three venues. <span style={{ color: C.gold }}>One book.</span></Title></Rise>
        <div style={{ display: "flex", flexDirection: square ? "column" : "row", gap: 24 * u, alignItems: "center" }}>
          {VENUES.map((v, i) => {
            const p = ease(frame, 18 + i * 8, 18);
            const bid = 64200 + Math.round(random(`b${i}${Math.floor(frame / 3)}`) * 30);
            return (
              <div key={v.n} style={{
                width: 330 * u, padding: 22 * u, borderRadius: 14 * u, border: `1px solid ${C.line}`, background: "rgba(20,20,20,0.85)",
                opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${1 - fuse * 0.06})`, fontFamily: MONO, textAlign: "left",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17 * u, color: C.muted }}>
                  <span style={{ color: C.ink, fontFamily: SANS, fontWeight: 600, fontSize: 24 * u }}>{v.n}</span>
                  <span>● {v.ms}</span>
                </div>
                <div style={{ marginTop: 14 * u, fontSize: 30 * u, color: C.green }}>{bid.toLocaleString("en-US")}.{(frame * 7 + i * 13) % 100}</div>
                <div style={{ marginTop: 10 * u, height: 4 * u, background: C.line, borderRadius: 4 }}>
                  <div style={{ width: `${40 + 50 * Math.abs(Math.sin(frame / 8 + i))}%`, height: "100%", background: C.gold, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ opacity: fuse, transform: `translateY(${(1 - fuse) * 20}px)` }}>
          <Chip u={u} color={C.goldHi} style={{ fontSize: 22 * u }}>↓ Cross-venue order-book fusion · 2 s refresh</Chip>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* Footage scenes */
const Footage: React.FC<{
  dur: number; from: number; label: string; title: React.ReactNode; body?: string; chips?: string[]; flip?: boolean; extra?: React.ReactNode;
}> = ({ dur, from, label, title, body, chips = [], flip, extra }) => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  return (
    <AbsoluteFill>
      <GridBg />
      <Split flip={flip}
        device={<Push dur={dur}><Monitor width={square ? 820 : 1080 * u} stand={!square}><DemoClip from={from} /></Monitor></Push>}
        copy={<>
          <Rise at={10}><Label>{label}</Label></Rise>
          <Rise at={16}><Title size={square ? 50 : 70}>{title}</Title></Rise>
          {body && <Rise at={26}><div style={{ fontFamily: SANS, fontSize: 26 * u, lineHeight: 1.45, color: C.muted, maxWidth: 560 * u }}>{body}</div></Rise>}
          {!square && <div style={{ display: "flex", flexWrap: "wrap", gap: 10 * u, maxWidth: 600 * u }}>
            {chips.map((c, i) => <div key={c} style={{ opacity: ease(frame, 40 + i * 8, 14) }}><Chip u={u}>{c}</Chip></div>)}
          </div>}
          {extra}
        </>}
      />
    </AbsoluteFill>
  );
};

export const Execution: S = ({ dur }) => (
  <Footage dur={dur} from={1} label="L06 · Execution" title={<>Every venue.<br />One click.</>}
    body="Live books, smart order routing and fills across Binance, OKX and MEXC, on a single trading surface."
    chips={["Smart order routing", "Live depth", "Fills & PnL", "Hotkeys"]} />
);

const RISK = [
  { k: "VaR", v: "Multi-model", c: C.gold },
  { k: "Kelly", v: "Position sizing", c: C.green },
  { k: "Stress", v: "Scenario scoring", c: C.goldHi },
  { k: "Breaker", v: "Auto circuit stop", c: C.red },
];
export const Risk: S = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  return (
    <Footage dur={dur} from={18} flip label="L04 · Risk layer" title={<>Risk you can <span style={{ color: C.gold }}>see</span>.</>}
      extra={
        <div style={{ display: "grid", gridTemplateColumns: square ? "repeat(4, 1fr)" : "1fr 1fr", gap: 14 * u, marginTop: 10 * u }}>
          {RISK.map((r, i) => {
            const p = ease(frame, 30 + i * 10, 16);
            return (
              <div key={r.k} style={{ padding: `${18 * u}px ${20 * u}px`, borderRadius: 12 * u, border: `1px solid ${C.line}`, background: "rgba(18,18,18,0.9)", opacity: p, transform: `translateY(${(1 - p) * 20}px)`, minWidth: (square ? 160 : 240) * u }}>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32 * u, color: r.c }}>{r.k}</div>
                <div style={{ fontFamily: MONO, fontSize: 15 * u, color: C.muted, marginTop: 4 * u }}>{r.v}</div>
              </div>
            );
          })}
        </div>
      } />
  );
};

const NARRATIVE = "BTC: funding flipped positive on OKX while Binance spot bid absorbs supply. FinBERT news tone +0.62. Bias: cautious long, size ≤ 0.5 Kelly.";
export const Research: S = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  const n = Math.floor(interpolate(frame, [40, dur - 40], [0, NARRATIVE.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Footage dur={dur} from={26} label="L03 · Intelligence engine" title={<>Gemma 4 reads<br />the tape for you.</>}
      extra={
        <div style={{ marginTop: 10 * u, padding: 22 * u, borderRadius: 14 * u, border: `1px solid rgba(201,163,90,0.35)`, background: "rgba(201,163,90,0.06)", maxWidth: 600 * u, textAlign: "left", opacity: ease(frame, 30, 14) }}>
          <div style={{ fontFamily: MONO, fontSize: 14 * u, color: C.gold, letterSpacing: 3 * u, marginBottom: 10 * u }}>◆ GEMMA 4 · LOCAL NARRATIVE</div>
          <div style={{ fontFamily: MONO, fontSize: 19 * u, lineHeight: 1.55, color: C.ink, minHeight: 120 * u }}>
            {NARRATIVE.slice(0, n)}<span style={{ opacity: frame % 20 < 10 ? 1 : 0, color: C.gold }}>▍</span>
          </div>
        </div>
      } />
  );
};

/* Liquidity + Order flow, two screens */
export const Liquidity: S = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  const w = square ? 600 : 820 * u;
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(34,197,94,0.07)" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 36 * u }}>
        <Rise at={0} style={{ textAlign: "center" }}><Label>L02 · Signal generation · 11 alpha signals</Label></Rise>
        <Rise at={6} style={{ textAlign: "center" }}><Title size={square ? 60 : 76}>See where the <span style={{ color: C.green }}>liquidity</span> sits.</Title></Rise>
        <div style={{ display: "flex", flexDirection: square ? "column" : "row", gap: 30 * u }}>
          {[{ f: 36, t: "Liquidity map" }, { f: 44, t: "Order flow" }].map((c, i) => {
            const p = ease(frame, 14 + i * 12, 22);
            const s = interpolate(frame, [0, dur], [1, 1.03]);
            return (
              <div key={c.t} style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${s})` }}>
                <Monitor width={w} stand={false}><DemoClip from={c.f} /></Monitor>
                <div style={{ marginTop: 14 * u, fontFamily: MONO, fontSize: 18 * u, color: C.muted, textAlign: "center", letterSpacing: 3 * u }}>{c.t.toUpperCase()}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const NEWS = [
  { h: "ETF inflows hit weekly high", s: "+0.71", c: C.green },
  { h: "Exchange outage reported in APAC", s: "−0.48", c: C.red },
  { h: "Funding normalises across majors", s: "+0.22", c: C.goldHi },
];
export const Alerts: S = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  return (
    <Footage dur={dur} from={50} flip label="News routing · FinBERT" title={<>Headlines, scored<br />before you read them.</>}
      extra={
        <div style={{ display: "flex", flexDirection: "column", gap: 12 * u, marginTop: 8 * u, width: square ? 820 : 560 * u }}>
          {NEWS.map((n, i) => {
            const p = ease(frame, 30 + i * 14, 16);
            return (
              <div key={n.h} style={{ display: "flex", justifyContent: "space-between", gap: 16 * u, padding: `${14 * u}px ${18 * u}px`, borderRadius: 10 * u, border: `1px solid ${C.line}`, background: "rgba(18,18,18,0.9)", opacity: p, transform: `translateX(${(1 - p) * 40}px)`, fontFamily: MONO, fontSize: 18 * u }}>
                <span style={{ color: C.ink, textAlign: "left" }}>{n.h}</span>
                <span style={{ color: n.c }}>{n.s}</span>
              </div>
            );
          })}
        </div>
      } />
  );
};

/* Seven-layer stack */
const LAYERS = ["Data Ingestion", "Signal Generation", "Intelligence & Bias Engine", "Risk Layer", "Derivatives Pricing", "Execution Logic", "Position Sizing & Audit"];
export const Layers: S = () => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  return (
    <AbsoluteFill>
      <GridBg glow="rgba(201,163,90,0.14)" />
      <Center gap={32}>
        <Rise at={0}><Label>Architecture</Label></Rise>
        <Rise at={6}><Title size={square ? 64 : 80}>Seven layers. <span style={{ color: C.gold }}>Zero guesswork.</span></Title></Rise>
        <div style={{ display: "flex", flexDirection: "column-reverse", gap: 10 * u, width: (square ? 900 : 1000) * u / (square ? 1.55 : 1) * (square ? 1.3 : 1) }}>
          {LAYERS.map((l, i) => {
            const p = ease(frame, 24 + i * 16, 18);
            const lit = frame > 24 + i * 16 + 10 && frame < 24 + i * 16 + 40;
            return (
              <div key={l} style={{
                display: "flex", alignItems: "center", gap: 22 * u, padding: `${14 * u}px ${24 * u}px`, borderRadius: 10 * u,
                border: `1px solid ${lit ? C.gold : C.line}`, background: lit ? "rgba(201,163,90,0.12)" : "rgba(18,18,18,0.9)",
                opacity: p, transform: `translateY(${(1 - p) * -30}px)`, boxShadow: lit ? `0 0 40px rgba(201,163,90,0.25)` : "none",
              }}>
                <span style={{ fontFamily: MONO, fontSize: 18 * u, color: C.gold }}>L0{i + 1}</span>
                <span style={{ fontFamily: SANS, fontSize: 28 * u, fontWeight: 500, color: C.ink, flex: 1, textAlign: "left" }}>{l}</span>
                <span style={{ fontFamily: MONO, fontSize: 16 * u, color: frame > 24 + i * 16 + 18 ? C.green : C.muted }}>{frame > 24 + i * 16 + 18 ? "● ONLINE" : "○"}</span>
              </div>
            );
          })}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* Montage on gold stage (lands on the lift) */
const SHOTS = ["shots/execution.png", "shots/risk.png", "shots/research.png", "shots/alerts-news.png"];
export const Montage: S = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  const per = dur / SHOTS.length;
  const idx = Math.min(SHOTS.length - 1, Math.floor(frame / per));
  const local = frame - idx * per;
  const k = ease(local, 0, 12);
  const w = square ? 960 : 1240 * u;
  return (
    <AbsoluteFill>
      <GoldStage />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `translateX(${(1 - k) * 120}px) rotate(${(1 - k) * -2}deg)`, opacity: k }}>
          <Laptop width={w}><Shot src={SHOTS[idx]} zoom={interpolate(local, [0, per], [1.0, 1.08])} /></Laptop>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 70 * u / (square ? 1.55 : 1), top: 60 * u / (square ? 1.55 : 1) }}>
        <Label color="#F2DDA4">One surface</Label>
      </div>
      <div style={{ position: "absolute", right: 70 * u / (square ? 1.55 : 1), bottom: 56 * u / (square ? 1.55 : 1), fontFamily: MONO, fontSize: 18 * u, color: "#1A140A", letterSpacing: 3 * u }}>
        {["EXECUTION", "RISK", "RESEARCH", "ALERTS & NEWS"][idx]} · 0{idx + 1}/04
      </div>
    </AbsoluteFill>
  );
};

/* Stats */
const STATS = [
  { v: 7, l: "Layers" },
  { v: 3, l: "Venues" },
  { v: 11, l: "Alpha signals" },
  { v: 5, l: "Risk modules" },
  { v: 2, l: "Second refresh", s: "s" },
];
export const Stats: S = () => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  return (
    <AbsoluteFill>
      <GridBg />
      <CandleField opacity={0.08} speed={0.8} seed="st" />
      <Center gap={44}>
        <Rise at={0}><Label>By the numbers</Label></Rise>
        <div style={{ display: "grid", gridTemplateColumns: square ? "repeat(3, 1fr)" : "repeat(5, 1fr)", gap: (square ? 30 : 60) * u }}>
          {STATS.map((s, i) => {
            const p = ease(frame, 8 + i * 8, 26);
            return (
              <div key={s.l} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 130 * u, color: i % 2 ? C.ink : C.gold, letterSpacing: -4 * u, lineHeight: 1 }}>{Math.round(s.v * p)}{s.s ?? ""}</div>
                <div style={{ fontFamily: MONO, fontSize: 18 * u, color: C.muted, letterSpacing: 3 * u, marginTop: 10 * u, textTransform: "uppercase" }}>{s.l}</div>
              </div>
            );
          })}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* Outro (final impact at local frame 135) */
export const Outro: S = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useUnit();
  const words = ["Execution.", "Risk.", "Research.", "Intelligence."];
  const hit = pop(frame, fps, 135, 140);
  const flash = interpolate(frame, [135, 139, 160], [0, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const end = interpolate(frame, [dur - 30, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: end }}>
      <GridBg glow={`rgba(201,163,90,${0.1 + 0.15 * hit})`} />
      <CandleField opacity={0.1 * hit} speed={0.6} seed="out" />
      {frame < 135 ? (
        <Center gap={8}>
          {words.map((w, i) => (
            <Rise key={w} at={i * 22}><Title size={104} style={{ color: i === words.length - 1 ? C.gold : C.ink }}>{w}</Title></Rise>
          ))}
        </Center>
      ) : (
        <Center gap={26}>
          <PixelN size={110 * u} at={135} />
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 140 * u, letterSpacing: 24 * u, marginRight: -24 * u, color: C.ink, transform: `scale(${0.9 + 0.1 * hit})` }}>NEXUS</div>
          <Rise at={150}><Title size={44} style={{ color: C.muted }}>One surface for the whole desk.</Title></Rise>
          <Rise at={172}><Chip u={u} color={C.goldHi} style={{ fontSize: 24 * u }}>1nonly.me/nexus</Chip></Rise>
          <Rise at={190}><Label color={C.muted}>Louis Miguel Bernal · in partnership with Float Infinity</Label></Rise>
        </Center>
      )}
      <AbsoluteFill style={{ background: C.goldHi, opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};
