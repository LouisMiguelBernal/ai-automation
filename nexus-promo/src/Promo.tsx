import React from "react";
import { AbsoluteFill, Audio, Series, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, SceneFade } from "./theme";
import { Alerts, ColdOpen, Execution, Layers, Liquidity, Logo, Montage, Outro, Research, Risk, Stats, Venues } from "./Scenes";

// Durations (30 fps) are cut to the score: drums at 12.5 s (f375), lift at 67.5 s (f2025), final hit at 84.5 s (f2535).
const SCENES: { C: React.FC<{ dur: number }>; d: number; fade?: boolean }[] = [
  { C: ColdOpen, d: 150 },
  { C: Logo, d: 225 },
  { C: Venues, d: 180 },
  { C: Execution, d: 285 },
  { C: Risk, d: 240 },
  { C: Research, d: 255 },
  { C: Liquidity, d: 210 },
  { C: Alerts, d: 195 },
  { C: Layers, d: 285 },
  { C: Montage, d: 210 },
  { C: Stats, d: 165 },
  { C: Outro, d: 300, fade: false },
];
export const TOTAL = SCENES.reduce((a, s) => a + s.d, 0);

export const Promo: React.FC = () => {
  const frame = useCurrentFrame();
  const vol = interpolate(frame, [0, 20, TOTAL - 45, TOTAL], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Audio src={staticFile("score.wav")} volume={vol} />
      <Series>
        {SCENES.map(({ C: Scene, d, fade = true }, i) => (
          <Series.Sequence key={i} durationInFrames={d}>
            {fade ? <SceneFade dur={d}><Scene dur={d} /></SceneFade> : <Scene dur={d} />}
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
