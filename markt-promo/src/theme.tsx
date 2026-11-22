import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

export const { fontFamily: SANS } = loadGeist("normal", { weights: ["400", "500", "600", "700"] });
export const { fontFamily: MONO } = loadGeistMono("normal", { weights: ["400", "500"] });

export const C = {
  bg: "#09090B",
  panel: "#121318",
  ink: "#F4F4F5",
  muted: "#8B8B93",
  line: "rgba(255,255,255,0.08)",
  accent: "#F2F1EF",
  accentDeep: "#8B8B93",
  emerald: "#34D399",
  amber: "#F5A623",
  red: "#FB7185",
  blue: "#60A5FA",
  n8n: "#EA4B71",
};

/** Scale factor so scenes designed at 1920×1080 also work at 1080×1080. */
export const useUnit = () => {
  const { width, height } = useVideoConfig();
  return { u: Math.min(width / 1920, height / 1080) * (width === height ? 1.55 : 1), square: width === height, width, height };
};

export const ease = (frame: number, from: number, dur = 20) =>
  interpolate(frame, [from, from + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });

export const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 200, stiffness: 120 } });

export const GridBg: React.FC<{ glow?: string }> = ({ glow = "rgba(242,241,239,0.14)" }) => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  const size = 64 * u;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundPosition: `${(frame * 0.4) % size}px ${(frame * 0.4) % size}px`,
          maskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 40% at 50% 55%, ${glow}, transparent 70%)` }} />
    </AbsoluteFill>
  );
};

export const Label: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.accent, style }) => {
  const { u } = useUnit();
  return <div style={{ fontFamily: MONO, fontSize: 20 * u, letterSpacing: 4 * u, textTransform: "uppercase", color, ...style }}>{children}</div>;
};

export const Title: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 84, style }) => {
  const { u } = useUnit();
  return <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: size * u, lineHeight: 1.05, letterSpacing: -1.5 * u, color: C.ink, ...style }}>{children}</div>;
};

/** Text that rises in with a fade. */
export const Rise: React.FC<{ at: number; children: React.ReactNode; dist?: number; style?: React.CSSProperties }> = ({ at, children, dist = 30, style }) => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  const t = ease(frame, at, 22);
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * dist * u}px)`, ...style }}>{children}</div>;
};

/** Fade a whole scene in and out at its edges. */
export const SceneFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10, dur - 12, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Chip: React.FC<{ children: React.ReactNode; on?: boolean; color?: string; style?: React.CSSProperties }> = ({ children, on = false, color = C.accent, style }) => {
  const { u } = useUnit();
  return (
    <div style={{
      fontFamily: MONO, fontSize: 20 * u, padding: `${10 * u}px ${18 * u}px`, borderRadius: 999,
      border: `1px solid ${on ? color : C.line}`, color: on ? "#140C02" : C.ink, background: on ? color : "rgba(255,255,255,0.04)",
      boxShadow: on ? `0 0 ${30 * u}px ${color}88` : "none", whiteSpace: "nowrap", ...style,
    }}>{children}</div>
  );
};

/**
 * Markt mark: an M built from stacked horizontal bars (brand/markt-logo.svg).
 * `draw` (0..1) slides each bar in sideways, alternating directions like order flow;
 * `pulse` (0..1) sweeps a brighter band down the rows.
 */
const MARK: [number, number][][] = [[[12,14],[74,14]],[[12,20],[68,20]],[[12,8],[24,14],[62,14],[80,8]],[[12,8],[31,14],[55,14],[80,8]],[[12,8],[38,24],[80,8]],[[12,8],[44,12],[80,8]],[[12,8],[80,8]],[[12,8],[80,8]],[[4,24],[72,24]]];
export const Logo: React.FC<{ size: number; draw?: number; pulse?: number; id?: string }> = ({ size, draw = 1, pulse = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    {MARK.map((row, r) => row.map(([x, w], k) => {
      const d = Math.max(0, Math.min(1, draw * 1.6 - r * 0.07));
      const e = 1 - Math.pow(1 - d, 3);
      const dir = (r + k) % 2 ? 1 : -1;
      const sweep = pulse > 0 && pulse < 1 ? Math.max(0, 1 - Math.abs(r / 8 - pulse) * 4) : 0;
      return <rect key={`${r}-${k}`} x={x + dir * (1 - e) * 46} y={8 + r * 9} width={w} height={6} fill="#F2F1EF" opacity={(0.15 + 0.85 * e) * (0.82 + 0.18 * sweep)} />;
    }))}
  </svg>
);

/** Abstract backdrop: slow amber ribbons and drifting light, no chart literalism. */
export const FlowBg: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / 30;
  const N = 18;
  const lines = Array.from({ length: N }, (_, i) => {
    const k = i / (N - 1);
    const base = height * (0.25 + 0.5 * k);
    const amp = height * (0.06 + 0.1 * Math.sin(i * 1.7) ** 2);
    const f1 = 1.4 + (i % 5) * 0.22, f2 = 3.1 + (i % 3) * 0.4;
    const ph = i * 0.9;
    const pts: string[] = [];
    for (let x = -40; x <= width + 40; x += 24) {
      const nx = x / width;
      const env = Math.sin(Math.PI * Math.min(1, Math.max(0, nx)));
      const y = base + (amp * Math.sin(nx * Math.PI * f1 + ph + t * 0.6) + amp * 0.35 * Math.sin(nx * Math.PI * f2 - t * 0.9 + ph)) * (0.4 + 0.6 * env)
        - (k - 0.5) * height * 0.35 * env;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return { d: "M" + pts.join(" L"), o: (0.08 + 0.32 * Math.sin(Math.PI * k)) * intensity, w: 1 + 2.2 * Math.sin(Math.PI * k) };
  });
  const ox = Math.sin(t * 0.35) * 8, oy = Math.cos(t * 0.3) * 6;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 45% 55% at ${50 + ox}% ${55 + oy}%, rgba(242,241,239,${0.22 * intensity}), transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 30% 35% at ${22 - ox * 0.6}% ${30 - oy * 0.6}%, rgba(110,110,112,${0.18 * intensity}), transparent 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 28% 30% at ${80 + ox * 0.4}% 78%, rgba(242,241,239,${0.1 * intensity}), transparent 70%)` }} />
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#C6C6C7" stopOpacity="0" />
            <stop offset="0.35" stopColor="#F2F1EF" />
            <stop offset="0.7" stopColor="#C6C6C7" />
            <stop offset="1" stopColor="#5E5E60" stopOpacity="0" />
          </linearGradient>
        </defs>
        {lines.map((l, i) => <path key={i} d={l.d} fill="none" stroke="url(#flow)" strokeWidth={l.w} opacity={l.o} />)}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};
