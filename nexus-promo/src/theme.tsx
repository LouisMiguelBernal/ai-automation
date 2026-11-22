import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

export const { fontFamily: SANS } = loadGeist("normal", { weights: ["400", "500", "600", "700"] });
export const { fontFamily: MONO } = loadGeistMono("normal", { weights: ["400", "500"] });

export const C = {
  bg: "#0A0A0A",
  ink: "#F5F5F4",
  muted: "#8A8A8E",
  line: "rgba(255,255,255,0.07)",
  gold: "#C9A35A",
  goldHi: "#E8CB8A",
  green: "#22C55E",
  fi: "#10B981",
  red: "#F43F5E",
};

export const useUnit = () => {
  const { width, height } = useVideoConfig();
  const square = width === height;
  return { u: Math.min(width / 1920, height / 1080) * (square ? 1.55 : 1), square, width, height };
};

export const ease = (frame: number, from: number, dur = 20) =>
  interpolate(frame, [from, from + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
export const pop = (frame: number, fps: number, delay = 0, stiffness = 120) =>
  spring({ frame: frame - delay, fps, config: { damping: 200, stiffness } });

export const SceneFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10, dur - 12, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Label: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.gold, style }) => {
  const { u } = useUnit();
  return <div style={{ fontFamily: MONO, fontSize: 20 * u, letterSpacing: 5 * u, textTransform: "uppercase", color, ...style }}>{children}</div>;
};

export const Title: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 84, style }) => {
  const { u } = useUnit();
  return <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: size * u, lineHeight: 1.04, letterSpacing: -2 * u, color: C.ink, ...style }}>{children}</div>;
};

export const Rise: React.FC<{ at: number; children: React.ReactNode; dist?: number; style?: React.CSSProperties }> = ({ at, children, dist = 30, style }) => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  const t = ease(frame, at, 22);
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * dist * u}px)`, filter: `blur(${(1 - t) * 6}px)`, ...style }}>{children}</div>;
};

/* ── Backgrounds ─────────────────────────────────────────────── */

/** Terminal graticule + vignette, with an optional coloured glow. */
export const GridBg: React.FC<{ glow?: string }> = ({ glow = "rgba(201,163,90,0.12)" }) => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  const s = 56 * u;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: `${s}px ${s}px`, backgroundPosition: `${-(frame * 0.5) % s}px 0px`,
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 25%, transparent 100%)",
      }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 45% at 50% 55%, ${glow}, transparent 70%)` }} />
    </AbsoluteFill>
  );
};

/** Procedural candlestick field drifting left: the market as a living background. */
export const CandleField: React.FC<{ opacity?: number; speed?: number; seed?: string }> = ({ opacity = 0.35, speed = 1.2, seed = "nx" }) => {
  const frame = useCurrentFrame();
  const { width, height, u } = useUnit();
  const w = 18 * u, gap = 10 * u, step = w + gap;
  const count = Math.ceil(width / step) + 4;
  const shift = (frame * speed * u) % step;
  const base = Math.floor((frame * speed * u) / step);
  let price = 0;
  const candles = [];
  for (let i = 0; i < count; i++) {
    const k = base + i;
    const drift = Math.sin(k / 9) * 0.6 + Math.sin(k / 23) * 1.1;
    const o = drift + (random(`${seed}o${k}`) - 0.5) * 0.4;
    const c = drift + (random(`${seed}c${k}`) - 0.5) * 0.9;
    const hi = Math.max(o, c) + random(`${seed}h${k}`) * 0.35;
    const lo = Math.min(o, c) - random(`${seed}l${k}`) * 0.35;
    price = c;
    const y = (v: number) => height * 0.55 - v * height * 0.12;
    const up = c >= o;
    const x = i * step - shift;
    candles.push(
      <g key={k} opacity={opacity}>
        <line x1={x + w / 2} x2={x + w / 2} y1={y(hi)} y2={y(lo)} stroke={up ? C.green : C.red} strokeWidth={Math.max(1, 1.5 * u)} />
        <rect x={x} y={Math.min(y(o), y(c))} width={w} height={Math.max(2, Math.abs(y(o) - y(c)))} fill={up ? C.green : C.red} rx={2} />
      </g>,
    );
  }
  void price;
  return (
    <AbsoluteFill style={{ maskImage: "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)" }}>
      <svg width={width} height={height}>{candles}</svg>
    </AbsoluteFill>
  );
};

/** Gold-to-ink gradient stage behind device mockups (portfolio-ad look). */
export const GoldStage: React.FC = () => {
  const frame = useCurrentFrame();
  const a = 115 + Math.sin(frame / 70) * 12;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${a}deg, #0A0A0A 0%, #1A140A 30%, #6B5223 62%, #C9A35A 90%, #F2DDA4 120%)` }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 50% 45% at 75% 30%, rgba(255,240,200,0.18), transparent 70%)" }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "6px 6px", mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};

/** Pixel "N" mark built from a dot matrix, like the Nexus logo. */
export const PixelN: React.FC<{ size: number; at?: number }> = ({ size, at = 0 }) => {
  const frame = useCurrentFrame();
  const cols = 14, rows = 18;
  const cell = size / cols;
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const leftBar = c < 3, rightBar = c >= cols - 3;
      const diag = Math.abs(c - (r / (rows - 1)) * (cols - 1)) < 1.6;
      if (!(leftBar || rightBar || diag)) continue;
      const d = at + (c + r) * 0.9 + random(`n${r}-${c}`) * 10;
      const t = ease(frame, d, 14);
      const flicker = 0.55 + 0.45 * Math.abs(Math.sin((frame + random(`f${r}${c}`) * 60) / 9));
      dots.push(
        <rect key={`${r}-${c}`} x={c * cell + cell * 0.15} y={r * cell * 1.05} width={cell * 0.7} height={cell * 0.8} rx={cell * 0.12}
          fill={diag ? C.goldHi : "#D4D4D4"} opacity={t * flicker} />,
      );
    }
  }
  return <svg width={size} height={rows * cell * 1.05}>{dots}</svg>;
};
