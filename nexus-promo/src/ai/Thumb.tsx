import React from "react";
import { AbsoluteFill } from "remotion";
import { MONO, SANS, useUnit } from "../theme";
import { GoogleG, NeuralBg, P, Pill } from "./kit";

/** Video thumbnail: one promise, one proof point, the brand. Rendered as a still. */
export const Thumb: React.FC = () => {
  const { u, square } = useUnit();
  const k = square ? 0.92 : 1; // square canvas is narrower; scale the type down
  const gauge = (
    <div style={{ position: "relative", width: 300 * u * k, height: 300 * u * k }}>
      <svg width={300 * u * k} height={300 * u * k} viewBox="0 0 300 300">
        <circle cx="150" cy="150" r="128" fill="none" stroke="rgba(214,220,226,0.08)" strokeWidth="18" />
        <circle cx="150" cy="150" r="128" fill="none" stroke={P.green} strokeOpacity="0.22" strokeWidth="40" strokeDasharray={`${2 * Math.PI * 128 * 0.97} 999`} transform="rotate(-90 150 150)" />
        <circle cx="150" cy="150" r="128" fill="none" stroke={P.greenHi} strokeWidth="18" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 128 * 0.97} 999`} transform="rotate(-90 150 150)" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 92 * u * k, color: P.ink, letterSpacing: -3 * u * k, lineHeight: 1 }}>97%</div>
        <div style={{ fontFamily: MONO, fontSize: 16 * u * k, color: P.silver, letterSpacing: 2 * u * k, marginTop: 10 * u * k, textAlign: "center", lineHeight: 1.5 }}>FinBERT<br />accuracy</div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <NeuralBg seed="th" glow={0.2} intensity={1.1} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 70% at 25% 50%, rgba(7,9,10,0.85), transparent 75%)" }} />
      <AbsoluteFill style={{
        flexDirection: square ? "column" : "row", alignItems: "center", justifyContent: "center",
        gap: (square ? 30 : 110) * u * k, padding: square ? 60 : `0 ${120 * u}px`,
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: square ? "center" : "flex-start", textAlign: square ? "center" : "left", gap: 22 * u * k }}>
          <Pill live color={P.greenHi} style={{ fontSize: 22 * u * k }}>LIVE · LOCAL AI</Pill>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 210 * u * k, letterSpacing: 30 * u * k, color: "#E3E7EB", lineHeight: 0.95, marginRight: -30 * u * k, textShadow: "0 6px 40px rgba(0,0,0,0.6)" }}>NEXUS</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 64 * u * k, color: P.ink, letterSpacing: -2 * u * k, lineHeight: 1.05 }}>
            AI that reads<br />the <span style={{ color: P.greenHi }}>market</span>.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 * u * k, marginTop: 10 * u * k, fontFamily: SANS, fontSize: 30 * u * k, fontWeight: 600, color: P.silver }}>
            <GoogleG size={38 * u * k} /> Gemma 4 <span style={{ color: P.dim }}>×</span> FinBERT
          </div>
        </div>
        {gauge}
      </AbsoluteFill>
      <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.75)" }} />
    </AbsoluteFill>
  );
};
