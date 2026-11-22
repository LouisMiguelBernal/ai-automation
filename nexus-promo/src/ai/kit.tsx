import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { MONO, SANS, ease, useUnit } from "../theme";
import { LOGOS } from "./logos";

/** Silver + Float Infinity green. No warm hues anywhere. */
export const P = {
  bg: "#07090A",
  ink: "#F1F3F5",
  silver: "#C9CED4",
  steel: "#7D848C",
  dim: "#4A5057",
  line: "rgba(214,220,226,0.08)",
  fi: "#0E8A68",
  green: "#10B981",
  greenHi: "#5EEAB0",
  neg: "#E5484D",
};

/** 124 BPM, 31 bars = 1800 frames at 30 fps. */
export const FPB = 1800 / 31; // frames per bar
export const BEAT = FPB / 4;
export const bars = (b: number) => Math.round(b * FPB);

export const Tag: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = P.green, style }) => {
  const { u } = useUnit();
  return <div style={{ fontFamily: MONO, fontSize: 19 * u, letterSpacing: 5 * u, textTransform: "uppercase", color, ...style }}>{children}</div>;
};

export const Head: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 84, style }) => {
  const { u } = useUnit();
  return <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: size * u, lineHeight: 1.02, letterSpacing: -0.035 * size * u, color: P.ink, ...style }}>{children}</div>;
};

/** Brushed-silver text: solid silver base plus a masked white sheen (no background-clip, which breaks in headless renders). */
export const Silver: React.FC<{ children: React.ReactNode; speed?: number }> = ({ children, speed = 1.6 }) => {
  const frame = useCurrentFrame();
  const x = ((frame * speed) % 260) - 80;
  const mask = `linear-gradient(100deg, transparent ${x - 16}%, black ${x}%, transparent ${x + 16}%)`;
  return (
    <span style={{ position: "relative", display: "inline-block", color: "#C4CAD0" }}>
      {children}
      <span aria-hidden style={{ position: "absolute", inset: 0, color: "#FFFFFF", WebkitMaskImage: mask, maskImage: mask }}>{children}</span>
    </span>
  );
};

/** Word-by-word kinetic reveal (mask + rise). */
export const Words: React.FC<{ text: string; at: number; step?: number; color?: (i: number, w: string) => string | undefined }> = ({ text, at, step = 4, color }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {text.split(" ").map((w, i) => {
        const t = ease(frame, at + i * step, 16);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.08em", marginRight: "0.25em" }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - t) * 105}%)`, color: color?.(i, w) }}>{w}</span>
          </span>
        );
      })}
    </>
  );
};

/** Official multi-colour Google "G" mark. `draw` animates it in. */
export const GoogleG: React.FC<{ size: number; draw?: number }> = ({ size, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ opacity: Math.min(1, draw * 1.4), transform: `rotate(${(1 - draw) * -90}deg) scale(${0.6 + 0.4 * draw})` }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

/** Pixel "N" in silver with a green diagonal. */
export const PixelMark: React.FC<{ size: number; at?: number }> = ({ size, at = 0 }) => {
  const frame = useCurrentFrame();
  const cols = 14, rows = 18, cell = size / cols;
  const dots = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const diag = Math.abs(c - (r / (rows - 1)) * (cols - 1)) < 1.6;
    if (!(c < 3 || c >= cols - 3 || diag)) continue;
    const t = ease(frame, at + (c + r) * 0.6 + random(`m${r}-${c}`) * 8, 12);
    const fl = 0.6 + 0.4 * Math.abs(Math.sin((frame + random(`q${r}${c}`) * 60) / 10));
    dots.push(<rect key={`${r}-${c}`} x={c * cell + cell * 0.15} y={r * cell * 1.05} width={cell * 0.7} height={cell * 0.8} rx={cell * 0.12} fill={diag ? P.greenHi : P.silver} opacity={t * fl} />);
  }
  return <svg width={size} height={rows * cell * 1.05}>{dots}</svg>;
};

/** Living background: drifting neural mesh with green signal pulses along the edges. */
export const NeuralBg: React.FC<{ intensity?: number; seed?: string; glow?: number }> = ({ intensity = 1, seed = "nb", glow = 0.1 }) => {
  const frame = useCurrentFrame();
  const { width, height, u } = useUnit();
  const n = 46;
  const pts = Array.from({ length: n }, (_, i) => {
    const bx = random(`${seed}x${i}`) * width, by = random(`${seed}y${i}`) * height;
    const sp = 0.25 + random(`${seed}s${i}`) * 0.5;
    return { x: bx + Math.sin(frame / 90 * sp + i) * 40 * u, y: by + Math.cos(frame / 110 * sp + i * 1.3) * 34 * u };
  });
  const max = 230 * u;
  const edges: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy);
    if (d > max) continue;
    const a = (1 - d / max) * 0.22 * intensity;
    edges.push(<line key={`e${i}-${j}`} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y} stroke={P.silver} strokeOpacity={a} strokeWidth={1} />);
    if ((i * 7 + j) % 9 === 0) {
      const p = ((frame / 40 + random(`${seed}p${i}${j}`)) % 1);
      edges.push(<circle key={`p${i}-${j}`} cx={pts[i].x + (pts[j].x - pts[i].x) * p} cy={pts[i].y + (pts[j].y - pts[i].y) * p} r={2.2 * u} fill={P.greenHi} opacity={a * 3.5} />);
    }
  }
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 50% at 50% 55%, rgba(16,185,129,${glow}), transparent 70%)` }} />
      <AbsoluteFill style={{ maskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, black 30%, transparent 100%)" }}>
        <svg width={width} height={height}>
          {edges}
          {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={1.8 * u} fill={P.silver} opacity={0.5 * intensity} />)}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${P.line} 1px, transparent 1px), linear-gradient(90deg, ${P.line} 1px, transparent 1px)`, backgroundSize: `${64 * u}px ${64 * u}px`, opacity: 0.5, maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)" }} />
    </AbsoluteFill>
  );
};

/** Scene entrance transitions, played over the previous scene's tail. */
export type Enter = "iris" | "wipe" | "zoom" | "slide" | "shutter" | "glitch" | "cut";
export const Reveal: React.FC<{ kind: Enter; len: number; children: React.ReactNode }> = ({ kind, len, children }) => {
  const frame = useCurrentFrame();
  const { width, height } = useUnit();
  const t = interpolate(frame, [0, len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 4) });
  if (kind === "cut" || t >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  const diag = Math.hypot(width, height);
  if (kind === "shutter") {
    const n = 9;
    return (
      <AbsoluteFill>
        {Array.from({ length: n }, (_, i) => {
          const k = interpolate(frame, [i * 1.1, i * 1.1 + len * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
          const x0 = (i / n) * 100, x1 = ((i + 1) / n) * 100;
          return (
            <AbsoluteFill key={i} style={{ clipPath: `polygon(${x0}% ${100 - k * 100}%, ${x1}% ${100 - k * 100}%, ${x1}% 100%, ${x0}% 100%)` }}>
              {children}
              <div style={{ position: "absolute", left: `${x0}%`, width: `${100 / n}%`, top: `${100 - k * 100}%`, height: 2, background: P.greenHi, boxShadow: `0 0 18px ${P.green}`, opacity: k < 1 ? 1 : 0 }} />
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
    );
  }
  if (kind === "glitch") {
    const slices = 12;
    return (
      <AbsoluteFill>
        {Array.from({ length: slices }, (_, i) => {
          const off = (1 - t) * (random(`g${i}${Math.floor(frame / 2)}`) - 0.5) * width * 0.25;
          return (
            <AbsoluteFill key={i} style={{ clipPath: `inset(${(i / slices) * 100}% 0 ${100 - ((i + 1) / slices) * 100}% 0)`, transform: `translateX(${off}px)`, opacity: Math.min(1, t * 2.2) }}>
              {children}
            </AbsoluteFill>
          );
        })}
        <AbsoluteFill style={{ background: P.greenHi, mixBlendMode: "overlay", opacity: (1 - t) * 0.5 }} />
      </AbsoluteFill>
    );
  }
  const style: React.CSSProperties =
    kind === "iris" ? { clipPath: `circle(${t * diag * 0.6}px at 50% 50%)` }
    : kind === "wipe" ? { clipPath: `polygon(0 0, ${t * 140}% 0, ${t * 140 - 40}% 100%, 0 100%)` }
    : kind === "zoom" ? { transform: `scale(${1.25 - 0.25 * t})`, opacity: t, filter: `blur(${(1 - t) * 14}px)` }
    : { transform: `translateX(${(1 - t) * 100}%)` };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {kind === "wipe" && (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(t * 140 - 20) * width / 100}px`, width: 3, background: P.greenHi, boxShadow: `0 0 30px 6px ${P.green}`, transform: "skewX(-21deg)", opacity: 1 - t }} />
      )}
      {kind === "iris" && (
        <div style={{ position: "absolute", left: "50%", top: "50%", width: t * diag * 1.2, height: t * diag * 1.2, marginLeft: -t * diag * 0.6, marginTop: -t * diag * 0.6, borderRadius: "50%", border: `2px solid ${P.greenHi}`, opacity: 1 - t, boxShadow: `0 0 40px ${P.green}` }} />
      )}
    </AbsoluteFill>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; color?: string; live?: boolean; style?: React.CSSProperties }> = ({ children, color = P.ink, live, style }) => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 * u, fontFamily: MONO, fontSize: 18 * u, color, border: `1px solid ${P.line}`, background: "rgba(14,16,18,0.8)", padding: `${10 * u}px ${18 * u}px`, borderRadius: 999, whiteSpace: "nowrap", ...style }}>
      {live && <span style={{ width: 9 * u, height: 9 * u, borderRadius: "50%", background: P.green, boxShadow: `0 0 ${6 + 6 * Math.abs(Math.sin(frame / 8))}px ${P.green}` }} />}
      {children}
    </div>
  );
};

/** Brand mark from Simple Icons (CC0). */
export const Brand: React.FC<{ id: keyof typeof LOGOS; size: number; color?: string }> = ({ id, size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d={LOGOS[id].d} fill={color ?? LOGOS[id].hex} /></svg>
);

/** Film finish: grain, vignette, and a soft light sweep on every bar downbeat. */
export const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useUnit();
  const inBar = (frame % FPB) / FPB;
  const sweep = Math.max(0, 1 - inBar * 4);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${inBar * 160 - 40}%, rgba(94,234,176,0.05) ${inBar * 160 - 20}%, transparent ${inBar * 160}%)`, opacity: sweep * 1.4 }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id={`gr${frame % 6}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 6} /></filter>
        <rect width="100%" height="100%" filter={`url(#gr${frame % 6})`} />
      </svg>
    </AbsoluteFill>
  );
};
