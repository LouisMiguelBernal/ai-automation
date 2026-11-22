import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadFragment } from "@remotion/google-fonts/FragmentMono";

export const { fontFamily: SANS } = loadGeist("normal", { weights: ["400", "500", "600"] });
export const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"] });
export const { fontFamily: MONO } = loadFragment("normal", { weights: ["400"] });

/** OSAKA brand: washi paper, sumi ink, vermilion hanko (E-Ink / Paper). */
export const C = {
  bg: "#F4F1EA", // washi
  bg2: "#ECE7DC",
  bg3: "#E3DCCD",
  surface: "#FBF9F4",
  ink: "#1A1A1A", // sumi
  muted: "#625C52",
  faint: "#A39C8F",
  line: "rgba(26,26,26,0.14)",
  rule: "#1A1A1A",
  seal: "#C8372D", // vermilion
  sealDeep: "#A82D24",
  ok: "#2F5A3A",
  ochre: "#8A5A00",
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

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Fine paper grain, blended onto whatever sits below. */
export const Grain: React.FC<{ opacity?: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({ opacity = 0.3, blend = "multiply" }) => (
  <AbsoluteFill style={{ backgroundImage: NOISE, opacity, mixBlendMode: blend, pointerEvents: "none" }} />
);

/** Washi stage: paper, grain and faint hairline ruling that drifts slowly. */
export const PaperBg: React.FC<{ tone?: string }> = ({ tone = C.bg }) => {
  const frame = useCurrentFrame();
  const { u } = useUnit();
  const gap = 72 * u;
  return (
    <AbsoluteFill style={{ background: tone }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px)`,
          backgroundSize: `100% ${gap}px`,
          backgroundPosition: `0 ${(frame * 0.3) % gap}px`,
          opacity: 0.55,
          maskImage: "linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      />
      <Grain />
    </AbsoluteFill>
  );
};

/** Sumi stage used behind the device mockups: ink paper with a faint seal ring. */
export const InkBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, width, height } = useUnit();
  const r = 520 * u;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <div style={{ position: "absolute", left: width * 0.62 - r, top: height * 0.55 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `${70 * u}px solid rgba(200,55,45,0.16)`, transform: `rotate(${frame * 0.05}deg)` }} />
      <Grain opacity={0.08} blend="screen" />
    </AbsoluteFill>
  );
};

/** The OSAKA hanko: vermilion seal, ring, check. */
export const Seal: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg viewBox="0 0 96 96" width={size} height={size} style={{ display: "block", ...style }}>
    <rect x="4" y="4" width="88" height="88" rx="6" fill={C.seal} />
    <rect x="11" y="11" width="74" height="74" rx="3" fill="none" stroke={C.bg} strokeWidth="2.5" />
    <circle cx="48" cy="48" r="22" fill="none" stroke={C.bg} strokeWidth="7" />
    <path d="M38 48.5 L45.5 56 L60 40.5" fill="none" stroke={C.bg} strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>
);

/** The seal pressed onto paper: drops in large and rotated, settles at -4°. */
export const Stamp: React.FC<{ at: number; size: number }> = ({ at, size }) => {
  const frame = useCurrentFrame();
  const k = [at, at + 10, at + 15, at + 20];
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const s = interpolate(frame, k, [1.7, 0.97, 1.01, 1], clamp);
  const rot = interpolate(frame, [at, at + 10, at + 20], [-14, -3, -4], clamp);
  const o = interpolate(frame, [at, at + 6], [0, 1], clamp);
  return (
    <div style={{ opacity: o, transform: `scale(${s}) rotate(${rot}deg)`, filter: "drop-shadow(0 1px 0 rgba(120,20,10,0.25))", position: "relative", width: size, height: size }}>
      <Seal size={size} />
      <div style={{ position: "absolute", inset: "6%", backgroundImage: NOISE, opacity: 0.35, mixBlendMode: "screen", borderRadius: 4 }} />
    </div>
  );
};

export const Label: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.seal, style }) => {
  const { u } = useUnit();
  return (
    <div style={{ fontFamily: MONO, fontSize: 20 * u, letterSpacing: 4 * u, textTransform: "uppercase", color, ...style }}>{children}</div>
  );
};

/** Display line: Instrument Serif, tight tracking, exaggerated scale. */
export const Title: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 84, style }) => {
  const { u } = useUnit();
  return (
    <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: size * 1.12 * u, lineHeight: 1.0, letterSpacing: -0.025 * size * u, color: C.ink, ...style }}>{children}</div>
  );
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
