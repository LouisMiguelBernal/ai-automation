import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { MONO, SANS, ease, pop, useUnit } from "../theme";
import { DemoClip, Monitor } from "../Devices";
import { BEAT, Brand, GoogleG, Head, NeuralBg, P, Pill, Silver, Tag, Words } from "./kit";

type S = React.FC<{ dur: number }>;

const Stage: React.FC<{ children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({ children, gap = 26, style }) => {
  const { u } = useUnit();
  return <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: gap * u, textAlign: "center", ...style }}>{children}</AbsoluteFill>;
};

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; glow?: boolean }> = ({ children, style, glow }) => {
  const { u } = useUnit();
  return (
    <div style={{
      borderRadius: 18 * u, border: `1px solid ${glow ? "rgba(94,234,176,0.35)" : "rgba(214,220,226,0.12)"}`,
      background: "linear-gradient(180deg, rgba(24,27,30,0.92), rgba(12,14,16,0.92))",
      boxShadow: glow ? `0 0 60px rgba(16,185,129,0.18), inset 0 1px 0 rgba(255,255,255,0.06)` : "inset 0 1px 0 rgba(255,255,255,0.05)",
      ...style,
    }}>{children}</div>
  );
};

/* 1 ─ Hook: the market as noise, then "read by AI" */
const HEADLINES = [
  "SEC weighs new crypto custody rules", "ETF inflows hit weekly high", "Funding flips positive on OKX", "Whale moves 4,200 BTC to exchange",
  "Corporate treasury adds BTC", "Open interest climbs 6%", "Fed minutes due Wednesday", "Liquidations spike on ETH perps",
];
export const Hook: S = () => {
  const frame = useCurrentFrame();
  const { u, width, height } = useUnit();
  const lines = ["Every headline.", "Every tick.", "Every second."];
  const idx = Math.min(2, Math.floor((frame - 6) / (BEAT * 2)));
  const ai = frame >= BEAT * 7;
  return (
    <AbsoluteFill>
      <NeuralBg intensity={0.6 + 0.4 * ease(frame, 0, 60)} glow={0.05 + (ai ? 0.08 : 0)} />
      {HEADLINES.map((h, i) => {
        const y = ((random(`hy${i}`) * height + frame * (1.2 + random(`hs${i}`)) * u) % (height + 100)) - 50;
        const x = random(`hx${i}`) * width * 0.8;
        const conv = ease(frame, BEAT * 7, 30);
        return (
          <div key={h} style={{ position: "absolute", left: x + (width / 2 - x) * conv * 0.8, top: height - y + (height / 2 - (height - y)) * conv * 0.8, fontFamily: MONO, fontSize: 17 * u, color: P.steel, opacity: (0.35 - 0.3 * conv) * ease(frame, i * 3, 20), whiteSpace: "nowrap", transform: `scale(${1 - conv * 0.5})` }}>
            {h}
          </div>
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 40% 30% at 50% 50%, rgba(7,9,10,0.9), transparent 80%)" }} />
      <Stage>
        {!ai && frame >= 6 && (
          <Head key={idx} size={124}><Words text={lines[idx]} at={6 + idx * BEAT * 2} step={3} /></Head>
        )}
        {ai && (
          <>
            <Head size={124}><Words text="Read by AI." at={BEAT * 7} step={4} color={(i) => (i === 2 ? P.greenHi : undefined)} /></Head>
            <div style={{ opacity: ease(frame, BEAT * 9, 14) }}><Pill live color={P.silver}>Gemma 4 E4B · FinBERT · running locally</Pill></div>
          </>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

const BigName: React.FC<{ at?: number; size: number }> = ({ at = 0, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u } = useUnit();
  return (
    <div style={{ display: "flex", fontFamily: SANS, fontWeight: 600, fontSize: size * u, letterSpacing: 0.18 * size * u, marginRight: -0.18 * size * u, lineHeight: 1, perspective: 900 }}>
      {"NEXUS".split("").map((l, i) => {
        const t = pop(frame, fps, at + i * 3, 170);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", padding: "0.06em 0" }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - t) * 115}%) rotateX(${(1 - t) * 75}deg)`, filter: `blur(${(1 - t) * 6}px)` }}>
              <Silver speed={2.2}>{l}</Silver>
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Skewed light streak that crosses the frame once. */
const Streak: React.FC<{ at: number; len?: number }> = ({ at, len = 34 }) => {
  const frame = useCurrentFrame();
  const { width } = useUnit();
  const x = interpolate(frame, [at, at + len], [-0.2, 1.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (k) => k * k * (3 - 2 * k) });
  if (frame < at || frame > at + len) return null;
  return <div style={{ position: "absolute", top: 0, bottom: 0, left: x * width, width: 160, transform: "skewX(-20deg)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), rgba(94,234,176,0.22), transparent)", mixBlendMode: "screen" }} />;
};

/* 2 ─ Logo slam on the drop: the name only */
export const Logo: S = () => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  const line = ease(frame, 12, 26);
  return (
    <AbsoluteFill>
      <NeuralBg intensity={1} glow={0.18 - 0.08 * ease(frame, 0, 40)} seed="lg" />
      <Stage gap={26}>
        <BigName size={square ? 150 : 200} />
        <div style={{ width: `${line * 56}%`, height: Math.max(2, 2 * u), background: `linear-gradient(90deg, transparent, ${P.greenHi}, transparent)`, boxShadow: `0 0 18px ${P.green}` }} />
        <div style={{ opacity: ease(frame, 22, 14) }}><Tag color={P.silver}>The AI-native institutional terminal</Tag></div>
        <div style={{ display: "flex", gap: 12 * u, opacity: ease(frame, 34, 14) }}>
          <Pill live color={P.greenHi}>LIVE · running now</Pill>
          <Pill color={P.silver}>Float Infinity</Pill>
        </div>
      </Stage>
      <Streak at={6} />
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [0, 6], [0.3, 0], { extrapolateRight: "clamp" }) }} />
    </AbsoluteFill>
  );
};

/* 3 ─ Tech stack: Google Gemma × FinBERT */
const ModelCard: React.FC<{ at: number; logo: React.ReactNode; name: string; by: string; chips: string[]; flip?: number }> = ({ at, logo, name, by, chips, flip = 1 }) => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  const t = ease(frame, at, 24);
  return (
    <div style={{ perspective: 1600 * u }}>
      <Card glow style={{ width: square ? 820 : 720 * u, padding: 36 * u, textAlign: "left", transform: `rotateY(${(1 - t) * 70 * flip}deg) translateY(${(1 - t) * 40}px)`, opacity: t }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 * u }}>
          {logo}
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50 * u, color: P.ink, letterSpacing: -1.5 * u }}>{name}</div>
            <div style={{ fontFamily: MONO, fontSize: 17 * u, color: P.steel, marginTop: 4 * u }}>{by}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 * u, marginTop: 26 * u }}>
          {chips.map((c, i) => {
            const logo = c.includes("Ollama") ? "ollama" : c.includes("Hugging") ? "huggingface" : c.includes("PyTorch") ? "pytorch" : null;
            const k = ease(frame, at + 16 + i * 5, 12);
            return <div key={c} style={{ opacity: k, transform: `translateY(${(1 - k) * 10}px)` }}><Pill color={P.silver} style={{ fontSize: 16 * u, padding: `${8 * u}px ${14 * u}px` }}>{logo && <Brand id={logo} size={18 * u} />}{c}</Pill></div>;
          })}
        </div>
      </Card>
    </div>
  );
};
const FinbertMark: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.22, background: `linear-gradient(135deg, ${P.fi}, #0B3D2E)`, display: "grid", placeItems: "center", fontFamily: MONO, fontWeight: 500, fontSize: size * 0.36, color: P.ink, boxShadow: `0 0 30px rgba(16,185,129,0.35)` }}>FB</div>
);
export const Stack: S = () => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  const g = ease(frame, 4, 30);
  const link = ease(frame, BEAT * 6, 20);
  return (
    <AbsoluteFill>
      <NeuralBg seed="st" glow={0.1} />
      <Stage gap={34}>
        <Tag>The intelligence stack</Tag>
        <div style={{ display: "flex", flexDirection: square ? "column" : "row", alignItems: "center", gap: 30 * u }}>
          <ModelCard at={4} logo={<GoogleG size={82 * u} draw={g} />} name="Gemma 4 E4B" by="Google DeepMind · open model"
            chips={["Runs locally via Ollama", "128K context", "Narrative synthesis"]} />
          <div style={{ fontFamily: SANS, fontSize: 60 * u, color: P.steel, opacity: ease(frame, 20, 12) }}>×</div>
          <ModelCard at={16} flip={-1} logo={<FinbertMark size={82 * u} />} name="FinBERT" by="ProsusAI · built on Google BERT"
            chips={["Hugging Face Transformers", "PyTorch", "Financial sentiment"]} />
        </div>
        <div style={{ opacity: link, transform: `scaleX(${0.6 + 0.4 * link})` }}>
          <Pill live color={P.greenHi} style={{ fontSize: 21 * u }}>↓ Nexus Intelligence & Bias Engine · Layer 03</Pill>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

/* 4 ─ FinBERT framework: headline → tokens → encoder → softmax */
const TOKENS = ["[CLS]", "spot", "etf", "inflows", "hit", "a", "weekly", "high", "as", "custody", "demand", "grows", "[SEP]"];
export const Finbert: S = () => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  const s1 = 6, s2 = BEAT * 4, s3 = BEAT * 8, s4 = BEAT * 11;
  const probs = [{ k: "Positive", v: 0.81, c: P.green }, { k: "Neutral", v: 0.15, c: P.silver }, { k: "Negative", v: 0.04, c: P.neg }];
  const W = square ? 900 : 1500;
  return (
    <AbsoluteFill>
      <NeuralBg seed="fb" glow={0.08} intensity={0.7} />
      <Stage gap={30}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 * u }}><Tag>FinBERT · how every headline is scored</Tag></div>
        <Card style={{ padding: `${18 * u}px ${28 * u}px`, opacity: ease(frame, s1, 14) }}>
          <span style={{ fontFamily: MONO, fontSize: 15 * u, color: P.steel, marginRight: 16 * u }}>HEADLINE</span>
          <span style={{ fontFamily: SANS, fontSize: 30 * u, color: P.ink }}>Spot ETF inflows hit a weekly high as custody demand grows</span>
        </Card>
        {/* tokens */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 * u, maxWidth: W * u / (square ? 1.55 : 1) }}>
          {TOKENS.map((t, i) => {
            const p = ease(frame, s1 + 18 + i * 2, 10);
            const special = t.startsWith("[");
            return <div key={i} style={{ fontFamily: MONO, fontSize: 18 * u, padding: `${6 * u}px ${12 * u}px`, borderRadius: 8 * u, border: `1px solid ${special ? P.green : P.line}`, color: special ? P.greenHi : P.silver, background: "rgba(14,16,18,0.9)", opacity: p, transform: `translateY(${(1 - p) * -24}px)` }}>{t}</div>;
          })}
        </div>
        {/* encoder */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 * u, opacity: ease(frame, s2, 14) }}>
          <span style={{ fontFamily: MONO, fontSize: 15 * u, color: P.steel, width: 150 * u, textAlign: "right" }}>BERT ENCODER<br />12 layers</span>
          <div style={{ display: "flex", gap: 7 * u }}>
            {Array.from({ length: 12 }, (_, i) => {
              const lit = frame > s2 + i * 4;
              const pulse = Math.max(0, 1 - Math.abs(frame - (s2 + i * 4)) / 10);
              return <div key={i} style={{ width: 22 * u, height: 92 * u, borderRadius: 5 * u, background: lit ? `rgba(16,185,129,${0.25 + 0.6 * pulse})` : "rgba(214,220,226,0.06)", border: `1px solid ${lit ? P.green : P.line}`, boxShadow: pulse > 0.2 ? `0 0 24px ${P.green}` : "none" }} />;
            })}
          </div>
          <span style={{ fontFamily: MONO, fontSize: 15 * u, color: P.steel, width: 150 * u, textAlign: "left" }}>→ SOFTMAX<br />3 classes</span>
          {!square && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(13, 1fr)", gap: 2 * u, marginLeft: 10 * u }}>
              {Array.from({ length: 169 }, (_, k) => {
                const r = Math.floor(k / 13), c = k % 13;
                const w = Math.max(0, Math.sin((r * 0.7 + c * 0.45) + frame / 7) * 0.5 + 0.5) * (r === c ? 1 : 0.55) * (random(`at${k}`) * 0.6 + 0.4);
                return <div key={k} style={{ width: 7 * u, height: 7 * u, borderRadius: 1.5 * u, background: P.greenHi, opacity: ease(frame, s2 + 8, 16) * (0.06 + 0.8 * w) }} />;
              })}
            </div>
          )}
        </div>
        {/* head */}
        <div style={{ display: "flex", gap: 20 * u, flexDirection: square ? "column" : "row", alignItems: "center" }}>
          {probs.map((p, i) => {
            const t = ease(frame, s3 + i * 4, 22);
            return (
              <Card key={p.k} style={{ width: 320 * u, padding: `${16 * u}px ${20 * u}px`, textAlign: "left", opacity: ease(frame, s3, 10) }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 17 * u, color: P.silver }}>
                  <span>{p.k}</span><span style={{ color: p.c }}>{(p.v * t).toFixed(2)}</span>
                </div>
                <div style={{ marginTop: 10 * u, height: 8 * u, borderRadius: 8 * u, background: "rgba(214,220,226,0.08)" }}>
                  <div style={{ width: `${p.v * t * 100}%`, height: "100%", borderRadius: 8 * u, background: p.c, boxShadow: i === 0 ? `0 0 16px ${P.green}` : "none" }} />
                </div>
              </Card>
            );
          })}
        </div>
        <div style={{ opacity: ease(frame, s4, 12), transform: `translateY(${(1 - ease(frame, s4, 12)) * 16}px)` }}>
          <Pill live color={P.greenHi}>Routed → bullish flow · weight 0.81 · sent to Gemma 4</Pill>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

/* 5 ─ Gemma 4 synthesis: the real live brief, typed out */
const BRIEF = "Institutional adoption is accelerating, evidenced by major corporate BTC investments and new custody services, yet this growth is shadowed by persistent regulatory uncertainty and political spending. The contradiction lies between rapidly increasing institutional capital inflows and the ongoing pressure from governmental bodies seeking to define crypto's legal boundaries. Derivatives traders should monitor regulatory announcements closely, as any definitive movement on SEC proposals could trigger significant volatility and directional shifts in leveraged positions.";
const INPUTS = ["FinBERT scores · 24 headlines", "Nexus sentiment · 46 Neutral", "Smart money · STRONG LONG", "Funding · OI · L/S ratio"];
export const Gemma: S = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  const coreIn = ease(frame, 0, 16);
  const typeStart = BEAT * 4;
  const n = Math.floor(interpolate(frame, [typeStart, dur - 14], [0, BRIEF.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const spin = frame * 1.5;
  const core = (
    <div style={{ position: "relative", width: 230 * u, height: 230 * u, display: "grid", placeItems: "center", opacity: coreIn, transform: `scale(${0.8 + 0.2 * coreIn})` }}>
      {[0, 1, 2].map((r) => (
        <div key={r} style={{ position: "absolute", inset: r * 22 * u, borderRadius: "50%", border: `1px ${r === 1 ? "dashed" : "solid"} rgba(94,234,176,${0.5 - r * 0.12})`, transform: `rotate(${spin * (r % 2 ? -1 : 1)}deg)` }} />
      ))}
      <div style={{ width: 120 * u, height: 120 * u, borderRadius: "50%", background: "radial-gradient(circle, #15191C, #0B0D0F)", display: "grid", placeItems: "center", boxShadow: `0 0 ${40 + 20 * Math.sin(frame / 6)}px rgba(16,185,129,0.45)` }}>
        <GoogleG size={58 * u} draw={coreIn} />
      </div>
    </div>
  );
  const streams = Array.from({ length: 16 }, (_, i) => {
    const p = ((frame + i * 9) % 44) / 44;
    const sx = (random(`sx${i}`) - 0.5) * 300 * u;
    return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 5 * u, height: 5 * u, borderRadius: "50%", background: P.greenHi, boxShadow: `0 0 10px ${P.green}`, transform: `translate(${sx * (1 - p)}px, ${260 * (1 - p) * u}px)`, opacity: ease(frame, 14, 10) * Math.sin(p * Math.PI) }} />;
  });
  return (
    <AbsoluteFill>
      <NeuralBg seed="gm" glow={0.12} />
      <AbsoluteFill style={{ flexDirection: square ? "column" : "row", alignItems: "center", justifyContent: "center", gap: (square ? 24 : 56) * u, padding: square ? 40 : `0 ${90 * u}px` }}>
        <div style={{ position: "relative", display: "flex", flexDirection: square ? "row" : "column", alignItems: "center", gap: 18 * u }}>
          {!square && <div style={{ position: "absolute", left: "50%", top: 115 * u, width: 0, height: 0 }}>{streams}</div>}
          {core}
          {!square && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 * u }}>
              {INPUTS.map((t, i) => {
                const p = ease(frame, 10 + i * 6, 12);
                return <div key={t} style={{ opacity: p, transform: `translateX(${(1 - p) * -30}px)` }}><Pill color={P.silver} style={{ fontSize: 16 * u }}>→ {t}</Pill></div>;
              })}
            </div>
          )}
          {square && <Head size={46} style={{ textAlign: "left" }}>Gemma 4 writes<br />the brief.</Head>}
        </div>
        <Card glow style={{ width: (square ? 980 : 1080) * u / (square ? 1.55 : 1), padding: `${30 * u}px ${34 * u}px`, textAlign: "left", opacity: ease(frame, 0, 12) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 * u }}>
            <span style={{ fontFamily: MONO, fontSize: 17 * u, letterSpacing: 3 * u, color: P.silver }}>AI NEWS SYNTHESIS · GEMMA 4</span>
            <span style={{ fontFamily: MONO, fontSize: 13 * u, color: P.greenHi, border: `1px solid ${P.fi}`, background: "rgba(16,185,129,0.12)", padding: `${3 * u}px ${10 * u}px`, borderRadius: 999 }}>ACTIVE</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 14 * u, color: P.dim, marginTop: 8 * u }}>Generated Oct 20, 07:46 AM · BTC sentiment (Nexus) 46 Neutral · SM: STRONG LONG</div>
          <div style={{ fontFamily: SANS, fontSize: (square ? 20 : 23) * u, lineHeight: 1.6, color: P.ink, marginTop: 18 * u, minHeight: (square ? 260 : 300) * u }}>
            {BRIEF.slice(0, n)}
            <span style={{ display: "inline-block", width: 10 * u, height: 22 * u, marginLeft: 3, background: P.greenHi, opacity: frame % 16 < 8 ? 1 : 0, verticalAlign: "middle" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 13 * u, color: P.steel, marginTop: 10 * u }}>
            <span>gemma4:e4b · local · think: off</span>
            <span style={{ color: P.greenHi }}>{n < BRIEF.length ? `generating… ${Math.round((n / BRIEF.length) * 100)}%` : "✓ brief ready"}</span>
          </div>
        </Card>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 6 ─ Where the AI runs: live product carousel in 3D */
const SPOTS = [
  { from: 29.5, tag: "Gemma 4", title: "Research brief", note: "Narrative synthesis across venues, funding and news" },
  { from: 50, tag: "FinBERT", title: "Alerts & News", note: "Every headline scored and routed in real time" },
  { from: 2, tag: "Bias engine", title: "Execution bias", note: "AI sentiment feeds the live bias score" },
];
export const WhereAI: S = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u, square, width } = useUnit();
  const per = dur / SPOTS.length;
  const pos = interpolate(frame, [0, per - 12, per, 2 * per - 12, 2 * per], [0, 0, 1, 1, 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => x * x * (3 - 2 * x) });
  const mw = square ? 760 : 1000 * u;
  const gap = square ? 640 : 900 * u;
  return (
    <AbsoluteFill>
      <NeuralBg seed="wa" glow={0.1} intensity={0.6} />
      <div style={{ position: "absolute", top: (square ? 56 : 70) * u, width: "100%", textAlign: "center" }}>
        <Tag>Where the AI runs · live</Tag>
      </div>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 45%" }}>
        {SPOTS.map((s, i) => ({ s, i, d: i - pos })).sort((a, b) => Math.abs(b.d) - Math.abs(a.d)).map(({ s, d }) => {
          const ad = Math.min(1.4, Math.abs(d));
          return (
            <div key={s.title} style={{ position: "absolute", left: width / 2 - mw / 2, top: square ? 190 : 200 * u, width: mw, transform: `translateX(${d * gap}px) translateZ(${-ad * 420}px) rotateY(${-d * 38}deg)`, opacity: 1 - ad * 0.45 }}>
              <Monitor width={mw} stand={false}>
                <DemoClip from={s.from} />
                <div style={{ position: "absolute", left: 0, right: 0, top: `${((frame * 1.4) % 120) - 10}%`, height: 2, background: P.greenHi, boxShadow: `0 0 20px 4px ${P.green}`, opacity: 0.45 }} />
                <div style={{ position: "absolute", left: 18 * u, top: 18 * u }}><Pill live color={P.greenHi} style={{ fontSize: 15 * u }}>{s.tag} · LIVE</Pill></div>
                <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.08), transparent 35%)" }} />
              </Monitor>
              <div style={{ height: 40 * u, margin: "0 6%", background: "radial-gradient(ellipse 50% 100% at 50% 0%, rgba(16,185,129,0.25), transparent)", filter: "blur(6px)" }} />
              <div style={{ marginTop: -10 * u, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: Math.max(0, 1 - Math.abs(d) * 2.5) }}>
                <Head size={square ? 40 : 46}>{s.title}</Head>
                {!square && <span style={{ fontFamily: SANS, fontSize: 22 * u, color: P.steel }}>{s.note}</span>}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 7 ─ Breakdown: local + private */
export const Local: S = () => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  const lines = [
    { t: "$ ollama run gemma4:e4b", c: P.silver },
    { t: "✓ model loaded · 100% on-device", c: P.greenHi },
    { t: "✓ finbert · transformers · cuda", c: P.greenHi },
    { t: "→ 0 cloud calls · 0 bytes leave the desk", c: P.ink },
  ];
  return (
    <AbsoluteFill>
      <NeuralBg seed="lc" glow={0.06 + 0.04 * Math.sin(frame / 10)} intensity={0.5} />
      <Stage gap={30}>
        <Head size={96}><Words text="Runs on your machine." at={4} step={4} color={(i) => (i === 3 ? P.greenHi : undefined)} /></Head>
        <Card style={{ padding: `${22 * u}px ${30 * u}px`, textAlign: "left", width: 760 * u, opacity: ease(frame, 18, 12) }}>
          {lines.map((l, i) => (
            <div key={l.t} style={{ display: "flex", alignItems: "center", gap: 12 * u, fontFamily: MONO, fontSize: 21 * u, lineHeight: 1.75, color: l.c, opacity: ease(frame, 24 + i * 12, 8) }}>
              {i === 0 && <Brand id="ollama" size={24 * u} />}{l.t}
            </div>
          ))}
        </Card>
      </Stage>
    </AbsoluteFill>
  );
};

/* 8 ─ Lift: kinetic verbs, then the stack (with logos) and AI benchmark charts */
const VERBS = ["Reads.", "Scores.", "Synthesises.", "Live."];
type Item = { name: string; mark: React.ReactNode };
const Gauge: React.FC<{ at: number; value: number; id: string; label: string; sub: string }> = ({ at, value, id, label, sub }) => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  const t = ease(frame, at, 40);
  const R = 74 * u, sw = 10 * u, C = 2 * Math.PI * R, c = R + sw;
  const k = ease(frame, at - 6, 14);
  return (
    <Card style={{ padding: `${24 * u}px ${26 * u}px`, display: "flex", alignItems: "center", gap: 22 * u, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
      <svg width={c * 2} height={c * 2}>
        <defs><linearGradient id={`gg${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={P.greenHi} /><stop offset="1" stopColor={P.fi} /></linearGradient></defs>
        <circle cx={c} cy={c} r={R} fill="none" stroke="rgba(214,220,226,0.08)" strokeWidth={sw} />
        {Array.from({ length: 40 }, (_, i) => {
          const a = (i / 40) * Math.PI * 2 - Math.PI / 2;
          return <line key={i} x1={c + Math.cos(a) * (R - sw * 1.6)} y1={c + Math.sin(a) * (R - sw * 1.6)} x2={c + Math.cos(a) * (R - sw * 2.3)} y2={c + Math.sin(a) * (R - sw * 2.3)} stroke={i / 40 < (value / 100) * t ? P.green : "rgba(214,220,226,0.12)"} strokeWidth={1.5} />;
        })}
        <circle cx={c} cy={c} r={R} fill="none" stroke={`url(#gg${id})`} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${C * (value / 100) * t} ${C}`} transform={`rotate(-90 ${c} ${c})`} style={{ filter: `drop-shadow(0 0 8px ${P.green})` }} />
        <text x={c} y={c + 15 * u} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={44 * u} fill={P.ink}>{Math.round(value * t)}%</text>
      </svg>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28 * u, color: P.ink }}>{label}</div>
        <div style={{ fontFamily: MONO, fontSize: 14 * u, color: P.steel, marginTop: 6 * u, maxWidth: 230 * u, lineHeight: 1.5 }}>{sub}</div>
      </div>
    </Card>
  );
};
const Signal: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  const W = 400 * u, H = 150 * u, n = 48;
  const pts = Array.from({ length: n }, (_, k) => {
    const v = 0.45 + 0.25 * Math.sin(k / 5 + 1) + 0.1 * Math.sin(k / 2.3) + (random(`sg${k}`) - 0.5) * 0.1 + (k / n) * 0.18;
    return [(k / (n - 1)) * W, H - v * H * 0.9] as const;
  });
  const draw = ease(frame, at, 50);
  const shown = pts.slice(0, Math.max(2, Math.round(n * draw)));
  const line = shown.map((p, k) => `${k ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const last = shown[shown.length - 1];
  const k = ease(frame, at - 6, 14);
  return (
    <Card style={{ padding: `${20 * u}px ${24 * u}px`, textAlign: "left", opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 14 * u, color: P.steel, letterSpacing: 2 * u }}>
        <span>LIVE SENTIMENT SIGNAL</span><span style={{ color: P.greenHi }}>● 2 s refresh</span>
      </div>
      <svg width={W} height={H} style={{ marginTop: 12 * u, overflow: "visible" }}>
        <defs><linearGradient id="sgf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P.green} stopOpacity={0.35} /><stop offset="1" stopColor={P.green} stopOpacity={0} /></linearGradient></defs>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke="rgba(214,220,226,0.06)" />)}
        <path d={`${line} L${last[0]},${H} L0,${H} Z`} fill="url(#sgf)" />
        <path d={line} fill="none" stroke={P.greenHi} strokeWidth={2.5 * u} style={{ filter: `drop-shadow(0 0 6px ${P.green})` }} />
        <circle cx={last[0]} cy={last[1]} r={6 * u} fill={P.greenHi} />
      </svg>
      <div style={{ display: "flex", gap: 22 * u, marginTop: 12 * u, fontFamily: MONO, fontSize: 15 * u, color: P.silver }}>
        <span><b style={{ color: P.ink }}>3</b> venues</span><span><b style={{ color: P.ink }}>2</b> AI models</span><span><b style={{ color: P.greenHi }}>0</b> cloud calls</span>
      </div>
    </Card>
  );
};
export const Lift: S = () => {
  const frame = useCurrentFrame();
  const { u, square, width } = useUnit();
  const split = Math.round(BEAT * 8);
  if (frame < split) {
    const i = Math.min(3, Math.floor(frame / (BEAT * 2)));
    const local = frame - i * BEAT * 2;
    const t = ease(local, 0, 9);
    return (
      <AbsoluteFill>
        <NeuralBg seed={`lv${i}`} glow={0.14 + 0.06 * (1 - t)} />
        <Stage>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: (square ? 150 : 210) * u, letterSpacing: -8 * u, color: i === 3 ? P.greenHi : P.ink, transform: `scale(${1.3 - 0.3 * t}) skewX(${(1 - t) * -8}deg)`, opacity: t, filter: `blur(${(1 - t) * 12}px)` }}>{VERBS[i]}</div>
          <div style={{ height: 6 * u, width: `${ease(local, 2, 14) * 30}%`, background: `linear-gradient(90deg, transparent, ${P.green}, transparent)` }} />
        </Stage>
        <Streak at={Math.round(i * BEAT * 2)} len={20} />
      </AbsoluteFill>
    );
  }
  const f = frame - split;
  const items: Item[] = [
    { name: "Gemma 4 E4B", mark: <GoogleG size={40 * u} /> },
    { name: "FinBERT", mark: <FinbertMark size={40 * u} /> },
    { name: "Ollama", mark: <Brand id="ollama" size={40 * u} /> },
    { name: "Hugging Face", mark: <Brand id="huggingface" size={40 * u} /> },
    { name: "PyTorch", mark: <Brand id="pytorch" size={40 * u} /> },
    { name: "Binance", mark: <Brand id="binance" size={40 * u} /> },
    { name: "OKX", mark: <Brand id="okx" size={40 * u} /> },
    { name: "MEXC", mark: null },
  ];
  const row = items.concat(items);
  return (
    <AbsoluteFill>
      <NeuralBg seed="lf" glow={0.12} />
      <Stage gap={square ? 30 : 44}>
        <Tag style={{ opacity: ease(f, 0, 10) }}>Built on</Tag>
        <div style={{ width, overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)", opacity: ease(f, 0, 12) }}>
          <div style={{ display: "flex", gap: 54 * u, transform: `translateX(${-f * 4.5 * u}px)`, whiteSpace: "nowrap", alignItems: "center" }}>
            {row.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 * u, fontFamily: SANS, fontWeight: 600, fontSize: 40 * u, color: i % items.length < 2 ? P.ink : P.silver }}>
                {s.mark}{s.name}<span style={{ color: P.fi, marginLeft: 38 * u }}>/</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: square ? "column" : "row", gap: 22 * u, alignItems: "center" }}>
          <Gauge at={20} id="a" value={86} label="Accuracy" sub="FinBERT · Financial PhraseBank, all data" />
          <Gauge at={30} id="b" value={97} label="Accuracy" sub="FinBERT · full-agreement headlines" />
          {!square && <Signal at={40} />}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 13 * u, color: P.dim, opacity: ease(f, 50, 12) }}>Benchmarks: FinBERT, Araci (2019) · Financial PhraseBank</div>
      </Stage>
    </AbsoluteFill>
  );
};

/* 9 ─ Outro on the final impact: the name only */
export const Outro: S = ({ dur }) => {
  const frame = useCurrentFrame();
  const { u, square } = useUnit();
  const end = interpolate(frame, [dur - 36, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: end }}>
      <NeuralBg seed="ou" glow={0.12 + 0.1 * (1 - ease(frame, 0, 50))} />
      <Stage gap={22}>
        <BigName size={square ? 140 : 180} />
        <div style={{ width: `${ease(frame, 10, 24) * 50}%`, height: 2, background: `linear-gradient(90deg, transparent, ${P.greenHi}, transparent)`, boxShadow: `0 0 18px ${P.green}` }} />
        <Head size={46} style={{ color: P.silver, fontWeight: 500 }}><Words text="AI-native. Live. Local." at={16} step={5} color={(i) => (i === 1 ? P.greenHi : undefined)} /></Head>
        <div style={{ display: "flex", alignItems: "center", gap: 14 * u, opacity: ease(frame, 36, 14), marginTop: 10 * u }}>
          <span style={{ fontFamily: MONO, fontSize: 17 * u, color: P.steel, letterSpacing: 3 * u }}>POWERED BY</span>
          <GoogleG size={30 * u} />
          <span style={{ fontFamily: SANS, fontSize: 26 * u, fontWeight: 600, color: P.ink }}>Gemma 4</span>
          <span style={{ color: P.dim, fontSize: 24 * u }}>·</span>
          <span style={{ fontFamily: SANS, fontSize: 26 * u, fontWeight: 600, color: P.ink }}>FinBERT</span>
        </div>
        <div style={{ opacity: ease(frame, 50, 14) }}><Pill live color={P.greenHi} style={{ fontSize: 24 * u }}>1nonly.me/nexus</Pill></div>
        <div style={{ opacity: ease(frame, 64, 14) }}><Tag color={P.steel}>Louis Miguel Bernal · in partnership with Float Infinity</Tag></div>
      </Stage>
      <Streak at={4} len={40} />
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [0, 8], [0.35, 0], { extrapolateRight: "clamp" }) }} />
    </AbsoluteFill>
  );
};
